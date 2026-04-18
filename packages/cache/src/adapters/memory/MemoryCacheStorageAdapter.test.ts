import { describe, expect, it } from "vitest";

import { createMemoryCacheStorageAdapter } from "./MemoryCacheStorageAdapter.js";
import { buildCacheStorageKey } from "../../core/CacheKeyBuilder.js";
import type { CacheRecord } from "../../contracts/CacheRecord.js";

const createRecord = (namespace: string, key: string): CacheRecord<string> => {
  const scope = {
    namespace,
    key,
    segments: {
      site: "site",
      tenant: "tenant"
    }
  };

  return {
    createdAt: 1,
    data: key,
    expiresAt: 100,
    scope,
    staleAt: 50,
    storageKey: buildCacheStorageKey(scope),
    updatedAt: 1
  };
};

describe("MemoryCacheStorageAdapter", () => {
  it("reads, writes, removes, and clears by partial scope", async () => {
    const adapter = createMemoryCacheStorageAdapter<string>();
    const weather = createRecord("weather", "london");
    const tasks = createRecord("tasks", "inbox");

    await adapter.set(weather);
    await adapter.set(tasks);

    expect(await adapter.get(weather.storageKey)).toEqual(weather);
    expect(await adapter.list({ namespace: "weather" })).toEqual([weather]);
    expect(await adapter.clearByScope?.({ namespace: "weather" })).toBe(1);
    expect(await adapter.get(weather.storageKey)).toBeUndefined();
    expect(await adapter.get(tasks.storageKey)).toEqual(tasks);

    await adapter.clear();
    expect(await adapter.list()).toEqual([]);
  });
});
