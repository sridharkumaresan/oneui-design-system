import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useProgressiveLoading } from "./useProgressiveLoading.js";

describe("useProgressiveLoading", () => {
  it("loads multiple sections and derives aggregate progress", async () => {
    const { result } = renderHook(() =>
      useProgressiveLoading({
        autoStart: false,
        sections: [
          {
            id: "news",
            loader: async () => {
              return {
                items: ["a", "b"]
              };
            },
            title: "News",
            getCount: (data) => data.items.length
          },
          {
            id: "files",
            loader: async () => {
              return [];
            },
            title: "Files",
            isEmpty: (data) => data.length === 0
          }
        ]
      })
    );

    await act(async () => {
      await result.current.loadAll();
    });

    expect(result.current.sectionMap.news.status).toBe("success");
    expect(result.current.sectionMap.news.count).toBe(2);
    expect(result.current.sectionMap.files.status).toBe("empty");
    expect(result.current.progress.completed).toBe(2);
    expect(result.current.progress.success).toBe(1);
    expect(result.current.progress.empty).toBe(1);
  });

  it("marks delayed sections when the threshold is exceeded", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useProgressiveLoading({
        autoStart: false,
        delayedThresholdMs: 100,
        sections: [
          {
            id: "people",
            loader: async () => {
              await new Promise((resolve) => {
                setTimeout(resolve, 200);
              });

              return ["maya"];
            },
            title: "People",
            getCount: (data) => data.length
          }
        ]
      })
    );

    const loadPromise = act(async () => {
      const promise = result.current.loadAll();
      vi.advanceTimersByTime(120);
      await Promise.resolve();
      expect(result.current.sectionMap.people.status).toBe("delayed");
      vi.advanceTimersByTime(200);
      await promise;
    });

    await loadPromise;

    expect(result.current.sectionMap.people.status).toBe("success");
    vi.useRealTimers();
  });

  it("supports retrying a single failed section", async () => {
    let shouldFail = true;

    const { result } = renderHook(() =>
      useProgressiveLoading({
        autoStart: false,
        sections: [
          {
            id: "resources",
            loader: async () => {
              if (shouldFail) {
                throw new Error("Failed");
              }

              return {
                records: ["ok"]
              };
            },
            title: "Resources",
            getCount: (data) => data.records.length
          }
        ]
      })
    );

    await act(async () => {
      await result.current.loadAll();
    });

    expect(result.current.sectionMap.resources.status).toBe("error");

    shouldFail = false;

    await act(async () => {
      await result.current.retrySection("resources");
    });

    expect(result.current.sectionMap.resources.status).toBe("success");
    expect(result.current.sectionMap.resources.count).toBe(1);
  });

  it("auto-starts only once for stable section configs", async () => {
    const loader = vi.fn(async () => {
      return ["item"];
    });

    const { unmount } = renderHook(() =>
      useProgressiveLoading({
        delayedThresholdMs: 100,
        sections: [
          {
            id: "news",
            loader,
            title: "News",
            getCount: (data) => data.length
          }
        ]
      })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(loader).toHaveBeenCalledTimes(1);
    unmount();
  });
});
