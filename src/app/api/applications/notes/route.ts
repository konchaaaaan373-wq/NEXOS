import { NextResponse } from "next/server";
import { addNote } from "@/data/seed";
import { noteSchema } from "@/lib/validations";
import type { UserRole } from "@/data/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = noteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容に問題があります" },
        { status: 400 }
      );
    }

    const note = {
      id: `note-${Date.now()}`,
      content: parsed.data.content,
      authorId: (body.authorId as string) || "unknown",
      authorName: parsed.data.authorName,
      authorRole: (body.authorRole as UserRole) || "clinic_admin",
      createdAt: new Date().toISOString(),
    };

    addNote(parsed.data.applicationId, note);
    return NextResponse.json({ success: true, note });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
