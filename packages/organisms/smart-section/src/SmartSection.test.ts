import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OneUIProvider } from "@functions-oneui/theme";

import { SmartSection } from "./SmartSection.js";
import type { SmartSectionEvent, SmartSectionFetchResult } from "./SmartSection.types.js";

type DemoItem = {
  id: string;
  label: string;
};

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const createDeferred = <T>(): Deferred<T> => {
  let resolve: (value: T) => void = () => undefined;
  let reject: (reason?: unknown) => void = () => undefined;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const waitWithSignal = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

const renderInProvider = (ui: React.ReactElement) => {
  const rendered = render(React.createElement(OneUIProvider, { mode: "light" }, ui));

  return {
    ...rendered,
    rerender: (nextUi: React.ReactElement) =>
      rendered.rerender(React.createElement(OneUIProvider, { mode: "light" }, nextUi))
  };
};

const renderItem = (item: DemoItem): React.ReactNode => {
  return React.createElement("span", null, item.label);
};

describe("SmartSection", () => {
  it("fetches only when requestKey changes and section is enabled", async () => {
    const fetcher = vi.fn(
      async ({ requestKey }): Promise<SmartSectionFetchResult<DemoItem>> => ({
        items: [{ id: String(requestKey), label: `Item ${String(requestKey)}` }],
        totalCount: 1
      })
    );

    const { rerender } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "request-check",
        title: "Request Check",
        requestKey: "alpha",
        requestParams: { page: 1 },
        enabled: true,
        fetcher,
        renderItem
      })
    );

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "request-check",
        title: "Request Check",
        requestKey: "alpha",
        requestParams: { page: 2 },
        enabled: true,
        fetcher,
        renderItem
      })
    );

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "request-check",
        title: "Request Check",
        requestKey: "beta",
        enabled: true,
        fetcher,
        renderItem
      })
    );

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "request-check",
        title: "Request Check",
        requestKey: "gamma",
        enabled: false,
        fetcher,
        renderItem
      })
    );

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  it("aborts in-flight request when requestKey changes", async () => {
    const deferredByKey = new Map<string, Deferred<SmartSectionFetchResult<DemoItem>>>();
    const abortedKeys: string[] = [];

    const fetcher = vi.fn(({ requestKey, signal }) => {
      const key = String(requestKey);
      const deferred = createDeferred<SmartSectionFetchResult<DemoItem>>();

      signal.addEventListener(
        "abort",
        () => {
          abortedKeys.push(key);
          deferred.reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true }
      );

      deferredByKey.set(key, deferred);
      return deferred.promise;
    });

    const { rerender } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "abort-check",
        title: "Abort Check",
        requestKey: "first",
        enabled: true,
        fetcher,
        renderItem
      })
    );

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "abort-check",
        title: "Abort Check",
        requestKey: "second",
        enabled: true,
        fetcher,
        renderItem
      })
    );

    await waitFor(() => {
      expect(abortedKeys).toContain("first");
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    deferredByKey.get("second")?.resolve({
      items: [{ id: "second-1", label: "Second item" }],
      totalCount: 1
    });

    await screen.findByText("Second item");
  });

  it("moves to slow state and auto-collapses", async () => {
    const fetcher = async ({
      signal
    }: {
      signal: AbortSignal;
    }): Promise<SmartSectionFetchResult<DemoItem>> => {
      await waitWithSignal(2000, signal);
      return { items: [{ id: "slow-1", label: "Slow item" }], totalCount: 1 };
    };

    renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "slow-check",
        title: "Slow Check",
        requestKey: "slow",
        enabled: true,
        slowThresholdMs: 30,
        fetcher,
        renderItem
      })
    );

    const toggle = screen.getByRole("button", { name: /Slow Check/ });
    await waitFor(() => {
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
    });
  });

  it("re-expands automatically when a slow-collapsed section eventually succeeds", async () => {
    const fetcher = async ({
      signal
    }: {
      signal: AbortSignal;
    }): Promise<SmartSectionFetchResult<DemoItem>> => {
      await waitWithSignal(90, signal);
      return { items: [{ id: "slow-success-1", label: "Recovered from slow" }], totalCount: 1 };
    };

    renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "slow-recover-check",
        title: "Slow Recover Check",
        requestKey: "slow-recover",
        enabled: true,
        slowThresholdMs: 20,
        fetcher,
        renderItem
      })
    );

    const toggle = screen.getByRole("button", { name: /Slow Recover Check/ });

    await waitFor(() => {
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
    });

    await screen.findByText("Recovered from slow");

    await waitFor(() => {
      expect(toggle.getAttribute("aria-expanded")).toBe("true");
    });
  });

  it("keeps previous items visible during slow refresh when keepPreviousData is enabled", async () => {
    const fetcher = vi.fn(({ requestKey, signal }) => {
      if (requestKey === "alpha") {
        return Promise.resolve({
          items: [{ id: "alpha-1", label: "Alpha item" }],
          totalCount: 1
        });
      }

      return waitWithSignal(2000, signal).then(() => ({
        items: [{ id: "beta-1", label: "Beta item" }],
        totalCount: 1
      }));
    });

    const { rerender } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-check",
        title: "Refresh Check",
        requestKey: "alpha",
        enabled: true,
        keepPreviousData: true,
        slowThresholdMs: 25,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("Alpha item");

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-check",
        title: "Refresh Check",
        requestKey: "beta",
        enabled: true,
        keepPreviousData: true,
        slowThresholdMs: 25,
        fetcher,
        renderItem
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Taking longer than expected")).toBeTruthy();
    });

    const toggle = screen.getByRole("button", { name: /Refresh Check/ });
    const panel = screen.getByRole("region", { name: "Refresh Check" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Alpha item")).toBeTruthy();
    expect(panel.style.height).toBe("60px");
    expect(screen.queryByText("Skeleton row 1")).toBeNull();
  });

  it("clears previous items and shows loading skeleton on request change when keepPreviousData is false", async () => {
    const refreshDeferred = createDeferred<SmartSectionFetchResult<DemoItem>>();

    const fetcher = vi.fn(({ requestKey }) => {
      if (requestKey === "alpha") {
        return Promise.resolve({
          items: [{ id: "alpha-1", label: "Alpha item" }],
          totalCount: 1
        });
      }

      return refreshDeferred.promise;
    });

    const { rerender } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-no-keep-check",
        title: "Refresh No Keep",
        requestKey: "alpha",
        enabled: true,
        keepPreviousData: false,
        rowHeightPx: 30,
        initialVisibleCount: 2,
        fetcher,
        renderItem,
        renderSkeletonRow: (index: number) =>
          React.createElement("span", null, `Skeleton row ${index + 1}`)
      })
    );

    await screen.findByText("Alpha item");

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-no-keep-check",
        title: "Refresh No Keep",
        requestKey: "beta",
        enabled: true,
        keepPreviousData: false,
        rowHeightPx: 30,
        initialVisibleCount: 2,
        fetcher,
        renderItem,
        renderSkeletonRow: (index: number) =>
          React.createElement("span", null, `Skeleton row ${index + 1}`)
      })
    );

    const panel = screen.getByRole("region", { name: "Refresh No Keep" });
    expect(screen.queryByText("Alpha item")).toBeNull();
    expect(screen.getByText("Loading")).toBeTruthy();
    expect(screen.getByText("Skeleton row 1")).toBeTruthy();
    expect(screen.getByText("Skeleton row 2")).toBeTruthy();
    expect(panel.style.height).toBe("84px");

    refreshDeferred.resolve({
      items: [{ id: "beta-1", label: "Beta item" }],
      totalCount: 1
    });

    await screen.findByText("Beta item");
    expect(screen.queryByText("Skeleton row 1")).toBeNull();
  });

  it("can skeletonize header content during initial loading", async () => {
    const deferred = createDeferred<SmartSectionFetchResult<DemoItem>>();
    const fetcher = vi.fn(() => deferred.promise);

    renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "header-skeleton-check",
        title: "Header Skeleton",
        requestKey: "header-skeleton-request",
        enabled: true,
        skeletonizeHeaderOnInitialLoad: true,
        fetcher,
        renderItem
      })
    );

    const toggle = screen.getByRole("button", { name: /Header Skeleton/ });
    expect(toggle.getAttribute("disabled")).toBe("");
    expect(screen.queryByText("Loading")).toBeNull();

    deferred.resolve({
      items: [{ id: "loaded-1", label: "Loaded item" }],
      totalCount: 1
    });

    await screen.findByText("Loaded item");
    expect(toggle.getAttribute("disabled")).toBeNull();
  });

  it("transitions to empty state after refresh resolves with no items", async () => {
    const fetcher = vi.fn(async ({ requestKey, signal }) => {
      await waitWithSignal(20, signal);

      if (requestKey === "alpha") {
        return {
          items: [{ id: "alpha-1", label: "Alpha item" }],
          totalCount: 1
        };
      }

      return {
        items: [],
        totalCount: 0
      };
    });

    const { rerender } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-empty-check",
        title: "Refresh Empty",
        requestKey: "alpha",
        enabled: true,
        keepPreviousData: true,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("Alpha item");

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-empty-check",
        title: "Refresh Empty",
        requestKey: "beta",
        enabled: true,
        keepPreviousData: true,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("No items available for this section.");

    const toggle = screen.getByRole("button", { name: /Refresh Empty/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("transitions to error state after refresh rejects", async () => {
    const fetcher = vi.fn(async ({ requestKey, signal }) => {
      await waitWithSignal(20, signal);

      if (requestKey === "alpha") {
        return {
          items: [{ id: "alpha-1", label: "Alpha item" }],
          totalCount: 1
        };
      }

      throw new Error("Refresh failed");
    });

    const { rerender } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-error-check",
        title: "Refresh Error",
        requestKey: "alpha",
        enabled: true,
        keepPreviousData: true,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("Alpha item");

    rerender(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "refresh-error-check",
        title: "Refresh Error",
        requestKey: "beta",
        enabled: true,
        keepPreviousData: true,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("Refresh failed");

    const toggle = screen.getByRole("button", { name: /Refresh Error/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });

  it("retry refetches section and emits retry + settled events", async () => {
    const events: SmartSectionEvent[] = [];
    let attempt = 0;

    const fetcher = vi.fn(async ({ signal }) => {
      attempt += 1;
      await waitWithSignal(15, signal);

      if (attempt === 1) {
        throw new Error("Transient API failure");
      }

      return {
        items: [{ id: "recovered-1", label: "Recovered item" }],
        totalCount: 1
      };
    });

    renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "retry-check",
        title: "Retry Check",
        requestKey: "retry",
        enabled: true,
        fetcher,
        renderItem,
        onEvent: (event) => {
          events.push(event);
        }
      })
    );

    await screen.findByText("Transient API failure");

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));

    await screen.findByText("Recovered item");
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(events.some((event) => event.type === "retry")).toBe(true);
    expect(
      events.some(
        (event) =>
          event.type === "settled" && (event.status === "success" || event.status === "error")
      )
    ).toBe(true);
  });

  it("calculates deterministic body height and enforces visible item limits", async () => {
    const fetcher = async (): Promise<SmartSectionFetchResult<DemoItem>> => {
      return {
        items: Array.from({ length: 6 }).map((_, index) => ({
          id: `height-${index + 1}`,
          label: `Height item ${index + 1}`
        })),
        totalCount: 6
      };
    };

    renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "height-check",
        title: "Height Check",
        requestKey: "height",
        enabled: true,
        rowHeightPx: 30,
        initialVisibleCount: 2,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("Height item 1");

    const panel = screen.getByRole("region", { name: "Height Check" });
    expect(panel.style.height).toBe("84px");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Showing 2 of 6")).toBeTruthy();

    const toggle = screen.getByRole("button", { name: /Height Check/ });
    fireEvent.click(toggle);
    expect(panel.style.height).toBe("0px");
  });

  it("renders a header view-more link and emits viewMore event", async () => {
    const events: SmartSectionEvent[] = [];
    const fetcher = async (): Promise<SmartSectionFetchResult<DemoItem>> => {
      return {
        items: Array.from({ length: 4 }).map((_, index) => ({
          id: `metrics-${index + 1}`,
          label: `Metrics item ${index + 1}`
        })),
        totalCount: 4
      };
    };

    renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "metrics-check",
        title: "Metrics Check",
        requestKey: "metrics",
        enabled: true,
        rowHeightPx: 20,
        initialVisibleCount: 2,
        bodyPaddingBlockPx: 10,
        rowGapPx: 2,
        viewMoreHref: "/sections/metrics",
        viewMoreLabel: "View all",
        viewMoreTarget: "_blank",
        fetcher,
        renderItem,
        onEvent: (event) => {
          events.push(event);
        }
      })
    );

    await screen.findByText("Metrics item 1");

    const panel = screen.getByRole("region", { name: "Metrics Check" });
    expect(panel.style.height).toBe("52px");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    const link = screen.getByRole("link", { name: "View all" });
    expect(link.getAttribute("href")).toBe("/sections/metrics");
    await userEvent.click(link);

    expect(
      events.some(
        (event) =>
          event.type === "viewMore" &&
          event.href === "/sections/metrics" &&
          event.sectionId === "metrics-check"
      )
    ).toBe(true);
  });
});
