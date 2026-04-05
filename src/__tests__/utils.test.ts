import { describe, it, expect } from "vitest";
import { cn, formatDate, generateId } from "@/lib/utils";

describe("cn", () => {
  it("クラス名を正しくマージする", () => {
    const result = cn("px-4", "py-2", "px-8");
    expect(result).toBe("py-2 px-8");
  });

  it("条件付きク���ス名を処理する", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toBe("base visible");
  });
});

describe("formatDate", () => {
  it("日本語の日付フォーマットを返す", () => {
    const result = formatDate("2026-03-15");
    expect(result).toContain("2026");
    expect(result).toContain("3");
    expect(result).toContain("15");
  });
});

describe("generateId", () => {
  it("ユニークなIDを生成する", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(5);
  });
});
