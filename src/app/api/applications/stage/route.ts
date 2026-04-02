import { NextResponse } from "next/server";
import { updateApplicationStage } from "@/data/seed";
import { stageUpdateSchema } from "@/lib/validations";
import { getApiUser } from "@/lib/api-auth";

export async function PATCH(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = stageUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容に問題があります" },
        { status: 400 }
      );
    }

    updateApplicationStage(parsed.data.applicationId, parsed.data.stage);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
