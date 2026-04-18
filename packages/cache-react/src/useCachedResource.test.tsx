import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createCacheEngine,
  createMemoryCacheStorageAdapter,
  type CacheEngine,
  type CacheScope,
  type CacheStorageAdapter
} from "@functions-oneui/cache";
import { useCachedResource } from "./useCachedResource.js";

type Resource = {
  value: string;
};

type Deferred<T> = {
  promise: Promise<T>;
  reject: (reason?: unknown) => void;
  resolve: (value: T) => void;
};

const createDeferred = <T,>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });

  return {
    promise,
    reject,
    resolve
  };
};

const scope: CacheScope = {
  key: "primary",
  namespace: "resource",
  segments: {
    site: "site-a",
    tenant: "tenant-a"
  }
};

const setVisibilityState = (visibilityState: DocumentVisibilityState): void => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: visibilityState
  });
};

afterEach(() => {
  vi.useRealTimers();
  setVisibilityState("visible");
});

const createTestEngine = (): {
  engine: CacheEngine;
  setNow: (nextNow: number) => void;
} => {
  let now = 1_000;
  const engine = createCacheEngine({
    clock: {
      now: () => now
    },
    storage: createMemoryCacheStorageAdapter()
  });

  return {
    engine,
    setNow: (nextNow: number) => {
      now = nextNow;
    }
  };
};

describe("useCachedResource", () => {
  it("loads from the fetcher on first load when no cache exists", async () => {
    const { engine } = createTestEngine();
    const deferred = createDeferred<Resource>();
    const fetcher = vi.fn(() => deferred.promise);

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy: {
          expireTimeMs: 10_000,
          staleTimeMs: 5_000
        },
        scope
      })
    );

    expect(result.current.status).toBe("loading-first-load");

    await act(async () => {
      deferred.resolve({ value: "network" });
      await deferred.promise;
    });

    await waitFor(() => expect(result.current.status).toBe("success-fresh"));
    expect(result.current.data).toEqual({ value: "network" });
    expect(result.current.source).toBe("network");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("uses cached fresh data without fetching", async () => {
    const { engine } = createTestEngine();
    const fetcher = vi.fn(async () => ({ value: "network" }));
    await engine.set(scope, { value: "cached" }, { expireTimeMs: 10_000, staleTimeMs: 5_000 });

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy: {
          expireTimeMs: 10_000,
          staleTimeMs: 5_000
        },
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("success-fresh"));
    expect(result.current.data).toEqual({ value: "cached" });
    expect(result.current.source).toBe("cache");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("uses cached stale data without revalidation when disabled", async () => {
    const { engine, setNow } = createTestEngine();
    const fetcher = vi.fn(async () => ({ value: "network" }));
    const policy = { expireTimeMs: 10_000, staleTimeMs: 10 };
    await engine.set(scope, { value: "stale" }, policy);
    setNow(1_020);

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy,
        revalidateIfStale: false,
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("success-stale"));
    expect(result.current.data).toEqual({ value: "stale" });
    expect(result.current.lifecycleState).toBe("stale");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("renders stale data immediately and refreshes in the background when enabled", async () => {
    const { engine, setNow } = createTestEngine();
    const deferred = createDeferred<Resource>();
    const fetcher = vi.fn(() => deferred.promise);
    const policy = { expireTimeMs: 10_000, staleTimeMs: 10 };
    await engine.set(scope, { value: "stale" }, policy);
    setNow(1_020);

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy,
        revalidateIfStale: true,
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("refreshing"));
    expect(result.current.data).toEqual({ value: "stale" });
    expect(result.current.source).toBe("cache");

    await act(async () => {
      deferred.resolve({ value: "fresh" });
      await deferred.promise;
    });

    await waitFor(() => expect(result.current.status).toBe("success-fresh"));
    expect(result.current.data).toEqual({ value: "fresh" });
    expect(result.current.source).toBe("network");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("keeps cached data when a manual refresh fails", async () => {
    const { engine } = createTestEngine();
    const error = new Error("refresh failed");
    const fetcher = vi.fn(async () => {
      throw error;
    });
    await engine.set(scope, { value: "cached" }, { expireTimeMs: 10_000, staleTimeMs: 5_000 });

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy: {
          expireTimeMs: 10_000,
          staleTimeMs: 5_000
        },
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("success-fresh"));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.status).toBe("error-with-stale-data");
    expect(result.current.data).toEqual({ value: "cached" });
    expect(result.current.error).toBe(error);
  });

  it("renders fresh network data when cache persistence fails", async () => {
    const storage: CacheStorageAdapter<Resource> = {
      clear: vi.fn(async () => undefined),
      get: vi.fn(async () => undefined),
      id: "write-fails",
      isAvailable: () => true,
      kind: "test",
      list: vi.fn(async () => []),
      remove: vi.fn(async () => undefined),
      set: vi.fn(async () => {
        throw new Error("write failed");
      })
    };
    const engine = createCacheEngine<Resource>({ storage });
    const fetcher = vi.fn(async () => ({ value: "network-even-with-storage-failure" }));

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy: {
          expireTimeMs: 10_000,
          staleTimeMs: 5_000
        },
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("success-fresh"));
    expect(result.current.data).toEqual({ value: "network-even-with-storage-failure" });
    expect(result.current.isError).toBe(false);
  });

  it("uses the first-load error path when no cached data exists", async () => {
    const { engine } = createTestEngine();
    const error = new Error("first load failed");
    const fetcher = vi.fn(async () => {
      throw error;
    });

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(error);
  });

  it("clears a stale refresh error after a later successful refresh", async () => {
    const { engine } = createTestEngine();
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary refresh failure"))
      .mockResolvedValueOnce({ value: "recovered" });
    await engine.set(scope, { value: "cached" }, { expireTimeMs: 10_000, staleTimeMs: 5_000 });

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy: {
          expireTimeMs: 10_000,
          staleTimeMs: 5_000
        },
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("success-fresh"));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.status).toBe("error-with-stale-data");
    expect(result.current.data).toEqual({ value: "cached" });

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.status).toBe("success-fresh");
    expect(result.current.data).toEqual({ value: "recovered" });
    expect(result.current.error).toBeUndefined();
  });

  it("exposes empty state when the consumer empty predicate matches", async () => {
    const { engine } = createTestEngine();
    const fetcher = vi.fn(async () => [] as Resource[]);

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        isEmptyData: (data) => data.length === 0,
        policy: {
          expireTimeMs: 10_000,
          staleTimeMs: 5_000
        },
        scope
      })
    );

    await waitFor(() => expect(result.current.status).toBe("empty"));
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it("refreshes on an interval when visible", async () => {
    vi.useFakeTimers();
    const { engine } = createTestEngine();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ value: "initial" })
      .mockResolvedValueOnce({ value: "interval" });

    const { result } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy: {
          expireTimeMs: 10_000,
          staleTimeMs: 5_000
        },
        refreshIntervalMs: 1_000,
        scope
      })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.data).toEqual({ value: "initial" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });

    expect(result.current.data).toEqual({ value: "interval" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("skips scheduled refresh while hidden and revalidates stale data when visible again", async () => {
    vi.useFakeTimers();
    const { engine, setNow } = createTestEngine();
    const policy = { expireTimeMs: 10_000, staleTimeMs: 10 };
    const fetcher = vi.fn(async () => ({ value: "visible-refresh" }));
    await engine.set(scope, { value: "cached" }, policy);
    setNow(1_020);
    setVisibilityState("hidden");

    const { result, unmount } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        policy,
        refreshIntervalMs: 1_000,
        refreshWhenVisibleOnly: true,
        revalidateIfStale: false,
        revalidateOnVisible: true,
        scope
      })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.status).toBe("success-stale");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });

    expect(fetcher).not.toHaveBeenCalled();

    setVisibilityState("visible");
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.data).toEqual({ value: "visible-refresh" });
    expect(fetcher).toHaveBeenCalledTimes(1);

    unmount();
  });

  it("cleans up scheduled refresh on unmount", async () => {
    vi.useFakeTimers();
    const { engine } = createTestEngine();
    const fetcher = vi.fn(async () => ({ value: "initial" }));

    const { unmount } = renderHook(() =>
      useCachedResource({
        engine,
        fetcher,
        refreshIntervalMs: 1_000,
        scope
      })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    unmount();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3_000);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
