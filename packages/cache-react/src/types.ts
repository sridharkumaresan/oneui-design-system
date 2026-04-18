import type {
  CacheEngine,
  CacheFetcher,
  CacheGetOrFetchSource,
  CacheLifecycleState,
  CachePolicy,
  CacheScope,
  CacheSnapshot
} from "@functions-oneui/cache";

export type CachedResourceStatus =
  | "idle"
  | "loading-first-load"
  | "success-fresh"
  | "success-stale"
  | "refreshing"
  | "empty"
  | "error"
  | "error-with-stale-data";

export type CachedResourceLifecycleState = CacheLifecycleState | "idle";

export type UseCachedResourceOptions<TData> = {
  engine: CacheEngine;
  scope: CacheScope;
  fetcher: CacheFetcher<TData>;
  policy?: CachePolicy;
  enabled?: boolean;
  allowStale?: boolean;
  revalidateIfStale?: boolean;
  refreshIntervalMs?: number;
  refreshWhenVisibleOnly?: boolean;
  revalidateOnVisible?: boolean;
  keepStaleDataOnError?: boolean;
  isEmptyData?: (data: TData) => boolean;
  deps?: readonly unknown[];
};

export type UseCachedResourceResult<TData> = {
  data?: TData;
  error?: unknown;
  snapshot?: CacheSnapshot<TData>;
  source: CacheGetOrFetchSource;
  lifecycleState: CachedResourceLifecycleState;
  status: CachedResourceStatus;
  isIdle: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasData: boolean;
  refresh: () => Promise<TData | undefined>;
};

export type CachedResourceInternalState<TData> = {
  data?: TData;
  error?: unknown;
  snapshot?: CacheSnapshot<TData>;
  source: CacheGetOrFetchSource;
  lifecycleState: CachedResourceLifecycleState;
  status: CachedResourceStatus;
};
