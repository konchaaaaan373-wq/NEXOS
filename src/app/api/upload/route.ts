import { z } from "zod";
import { generateUploadUrl, getPublicUrl } from "@/lib/s3";
import { prisma, hasDatabase } from "@/lib/db";
import { getApiUser } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordAuditLog } from "@/lib/audit";
import { v4 as uuidv4 } from "uuid";
import {
  apiSuccess,
  apiValidationError,
  apiUnauthorized,
  apiRateLimited,
  apiError,
  apiServerError,
} from "@/lib/api-response";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const uploadSchema = z.object({
  fileName: z.string().min(1, "ファイル名は必須です").max(255),
  fileType: z.string().refine((t) => ALLOWED_TYPES.includes(t), "サポートされていないファイル形式です"),
  fileSize: z.number().int().min(1).max(MAX_SIZE, "ファイルサイズは10MB以下にしてください"),
  clinicId: z.string().optional(),
  category: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    // アップロードは1分に20回まで
    const rl = checkRateLimit(`upload:${user.id}`, { maxRequests: 20, windowMs: 60_000 });
    if (!rl.allowed) return apiRateLimited();

    // S3設定チェック
    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
      return apiError("STORAGE_NOT_CONFIGURED", "ファイルストレージが設定されていません", 503);
    }

    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error);

    const { fileName, fileType, fileSize, clinicId, category } = parsed.data;

    const ext = fileName.split(".").pop() || "bin";
    const key = `${category || "general"}/${clinicId || "shared"}/${uuidv4()}.${ext}`;

    const uploadUrl = await generateUploadUrl(key, fileType);
    const publicUrl = getPublicUrl(key);

    // DBがある場合はアップロード記録を保存
    if (hasDatabase) {
      await prisma.upload.create({
        data: {
          clinicId: clinicId || null,
          fileName,
          fileType,
          fileSize,
          url: publicUrl,
          key,
          uploadedById: user.id,
        },
      });
    }

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      clinicId,
      action: "upload",
      entity: "file",
      details: { fileName, fileType, fileSize, key },
    });

    return apiSuccess({ uploadUrl, publicUrl, key });
  } catch (err) {
    return apiServerError(err, "upload.POST");
  }
}
