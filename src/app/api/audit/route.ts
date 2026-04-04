import { prisma, hasDatabase } from "@/lib/db";
import { getApiUser } from "@/lib/api-auth";
import {
  apiSuccess,
  apiUnauthorized,
  apiForbidden,
  apiError,
  apiServerError,
} from "@/lib/api-response";

// 監査ログ一覧（Neco管理者のみ）
export async function GET(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();
    if (user.role !== "neco_admin") return apiForbidden();

    if (!hasDatabase) {
      return apiError("NO_DATABASE", "監査ログはDB接続時のみ利用可能です", 503);
    }

    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const entity = searchParams.get("entity");
    const action = searchParams.get("action");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const offset = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (clinicId) where.clinicId = clinicId;
    if (entity) where.entity = entity;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return apiSuccess({
      items: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return apiServerError(err, "audit.GET");
  }
}
