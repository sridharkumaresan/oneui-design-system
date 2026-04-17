# Cache Package Architecture

`@functions-oneui/cache` is the framework-agnostic resource cache foundation for OneUI packages and consumers.

## Design Intent

The package deliberately has no React, Angular, SPFx, UI, polling, or business-specific logic. Consumers and future adapters should build on the same cache semantics instead of reimplementing stale/fresh/expired behavior per framework.

## Async API

All engine and adapter methods are async. Memory and Web Storage could be synchronous internally, but IndexedDB is async, and a single async contract avoids adapter-specific behavior and future breaking changes.

## Scope Hierarchy

Every record is addressed as:

```text
tenantId -> siteId -> namespace -> key
```

`tenantId`, `namespace`, and `key` are required. `siteId` is optional. The structured scope is normalized into an internal storage key, but consumers should continue to use structured scopes so invalidation remains understandable.

## Lifecycle State

The engine resolves state centrally:

- `missing`: no valid record exists
- `fresh`: `now < staleAt`
- `stale`: `staleAt <= now < expiresAt`
- `expired`: `now >= expiresAt`

Stale data is usable by default. It is not automatically refreshed unless a caller explicitly requests revalidation.

## Request Deduplication

In-flight request dedupe is centralized in the engine and keyed by normalized scope. This prevents multiple widgets, hooks, or consumers from issuing duplicate requests for the same resource at the same time.

## Storage Selection

Storage is selected when the cache engine is created. Policies do not route individual resources to different adapters. This keeps Phase 1 storage behavior explicit and avoids hidden routing complexity.

## Invalidation Cost Model

Exact remove is key-based. Partial-scope invalidation is scan-based for memory, Web Storage, and IndexedDB in Phase 1.6. This is acceptable for the expected package scale. If future consumers store large IndexedDB datasets, indexes can be added behind the adapter contract without changing the engine API.

## Rich Fetch Semantics

`getOrFetch` returns data for simple consumers. `getOrFetchSnapshot` returns data plus source/state/snapshot metadata so future React hooks can render stale, refreshing, expired, or network-loaded states without re-deriving cache semantics.

## Phase 2 Direction

Phase 2 should build React hooks and demo integration on top of the existing engine. Hooks should use `getOrFetchSnapshot`, subscriptions, and explicit refresh/revalidation options rather than duplicating lifecycle logic.
