import { describe, it, expect } from "vitest";
import {
  clinics,
  jobPostings,
  applications,
  adminUsers,
  alerts,
  facilities,
  vacancyImpacts,
  getClinic,
  getClinicBySlug,
  getJobsForClinic,
  getJob,
  getApplication,
  getAdminUser,
  getAdminUsersForClinic,
} from "@/data/seed";

describe("シードデータの整合性", () => {
  it("3つのクリニックが存在する", () => {
    expect(clinics).toHaveLength(3);
  });

  it("各クリニックにユニークなスラグがある", () => {
    const slugs = clinics.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("各求人が存在するクリニックに紐づいている", () => {
    const clinicIds = new Set(clinics.map((c) => c.id));
    for (const job of jobPostings) {
      expect(clinicIds.has(job.clinicId)).toBe(true);
    }
  });

  it("各応募が存在する求人に紐づいている", () => {
    const jobIds = new Set(jobPostings.map((j) => j.id));
    for (const app of applications) {
      expect(jobIds.has(app.jobId)).toBe(true);
    }
  });

  it("各応募が存在するクリニックに紐づいている", () => {
    const clinicIds = new Set(clinics.map((c) => c.id));
    for (const app of applications) {
      expect(clinicIds.has(app.clinicId)).toBe(true);
    }
  });

  it("アラートが存在するクリニックに紐づいている", () => {
    const clinicIds = new Set(clinics.map((c) => c.id));
    for (const alert of alerts) {
      expect(clinicIds.has(alert.clinicId)).toBe(true);
    }
  });

  it("施設が存在するクリニックに紐づいている", () => {
    const clinicIds = new Set(clinics.map((c) => c.id));
    for (const facility of facilities) {
      expect(clinicIds.has(facility.clinicId)).toBe(true);
    }
  });
});

describe("ヘルパー関数", () => {
  it("getClinic: IDでクリニックを取得できる", () => {
    const clinic = getClinic("clinic-1");
    expect(clinic).toBeDefined();
    expect(clinic?.name).toBe("メディカルフロンティア渋谷");
  });

  it("getClinicBySlug: スラグでクリニックを取得できる", () => {
    const clinic = getClinicBySlug("sakura-home-care");
    expect(clinic).toBeDefined();
    expect(clinic?.id).toBe("clinic-2");
  });

  it("getJobsForClinic: クリニックの求人を取得できる", () => {
    const jobs = getJobsForClinic("clinic-1");
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.every((j) => j.clinicId === "clinic-1")).toBe(true);
  });

  it("getJob: IDで求人を取得できる", () => {
    const job = getJob("job-1");
    expect(job).toBeDefined();
    expect(job?.clinicId).toBe("clinic-1");
  });

  it("getApplication: IDで応募を取得できる", () => {
    const app = getApplication("app-1");
    expect(app).toBeDefined();
    expect(app?.applicantName).toBe("田中 美咲");
  });

  it("getAdminUser: IDでユーザーを取得できる", () => {
    const user = getAdminUser("user-neco-1");
    expect(user).toBeDefined();
    expect(user?.role).toBe("neco_admin");
  });

  it("getAdminUsersForClinic: クリニックのユーザーを取得できる", () => {
    const users = getAdminUsersForClinic("clinic-1");
    expect(users.length).toBeGreaterThan(0);
  });
});
