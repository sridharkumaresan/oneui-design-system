import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useImageLoader } from "./useImageLoader.js";

type MockImageBehavior = "success" | "error" | "timeout";

let currentBehavior: MockImageBehavior = "success";
let imageInstances: MockImage[] = [];

class MockImage {
  public crossOrigin: "" | "anonymous" | "use-credentials" | null = null;
  public referrerPolicy = "";
  public naturalHeight = 240;
  public naturalWidth = 320;
  public onerror: ((event?: Event) => void) | null = null;
  public onload: (() => void) | null = null;
  private _src = "";

  public decode = vi.fn().mockResolvedValue(undefined);

  public get src(): string {
    return this._src;
  }

  public set src(value: string) {
    this._src = value;
    imageInstances.push(this);

    queueMicrotask(() => {
      if (currentBehavior === "success") {
        this.onload?.();
      } else if (currentBehavior === "error") {
        this.onerror?.(new Event("error"));
      }
    });
  }
}

describe("useImageLoader", () => {
  const originalImage = globalThis.Image;

  beforeEach(() => {
    currentBehavior = "success";
    imageInstances = [];
    globalThis.Image = MockImage as unknown as typeof Image;
  });

  afterEach(() => {
    globalThis.Image = originalImage;
    vi.useRealTimers();
  });

  it("returns empty when no src is provided", () => {
    const { result } = renderHook(() => useImageLoader({}));

    expect(result.current.state).toBe("empty");
    expect(result.current.resolvedSrc).toBeUndefined();
  });

  it("loads a valid image successfully", async () => {
    const { result } = renderHook(() => useImageLoader({ src: "https://example.com/a.png" }));

    expect(result.current.state).toBe("loading");

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.state).toBe("loaded");
    expect(result.current.resolvedSrc).toBe("https://example.com/a.png");
    expect(result.current.width).toBe(320);
  });

  it("falls back to fallbackSrc after an error", async () => {
    let attempt = 0;
    globalThis.Image = class extends MockImage {
      public override set src(value: string) {
        this["_src"] = value;
        imageInstances.push(this);
        attempt += 1;

        queueMicrotask(() => {
          if (attempt === 1) {
            this.onerror?.(new Event("error"));
            return;
          }

          this.onload?.();
        });
      }
    } as unknown as typeof Image;

    const { result } = renderHook(() =>
      useImageLoader({
        fallbackSrc: "https://example.com/fallback.png",
        src: "https://example.com/a.png"
      })
    );

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.state).toBe("loaded");
    expect(result.current.didUseFallback).toBe(true);
    expect(result.current.resolvedSrc).toBe("https://example.com/fallback.png");
  });

  it("supports retry after an error", async () => {
    currentBehavior = "error";

    const { result } = renderHook(() => useImageLoader({ src: "https://example.com/a.png" }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.state).toBe("error");

    currentBehavior = "success";

    await act(async () => {
      result.current.retry();
      await Promise.resolve();
    });

    expect(result.current.state).toBe("loaded");
  });

  it("times out when loading exceeds the configured limit", async () => {
    vi.useFakeTimers();
    currentBehavior = "timeout";

    const { result } = renderHook(() =>
      useImageLoader({
        src: "https://example.com/a.png",
        timeoutMs: 200
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(220);
    });

    expect(result.current.state).toBe("error");
    expect(result.current.error).toBe("Unable to load image.");
  });
});
