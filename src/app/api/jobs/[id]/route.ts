import { prisma, hasDatabase } from "@/lib/db";
import { jobPostings } from "@/data/seed";
import { getApiUser } from "@/lib/api-auth";
import { recordAuditLog } from "@/lib/audit";
import {
  apiSuccess,
  apiUnauthorized,
  apiNotFound,
  apiError,
  apiServerError,
} from "@/lib/api-response";

// 求人詳細取得
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (hasDatabase) {
      const job = await prisma.jobPosting.findUnique({
        where: { id },
        include: {
          clinic: { select: { name: true, slug: true, brandColor: true } },
          _count: { select: { applications: true } },
        },
      });
      if (!job) return apiNotFound("求人");
      return apiSuccess(job);
    }

    const job = jobPostings.find((j) => j.id === id);
    if (!job) return apiNotFound("求人");
    return apiSuccess(job);
  } catch (err) {
    return apiServerError(err, "jobs.[id].GET");
  }
}

// 求人更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    const { id } = await params;
    let body;
    try {
      body = await request.json();
    } catch {
      return apiError("INVALID_JSON", "リクエストボディが不正です", 400);
    }

    if (hasDatabase) {
      const existing = await prisma.jobPosting.findUnique({ where: { id } });
      if (!existing) return apiNotFound("求人");

      // 更新フィールドを組み立て
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        lastEditedById: user.id,
        lastEditedAt: new Date(),
      };
      if (body.title !== undefined) updateData.title = body.title;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.type !== undefined) updateData.type = body.type.replace("-", "_");
      if (body.location !== undefined) updateData.location = body.location;
      if (body.salaryMin !== undefined) updateData.salaryMin = body.salaryMin * 10000;
      if (body.salaryMax !== undefined) updateData.salaryMax = body.salaryMax * 10000;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.requirements !== undefined) updateData.requirements = body.requirements;
      if (body.niceToHave !== undefined) updateData.niceToHave = body.niceToHave;
      if (body.benefits !== undefined) updateData.benefits = body.benefits;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;

      const updated = await prisma.jobPosting.update({
        where: { id },
        data: updateData,
      });

      await recordAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        clinicId: existing.clinicId,
        action: "update",
        entity: "job_posting",
        entityId: id,
        details: { updatedFields: Object.keys(updateData) },
      });

      return apiSuccess({ id: updated.id });
    }

    // MVPモード
    const job = jobPostings.find((j) => j.id === id);
    if (!job) return apiNotFound("求人");

    if (body.title !== undefined) job.title = body.title;
    if (body.category !== undefined) job.category = body.category;
    if (body.type !== undefined) job.type = body.type;
    if (body.location !== undefined) job.location = body.location;
    if (body.salaryMin !== undefined) job.salaryMin = body.salaryMin * 10000;
    if (body.salaryMax !== undefined) job.salaryMax = body.salaryMax * 10000;
    if (body.description !== undefined) job.description = body.description;
    if (body.requirements !== undefined) job.requirements = body.requirements;
    if (body.niceToHave !== undefined) job.niceToHave = body.niceToHave;
    if (body.benefits !== undefined) job.benefits = body.benefits;
    if (body.isActive !== undefined) job.isActive = body.isActive;

    job.lastEditedBy = user.id;
    job.lastEditedAt = new Date().toISOString();

    return apiSuccess({ id: job.id });
  } catch (err) {
    return apiServerError(err, "jobs.[id].PATCH");
  }
}
