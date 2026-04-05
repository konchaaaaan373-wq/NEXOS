import { NextResponse } from "next/server";

// AI-powered job description optimizer
// Uses Anthropic Claude via Vercel AI SDK

export async function POST(request: Request) {
  try {
    // Check if AI is configured
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
    const { title, description, category, clinicName } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "求人タイトルと仕事内容は必須です" },
        { status: 400 }
      );
    }

    // Dynamic import to avoid build errors when key is not set
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

クリニック名: ${clinicName || "未設定"}
職種カテゴリ: ${category || "未設定"}
求人タイトル: ${title}
仕事内容:
${description}`,
      maxOutputTokens: 1500,
    });

    return NextResponse.json({ suggestions: text });
  } catch (error) {
    console.error("AI optimization failed:", error);
    return NextResponse.json(
      { error: "AI分析に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
