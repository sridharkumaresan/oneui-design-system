import { defaultCachePolicy, type CachePolicy, type ResolvedCachePolicy } from "../contracts/CachePolicy.js";
import type { CacheRecord } from "../contracts/CacheRecord.js";
import type { CacheLifecycleState } from "../contracts/CacheSnapshot.js";

export const resolveCachePolicy = (
  policy: CachePolicy | undefined,
  defaultPolicy: CachePolicy | undefined
): ResolvedCachePolicy => {
  return {
    ...defaultCachePolicy,
    ...defaultPolicy,
    ...policy,
    bustOnVersionChange:
      policy?.bustOnVersionChange ?? defaultPolicy?.bustOnVersionChange ?? defaultCachePolicy.bustOnVersionChange
  };
};

export const resolveCacheState = (
  record: CacheRecord | undefined,
  now: number
): CacheLifecycleState => {
  if (!record) {
    return "missing";
  }

  if (now >= record.expiresAt) {
    return "expired";
  }

  if (now >= record.staleAt) {
    return "stale";
  }

  return "fresh";
};

export const isVersionBusted = (
  record: CacheRecord | undefined,
  policy: ResolvedCachePolicy
): boolean => {
  if (!record || !policy.bustOnVersionChange || policy.version === undefined) {
    return false;
  }

  return record.version !== policy.version;
};
