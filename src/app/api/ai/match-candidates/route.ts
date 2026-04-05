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
const matchSchema = z.object({
  jobDescription: z.string().min(1, "求人内容は必須です").max(5000),
  jobRequirements: z.array(z.string()).optional(),
  candidateMotivation: z.string().min(1, "候補者情報は必須です").max(5000),
  candidatePosition: z.string().max(200).optional(),
  candidateExperience: z.number().int().min(0).max(99).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    if (!process.env.ANTHROPIC_API_KEY) {
      return apiError("AI_NOT_CONFIGURED", "AI機能は現在設定されていません", 503);
    }

    // AI APIはユーザーあたり1分に10回まで
    const rl = checkRateLimit(`ai:match:${user.id}`, { maxRequests: 10, windowMs: 60_000 });
    if (!rl.allowed) return apiRateLimited();

    let body;
    try {
      body = await request.json();
    } catch {
      return apiError("INVALID_JSON", "リクエストボディが不正です", 400);
    }
    const parsed = matchSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error);

    const data = parsed.data;
    const { generateText } = await import("ai");
    const { anthropic } = await import("@ai-sdk/anthropic");

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: `あなたは医療機関の採用AIアシスタントです。
候補者と求人のマッチング分析を行ってください。

以下を簡潔に出力してください（JSON形式）：
{
  "score": 0-100のマッチングスコア,
  "strengths": ["強みポイント1", "強みポイント2"],
  "concerns": ["懸念点1"],
  "recommendation": "短い推薦コメント"
}`,
      prompt: `【求人情報】
仕事内容: ${data.jobDescription}
応募要件: ${(data.jobRequirements || []).join("、")}

【候補者情報】
現在の職種: ${data.candidatePosition || "未入力"}
経験年数: ${data.candidateExperience || 0}年
志望動機: ${data.candidateMotivation}`,
      maxOutputTokens: 800,
    });

    // レスポンスのJSON解析
    let result: { score: number | null; strengths?: string[]; concerns?: string[]; recommendation: string };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { recommendation: text, score: null };
      }
    } catch {
      result = { recommendation: text, score: null };
    }

    // 監査ログ
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "ai_match",
      entity: "ai",
      details: { score: result.score },
    });

    return apiSuccess(result);
  } catch (err) {
    return apiServerError(err, "ai.match-candidates");
  }
}
