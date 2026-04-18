import type {
  CachePartialScope,
  CacheScope,
  CacheScopeSegmentValue,
  CacheStorageKey
} from "../contracts/CacheScope.js";

const storageKeyPrefix = "oneui-cache";
const storageKeyVersion = "v2";

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

const normalizeSegmentValue = (name: string, value: CacheScopeSegmentValue | undefined): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return undefined;
  }

  if (!name.trim()) {
    throw new Error("Cache scope segment names cannot be empty.");
  }

  return normalized;
};

const normalizeSegments = (segments: CacheScope["segments"]): Record<string, string> | undefined => {
  if (!segments) {
    return undefined;
  }

  const normalizedEntries = Object.entries(segments)
    .map(([name, value]) => [name.trim(), normalizeSegmentValue(name, value)] as const)
    .filter((entry): entry is readonly [string, string] => entry[1] !== undefined)
    .sort(([leftName], [rightName]) => leftName.localeCompare(rightName));

  if (normalizedEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(normalizedEntries);
};

export const normalizeCacheScope = (scope: CacheScope): CacheScope => {
  return {
    key: assertSegment("key", scope.key, true) as string,
    namespace: assertSegment("namespace", scope.namespace, true) as string,
    segments: normalizeSegments(scope.segments)
  };
};

export const normalizeCachePartialScope = (partialScope: CachePartialScope): CachePartialScope => {
  return {
    key: assertSegment("key", partialScope.key, false),
    namespace: assertSegment("namespace", partialScope.namespace, false),
    segments: normalizeSegments(partialScope.segments)
  };
};

const encodeSegment = (value: string): string => encodeURIComponent(value);

const decodeSegment = (value: string): string => decodeURIComponent(value);

const encodeSegments = (segments: CacheScope["segments"]): string => {
  const entries = Object.entries(segments ?? {});

  return encodeSegment(JSON.stringify(entries));
};

const decodeSegments = (value: string): CacheScope["segments"] | undefined => {
  try {
    const parsed = JSON.parse(decodeSegment(value)) as unknown;

    if (!Array.isArray(parsed)) {
      return undefined;
    }

    const segments: Record<string, string> = {};
    for (const entry of parsed) {
      if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || typeof entry[1] !== "string") {
        return undefined;
      }

      segments[entry[0]] = entry[1];
    }

    return Object.keys(segments).length > 0 ? segments : undefined;
  } catch {
    return undefined;
  }
};

export const buildCacheStorageKey = (scope: CacheScope): CacheStorageKey => {
  const normalized = normalizeCacheScope(scope);

  return [
    storageKeyPrefix,
    storageKeyVersion,
    encodeSegment(normalized.namespace),
    encodeSegment(normalized.key),
    encodeSegments(normalized.segments)
  ].join(":");
};

export const parseCacheStorageKey = (storageKey: CacheStorageKey): CacheScope | undefined => {
  const [prefix, version, namespace, key, segments, ...extra] = storageKey.split(":");

  if (prefix !== storageKeyPrefix || version !== storageKeyVersion || !namespace || !key || !segments || extra.length > 0) {
    return undefined;
  }

  return normalizeCacheScope({
    key: decodeSegment(key),
    namespace: decodeSegment(namespace),
    segments: decodeSegments(segments)
  });
};

export const doesScopeMatch = (scope: CacheScope, partialScope: CachePartialScope): boolean => {
  const normalizedScope = normalizeCacheScope(scope);
  const normalizedPartial = normalizeCachePartialScope(partialScope);
  const partialSegments = normalizedPartial.segments ?? {};
  const scopeSegments = normalizedScope.segments ?? {};

  return (
    (normalizedPartial.namespace === undefined || normalizedPartial.namespace === normalizedScope.namespace) &&
    (normalizedPartial.key === undefined || normalizedPartial.key === normalizedScope.key) &&
    Object.entries(partialSegments).every(([name, value]) => scopeSegments[name] === value)
  );
};
