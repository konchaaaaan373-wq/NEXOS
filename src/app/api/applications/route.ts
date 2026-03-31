import { NextResponse } from "next/server";
import { addApplication } from "@/data/seed";
import type { Application } from "@/data/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const application: Application = {
      id: `app-${Date.now()}`,
      jobId: body.jobId,
      clinicId: body.clinicId,
      applicantName: body.name,
      applicantEmail: body.email,
      applicantPhone: body.phone,
      currentPosition: body.currentPosition || "",
      yearsOfExperience: body.yearsOfExperience || 0,
      motivation: body.motivation,
      stage: "applied",
      notes: [],
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addApplication(application);

    return NextResponse.json({ success: true, id: application.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
