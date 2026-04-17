import type { CacheRecord } from "../contracts/CacheRecord.js";
import { buildCacheStorageKey, normalizeCacheScope } from "./CacheKeyBuilder.js";

const isRecordLike = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const validateCacheRecord = <TData = unknown>(value: unknown): CacheRecord<TData> | undefined => {
  if (!isRecordLike(value) || !isRecordLike(value.scope)) {
    return undefined;
  }

  let scope;
  try {
    scope = normalizeCacheScope({
      key: value.scope.key as string,
      namespace: value.scope.namespace as string,
      siteId: value.scope.siteId as string | undefined,
      tenantId: value.scope.tenantId as string
    });
  } catch {
    return undefined;
  }

  if (
    typeof value.storageKey !== "string" ||
    value.storageKey !== buildCacheStorageKey(scope) ||
    !isFiniteNumber(value.createdAt) ||
    !isFiniteNumber(value.updatedAt) ||
    !isFiniteNumber(value.staleAt) ||
    !isFiniteNumber(value.expiresAt) ||
    !isOptionalString(value.version) ||
    !isOptionalString(value.etag) ||
    !isOptionalString(value.checksum)
  ) {
    return undefined;
  }

  if (value.metadata !== undefined && !isRecordLike(value.metadata)) {
    return undefined;
  }

  if (value.policy !== undefined && !isRecordLike(value.policy)) {
    return undefined;
  }

  return {
    ...(value as CacheRecord<TData>),
    scope
  };
};
