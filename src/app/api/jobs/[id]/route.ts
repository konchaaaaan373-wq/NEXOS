import { NextResponse } from "next/server";
import { jobPostings } from "@/data/seed";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = jobPostings.find((j) => j.id === id);

    if (!job) {
      return NextResponse.json(
        { error: "求人が見つかりません" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Update fields if provided
    if (body.title !== undefined) job.title = body.title;
    if (body.category !== undefined) job.category = body.category;
    if (body.type !== undefined) job.type = body.type;
    if (body.location !== undefined) job.location = body.location;
    if (body.salaryMin !== undefined) job.salaryMin = body.salaryMin * 10000;
    if (body.salaryMax !== undefined) job.salaryMax = body.salaryMax * 10000;
    if (body.description !== undefined) job.description = body.description;
    if (body.requirements !== undefined) job.requirements = body.requirements;
    if (body.niceToHave !== undefined) job.niceToHave = body.niceToHave;
    if (body.benefits !== undefined) job.benefits = body.benefits;
    if (body.isActive !== undefined) job.isActive = body.isActive;

    // Track editor
    if (body.editorId) {
      job.lastEditedBy = body.editorId;
      job.lastEditedAt = new Date().toISOString();
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
