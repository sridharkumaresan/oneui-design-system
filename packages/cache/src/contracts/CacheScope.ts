export type CacheScope = {
  tenantId: string;
  siteId?: string;
  namespace: string;
  key: string;
};

export type CachePartialScope = {
  tenantId?: string;
  siteId?: string;
  namespace?: string;
  key?: string;
};

export type CacheStorageKey = string;

export type CacheScopeSegmentName = keyof CacheScope;

export const cacheScopeSegmentNames: CacheScopeSegmentName[] = [
  "tenantId",
  "siteId",
  "namespace",
  "key"
];
