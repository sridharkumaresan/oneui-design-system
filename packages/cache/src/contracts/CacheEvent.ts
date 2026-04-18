import type { CacheLifecycleState } from "./CacheSnapshot.js";
import type { CachePartialScope, CacheScope, CacheStorageKey } from "./CacheScope.js";

export type CacheEventName =
  | "hit"
  | "miss"
  | "stale-hit"
  | "set"
  | "removed"
  | "cleared"
  | "refresh-start"
  | "refresh-success"
  | "refresh-error"
  | "storage-error"
  | "invalidated"
  | "busted"
  | "expired";

export type CacheEvent<TData = unknown> = {
  name: CacheEventName;
  scope?: CacheScope;
  partialScope?: CachePartialScope;
  storageKey?: CacheStorageKey;
  state?: CacheLifecycleState;
  data?: TData;
  error?: unknown;
  reason?: string;
  timestamp: number;
};

export type CacheEventListener<TData = unknown> = (event: CacheEvent<TData>) => void;

export type CacheUnsubscribe = () => void;
