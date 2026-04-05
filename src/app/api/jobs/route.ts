import { NextResponse } from "next/server";
import { jobPostings } from "@/data/seed";
import { jobPostingSchema } from "@/lib/validations";
import type { JobPosting } from "@/data/types";

// 求人一覧を取得
export async function GET() {
  try {
    return NextResponse.json(jobPostings);
  } catch {
    return NextResponse.json(
      { error: "求人一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "リクエストボディが不正です" },
        { status: 400 }
      );
    }
    const parsed = jobPostingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "入力内容に問題があります",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      clinicId: data.clinicId,
      title: data.title,
      type: data.type,
      category: data.category,
      location: data.location,
      salaryMin: data.salaryMin * 10000,
      salaryMax: data.salaryMax * 10000,
      description: data.description,
      requirements: data.requirements,
      niceToHave: data.niceToHave,
      benefits: data.benefits,
      isActive: true,
      publishedAt: new Date().toISOString().split("T")[0],
      viewCount: 0,
      applyStartCount: 0,
      applyCompleteCount: 0,
    };

    jobPostings.push(newJob);

    return NextResponse.json({ success: true, id: newJob.id });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
