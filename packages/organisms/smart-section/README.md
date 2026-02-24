# @functions-oneui/organism-smart-section

Reusable, layout-agnostic smart section organism for OneUI.

## Purpose

`SmartSection` is a single section widget that owns request lifecycle for one data source:

- requestKey-driven fetch trigger
- in-flight abort on new requestKey
- slow/empty/error lifecycle handling
- retry and show-more actions
- deterministic accordion body height to reduce layout jumps
- accessibility-first header toggle + region semantics

It does **not** implement page-level layout (columns/grid/max-width).

## Usage

```ts
import { SmartSection } from "@functions-oneui/organism-smart-section";

type Item = { id: string; label: string };

<SmartSection<Item>
  sectionId="people"
  title="People"
  requestKey={query}
  enabled={query.length > 0}
  fetcher={async ({ requestKey, signal }) => {
    const items = await fetchPeople(String(requestKey), signal);
    return { items, totalCount: items.length };
  }}
  renderItem={(item) => <span>{item.label}</span>}
/>;
```

## Public API

Exports from package root:

- `SmartSection`
- `useSmartSectionController`
- types for props, fetch contracts, controller snapshot, and events

No deep imports are required.

## Key Props

- `sectionId`: unique section identifier
- `title`: section heading
- `enabled`: enables/disables request trigger logic
- `requestKey`: fetch trigger key (fetch occurs only when this changes while enabled)
- `fetcher`: async data function with AbortSignal support
- `renderItem`: required item renderer
- `keepPreviousData`: keeps previous items visible during requestKey refresh
- `slowThresholdMs`: loading-to-slow threshold
- `rowHeightPx`, `initialVisibleCount`: deterministic height controls
- `bodyPaddingBlockPx`, `rowGapPx`: optional layout metrics for deterministic body sizing
- `skeletonizeHeaderOnInitialLoad`: render header ghost placeholders during first-load skeleton state
- `viewMoreLabel`, `viewMoreHref`: optional header-level link for opening full section results

Optional render overrides:

- `renderSkeletonRow`
- `renderEmpty`
- `renderError`
- `renderSlow`
- `renderHeaderExtras`

`SmartSection` owns section lifecycle and accessibility behavior. Consumers own item presentation via `renderItem` and optional state render overrides.

## Accessibility Notes

- Header toggle is a native `button` with `aria-expanded` and `aria-controls`
- Content panel exposes `role="region"` + `aria-labelledby`
- Keyboard Enter/Space supported via native button semantics
- Includes hidden `aria-live` status updates
- Includes automated axe checks

## Motion

- Honors `prefers-reduced-motion`
- `reducedMotion` prop can force reduced-motion behavior for deterministic demos/tests
- Reduced motion disables height transitions and spinner visuals

## Actions

- Retry and Show more actions use `@functions-oneui/atoms` `OneUIButton`

## Local Validation

- `pnpm --filter @functions-oneui/organism-smart-section run lint`
- `pnpm --filter @functions-oneui/organism-smart-section run typecheck`
- `pnpm --filter @functions-oneui/organism-smart-section run test`
- `pnpm --filter @functions-oneui/organism-smart-section run build`
