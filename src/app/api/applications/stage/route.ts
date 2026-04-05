import { stageUpdateSchema } from "@/lib/validations";
import { prisma, hasDatabase } from "@/lib/db";
import { updateApplicationStage } from "@/data/seed";
import { getApiUser } from "@/lib/api-auth";
import { recordAuditLog } from "@/lib/audit";
import { sendStatusChangedEmail } from "@/lib/email/send";
import { logger } from "@/lib/logger";
import { PIPELINE_STAGES } from "@/data/types";
import {
  apiSuccess,
  apiValidationError,
  apiUnauthorized,
  apiNotFound,
  apiServerError,
} from "@/lib/api-response";

export async function PATCH(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    const body = await request.json();
    const parsed = stageUpdateSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error);

    const { applicationId, stage } = parsed.data;

    if (hasDatabase) {
      // 既存のステージを取得
      const existing = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true, clinic: true },
      });
      if (!existing) return apiNotFound("応募");

      const previousStage = existing.stage;

      // ステージ更新
      await prisma.application.update({
        where: { id: applicationId },
        data: { stage },
      });

      // ステージ変更履歴を記録
      await prisma.stageHistory.create({
        data: {
          applicationId,
          fromStage: previousStage,
          toStage: stage,
          changedById: user.id,
          changedByName: user.name,
        },
      });

      // 監査ログ
      await recordAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        clinicId: existing.clinicId,
        action: "stage_change",
        entity: "application",
        entityId: applicationId,
        details: { from: previousStage, to: stage },
      });

      // 候補者へのメール通知
      const stageLabel = PIPELINE_STAGES.find((s) => s.id === stage)?.label || stage;
      sendStatusChangedEmail({
        to: existing.applicantEmail,
        applicantName: existing.applicantName,
        jobTitle: existing.job.title,
        clinicName: existing.clinic.name,
        newStage: stage,
        stageLabel,
      }).catch((e) => logger.error("ステータス変更メール送信失敗", { error: String(e) }));

      return apiSuccess({ applicationId, stage, previousStage });
    }

    // MVPモード
    updateApplicationStage(applicationId, stage);
    return apiSuccess({ applicationId, stage });
  } catch (err) {
    return apiServerError(err, "applications.stage.PATCH");
  }
}
