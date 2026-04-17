import { describe, expect, it } from "vitest";

import { createIndexedDbCacheAdapter } from "./IndexedDbCacheAdapter.js";
import type { CacheRecord } from "../../contracts/CacheRecord.js";
import { buildCacheStorageKey } from "../../core/CacheKeyBuilder.js";

class FakeIdbRequest<TResult> {
  error: Error | null = null;
  result!: TResult;
  onsuccess: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onupgradeneeded: (() => void) | null = null;
  onblocked: (() => void) | null = null;
}

const completeRequest = <TResult>(result: TResult): IDBRequest<TResult> => {
  const request = new FakeIdbRequest<TResult>() as unknown as IDBRequest<TResult>;
  (request as unknown as FakeIdbRequest<TResult>).result = result;
  queueMicrotask(() => {
    (request as unknown as FakeIdbRequest<TResult>).onsuccess?.();
  });

  return request;
};

const createFakeIndexedDb = (): IDBFactory => {
  const records = new Map<string, CacheRecord>();
  const store = {
    clear: () => {
      records.clear();
      return completeRequest(undefined);
    },
    delete: (key: IDBValidKey) => {
      records.delete(String(key));
      return completeRequest(undefined);
    },
    get: (key: IDBValidKey) => completeRequest(records.get(String(key))),
    getAll: () => completeRequest([...records.values()]),
    put: (record: CacheRecord) => {
      records.set(record.storageKey, record);
      return completeRequest(record.storageKey);
    }
  };
  const database = {
    objectStoreNames: {
      contains: () => true
    },
    createObjectStore: () => store,
    transaction: () => ({
      objectStore: () => store
    })
  };

  return {
    open: () => {
      const request = new FakeIdbRequest<IDBDatabase>() as unknown as IDBOpenDBRequest;
      (request as unknown as FakeIdbRequest<IDBDatabase>).result = database as unknown as IDBDatabase;
      queueMicrotask(() => {
        (request as unknown as FakeIdbRequest<IDBDatabase>).onupgradeneeded?.();
        (request as unknown as FakeIdbRequest<IDBDatabase>).onsuccess?.();
      });

      return request;
    }
  } as unknown as IDBFactory;
};

const createRecord = (namespace: string): CacheRecord<string> => {
  const scope = {
    tenantId: "tenant",
    siteId: "site",
    namespace,
    key: "key"
  };

  return {
    createdAt: 1,
    data: namespace,
    expiresAt: 100,
    scope,
    staleAt: 50,
    storageKey: buildCacheStorageKey(scope),
    updatedAt: 1
  };
};

describe("IndexedDbCacheAdapter", () => {
  it("reads, writes, lists, removes, and clears records", async () => {
    const adapter = createIndexedDbCacheAdapter<string>({
      indexedDB: createFakeIndexedDb()
    });
    const weather = createRecord("weather");
    const tasks = createRecord("tasks");

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

  it("does not throw when IndexedDB is unavailable", async () => {
    const adapter = createIndexedDbCacheAdapter();

    expect(await adapter.isAvailable?.()).toBe(false);
    await expect(adapter.list()).resolves.toEqual([]);
  });
});
