import { describe, expect, it } from "vitest";

import { shouldMarkSectionDelayed } from "./delayed-state.js";

describe("shouldMarkSectionDelayed", () => {
  it("returns false when the threshold has not elapsed", () => {
    expect(
      shouldMarkSectionDelayed({
        now: 1_000,
        startedAt: 500,
        thresholdMs: 600
      })
    ).toBe(false);
  });

  it("returns true when the threshold has elapsed", () => {
    expect(
      shouldMarkSectionDelayed({
        now: 1_500,
        startedAt: 0,
        thresholdMs: 600
      })
    ).toBe(true);
  });
});
