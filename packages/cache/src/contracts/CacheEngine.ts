import type { CacheEventListener, CacheUnsubscribe } from "./CacheEvent.js";
import type { CachePolicy } from "./CachePolicy.js";
import type { CacheRecord, CacheRecordMetadata } from "./CacheRecord.js";
import type { CacheSnapshot } from "./CacheSnapshot.js";
import type { CachePartialScope, CacheScope } from "./CacheScope.js";
import type { CacheStorageAdapter } from "./CacheStorageAdapter.js";

export type CacheFetcher<TData> = () => Promise<TData> | TData;

export type CacheClock = {
  now: () => number;
};

export type CacheEngineOptions<TData = unknown> = {
  storage?: CacheStorageAdapter<TData>;
  defaultPolicy?: CachePolicy;
  clock?: CacheClock;
};

export type CacheSetOptions = {
  etag?: string;
  checksum?: string;
  metadata?: CacheRecordMetadata;
};

export type CacheGetOptions = {
  includeExpired?: boolean;
};

export type CacheGetOrFetchOptions = {
  allowStale?: boolean;
};

export type CacheRefreshOptions = CacheSetOptions;

export type CacheEngine<TData = unknown> = {
  getSnapshot: <TResult = TData>(scope: CacheScope, policy?: CachePolicy) => Promise<CacheSnapshot<TResult>>;
  get: <TResult = TData>(scope: CacheScope, options?: CacheGetOptions) => Promise<TResult | undefined>;
  set: <TResult = TData>(
    scope: CacheScope,
    data: TResult,
    policy?: CachePolicy,
    options?: CacheSetOptions
  ) => Promise<CacheRecord<TResult>>;
  getOrFetch: <TResult = TData>(
    scope: CacheScope,
    fetcher: CacheFetcher<TResult>,
    policy?: CachePolicy,
    options?: CacheGetOrFetchOptions
  ) => Promise<TResult>;
  refresh: <TResult = TData>(
    scope: CacheScope,
    fetcher: CacheFetcher<TResult>,
    policy?: CachePolicy,
    options?: CacheRefreshOptions
  ) => Promise<TResult>;
  remove: (scope: CacheScope) => Promise<void>;
  invalidate: (partialScope: CachePartialScope) => Promise<number>;
  clearByScope: (partialScope: CachePartialScope) => Promise<number>;
  clear: () => Promise<void>;
  subscribe: (listener: CacheEventListener<TData>) => CacheUnsubscribe;
};
