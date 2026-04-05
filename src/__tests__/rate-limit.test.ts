import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("初回リクエストは許可される", () => {
    const result = checkRateLimit("test-initial", { maxRequests: 5, windowMs: 60000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("上限を超えると拒否される", () => {
    const key = "test-exceed-" + Date.now();
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key, { maxRequests: 3, windowMs: 60000 });
    }
    const result = checkRateLimit(key, { maxRequests: 3, windowMs: 60000 });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("異なるキーは独立してカウントされる", () => {
    const key1 = "test-key1-" + Date.now();
    const key2 = "test-key2-" + Date.now();
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key1, { maxRequests: 3, windowMs: 60000 });
    }
    const result = checkRateLimit(key2, { maxRequests: 3, windowMs: 60000 });
    expect(result.allowed).toBe(true);
  });
});
