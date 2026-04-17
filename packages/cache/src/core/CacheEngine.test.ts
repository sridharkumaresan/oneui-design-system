import { describe, expect, it, vi } from "vitest";

import { createCacheEngine } from "./CacheEngine.js";
import type { CacheClock } from "../contracts/CacheEngine.js";
import type { CacheEvent } from "../contracts/CacheEvent.js";
import type { CacheStorageAdapter } from "../contracts/CacheStorageAdapter.js";

const createClock = (initialNow = 0): CacheClock & { advance: (ms: number) => void } => {
  let now = initialNow;

  return {
    advance: (ms) => {
      now += ms;
    },
    now: () => now
  };
};

const scope = {
  tenantId: "barclays",
  siteId: "dcw-home",
  namespace: "weather",
  key: "london"
};

describe("CacheEngine", () => {
  it("resolves missing, fresh, stale, and expired lifecycle states", async () => {
    const clock = createClock(1000);
    const engine = createCacheEngine<string>({
      clock
    });

    expect((await engine.getSnapshot(scope)).state).toBe("missing");

    await engine.set(scope, "sunny", {
      expireTimeMs: 100,
      staleTimeMs: 50
    });

    expect((await engine.getSnapshot(scope)).state).toBe("fresh");
    clock.advance(60);
    expect((await engine.getSnapshot(scope)).state).toBe("stale");
    clock.advance(50);
    expect((await engine.getSnapshot(scope)).state).toBe("expired");
  });

  it("returns fresh cached data without calling the fetcher", async () => {
    const engine = createCacheEngine<string>();
    const fetcher = vi.fn(async () => "network");

    await engine.set(scope, "cached");

    await expect(engine.getOrFetch(scope, fetcher)).resolves.toBe("cached");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns snapshot result semantics for missing, fresh, stale, and expired flows", async () => {
    const clock = createClock(0);
    const engine = createCacheEngine<string>({ clock });
    const fetcher = vi.fn(async () => "network");

    const missingResult = await engine.getOrFetchSnapshot(scope, fetcher, {
      expireTimeMs: 100,
      staleTimeMs: 50
    });

    expect(missingResult).toMatchObject({
      data: "network",
      source: "network",
      state: "missing"
    });
    expect(missingResult.snapshot.state).toBe("fresh");

    const freshResult = await engine.getOrFetchSnapshot(scope, fetcher);
    expect(freshResult).toMatchObject({
      data: "network",
      source: "cache",
      state: "fresh"
    });

    clock.advance(60);
    const staleResult = await engine.getOrFetchSnapshot(scope, fetcher);
    expect(staleResult).toMatchObject({
      data: "network",
      source: "cache",
      state: "stale"
    });

    clock.advance(50);
    const expiredResult = await engine.getOrFetchSnapshot(scope, async () => "network-2", {
      expireTimeMs: 100,
      staleTimeMs: 50
    });
    expect(expiredResult).toMatchObject({
      data: "network-2",
      source: "network",
      state: "expired"
    });
  });

  it("deduplicates concurrent fetches for the same scoped key", async () => {
    const engine = createCacheEngine<string>();
    let resolveFetch: (value: string) => void = () => {};
    const fetcher = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveFetch = resolve;
        })
    );

    const first = engine.getOrFetch(scope, fetcher);
    const second = engine.getOrFetch(scope, fetcher);
    await vi.waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
    resolveFetch("from-network");

    await expect(Promise.all([first, second])).resolves.toEqual(["from-network", "from-network"]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("fetches stale data when stale usage is disabled", async () => {
    const clock = createClock(0);
    const engine = createCacheEngine<string>({
      clock
    });
    const fetcher = vi.fn(async () => "refreshed");

    await engine.set(scope, "cached", {
      expireTimeMs: 1000,
      staleTimeMs: 10
    });
    clock.advance(20);

    await expect(engine.getOrFetch(scope, fetcher, undefined, { allowStale: false })).resolves.toBe("refreshed");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("returns stale cache data and revalidates when explicitly requested", async () => {
    const clock = createClock(0);
    const engine = createCacheEngine<string>({
      clock
    });
    const fetcher = vi.fn(async () => "refreshed");

    await engine.set(scope, "cached", {
      expireTimeMs: 1000,
      staleTimeMs: 10
    });
    clock.advance(20);

    const result = await engine.getOrFetchSnapshot(scope, fetcher, undefined, {
      revalidateIfStale: true
    });

    expect(result).toMatchObject({
      data: "cached",
      source: "cache",
      state: "stale"
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    await expect(engine.get(scope)).resolves.toBe("refreshed");
  });

  it("invalidates by partial scope and removes exact entries", async () => {
    const engine = createCacheEngine<string>();
    const tasksScope = {
      ...scope,
      namespace: "tasks",
      key: "inbox"
    };

    await engine.set(scope, "weather");
    await engine.set(tasksScope, "tasks");

    expect(await engine.invalidate({ namespace: "weather" })).toBe(1);
    expect(await engine.get(scope)).toBeUndefined();
    expect(await engine.get(tasksScope)).toBe("tasks");

    await engine.remove(tasksScope);
    expect(await engine.get(tasksScope)).toBeUndefined();
  });

  it("busts cached records when policy version changes", async () => {
    const engine = createCacheEngine<string>();
    const fetcher = vi.fn(async () => "v2");

    await engine.set(scope, "v1", {
      version: "1"
    });

    expect((await engine.getSnapshot(scope, { version: "2" })).state).toBe("missing");
    await engine.set(scope, "v1", {
      version: "1"
    });
    await expect(engine.get(scope, { policy: { version: "2" } })).resolves.toBeUndefined();

    await engine.set(scope, "v1", {
      version: "1"
    });
    await expect(engine.getOrFetch(scope, fetcher, { version: "2" })).resolves.toBe("v2");
  });

  it("ignores and removes structurally invalid records returned by storage", async () => {
    const remove = vi.fn(async () => undefined);
    const storage: CacheStorageAdapter<string> = {
      clear: vi.fn(async () => undefined),
      get: vi.fn(async () => ({ storageKey: "bad-record" }) as never),
      id: "invalid",
      isAvailable: () => true,
      kind: "test",
      list: vi.fn(async () => []),
      remove,
      set: vi.fn(async () => undefined)
    };
    const engine = createCacheEngine<string>({ storage });

    await expect(engine.get(scope)).resolves.toBeUndefined();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("emits lifecycle events", async () => {
    const engine = createCacheEngine<string>();
    const events: Array<CacheEvent<string>["name"]> = [];

    engine.subscribe((event) => {
      events.push(event.name);
    });

    await engine.get(scope);
    await engine.getOrFetch(scope, async () => "network");
    await engine.get(scope);
    await engine.invalidate({ tenantId: "barclays" });

    expect(events).toEqual([
      "miss",
      "miss",
      "refresh-start",
      "set",
      "refresh-success",
      "hit",
      "invalidated"
    ]);
  });

  it("continues event delivery when a subscriber throws", async () => {
    const engine = createCacheEngine<string>();
    const listener = vi.fn();

    engine.subscribe(() => {
      throw new Error("Subscriber failed");
    });
    engine.subscribe(listener);

    await engine.set(scope, "cached");

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
