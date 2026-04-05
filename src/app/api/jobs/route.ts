import { jobPostingSchema } from "@/lib/validations";
import { prisma, hasDatabase } from "@/lib/db";
import { jobPostings } from "@/data/seed";
import { getApiUser } from "@/lib/api-auth";
import { recordAuditLog } from "@/lib/audit";
import {
  apiSuccess,
  apiValidationError,
  apiUnauthorized,
  apiError,
  apiServerError,
} from "@/lib/api-response";
import type { JobPosting } from "@/data/types";

// 求人作成
export async function POST(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    let body;
    try {
      body = await request.json();
    } catch {
      return apiError("INVALID_JSON", "リクエストボディが不正です", 400);
    }
    const parsed = jobPostingSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error);

    const data = parsed.data;

    if (hasDatabase) {
      const job = await prisma.jobPosting.create({
        data: {
          clinicId: data.clinicId,
          title: data.title,
          type: data.type.replace("-", "_") as "full_time" | "part_time" | "contract",
          category: data.category,
          location: data.location,
          salaryMin: data.salaryMin * 10000,
          salaryMax: data.salaryMax * 10000,
          description: data.description,
          requirements: data.requirements,
          niceToHave: data.niceToHave,
          benefits: data.benefits,
          isActive: true,
          lastEditedById: user.id,
          lastEditedAt: new Date(),
        },
      });

      await recordAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        clinicId: data.clinicId,
        action: "create",
        entity: "job_posting",
        entityId: job.id,
        details: { title: data.title },
      });

      return apiSuccess({ id: job.id }, 201);
    }

    // MVPモード
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      clinicId: data.clinicId,
      title: data.title,
      type: data.type,
      category: data.category,
      location: data.location,
      salaryMin: data.salaryMin * 10000,
      salaryMax: data.salaryMax * 10000,
      description: data.description,
      requirements: data.requirements,
      niceToHave: data.niceToHave,
      benefits: data.benefits,
      isActive: true,
      publishedAt: new Date().toISOString().split("T")[0],
      viewCount: 0,
      applyStartCount: 0,
      applyCompleteCount: 0,
    };
    jobPostings.push(newJob);

    return apiSuccess({ id: newJob.id }, 201);
  } catch (err) {
    return apiServerError(err, "jobs.POST");
  }
}

// 求人一覧（ページネーション対応）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;

    if (hasDatabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};
      if (clinicId) where.clinicId = clinicId;
      if (isActive !== null && isActive !== undefined) where.isActive = isActive === "true";
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ];
      }

      const [jobs, total] = await Promise.all([
        prisma.jobPosting.findMany({
          where,
          include: {
            clinic: { select: { name: true, slug: true } },
            _count: { select: { applications: true } },
          },
          orderBy: { publishedAt: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.jobPosting.count({ where }),
      ]);

      return apiSuccess({
        items: jobs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    // MVPモード
    let filtered = [...jobPostings];
    if (clinicId) filtered = filtered.filter((j) => j.clinicId === clinicId);
    if (isActive !== null) filtered = filtered.filter((j) => j.isActive === (isActive === "true"));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (j) => j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit);

    return apiSuccess({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return apiServerError(err, "jobs.GET");
  }
}
