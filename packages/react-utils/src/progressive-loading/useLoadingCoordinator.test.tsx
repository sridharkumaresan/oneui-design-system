import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { deriveLoadingProgress } from "./deriveLoadingProgress.js";
import { useLoadingCoordinator } from "./useLoadingCoordinator.js";

const sections = [
  { id: "news", order: 1, title: "News" },
  { id: "people", order: 2, title: "People" },
  { id: "resources", order: 3, title: "Resources" }
];

describe("progressive loading helpers", () => {
  it("derives the requested summary counts from section states", () => {
    const progress = deriveLoadingProgress([
      {
        count: 4,
        id: "news",
        retryable: false,
        status: "success",
        title: "News"
      },
      {
        count: 0,
        id: "people",
        retryable: false,
        status: "delayed",
        title: "People"
      },
      {
        count: 0,
        id: "resources",
        retryable: true,
        status: "error",
        title: "Resources"
      }
    ]);

    expect(progress.total).toBe(3);
    expect(progress.completed).toBe(2);
    expect(progress.success).toBe(1);
    expect(progress.delayed).toBe(1);
    expect(progress.error).toBe(1);
    expect(progress.percent).toBe(67);
    expect(progress.totalItems).toBe(4);
  });
});

describe("useLoadingCoordinator", () => {
  it("tracks delayed and success transitions", () => {
    const { result } = renderHook(() => useLoadingCoordinator({ sections }));

    act(() => {
      result.current.markLoading();
      result.current.markDelayed(["people"]);
      result.current.markSuccess("news", 5);
      result.current.markError("resources", "Temporarily unavailable");
    });

    expect(result.current.sectionMap.news.status).toBe("success");
    expect(result.current.sectionMap.news.count).toBe(5);
    expect(result.current.sectionMap.people.status).toBe("delayed");
    expect(result.current.sectionMap.resources.status).toBe("error");
    expect(result.current.progress.completed).toBe(2);
    expect(result.current.progress.delayed).toBe(1);
  });

  it("supports refreshing without dropping existing counts", () => {
    const { result } = renderHook(() => useLoadingCoordinator({ sections }));

    act(() => {
      result.current.markSuccess("news", 2);
      result.current.markRefreshing(["news"]);
    });

    expect(result.current.sectionMap.news.status).toBe("refreshing");
    expect(result.current.sectionMap.news.count).toBe(2);
    expect(result.current.progress.refreshing).toBe(1);
  });

  it("can reset a single section without disturbing the others", () => {
    const { result } = renderHook(() => useLoadingCoordinator({ sections }));

    act(() => {
      result.current.markSuccess("news", 2);
      result.current.markEmpty("people");
      result.current.markError("resources", "Failed");
    });

    act(() => {
      result.current.reset(["resources"]);
    });

    expect(result.current.sectionMap.news.status).toBe("success");
    expect(result.current.sectionMap.people.status).toBe("empty");
    expect(result.current.sectionMap.resources.status).toBe("idle");
    expect(result.current.progress.completed).toBe(2);
  });
});
