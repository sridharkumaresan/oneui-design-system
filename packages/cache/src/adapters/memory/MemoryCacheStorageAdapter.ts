import type { CacheRecord } from "../../contracts/CacheRecord.js";
import type { CachePartialScope, CacheStorageKey } from "../../contracts/CacheScope.js";
import type { CacheStorageAdapter } from "../../contracts/CacheStorageAdapter.js";
import { doesScopeMatch } from "../../core/CacheKeyBuilder.js";
import { validateCacheRecord } from "../../core/CacheRecordValidation.js";

export type MemoryCacheStorageAdapterOptions = {
  id?: string;
};

export const createMemoryCacheStorageAdapter = <TData = unknown>(
  options: MemoryCacheStorageAdapterOptions = {}
): CacheStorageAdapter<TData> => {
  const records = new Map<CacheStorageKey, CacheRecord<TData>>();

  return {
    id: options.id ?? "memory",
    kind: "memory",
    get: async (storageKey) => validateCacheRecord<TData>(records.get(storageKey)),
    set: async (record) => {
      records.set(record.storageKey, record);
    },
    remove: async (storageKey) => {
      records.delete(storageKey);
    },
    clear: async () => {
      records.clear();
    },
    list: async (partialScope?: CachePartialScope) => {
      const values = [...records.values()].flatMap((record) => {
        const validRecord = validateCacheRecord<TData>(record);

        return validRecord ? [validRecord] : [];
      });

      return partialScope ? values.filter((record) => doesScopeMatch(record.scope, partialScope)) : values;
    },
    clearByScope: async (partialScope) => {
      let removed = 0;

      for (const record of records.values()) {
        if (doesScopeMatch(record.scope, partialScope)) {
          records.delete(record.storageKey);
          removed += 1;
        }
      }

      return removed;
    },
    isAvailable: () => true
  };
};
