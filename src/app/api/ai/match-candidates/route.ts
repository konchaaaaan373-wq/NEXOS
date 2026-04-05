import { NextResponse } from "next/server";

// AI-powered candidate matching score
// Analyzes how well a candidate's profile matches a job posting

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI機能は現在設定されていません" },
        { status: 503 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "リクエストボディが不正です" },
        { status: 400 }
      );
    }
    const { jobDescription, jobRequirements, candidateMotivation, candidatePosition, candidateExperience } = body;

    if (!jobDescription || !candidateMotivation) {
      return NextResponse.json(
        { error: "求人内容と候補者情報は必須です" },
        { status: 400 }
      );
    }

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
仕事内容: ${jobDescription}
応募要件: ${(jobRequirements || []).join("、")}

【候補者情報】
現在の職種: ${candidatePosition || "未入力"}
経験年数: ${candidateExperience || 0}年
志望動機: ${candidateMotivation}`,
      maxOutputTokens: 800,
    });

    // Parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // If JSON parsing fails, return raw text
    }

    return NextResponse.json({ recommendation: text, score: null });
  } catch (error) {
    console.error("AI matching failed:", error);
    return NextResponse.json(
      { error: "AI分析に失敗しました" },
      { status: 500 }
    );
  }
}
