import { z } from "zod";
import { getApiUser } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordAuditLog } from "@/lib/audit";
import {
  apiSuccess,
  apiValidationError,
  apiUnauthorized,
  apiRateLimited,
  apiError,
  apiServerError,
} from "@/lib/api-response";

// リクエストのバリデーション
const optimizeSchema = z.object({
  title: z.string().min(1, "求人タイトルは必須です").max(200),
  description: z.string().min(1, "仕事内容は必須です").max(5000),
  category: z.string().max(100).optional(),
  clinicName: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    if (!process.env.ANTHROPIC_API_KEY) {
      return apiError("AI_NOT_CONFIGURED", "AI機能は現在設定されていません", 503);
    }

    // AI APIはユーザーあたり1分に10回まで
    const rl = checkRateLimit(`ai:optimize:${user.id}`, { maxRequests: 10, windowMs: 60_000 });
    if (!rl.allowed) return apiRateLimited();

    const body = await request.json();
    const parsed = optimizeSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error);

    const data = parsed.data;
    const { generateText } = await import("ai");
    const { anthropic } = await import("@ai-sdk/anthropic");

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: `あなたは医療機関の採用コンサルタントです。
求人票の改善提案を行ってください。

以下の観点で改善案を提示してください：
1. 求職者の目を引くタイトル案（2-3案）
2. 仕事内容の改善案（具体性、魅力の伝え方）
3. 応募を促すポイント（追加すべき情報）
4. 避けるべき表現の指摘

出力は日本語で、マークダウン形式で、簡潔にまとめてください。`,
      prompt: `以下の求人票を改善してください。

クリニック名: ${data.clinicName || "未設定"}
職種カテゴリ: ${data.category || "未設定"}
求人タイトル: ${data.title}
仕事内容:
${data.description}`,
      maxOutputTokens: 1500,
    });

    // 監査ログ
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "ai_optimize",
      entity: "ai",
      details: { jobTitle: data.title },
    });

    return apiSuccess({ suggestions: text });
  } catch (err) {
    return apiServerError(err, "ai.optimize-job");
  }
}
