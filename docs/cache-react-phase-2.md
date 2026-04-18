# Cache React Adapter Phase 2

Phase 2 adds `@functions-oneui/cache-react`, an optional React adapter on top of the framework-agnostic `@functions-oneui/cache` package.

## Architecture

- `@functions-oneui/cache` stays framework-agnostic and owns storage, lifecycle state, invalidation, version busting, and request dedupe.
- `@functions-oneui/cache-react` adds React hooks that convert the core cache result into UI-friendly state.
- Demo and consumer code depend on the adapter, not on copied cache logic.

## Hook

`useCachedResource` accepts an engine, scope, fetcher, policy, and optional rendering controls.

The hook returns:

- `data`
- `snapshot`
- `source`
- `lifecycleState`
- `status`
- derived booleans such as `isLoading`, `isRefreshing`, `isEmpty`, and `isError`
- `refresh()`

The hook paints cached stale data first, then calls `engine.refresh(...)` when `revalidateIfStale` is enabled. That keeps React components from blocking on a background refresh before they can render useful cached data.

Scheduled refresh is also handled in the React adapter layer. `refreshIntervalMs` can trigger background refreshes without duplicating timers inside widgets. When `refreshWhenVisibleOnly` is enabled, interval refresh pauses while the document is hidden. When `revalidateOnVisible` is enabled, stale resources revalidate when the document becomes visible again. None of this scheduling logic lives in the framework-agnostic cache core.

## Demo Surfaces

The playground search home banner uses the React cache adapter for the existing insight widgets:

- weather
- market data
- the four task/action cards

It uses IndexedDB persistence. The existing banner widgets/cards render first-load skeletons, cached values, and subtle refreshing states in place.

The SPFx enterprise search consumer uses the same hook contract in the hero banner. The banner has HTTP-backed stock, weather, approvals, tasks, and mandatory-training resources. Each resource has its own scope, fetcher, policy, refresh interval, and failure behavior, so one failed endpoint does not block the others.

## Manual Validation Checklist

### Playground

1. Start the playground with `pnpm dev:playground`.
2. Open the search/home route.
3. Clear existing browser IndexedDB data for `oneui-playground-search-banner-cache`.
4. Reload and verify the weather widget, stock widget, and four task cards show in-place skeletons before data appears.
5. Reload again and verify cached values appear immediately; the top-right banner badge should show `Cached`.
6. Wait at least 10 seconds, then reload. The cached values should remain visible while the banner briefly shows refreshing state.
7. After refresh completion, verify the top-right banner badge changes back to `Fresh` and values may update.
8. Inspect one weather/stock widget or task card in DevTools and verify `data-cache-source` / `data-cache-state` attributes reflect cache state.
9. Resize to mobile width and verify the existing banner layout does not overlap.

### SPFx Consumer

1. Build the local cache packages from the repo root: `pnpm --filter @functions-oneui/cache build && pnpm --filter @functions-oneui/cache-react build`.
2. From `consumers/oneui-spfx-enterprise-search`, run `pnpm install` if dependencies are not linked.
3. Run `pnpm preview`.
4. Open the preview page and verify the existing search header, vertical tabs, onboarding, and result behavior still work.
5. Clear localStorage entries beginning with `oneui-spfx-banner-resource-cache:`.
6. Reload and verify the stock widget, weather widget, approvals card, tasks card, and mandatory-training card show shaped skeletons before data arrives.
7. Reload again and verify cached data appears immediately.
8. Wait for the configured refresh intervals; verify each resource can show its own top-right spinner while keeping current content visible.
9. Hide the browser tab for longer than a refresh interval. Return to the tab and verify stale resources revalidate after visibility returns.
10. Add `?bannerStatus=error&bannerTarget=stock` to the preview URL and verify only stock shows error behavior while the other resources continue.
11. Add `?bannerStatus=empty&bannerTarget=tasks.training` and verify the training card shows an empty state without changing layout.
12. Search for a normal query and verify the search results/progress behavior is unchanged.

## Notes

The SPFx consumer uses local `link:` dependencies for source validation. After publishing cache packages to Verdaccio or Nexus, those dependency entries can be switched to the published snapshot or stable versions.
