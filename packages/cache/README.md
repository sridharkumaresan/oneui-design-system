# @functions-oneui/cache

Framework-agnostic scoped cache and resource engine for OneUI consumers.

This package is the Phase 1 cache foundation. It does not include React hooks, UI components, polling, SPFx-specific logic, or demo app integrations.

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

Engine methods:

- `getSnapshot(scope, policy?)`
- `get(scope, options?)`
- `set(scope, data, policy?, options?)`
- `getOrFetch(scope, fetcher, policy?, options?)`
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

## Lifecycle

Each record stores:

- `scope`
- `storageKey`
- `data`
- `version`
- `createdAt`
- `updatedAt`
- `lastAccessedAt`
- `staleAt`
- `expiresAt`
- optional `etag`, `checksum`, and metadata

The engine resolves snapshots as:

- `missing`: no record exists
- `fresh`: `now < staleAt`
- `stale`: `staleAt <= now < expiresAt`
- `expired`: `now >= expiresAt`

Stale records are usable by default in `getOrFetch`. Pass `{ allowStale: false }` to force a fetch when a record is stale. This prepares the package for stale-while-revalidate patterns in a future phase without adding hidden background refresh behavior now.

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

## Request Deduplication

`getOrFetch` and `refresh` dedupe concurrent requests by normalized scoped key. If multiple callers request the same scope while a fetch is in flight, only one fetcher runs and all callers receive the same promise result.

## Invalidation And Busting

Use structured partial scopes:

```ts
await cache.invalidate({ tenantId: "barclays" });
await cache.invalidate({ tenantId: "barclays", siteId: "dcw-home" });
await cache.invalidate({ tenantId: "barclays", siteId: "dcw-home", namespace: "weather" });
await cache.remove({ tenantId: "barclays", siteId: "dcw-home", namespace: "weather", key: "london" });
```

If a policy supplies `version` and `bustOnVersionChange` is true, a cached record with a different version is removed and treated as `missing`.

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
- `refreshed`
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
