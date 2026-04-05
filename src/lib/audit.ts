import { prisma, hasDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";

// 監査ログの記録
interface AuditLogParams {
  userId?: string;
  userName?: string;
  userRole?: string;
  clinicId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  requestId?: string;
}

export async function recordAuditLog(params: AuditLogParams): Promise<void> {
  // 常にログ出力
  logger.info(`Audit: ${params.action} on ${params.entity}`, {
    ...params,
    details: undefined,
  });

  // DBがある場合はDBにも保存
  if (hasDatabase) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId,
          userName: params.userName,
          userRole: params.userRole,
          clinicId: params.clinicId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          details: params.details ? JSON.parse(JSON.stringify(params.details)) : undefined,
          ipAddress: params.ipAddress,
          requestId: params.requestId,
        },
      });
    } catch (error) {
      // 監査ログの書き込み失敗はアプリ全体を止めない
      logger.error("監査ログの書き込みに失敗しました", {
        error: error instanceof Error ? error.message : "unknown",
        params,
      });
    }
  }
}
