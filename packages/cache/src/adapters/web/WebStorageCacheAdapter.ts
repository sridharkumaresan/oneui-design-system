import type { CacheRecord } from "../../contracts/CacheRecord.js";
import type { CachePartialScope, CacheStorageKey } from "../../contracts/CacheScope.js";
import type { CacheStorageAdapter } from "../../contracts/CacheStorageAdapter.js";
import { doesScopeMatch } from "../../core/CacheKeyBuilder.js";

export type WebStorageLike = {
  readonly length: number;
  key: (index: number) => string | null;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type WebStorageCacheAdapterOptions = {
  id?: string;
  kind: "localStorage" | "sessionStorage";
  namespace?: string;
  storage?: WebStorageLike;
  getStorage?: () => WebStorageLike | undefined;
};

const defaultNamespace = "oneui-cache-record";

const getStoragePrefix = (namespace: string): string => `${namespace}:`;

const toStorageItemKey = (namespace: string, storageKey: CacheStorageKey): string =>
  `${getStoragePrefix(namespace)}${storageKey}`;

const fromStorageItemKey = (namespace: string, itemKey: string): CacheStorageKey | undefined => {
  const prefix = getStoragePrefix(namespace);

  return itemKey.startsWith(prefix) ? itemKey.slice(prefix.length) : undefined;
};

const safeParseRecord = <TData>(value: string | null): CacheRecord<TData> | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as CacheRecord<TData>;
  } catch {
    return undefined;
  }
};

const resolveStorage = (options: WebStorageCacheAdapterOptions): WebStorageLike | undefined => {
  try {
    return options.storage ?? options.getStorage?.();
  } catch {
    return undefined;
  }
};

export const createWebStorageCacheAdapter = <TData = unknown>(
  options: WebStorageCacheAdapterOptions
): CacheStorageAdapter<TData> => {
  const namespace = options.namespace ?? defaultNamespace;

  const getAvailableStorage = (): WebStorageLike | undefined => resolveStorage(options);

  const listItemKeys = (): string[] => {
    const storage = getAvailableStorage();
    if (!storage) {
      return [];
    }

    const keys: string[] = [];
    for (let index = 0; index < storage.length; index += 1) {
      const itemKey = storage.key(index);
      if (itemKey && fromStorageItemKey(namespace, itemKey)) {
        keys.push(itemKey);
      }
    }

    return keys;
  };

  const listRecords = (partialScope?: CachePartialScope): Array<CacheRecord<TData>> => {
    const storage = getAvailableStorage();
    if (!storage) {
      return [];
    }

    const records = listItemKeys()
      .map((itemKey) => safeParseRecord<TData>(storage.getItem(itemKey)))
      .filter((record): record is CacheRecord<TData> => Boolean(record));

    return partialScope ? records.filter((record) => doesScopeMatch(record.scope, partialScope)) : records;
  };

  return {
    id: options.id ?? options.kind,
    kind: options.kind,
    get: async (storageKey) => {
      try {
        const storage = getAvailableStorage();

        return safeParseRecord<TData>(storage?.getItem(toStorageItemKey(namespace, storageKey)) ?? null);
      } catch {
        return undefined;
      }
    },
    set: async (record) => {
      try {
        const storage = getAvailableStorage();
        if (!storage) {
          return;
        }

        storage.setItem(toStorageItemKey(namespace, record.storageKey), JSON.stringify(record));
      } catch {
        return;
      }
    },
    remove: async (storageKey) => {
      try {
        getAvailableStorage()?.removeItem(toStorageItemKey(namespace, storageKey));
      } catch {
        return;
      }
    },
    clear: async () => {
      try {
        const storage = getAvailableStorage();
        if (!storage) {
          return;
        }

        for (const itemKey of listItemKeys()) {
          storage.removeItem(itemKey);
        }
      } catch {
        return;
      }
    },
    list: async (partialScope?: CachePartialScope) => {
      try {
        return listRecords(partialScope);
      } catch {
        return [];
      }
    },
    clearByScope: async (partialScope) => {
      try {
        const storage = getAvailableStorage();
        if (!storage) {
          return 0;
        }

        const records = listRecords(partialScope);
        for (const record of records) {
          storage.removeItem(toStorageItemKey(namespace, record.storageKey));
        }

        return records.length;
      } catch {
        return 0;
      }
    },
    isAvailable: () => Boolean(getAvailableStorage())
  };
};

const createBrowserStorageGetter = (name: "localStorage" | "sessionStorage") => (): WebStorageLike | undefined => {
  const globalObject = globalThis as typeof globalThis & {
    localStorage?: WebStorageLike;
    sessionStorage?: WebStorageLike;
  };

  return globalObject[name];
};

export const createLocalStorageCacheAdapter = <TData = unknown>(
  options: Omit<WebStorageCacheAdapterOptions, "kind" | "getStorage"> = {}
): CacheStorageAdapter<TData> =>
  createWebStorageCacheAdapter<TData>({
    ...options,
    getStorage: createBrowserStorageGetter("localStorage"),
    kind: "localStorage"
  });

export const createSessionStorageCacheAdapter = <TData = unknown>(
  options: Omit<WebStorageCacheAdapterOptions, "kind" | "getStorage"> = {}
): CacheStorageAdapter<TData> =>
  createWebStorageCacheAdapter<TData>({
    ...options,
    getStorage: createBrowserStorageGetter("sessionStorage"),
    kind: "sessionStorage"
  });
