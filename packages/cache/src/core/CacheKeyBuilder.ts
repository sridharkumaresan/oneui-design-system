import type { CachePartialScope, CacheScope, CacheStorageKey } from "../contracts/CacheScope.js";

const storageKeyPrefix = "oneui-cache";
const storageKeyVersion = "v1";
const siteSentinel = "~";

const assertSegment = (name: string, value: string | undefined, required: boolean): string | undefined => {
  if (value === undefined) {
    if (required) {
      throw new Error(`Cache scope '${name}' is required.`);
    }

    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    if (required) {
      throw new Error(`Cache scope '${name}' cannot be empty.`);
    }

    return undefined;
  }

  return normalized;
};

export const normalizeCacheScope = (scope: CacheScope): CacheScope => {
  return {
    tenantId: assertSegment("tenantId", scope.tenantId, true) as string,
    siteId: assertSegment("siteId", scope.siteId, false),
    namespace: assertSegment("namespace", scope.namespace, true) as string,
    key: assertSegment("key", scope.key, true) as string
  };
};

export const normalizeCachePartialScope = (partialScope: CachePartialScope): CachePartialScope => {
  return {
    tenantId: assertSegment("tenantId", partialScope.tenantId, false),
    siteId: assertSegment("siteId", partialScope.siteId, false),
    namespace: assertSegment("namespace", partialScope.namespace, false),
    key: assertSegment("key", partialScope.key, false)
  };
};

const encodeSegment = (value: string): string => encodeURIComponent(value);

const decodeSegment = (value: string): string => decodeURIComponent(value);

export const buildCacheStorageKey = (scope: CacheScope): CacheStorageKey => {
  const normalized = normalizeCacheScope(scope);

  return [
    storageKeyPrefix,
    storageKeyVersion,
    encodeSegment(normalized.tenantId),
    encodeSegment(normalized.siteId ?? siteSentinel),
    encodeSegment(normalized.namespace),
    encodeSegment(normalized.key)
  ].join(":");
};

export const parseCacheStorageKey = (storageKey: CacheStorageKey): CacheScope | undefined => {
  const [prefix, version, tenantId, siteId, namespace, key, ...extra] = storageKey.split(":");

  if (
    prefix !== storageKeyPrefix ||
    version !== storageKeyVersion ||
    !tenantId ||
    !siteId ||
    !namespace ||
    !key ||
    extra.length > 0
  ) {
    return undefined;
  }

  return normalizeCacheScope({
    tenantId: decodeSegment(tenantId),
    siteId: decodeSegment(siteId) === siteSentinel ? undefined : decodeSegment(siteId),
    namespace: decodeSegment(namespace),
    key: decodeSegment(key)
  });
};

export const doesScopeMatch = (scope: CacheScope, partialScope: CachePartialScope): boolean => {
  const normalizedScope = normalizeCacheScope(scope);
  const normalizedPartial = normalizeCachePartialScope(partialScope);

  return (
    (normalizedPartial.tenantId === undefined || normalizedPartial.tenantId === normalizedScope.tenantId) &&
    (normalizedPartial.siteId === undefined || normalizedPartial.siteId === normalizedScope.siteId) &&
    (normalizedPartial.namespace === undefined || normalizedPartial.namespace === normalizedScope.namespace) &&
    (normalizedPartial.key === undefined || normalizedPartial.key === normalizedScope.key)
  );
};
