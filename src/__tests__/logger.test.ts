import { describe, it, expect } from "vitest";
import { generateRequestId, logger } from "@/lib/logger";

describe("generateRequestId", () => {
  it("req_プレフィックスで始まるIDを生成する", () => {
    const id = generateRequestId();
    expect(id).toMatch(/^req_/);
  });

  it("ユニークなIDを生成する", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateRequestId()));
    expect(ids.size).toBe(100);
  });
});

describe("logger", () => {
  it("各レベルのログが呼び出し可能", () => {
    expect(() => logger.debug("test debug")).not.toThrow();
    expect(() => logger.info("test info")).not.toThrow();
    expect(() => logger.warn("test warn")).not.toThrow();
    expect(() => logger.error("test error")).not.toThrow();
  });

  it("メタデータ付きログが呼び出し可能", () => {
    expect(() => logger.info("test", { key: "value" })).not.toThrow();
  });
});
