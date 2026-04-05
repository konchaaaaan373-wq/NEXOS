import { describe, it, expect } from "vitest";
import { hasDatabaseUrl, isProduction, getServiceStatus } from "@/lib/env";

describe("hasDatabaseUrl", () => {
  it("DATABASE_URLが未設定の場合はfalseを返す", () => {
    expect(hasDatabaseUrl()).toBe(false);
  });
});

describe("isProduction", () => {
  it("テスト環境ではfalseを返す", () => {
    expect(isProduction()).toBe(false);
  });
});

describe("getServiceStatus", () => {
  it("サービスステータスオブジェクトを返す", () => {
    const status = getServiceStatus();
    expect(status).toHaveProperty("database");
    expect(status).toHaveProperty("auth");
    expect(status).toHaveProperty("ai");
    expect(status).toHaveProperty("email");
    expect(status).toHaveProperty("storage");
  });
});
