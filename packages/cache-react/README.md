# @functions-oneui/cache-react

React adapter hooks for the framework-agnostic `@functions-oneui/cache` resource engine.

The core cache package remains independent of React. This package is the optional React layer for applications and SPFx consumers that want cache-aware rendering without reimplementing lifecycle rules in components.

## Install

```bash
pnpm add @functions-oneui/cache @functions-oneui/cache-react
```

React and ReactDOM are peer dependencies.

## Basic Usage

```tsx
import { createCacheEngine, createIndexedDbCacheAdapter } from "@functions-oneui/cache";
import { useCachedResource } from "@functions-oneui/cache-react";

const engine = createCacheEngine({
  storage: createIndexedDbCacheAdapter({ databaseName: "my-app-cache" })
});

const weatherScope = {
  namespace: "weather",
  key: "london",
  segments: {
    tenant: "barclays",
    site: "dcw-home"
  }
};

const weatherPolicy = {
  staleTimeMs: 30_000,
  expireTimeMs: 5 * 60_000,
  version: "v1"
};

export const WeatherTile = () => {
  const weather = useCachedResource({
    engine,
    scope: weatherScope,
    policy: weatherPolicy,
    fetcher: () => fetch("/api/weather/london").then((response) => response.json()),
    revalidateIfStale: true
  });

  if (weather.isLoading) {
    return <SkeletonTile />;
  }

  if (weather.isError && !weather.hasData) {
    return <ErrorTile onRetry={weather.refresh} />;
  }

  return (
    <WeatherCard
      data={weather.data}
      isRefreshing={weather.isRefreshing}
      onRefresh={weather.refresh}
    />
  );
};
```

## Hook Contract

`useCachedResource(options)` returns:

- `data`
- `snapshot`
- `source`: `cache`, `network`, or `none`
- `lifecycleState`: `fresh`, `stale`, `expired`, `missing`, or `idle`
- `status`: `idle`, `loading-first-load`, `success-fresh`, `success-stale`, `refreshing`, `empty`, `error`, or `error-with-stale-data`
- booleans for common UI branches: `isLoading`, `isRefreshing`, `isEmpty`, `isError`, `hasData`, `isIdle`
- `refresh()`

The hook uses the cache engine as the source of truth for storage, lifecycle, version busting, and request deduplication.

## Rendering Pattern

Use the status flags to render stable UI:

- First load with no cache: show skeleton or ghost layout.
- Fresh cache: render cached data immediately.
- Stale cache with `revalidateIfStale: true`: render cached data immediately and show a subtle refreshing indicator.
- Refresh failure with cached data: keep the last good data and show non-disruptive error feedback. Compact widgets should prefer a small failure glyph in the same slot used for the background-refresh spinner instead of replacing the widget body.
- Empty data: pass `isEmptyData` so the hook can expose `status: "empty"`.

## Options

`revalidateIfStale` defaults to `false`. Set it to `true` when the component should keep stale data visible and refresh in the background.

`refreshIntervalMs` enables scheduled refresh from the React adapter layer. It does not add polling to the core cache engine. Pair it with:

- `refreshWhenVisibleOnly`: defaults to `true`; scheduled refresh pauses while the document is hidden.
- `revalidateOnVisible`: defaults to `true`; stale resources revalidate when the document becomes visible again.
- `keepStaleDataOnError`: defaults to `true`; failed refreshes retain the last good cached data.

`deps` is an explicit dependency list for values used by the fetcher or empty predicate. The hook keeps those callbacks in refs so inline functions do not create accidental fetch loops.

Storage remains engine-level. Policies do not choose storage adapters per call.

Storage and fetch failures are intentionally separated. If the fetcher succeeds but the cache engine cannot persist the result, the hook still renders the fresh data. If the fetcher itself fails and usable cached data exists, the hook reports `status: "error-with-stale-data"` so consumers can keep the content visible and show compact refresh-failure feedback.
