import { applicationSchema } from "@/lib/validations";
import { prisma, hasDatabase } from "@/lib/db";
import { addApplication } from "@/data/seed";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  apiSuccess,
  apiError,
  apiValidationError,
  apiRateLimited,
  apiServerError,
  apiUnauthorized,
} from "@/lib/api-response";
import { recordAuditLog } from "@/lib/audit";
import { getApiUser } from "@/lib/api-auth";
import { sendApplicationReceivedEmail, sendNewApplicationNotification } from "@/lib/email/send";
import { logger } from "@/lib/logger";
import type { Application } from "@/data/types";

export async function POST(request: Request) {
  try {
    // レート制限（IPベース、1分あたり5回）
    const ip = getClientIp(request);
    const rl = checkRateLimit(`apply:${ip}`, { maxRequests: 5, windowMs: 60_000 });
    if (!rl.allowed) return apiRateLimited();

    let body;
    try {
      body = await request.json();
    } catch {
      return apiError("INVALID_JSON", "リクエストボディが不正です", 400);
    }
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error);

    const data = parsed.data;

    if (hasDatabase) {
      // 本番モード：DBに保存
      const job = await prisma.jobPosting.findUnique({
        where: { id: data.jobId },
        include: { clinic: true },
      });
      if (!job) {
        return apiServerError(new Error("求人が見つかりません"), "applications.POST");
      }

      const application = await prisma.application.create({
        data: {
          jobId: data.jobId,
          clinicId: data.clinicId,
          applicantName: data.name,
          applicantEmail: data.email,
          applicantPhone: data.phone,
          currentPosition: data.currentPosition ?? "",
          yearsOfExperience: data.yearsOfExperience ?? 0,
          motivation: data.motivation,
          stage: "applied",
        },
      });

      // 閲覧数・応募数をインクリメント
      await prisma.jobPosting.update({
        where: { id: data.jobId },
        data: { applyCompleteCount: { increment: 1 } },
      });

      // 監査ログ記録
      await recordAuditLog({
        clinicId: data.clinicId,
        action: "create",
        entity: "application",
        entityId: application.id,
        details: { jobId: data.jobId, applicantName: data.name },
        ipAddress: ip,
      });

      // メール送信（非同期、エラーでも応募処理は止めない）
      sendApplicationReceivedEmail({
        to: data.email,
        applicantName: data.name,
        jobTitle: job.title,
        clinicName: job.clinic.name,
      }).catch((e) => logger.error("応募確認メール送信失敗", { error: String(e) }));

      // クリニック管理者への通知メール
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexos.necofindjob.com";
      const members = await prisma.clinicMember.findMany({
        where: { clinicId: data.clinicId, role: { in: ["clinic_admin", "neco_admin"] } },
        include: { user: true },
      });
      for (const member of members) {
        if (member.user.email) {
          sendNewApplicationNotification({
            to: member.user.email,
            applicantName: data.name,
            jobTitle: job.title,
            clinicName: job.clinic.name,
            applicantEmail: data.email,
            dashboardUrl: `${siteUrl}/dashboard/candidates/${application.id}`,
          }).catch((e) => logger.error("新規応募通知メール送信失敗", { error: String(e) }));
        }
      }

      return apiSuccess({ id: application.id }, 201);
    }

    // MVPモード：インメモリに保存
    const application: Application = {
      id: `app-${Date.now()}`,
      jobId: data.jobId,
      clinicId: data.clinicId,
      applicantName: data.name,
      applicantEmail: data.email,
      applicantPhone: data.phone,
      currentPosition: data.currentPosition ?? "",
      yearsOfExperience: data.yearsOfExperience ?? 0,
      motivation: data.motivation,
      stage: "applied",
      notes: [],
      tasks: [],
      stageHistory: [],
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addApplication(application);

    return apiSuccess({ id: application.id }, 201);
  } catch (err) {
    return apiServerError(err, "applications.POST");
  }
}

// GET: 応募一覧（認証必須・ページネーション対応）
export async function GET(request: Request) {
  try {
    // 認証チェック（未認証ユーザーはアクセス不可）
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const stage = searchParams.get("stage");
    const jobId = searchParams.get("jobId");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;

    if (hasDatabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};
      if (clinicId) where.clinicId = clinicId;
      if (stage) where.stage = stage;
      if (jobId) where.jobId = jobId;
      if (search) {
        where.OR = [
          { applicantName: { contains: search, mode: "insensitive" } },
          { applicantEmail: { contains: search, mode: "insensitive" } },
        ];
      }

      const [applications, total] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            job: { select: { title: true } },
            clinic: { select: { name: true } },
            notes: { orderBy: { createdAt: "desc" }, take: 3 },
          },
          orderBy: { appliedAt: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.application.count({ where }),
      ]);

      return apiSuccess({
        items: applications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // MVPモード：シードデータから検索
    const { applications: seedApps, jobPostings } = await import("@/data/seed");
    let filtered = [...seedApps];
    if (clinicId) filtered = filtered.filter((a) => a.clinicId === clinicId);
    if (stage) filtered = filtered.filter((a) => a.stage === stage);
    if (jobId) filtered = filtered.filter((a) => a.jobId === jobId);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.applicantName.toLowerCase().includes(q) ||
          a.applicantEmail.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit).map((a) => ({
      ...a,
      job: { title: jobPostings.find((j) => j.id === a.jobId)?.title || "" },
    }));

    return apiSuccess({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return apiServerError(err, "applications.GET");
  }
}
