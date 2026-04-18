import { describe, expect, it } from "vitest";

import {
  createLocalStorageCacheAdapter,
  createSessionStorageCacheAdapter,
  createWebStorageCacheAdapter,
  type WebStorageLike
} from "./WebStorageCacheAdapter.js";
import type { CacheRecord } from "../../contracts/CacheRecord.js";
import { buildCacheStorageKey } from "../../core/CacheKeyBuilder.js";

type TestWebStorage = WebStorageLike & {
  values: Map<string, string>;
};

const createStorage = (): TestWebStorage => {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, value);
    },
    values
  };
};

const createRecord = (namespace: string): CacheRecord<{ value: string }> => {
  const scope = {
    namespace,
    key: "key"
  };

  return {
    createdAt: 1,
    data: { value: namespace },
    expiresAt: 100,
    scope,
    staleAt: 50,
    storageKey: buildCacheStorageKey(scope),
    updatedAt: 1
  };
};

describe("WebStorageCacheAdapter", () => {
  it("persists JSON records and clears by partial scope", async () => {
    const storage = createStorage();
    const adapter = createWebStorageCacheAdapter<{ value: string }>({
      kind: "localStorage",
      storage
    });
    const weather = createRecord("weather");
    const tasks = createRecord("tasks");

    await adapter.set(weather);
    await adapter.set(tasks);

    expect(await adapter.get(weather.storageKey)).toEqual(weather);
    expect(await adapter.clearByScope?.({ namespace: "weather" })).toBe(1);
    expect(await adapter.get(weather.storageKey)).toBeUndefined();
    expect(await adapter.get(tasks.storageKey)).toEqual(tasks);
  });

  it("is safe when browser storage is unavailable", async () => {
    const adapter = createLocalStorageCacheAdapter();

    await expect(adapter.set(createRecord("weather"))).resolves.toBeUndefined();
    await expect(adapter.get("missing")).resolves.toBeUndefined();
    await expect(adapter.list()).resolves.toEqual([]);
    expect(await adapter.isAvailable?.()).toBe(false);
  });

  it("ignores structurally invalid persisted records", async () => {
    const storage = createStorage();
    const adapter = createWebStorageCacheAdapter({
      kind: "localStorage",
      storage
    });
    const invalidStorageKey = "oneui-cache-record:oneui-cache:v1:tenant:site:weather:key";

    storage.values.set(
      invalidStorageKey,
      JSON.stringify({
        data: "broken",
        scope: {
          namespace: "weather",
          key: "key",
          segments: { tenant: "tenant" }
        },
        storageKey: "wrong-key"
      })
    );

    expect(await adapter.get("oneui-cache:v1:tenant:site:weather:key")).toBeUndefined();
    expect(await adapter.list()).toEqual([]);
    await expect(adapter.clearByScope?.({ namespace: "weather" })).resolves.toBe(0);
  });

  it("creates session storage adapters with the expected kind", () => {
    const adapter = createSessionStorageCacheAdapter({
      storage: createStorage()
    });

    expect(adapter.kind).toBe("sessionStorage");
  });
});
