import { NextResponse } from "next/server";
import { addApplication } from "@/data/seed";
import { applicationSchema } from "@/lib/validations";
import type { Application } from "@/data/types";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくしてからお試しください。" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

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

    const application: Application = {
      id: `app-${Date.now()}`,
      jobId: data.jobId,
      clinicId: data.clinicId,
      applicantName: data.name,
      applicantEmail: data.email,
      applicantPhone: data.phone,
      currentPosition: data.currentPosition ?? "",
      yearsOfExperience: data.yearsOfExperience ?? 0,
      motivation: data.motivation,
      stage: "applied",
      notes: [],
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addApplication(application);

    return NextResponse.json({ success: true, id: application.id });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
