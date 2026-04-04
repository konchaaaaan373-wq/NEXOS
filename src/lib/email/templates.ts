// ============================================================
// Email templates — plain HTML for Resend
// ============================================================

export function applicationReceivedEmail(params: {
  applicantName: string;
  jobTitle: string;
  clinicName: string;
}) {
  const { applicantName, jobTitle, clinicName } = params;
  return {
    subject: `【${clinicName}】ご応募ありがとうございます`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #0f172a; color: white; font-weight: bold; font-size: 20px; width: 40px; height: 40px; line-height: 40px; border-radius: 10px;">N</div>
        </div>
        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 16px;">ご応募ありがとうございます</h1>
        <p style="color: #64748b; line-height: 1.7;">
          ${applicantName}様<br><br>
          ${clinicName}の「${jobTitle}」へのご応募を受け付けました。<br>
          選考結果は、ご登録いただいたメールアドレスにご連絡いたします。
        </p>
        <div style="margin: 32px 0; padding: 20px; background: #f8fafc; border-radius: 12px;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">応募先</p>
          <p style="margin: 4px 0 0; font-weight: 600; color: #0f172a;">${clinicName}</p>
          <p style="margin: 2px 0 0; font-size: 14px; color: #64748b;">${jobTitle}</p>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">
          このメールは NEXOS（nexos.necofindjob.com）から自動送信されています。<br>
          ご不明点は <a href="mailto:contact@necofindjob.com" style="color: #2563eb;">contact@necofindjob.com</a> までお問い合わせください。
        </p>
      </div>
    `,
  };
}

export function applicationStatusChangedEmail(params: {
  applicantName: string;
  jobTitle: string;
  clinicName: string;
  newStage: string;
  stageLabel: string;
}) {
  const { applicantName, jobTitle, clinicName, stageLabel } = params;
  return {
    subject: `【${clinicName}】選考ステータスが更新されました`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #0f172a; color: white; font-weight: bold; font-size: 20px; width: 40px; height: 40px; line-height: 40px; border-radius: 10px;">N</div>
        </div>
        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 16px;">選考ステータスのお知らせ</h1>
        <p style="color: #64748b; line-height: 1.7;">
          ${applicantName}様<br><br>
          ${clinicName}の「${jobTitle}」の選考ステータスが更新されました。
        </p>
        <div style="margin: 32px 0; padding: 20px; background: #f8fafc; border-radius: 12px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">現在のステータス</p>
          <p style="margin: 8px 0 0; font-size: 20px; font-weight: 700; color: #0f172a;">${stageLabel}</p>
        </div>
        <p style="color: #64748b; line-height: 1.7;">
          詳細については、クリニックからのご連絡をお待ちください。
        </p>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
          このメールは NEXOS（nexos.necofindjob.com）から自動送信されています。
        </p>
      </div>
    `,
  };
}

export function newApplicationNotificationEmail(params: {
  applicantName: string;
  jobTitle: string;
  clinicName: string;
  applicantEmail: string;
  dashboardUrl: string;
}) {
  const { applicantName, jobTitle, clinicName, dashboardUrl } = params;
  return {
    subject: `【新規応募】${applicantName}様が「${jobTitle}」に応募しました`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #0f172a; color: white; font-weight: bold; font-size: 20px; width: 40px; height: 40px; line-height: 40px; border-radius: 10px;">N</div>
        </div>
        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 16px;">新規応募がありました</h1>
        <p style="color: #64748b; line-height: 1.7;">
          ${clinicName}の「${jobTitle}」に新しい応募がありました。
        </p>
        <div style="margin: 32px 0; padding: 20px; background: #f8fafc; border-radius: 12px;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">候補者</p>
          <p style="margin: 4px 0 0; font-weight: 600; color: #0f172a;">${applicantName}</p>
          <p style="margin: 12px 0 0; font-size: 14px; color: #64748b;">応募先求人</p>
          <p style="margin: 4px 0 0; font-weight: 600; color: #0f172a;">${jobTitle}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            管理画面で確認する
          </a>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">
          このメールは NEXOS（nexos.necofindjob.com）から自動送信されています。
        </p>
      </div>
    `,
  };
}
