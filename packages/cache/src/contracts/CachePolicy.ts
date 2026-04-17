export type CacheStoragePreference = "memory" | "localStorage" | "sessionStorage" | "indexedDB" | string;

export type CachePolicy = {
  staleTimeMs?: number;
  expireTimeMs?: number;
  storage?: CacheStoragePreference;
  version?: string;
  bustOnVersionChange?: boolean;
  metadata?: Record<string, unknown>;
};

export type ResolvedCachePolicy = Required<
  Pick<CachePolicy, "staleTimeMs" | "expireTimeMs" | "bustOnVersionChange">
> &
  Pick<CachePolicy, "storage" | "version" | "metadata">;

export const defaultCachePolicy: ResolvedCachePolicy = {
  bustOnVersionChange: true,
  expireTimeMs: 30 * 60 * 1000,
  staleTimeMs: 5 * 60 * 1000
};
