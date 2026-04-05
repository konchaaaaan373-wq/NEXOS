import { resend, FROM_EMAIL } from "./client";
import {
  applicationReceivedEmail,
  applicationStatusChangedEmail,
  newApplicationNotificationEmail,
} from "./templates";
import { logger } from "@/lib/logger";

// メール送信結果の型
interface EmailResult {
  sent: boolean;
  error?: string;
}

// 共通メール送信ラッパー
async function sendEmail(
  to: string,
  template: { subject: string; html: string },
  context: string
): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    logger.warn(`メール未送信（APIキー未設定）: ${context}`, { to });
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });

    logger.info(`メール送信成功: ${context}`, { to, messageId: result?.data?.id });
    return { sent: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "unknown error";
    logger.error(`メール送信失敗: ${context}`, { to, error: errorMessage });
    return { sent: false, error: errorMessage };
  }
}

export async function sendApplicationReceivedEmail(params: {
  to: string;
  applicantName: string;
  jobTitle: string;
  clinicName: string;
}): Promise<EmailResult> {
  const template = applicationReceivedEmail(params);
  return sendEmail(params.to, template, "応募確認メール");
}

export async function sendStatusChangedEmail(params: {
  to: string;
  applicantName: string;
  jobTitle: string;
  clinicName: string;
  newStage: string;
  stageLabel: string;
}): Promise<EmailResult> {
  const template = applicationStatusChangedEmail(params);
  return sendEmail(params.to, template, "ステータス変更通知メール");
}

export async function sendNewApplicationNotification(params: {
  to: string;
  applicantName: string;
  jobTitle: string;
  clinicName: string;
  applicantEmail: string;
  dashboardUrl: string;
}): Promise<EmailResult> {
  const template = newApplicationNotificationEmail(params);
  return sendEmail(params.to, template, "新規応募通知メール");
}
