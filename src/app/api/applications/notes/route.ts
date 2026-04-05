import { noteSchema } from "@/lib/validations";
import { prisma, hasDatabase } from "@/lib/db";
import { addNote } from "@/data/seed";
import { getApiUser } from "@/lib/api-auth";
import { recordAuditLog } from "@/lib/audit";
import type { UserRole } from "@/data/types";
import {
  apiSuccess,
  apiValidationError,
  apiUnauthorized,
  apiNotFound,
  apiServerError,
} from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    const body = await request.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error);

    const { applicationId, content } = parsed.data;

    if (hasDatabase) {
      // 応募の存在確認
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
      });
      if (!application) return apiNotFound("応募");

      const note = await prisma.candidateNote.create({
        data: {
          applicationId,
          content,
          authorId: user.id,
          authorRole: user.role as UserRole,
        },
      });

      // 監査ログ
      await recordAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        clinicId: application.clinicId,
        action: "create",
        entity: "note",
        entityId: note.id,
        details: { applicationId, contentLength: content.length },
      });

      return apiSuccess({
        id: note.id,
        content: note.content,
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        createdAt: note.createdAt.toISOString(),
      }, 201);
    }

    // MVPモード
    const note = {
      id: `note-${Date.now()}`,
      content,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role as UserRole,
      createdAt: new Date().toISOString(),
    };
    addNote(applicationId, note);

    return apiSuccess(note, 201);
  } catch (err) {
    return apiServerError(err, "applications.notes.POST");
  }
}
