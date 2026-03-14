import { describe, expect, it } from "vitest";

import { isAbortError, normalizeError } from "./errors.js";

describe("error normalization", () => {
  it("normalizes standard Error instances including causes", () => {
    const cause = new Error("root cause");
    const error = new Error("top level", { cause });

    expect(normalizeError(error)).toEqual(
      expect.objectContaining({
        kind: "error",
        name: "Error",
        message: "top level",
        cause: expect.objectContaining({
          message: "root cause"
        })
      })
    );
  });

  it("normalizes abort errors distinctly", () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError");
    const normalized = normalizeError(abortError);

    expect(isAbortError(abortError)).toBe(true);
    expect(normalized).toEqual(
      expect.objectContaining({
        kind: "abort",
        name: "AbortError"
      })
    );
  });

  it("normalizes non-error thrown values", () => {
    expect(normalizeError("plain string")).toEqual({
      kind: "unknown",
      name: "NonErrorThrow",
      message: "plain string"
    });

    expect(normalizeError({ message: "from object", code: "E_CUSTOM" })).toEqual(
      expect.objectContaining({
        kind: "unknown",
        name: "NonErrorThrow",
        message: "from object",
        code: "E_CUSTOM",
        details: expect.objectContaining({
          code: "E_CUSTOM",
          message: "from object"
        })
      })
    );
  });
});
