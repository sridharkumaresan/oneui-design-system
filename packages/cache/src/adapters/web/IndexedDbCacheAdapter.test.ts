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

const createRecoverableIndexedDb = (): IDBFactory & { breakActiveDatabase: () => void; openCount: () => number } => {
  const records = new Map<string, CacheRecord>();
  let broken = false;
  let openCount = 0;
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
  const createDatabase = (): IDBDatabase =>
    ({
      close: () => undefined,
      objectStoreNames: {
        contains: () => true
      },
      createObjectStore: () => store,
      transaction: () => {
        if (broken) {
          broken = false;
          throw new DOMException("The database connection is invalid.", "InvalidStateError");
        }

        return {
          objectStore: () => store
        };
      }
    }) as unknown as IDBDatabase;

  return {
    breakActiveDatabase: () => {
      broken = true;
    },
    open: () => {
      openCount += 1;
      const request = new FakeIdbRequest<IDBDatabase>() as unknown as IDBOpenDBRequest;
      (request as unknown as FakeIdbRequest<IDBDatabase>).result = createDatabase();
      queueMicrotask(() => {
        (request as unknown as FakeIdbRequest<IDBDatabase>).onupgradeneeded?.();
        (request as unknown as FakeIdbRequest<IDBDatabase>).onsuccess?.();
      });

      return request;
    },
    openCount: () => openCount
  } as unknown as IDBFactory & { breakActiveDatabase: () => void; openCount: () => number };
};

const createRecord = (namespace: string): CacheRecord<string> => {
  const scope = {
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

  it("reopens and recovers when the active database handle becomes invalid", async () => {
    const indexedDB = createRecoverableIndexedDb();
    const adapter = createIndexedDbCacheAdapter<string>({
      indexedDB
    });
    const weather = createRecord("weather");

    await adapter.set(weather);
    expect(indexedDB.openCount()).toBe(1);

    indexedDB.breakActiveDatabase();

    await expect(adapter.get(weather.storageKey)).resolves.toEqual(weather);
    expect(indexedDB.openCount()).toBe(2);
  });
});
