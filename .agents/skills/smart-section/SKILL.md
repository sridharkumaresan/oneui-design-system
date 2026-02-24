---
name: smart-section
description: Implement the SmartSection organism: a reusable, layout-agnostic section widget that owns fetch lifecycle, retry/abort, deterministic accordion height, skeleton/slow/empty/error states, events, and accessibility
---

## Objective

Create an independently publishable organism package:

@functions-oneui/organism-smart-section

SmartSection is a single reusable section widget that:
- fetches data for one source
- manages lifecycle states and cancellation
- provides deterministic expand/collapse behavior
- renders header + body
- allows parent-provided item rendering via slots/render props
- does NOT own page layout

## Non-Negotiables

- Layout-agnostic: no columns/grid/max widths/padding decisions
- No domain coupling: not tied to "search" naming or behavior
- Fetch lifecycle: idle → loading → slow(optional) → success|empty|error
- Per-request abort: AbortController cancels prior in-flight on new requestKey
- Retry refetches only this section
- Deterministic body height using rowHeightPx and visible item count
- Prefers-reduced-motion disables ALL animations/transitions
- Full a11y: section role region, header toggle semantics, keyboard Enter/Space, focus visible
- Consumer supplies renderItem and optional render overrides (skeleton/empty/error/slow)

## Public API (export only from src/index.ts)

- SmartSection component (generic Item type support)
- useSmartSectionController hook (headless engine)
- Types: props, config, events, snapshot, lifecycle states

## Request Trigger

SmartSection must fetch only when:
- enabled === true
- requestKey changes

requestParams is arbitrary and passed to fetcher.

Avoid tying logic to "query" specifically.

## Rendering / Slots

Required:
- renderItem(item, ctx)

Optional:
- renderSkeletonRow(index, ctx)
- renderEmpty(ctx)
- renderError(ctx, error)
- renderSlow(ctx)
- renderHeaderExtras(ctx)

The section must never hardcode People/Files/News row layouts.

## keepPreviousData (required)

Add prop:
- keepPreviousData?: boolean (default true recommended)

Behavior:
- On requestKey change, if keepPreviousData is true and section has prior success items:
  - do not clear items
  - show a loading/refresh indicator (spinner in header)
  - keep deterministic height stable using the existing visible item count
  - replace items when new fetch resolves
- If keepPreviousData is false:
  - clear items and show skeleton during loading

Slow handling while keepPreviousData is true:
- Do not auto-collapse simply because slow timer fired if prior items are visible.
- Instead show the slow message in header/subheader while keeping existing items visible.

## Slow / Empty / Error Behavior

Defaults:
- slowThresholdMs: 1200
- autoCollapseOn: slow, empty, error
- autoExpandOnRequest: true

Error state must show:
- message
- Retry button (use atoms Button)

## Tests Required

Unit tests:
- state transitions (including slow timer)
- abort behavior on requestKey changes
- retry triggers only this section refetch
- deterministic height calculation
- visibility rules (initialVisibleCount/maxExpandedCount)

Accessibility tests:
- axe checks for key states
- keyboard toggle (Enter/Space)
- aria-expanded, aria-controls, role region, aria-labelledby correctness

## Storybook Required

Stories:
- Success (list rendering)
- Slow state auto-collapse
- Error + Retry
- Empty state
- Reduced motion (animations disabled)
- Custom renderers (renderSkeletonRow + renderEmpty override)
- Showcase story that reproduces the screenshot-style page with 2 columns (implemented outside SmartSection)

## Success Criteria

- Package builds independently and is publish-ready
- Integrated into aggregate Storybook
- Uses @functions-oneui/atoms Button for actions
- No hardcoded colors; tokens/theme only
- All CI gates pass
- Adds a changeset for initial package introduction (do not publish)