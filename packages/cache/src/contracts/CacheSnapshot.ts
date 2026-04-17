import type { CacheRecord } from "./CacheRecord.js";
import type { CacheScope, CacheStorageKey } from "./CacheScope.js";

export type CacheLifecycleState = "missing" | "fresh" | "stale" | "expired";

export type CacheSnapshot<TData = unknown> = {
  scope: CacheScope;
  storageKey: CacheStorageKey;
  state: CacheLifecycleState;
  record?: CacheRecord<TData>;
  now: number;
};
