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

const isRecoverableIndexedDbError = (error: unknown): boolean => {
  const name = error instanceof DOMException || error instanceof Error ? error.name : "";

  return (
    name === "AbortError" ||
    name === "InvalidStateError" ||
    name === "NotFoundError" ||
    name === "TransactionInactiveError" ||
    name === "UnknownError" ||
    name === "VersionError"
  );
};

export const createIndexedDbCacheAdapter = <TData = unknown>(
  options: IndexedDbCacheAdapterOptions = {}
): CacheStorageAdapter<TData> => {
  const databaseName = options.databaseName ?? defaultDatabaseName;
  const storeName = options.storeName ?? defaultStoreName;
  let databasePromise: Promise<IDBDatabase | undefined> | undefined;
  let databaseHandle: IDBDatabase | undefined;

  const resetDatabase = (): void => {
    try {
      databaseHandle?.close();
    } catch {
      // Ignore close failures while recovering from a broken IndexedDB handle.
    }

    databaseHandle = undefined;
    databasePromise = undefined;
  };

  const openDatabase = (): Promise<IDBDatabase | undefined> => {
    if (databaseHandle) {
      return Promise.resolve(databaseHandle);
    }

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
    })
      .then((database) => {
        databaseHandle = database;
        database.onversionchange = () => {
          resetDatabase();
        };

        return database;
      })
      .catch((): undefined => {
        resetDatabase();
        return undefined;
      });

    return databasePromise;
  };

  const transactionStore = async (mode: IDBTransactionMode): Promise<IDBObjectStore | undefined> => {
    const database = await openDatabase();
    if (!database) {
      return undefined;
    }

    try {
      return database.transaction(storeName, mode).objectStore(storeName);
    } catch (error) {
      resetDatabase();
      throw error;
    }
  };

  const runWithRecovery = async <TResult>(
    operation: (store: IDBObjectStore | undefined) => Promise<TResult>,
    fallback: TResult
  ): Promise<TResult> => {
    try {
      const store = await transactionStore("readonly");
      return await operation(store);
    } catch (error) {
      if (!isRecoverableIndexedDbError(error)) {
        return fallback;
      }

      resetDatabase();
    }

    try {
      const store = await transactionStore("readonly");
      return await operation(store);
    } catch (error) {
      resetDatabase();
      throw error;
    }
  };

  const runWriteWithRecovery = async (
    operation: (store: IDBObjectStore | undefined) => Promise<void>
  ): Promise<void> => {
    try {
      const store = await transactionStore("readwrite");
      await operation(store);
      return;
    } catch (error) {
      if (!isRecoverableIndexedDbError(error)) {
        return;
      }

      resetDatabase();
    }

    try {
      const store = await transactionStore("readwrite");
      await operation(store);
    } catch (error) {
      resetDatabase();
      throw error;
    }
  };

  const listRecords = async (partialScope?: CachePartialScope): Promise<Array<CacheRecord<TData>>> => {
    return runWithRecovery(
      async (store) => {
        if (!store) {
          return [];
        }

        const records = (await requestToPromise<Array<unknown>>(store.getAll())).flatMap((record) => {
          const validRecord = validateCacheRecord<TData>(record);

          return validRecord ? [validRecord] : [];
        });

        return partialScope ? records.filter((record) => doesScopeMatch(record.scope, partialScope)) : records;
      },
      []
    );
  };

  return {
    id: options.id ?? "indexedDB",
    kind: "indexedDB",
    get: async (storageKey) => {
      return runWithRecovery(
        async (store) =>
          store ? validateCacheRecord<TData>(await requestToPromise<unknown>(store.get(storageKey))) : undefined,
        undefined
      );
    },
    set: async (record) => {
      await runWriteWithRecovery(async (store) => {
        if (!store) {
          return;
        }

        await requestToPromise(store.put(record));
      });
    },
    remove: async (storageKey) => {
      await runWriteWithRecovery(async (store) => {
        if (!store) {
          return;
        }

        await requestToPromise(store.delete(storageKey));
      });
    },
    clear: async () => {
      await runWriteWithRecovery(async (store) => {
        if (!store) {
          return;
        }

        await requestToPromise(store.clear());
      });
    },
    list: listRecords,
    clearByScope: async (partialScope) => {
      const records = await listRecords(partialScope);
      await runWriteWithRecovery(async (store) => {
        if (!store) {
          return;
        }

        await Promise.all(records.map((record) => requestToPromise(store.delete(record.storageKey))));
      });

      return records.length;
    },
    isAvailable: () => Boolean(resolveIndexedDbFactory(options))
  };
};
