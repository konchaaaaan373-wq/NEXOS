import { resend, FROM_EMAIL } from "./client";
import {
  applicationReceivedEmail,
  applicationStatusChangedEmail,
  newApplicationNotificationEmail,
} from "./templates";

export async function sendApplicationReceivedEmail(params: {
  to: string;
  applicantName: string;
  jobTitle: string;
  clinicName: string;
}) {
  if (!process.env.RESEND_API_KEY) return; // skip if not configured

  const template = applicationReceivedEmail(params);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error("Failed to send application received email:", error);
  }
}

export async function sendStatusChangedEmail(params: {
  to: string;
  applicantName: string;
  jobTitle: string;
  clinicName: string;
  newStage: string;
  stageLabel: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const template = applicationStatusChangedEmail(params);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error("Failed to send status changed email:", error);
  }
}

export async function sendNewApplicationNotification(params: {
  to: string;
  applicantName: string;
  jobTitle: string;
  clinicName: string;
  applicantEmail: string;
  dashboardUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const template = newApplicationNotificationEmail(params);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error("Failed to send new application notification:", error);
  }
}
