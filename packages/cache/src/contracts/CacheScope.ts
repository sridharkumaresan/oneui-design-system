export type CacheScopeSegmentValue = string | number | boolean;

export type CacheScopeSegments = Record<string, CacheScopeSegmentValue | undefined>;

export type CacheScope = {
  namespace: string;
  key: string;
  segments?: CacheScopeSegments;
};

export type CachePartialScope = {
  namespace?: string;
  key?: string;
  segments?: CacheScopeSegments;
};

export type CacheStorageKey = string;

export type CacheScopeSegmentName = keyof CacheScope;

export const cacheScopeSegmentNames: CacheScopeSegmentName[] = [
  "namespace",
  "key",
  "segments"
];
