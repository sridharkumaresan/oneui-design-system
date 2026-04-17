export type CachePolicy = {
  staleTimeMs?: number;
  expireTimeMs?: number;
  version?: string;
  bustOnVersionChange?: boolean;
  metadata?: Record<string, unknown>;
};

export type ResolvedCachePolicy = Required<
  Pick<CachePolicy, "staleTimeMs" | "expireTimeMs" | "bustOnVersionChange">
> &
  Pick<CachePolicy, "version" | "metadata">;

export const defaultCachePolicy: ResolvedCachePolicy = {
  bustOnVersionChange: true,
  expireTimeMs: 30 * 60 * 1000,
  staleTimeMs: 5 * 60 * 1000
};
