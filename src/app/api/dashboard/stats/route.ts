import { prisma, hasDatabase } from "@/lib/db";
import { getApiUser } from "@/lib/api-auth";
import {
  applications as seedApps,
  jobPostings as seedJobs,
  alerts as seedAlerts,
  clinics as seedClinics,
} from "@/data/seed";
import {
  apiSuccess,
  apiUnauthorized,
  apiServerError,
} from "@/lib/api-response";

// ダッシュボード統計情報
export async function GET(request: Request) {
  try {
    const user = await getApiUser();
    if (!user) return apiUnauthorized();

    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");

    if (hasDatabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clinicFilter: any = clinicId ? { clinicId } : {};

      const [
        totalApplications,
        activeJobs,
        applicationsByStage,
        recentApplications,
        criticalAlerts,
      ] = await Promise.all([
        prisma.application.count({ where: clinicFilter }),
        prisma.jobPosting.count({ where: { ...clinicFilter, isActive: true } }),
        prisma.application.groupBy({
          by: ["stage"],
          where: clinicFilter,
          _count: true,
        }),
        prisma.application.findMany({
          where: clinicFilter,
          orderBy: { appliedAt: "desc" },
          take: 5,
          include: {
            job: { select: { title: true } },
            clinic: { select: { name: true } },
          },
        }),
        prisma.alert.count({
          where: { ...clinicFilter, severity: "critical", isResolved: false },
        }),
      ]);

      // パイプライン集計
      const pipeline = applicationsByStage.reduce(
        (acc, item) => ({ ...acc, [item.stage]: item._count }),
        {} as Record<string, number>
      );

      return apiSuccess({
        totalApplications,
        activeJobs,
        pipeline,
        recentApplications,
        criticalAlerts,
      });
    }

    // MVPモード
    const filteredApps = clinicId
      ? seedApps.filter((a) => a.clinicId === clinicId)
      : seedApps;
    const filteredJobs = clinicId
      ? seedJobs.filter((j) => j.clinicId === clinicId && j.isActive)
      : seedJobs.filter((j) => j.isActive);
    const filteredAlerts = clinicId
      ? seedAlerts.filter((a) => a.clinicId === clinicId && !a.isResolved)
      : seedAlerts.filter((a) => !a.isResolved);

    const pipeline: Record<string, number> = {};
    for (const app of filteredApps) {
      pipeline[app.stage] = (pipeline[app.stage] || 0) + 1;
    }

    return apiSuccess({
      totalApplications: filteredApps.length,
      activeJobs: filteredJobs.length,
      pipeline,
      recentApplications: filteredApps
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        .slice(0, 5)
        .map((a) => ({
          ...a,
          job: { title: seedJobs.find((j) => j.id === a.jobId)?.title || "" },
          clinic: { name: seedClinics.find((c) => c.id === a.clinicId)?.name || "" },
        })),
      criticalAlerts: filteredAlerts.filter((a) => a.severity === "critical").length,
    });
  } catch (err) {
    return apiServerError(err, "dashboard.stats.GET");
  }
}
