import type { CacheRecord } from "../../contracts/CacheRecord.js";
import type { CachePartialScope } from "../../contracts/CacheScope.js";
import type { CacheStorageAdapter } from "../../contracts/CacheStorageAdapter.js";
import { doesScopeMatch } from "../../core/CacheKeyBuilder.js";
import { validateCacheRecord } from "../../core/CacheRecordValidation.js";

export type IndexedDbCacheAdapterOptions = {
  id?: string;
  databaseName?: string;
  storeName?: string;
  indexedDB?: IDBFactory;
};

const defaultDatabaseName = "oneui-cache";
const defaultStoreName = "records";
const databaseVersion = 1;

const resolveIndexedDbFactory = (options: IndexedDbCacheAdapterOptions): IDBFactory | undefined => {
  try {
    return options.indexedDB ?? globalThis.indexedDB;
  } catch {
    return undefined;
  }
};

const requestToPromise = <TResult>(request: IDBRequest<TResult>): Promise<TResult> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const createIndexedDbCacheAdapter = <TData = unknown>(
  options: IndexedDbCacheAdapterOptions = {}
): CacheStorageAdapter<TData> => {
  const databaseName = options.databaseName ?? defaultDatabaseName;
  const storeName = options.storeName ?? defaultStoreName;
  let databasePromise: Promise<IDBDatabase | undefined> | undefined;

  const openDatabase = (): Promise<IDBDatabase | undefined> => {
    if (databasePromise) {
      return databasePromise;
    }

    const indexedDB = resolveIndexedDbFactory(options);
    if (!indexedDB) {
      databasePromise = Promise.resolve(undefined);
      return databasePromise;
    }

    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(databaseName, databaseVersion);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "storageKey" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error(`IndexedDB database '${databaseName}' is blocked.`));
    }).catch((): undefined => undefined);

    return databasePromise;
  };

  const transactionStore = async (mode: IDBTransactionMode): Promise<IDBObjectStore | undefined> => {
    const database = await openDatabase();
    if (!database) {
      return undefined;
    }

    return database.transaction(storeName, mode).objectStore(storeName);
  };

  const listRecords = async (partialScope?: CachePartialScope): Promise<Array<CacheRecord<TData>>> => {
    const store = await transactionStore("readonly");
    if (!store) {
      return [];
    }

    const records = (await requestToPromise<Array<unknown>>(store.getAll())).flatMap((record) => {
      const validRecord = validateCacheRecord<TData>(record);

      return validRecord ? [validRecord] : [];
    });

    return partialScope ? records.filter((record) => doesScopeMatch(record.scope, partialScope)) : records;
  };

  return {
    id: options.id ?? "indexedDB",
    kind: "indexedDB",
    get: async (storageKey) => {
      const store = await transactionStore("readonly");

      return store
        ? validateCacheRecord<TData>(await requestToPromise<unknown>(store.get(storageKey)))
        : undefined;
    },
    set: async (record) => {
      const store = await transactionStore("readwrite");
      if (!store) {
        return;
      }

      await requestToPromise(store.put(record));
    },
    remove: async (storageKey) => {
      const store = await transactionStore("readwrite");
      if (!store) {
        return;
      }

      await requestToPromise(store.delete(storageKey));
    },
    clear: async () => {
      const store = await transactionStore("readwrite");
      if (!store) {
        return;
      }

      await requestToPromise(store.clear());
    },
    list: listRecords,
    clearByScope: async (partialScope) => {
      const records = await listRecords(partialScope);
      const store = await transactionStore("readwrite");
      if (!store) {
        return 0;
      }

      await Promise.all(records.map((record) => requestToPromise(store.delete(record.storageKey))));

      return records.length;
    },
    isAvailable: () => Boolean(resolveIndexedDbFactory(options))
  };
};
