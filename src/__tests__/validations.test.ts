import { describe, it, expect } from "vitest";
import {
  applicationSchema,
  noteSchema,
  stageUpdateSchema,
  jobPostingSchema,
} from "@/lib/validations";

// バリデーションスキーマのテスト
describe("applicationSchema", () => {
  it("有効な応募データを受け付ける", () => {
    const result = applicationSchema.safeParse({
      jobId: "job-1",
      clinicId: "clinic-1",
      name: "田中 太郎",
      email: "tanaka@example.com",
      phone: "090-1234-5678",
      currentPosition: "看護師",
      yearsOfExperience: 5,
      motivation: "志望動機テキスト",
    });
    expect(result.success).toBe(true);
  });

  it("名前が空の場合はエラー", () => {
    const result = applicationSchema.safeParse({
      jobId: "job-1",
      clinicId: "clinic-1",
      name: "",
      email: "tanaka@example.com",
      phone: "090-1234-5678",
      motivation: "志望動機",
    });
    expect(result.success).toBe(false);
  });

  it("無効なメールアドレスはエラー", () => {
    const result = applicationSchema.safeParse({
      jobId: "job-1",
      clinicId: "clinic-1",
      name: "田中",
      email: "invalid-email",
      phone: "090-1234-5678",
      motivation: "志望動機",
    });
    expect(result.success).toBe(false);
  });

  it("電話番号のバリデーション", () => {
    const valid = applicationSchema.safeParse({
      jobId: "job-1",
      clinicId: "clinic-1",
      name: "田中",
      email: "test@example.com",
      phone: "080-1234-5678",
      motivation: "test",
    });
    expect(valid.success).toBe(true);

    const invalid = applicationSchema.safeParse({
      jobId: "job-1",
      clinicId: "clinic-1",
      name: "田中",
      email: "test@example.com",
      phone: "abc",
      motivation: "test",
    });
    expect(invalid.success).toBe(false);
  });

  it("志望動機は2000文字以内", () => {
    const result = applicationSchema.safeParse({
      jobId: "job-1",
      clinicId: "clinic-1",
      name: "田中",
      email: "test@example.com",
      phone: "090-1234-5678",
      motivation: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("noteSchema", () => {
  it("有効なメモを受け付ける", () => {
    const result = noteSchema.safeParse({
      applicationId: "app-1",
      content: "面接の印象は良好",
      authorName: "佐藤",
    });
    expect(result.success).toBe(true);
  });

  it("空のメモはエラー", () => {
    const result = noteSchema.safeParse({
      applicationId: "app-1",
      content: "",
      authorName: "佐藤",
    });
    expect(result.success).toBe(false);
  });
});

describe("stageUpdateSchema", () => {
  it("有効なステージ変更を受け付ける", () => {
    const result = stageUpdateSchema.safeParse({
      applicationId: "app-1",
      stage: "screening",
    });
    expect(result.success).toBe(true);
  });

  it("無効なステージはエラー", () => {
    const result = stageUpdateSchema.safeParse({
      applicationId: "app-1",
      stage: "invalid_stage",
    });
    expect(result.success).toBe(false);
  });
});

describe("jobPostingSchema", () => {
  it("有効な求人データを受け付ける", () => {
    const result = jobPostingSchema.safeParse({
      clinicId: "clinic-1",
      title: "看護師募集",
      type: "full-time",
      category: "看護師",
      location: "東京都渋谷区",
      salaryMin: 450,
      salaryMax: 600,
      description: "外来診療のサポート業務を担当いただきます。",
      requirements: ["看護師免許"],
      niceToHave: ["美容クリニック経験"],
      benefits: ["社保完備"],
    });
    expect(result.success).toBe(true);
  });

  it("タイトルが空はエラー", () => {
    const result = jobPostingSchema.safeParse({
      clinicId: "clinic-1",
      title: "",
      type: "full-time",
      category: "看護師",
      location: "東京",
      salaryMin: 400,
      salaryMax: 500,
      description: "説明",
      requirements: [],
      niceToHave: [],
      benefits: [],
    });
    expect(result.success).toBe(false);
  });
});
