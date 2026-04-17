import type { CacheRecord } from "./CacheRecord.js";
import type { CachePartialScope, CacheScope, CacheStorageKey } from "./CacheScope.js";

export type CacheStorageAdapter<TData = unknown> = {
  readonly id: string;
  readonly kind: string;
  get: (storageKey: CacheStorageKey) => Promise<CacheRecord<TData> | undefined>;
  set: (record: CacheRecord<TData>) => Promise<void>;
  remove: (storageKey: CacheStorageKey) => Promise<void>;
  clear: () => Promise<void>;
  list: (partialScope?: CachePartialScope) => Promise<Array<CacheRecord<TData>>>;
  clearByScope?: (partialScope: CachePartialScope) => Promise<number>;
  isAvailable?: () => Promise<boolean> | boolean;
};

export type CacheStorageAdapterFactory<TData = unknown> = () => CacheStorageAdapter<TData>;

export type CacheStorageAdapterOptions = {
  namespace?: string;
};

export type CacheStorageEntry<TData = unknown> = {
  storageKey: CacheStorageKey;
  scope: CacheScope;
  record: CacheRecord<TData>;
};
