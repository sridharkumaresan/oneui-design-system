# @functions-oneui/cache

Framework-agnostic scoped cache and resource engine for OneUI consumers.

This package is the Phase 1 cache foundation. It does not include React hooks, UI components, polling, SPFx-specific logic, or demo app integrations.

All cache engine methods are asynchronous, including memory and Web Storage backed engines. This keeps the public contract consistent with IndexedDB.

## Scope Model

Every entry is addressed by a hierarchy:

```ts
tenantId -> siteId -> namespace -> key
```

`tenantId`, `namespace`, and `key` are required. `siteId` is optional.

```ts
const scope = {
  tenantId: "barclays",
  siteId: "dcw-home",
  namespace: "weather",
  key: "london"
};
```

The engine normalizes this hierarchy into an internal storage key. Consumers should keep using the structured scope object so invalidation remains clear and collision-safe.

## Basic Usage

```ts
import {
  createCacheEngine,
  createIndexedDbCacheAdapter
} from "@functions-oneui/cache";

const cache = createCacheEngine({
  storage: createIndexedDbCacheAdapter()
});

const data = await cache.getOrFetch(
  {
    tenantId: "barclays",
    siteId: "dcw-home",
    namespace: "tasks",
    key: "inbox-summary"
  },
  () => fetch("/api/tasks/summary").then((response) => response.json()),
  {
    staleTimeMs: 60_000,
    expireTimeMs: 5 * 60_000,
    version: "tasks-v1"
  }
);
```

## Public API

Create an engine:

```ts
createCacheEngine({
  storage,
  defaultPolicy,
  clock
});
```

Storage is selected when the engine is created. Cache policies do not choose storage per resource in Phase 1.5.

Engine methods:

- `getSnapshot(scope, policy?)`
- `get(scope, { includeExpired?, policy? })`
- `set(scope, data, policy?, options?)`
- `getOrFetch(scope, fetcher, policy?, options?)`
- `getOrFetchSnapshot(scope, fetcher, policy?, options?)`
- `refresh(scope, fetcher, policy?, options?)`
- `remove(scope)`
- `invalidate(partialScope)`
- `clearByScope(partialScope)`
- `clear()`
- `subscribe(listener)`

## Storage Adapters

### Memory

Use `createMemoryCacheStorageAdapter()` for tests, temporary runtime state, or environments without browser persistence.

### localStorage

Use `createLocalStorageCacheAdapter()` for small browser data that should survive tab closes. Values are serialized as JSON. The adapter safely no-ops when storage is unavailable.

### sessionStorage

Use `createSessionStorageCacheAdapter()` for small browser data that should be cleared when the tab session ends.

### IndexedDB

Use `createIndexedDbCacheAdapter()` for durable structured browser data. This is the recommended persistent adapter for larger app/resource data because it avoids the size and sync limitations of Web Storage. The adapter safely behaves as unavailable when IndexedDB cannot be opened or is not present.

For adapter portability, cache data should be JSON-compatible. Memory and IndexedDB can preserve more structured values than Web Storage, but portable consumers should avoid functions, class instances, and prototype-dependent data.

## Lifecycle

Each record stores:

- `scope`
- `storageKey`
- `data`
- `version`
- `createdAt`
- `updatedAt`
- `staleAt`
- `expiresAt`
- optional `etag`, `checksum`, and metadata

The engine resolves snapshots as:

- `missing`: no record exists
- `fresh`: `now < staleAt`
- `stale`: `staleAt <= now < expiresAt`
- `expired`: `now >= expiresAt`

Stale records are usable by default in `getOrFetch`. Pass `{ allowStale: false }` to force a fetch when a record is stale. Stale does not trigger automatic background refresh in Phase 1.5; callers or future scheduler adapters must explicitly call `refresh`.

Use `getOrFetchSnapshot` when a caller needs hook-friendly cache semantics:

```ts
const result = await cache.getOrFetchSnapshot(scope, fetcher, policy);

result.source; // "cache" | "network" | "none"
result.state; // "fresh" | "stale" | "expired" | "missing"
result.snapshot; // full cache snapshot after the operation
result.data; // resolved data when available
```

`getOrFetch` remains the convenience API for callers that only need data.

## Policies

Policies control lifecycle and busting:

```ts
{
  staleTimeMs: 60_000,
  expireTimeMs: 300_000,
  version: "resource-v2",
  bustOnVersionChange: true,
  metadata: {
    owner: "dashboard"
  }
}
```

Defaults:

- `staleTimeMs`: 5 minutes
- `expireTimeMs`: 30 minutes
- `bustOnVersionChange`: true

`get(scope, { policy })`, `getSnapshot(scope, policy)`, and `getOrFetch(scope, fetcher, policy)` all apply version busting when `version` changes and `bustOnVersionChange` is enabled.

## Request Deduplication

`getOrFetch`, `getOrFetchSnapshot`, and `refresh` dedupe concurrent requests by normalized scoped key. If multiple callers request the same scope while a fetch is in flight, only one fetcher runs and all callers receive the same promise result. `refresh` bypasses cache freshness, but it is still deduped by scoped key.

By default, stale records are returned without revalidation. Consumers can opt into explicit stale revalidation:

```ts
await cache.getOrFetchSnapshot(scope, fetcher, policy, {
  revalidateIfStale: true
});
```

This returns the stale cached data and refreshes the cache through the existing deduped refresh path. It does not add polling or UI behavior.

## Invalidation And Busting

Use structured partial scopes:

```ts
await cache.invalidate({ tenantId: "barclays" });
await cache.invalidate({ tenantId: "barclays", siteId: "dcw-home" });
await cache.invalidate({ tenantId: "barclays", siteId: "dcw-home", namespace: "weather" });
await cache.remove({ tenantId: "barclays", siteId: "dcw-home", namespace: "weather", key: "london" });
```

If a policy supplies `version` and `bustOnVersionChange` is true, a cached record with a different version is removed and treated as `missing`.

Partial-scope invalidation in Web Storage and IndexedDB is scan-based in Phase 1.5. This is acceptable for small and moderate cache sets. If future consumers store large datasets, IndexedDB indexes can be added without changing the engine API.

Persisted records are structurally validated before use. Malformed or partially corrupted records are ignored safely.

## Events

Subscribe without a framework:

```ts
const unsubscribe = cache.subscribe((event) => {
  console.log(event.name, event.scope, event.state);
});
```

Events include:

- `hit`
- `miss`
- `stale-hit`
- `set`
- `removed`
- `cleared`
- `refresh-start`
- `refresh-success`
- `refresh-error`
- `invalidated`
- `busted`
- `expired`

## Future Seams

The package includes framework-neutral seams for future phases:

- `CacheClock` for deterministic tests
- `CacheTimer`
- `CacheRefreshScheduler`
- `CacheActivityProvider`

These are intentionally small. Future React hooks, visibility-aware refresh, revalidate-on-focus, and UI refresh indicators should build on these contracts without changing the core engine.

## Limitations In Phase 1

- No React hooks.
- No UI.
- No automatic polling.
- No hidden-tab refresh orchestration.
- No service worker caching.
- No business-specific resources or demo consumers.
