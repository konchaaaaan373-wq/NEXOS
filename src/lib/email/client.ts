import { Resend } from "resend";

// APIキーが未設定の場合はダミー値で初期化（送信時にチェックする）
export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export const FROM_EMAIL =
  process.env.FROM_EMAIL || "NEXOS <noreply@necofindjob.com>";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@necofindjob.com";
