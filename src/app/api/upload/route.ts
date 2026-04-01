import { NextResponse } from "next/server";
import { generateUploadUrl, getPublicUrl } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileType, fileSize, clinicId, category } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "ファイル名とファイル形式は必須です" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "サポートされていないファイル形式です" },
        { status: 400 }
      );
    }

    if (fileSize && fileSize > MAX_SIZE) {
      return NextResponse.json(
        { error: "ファイルサイズは10MB以下にしてください" },
        { status: 400 }
      );
    }

    const ext = fileName.split(".").pop() || "bin";
    const key = `${category || "general"}/${clinicId || "shared"}/${uuidv4()}.${ext}`;

    const uploadUrl = await generateUploadUrl(key, fileType);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch {
    return NextResponse.json(
      { error: "アップロードURLの生成に失敗しました" },
      { status: 500 }
    );
  }
}
