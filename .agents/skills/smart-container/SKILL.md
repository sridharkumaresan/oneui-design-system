---
name: smart-container
description: Implement the config-driven Smart Search Results Container organism with parallel fetching, per-section lifecycle, deterministic accordion layout, and full accessibility
---

## Objective

Create a production-grade Smart Container organism:
@functions-oneui/organism-smart-container

It orchestrates parallel fetches across multiple independent sections and renders them in a responsive two-column layout. Each section has its own lifecycle and deterministic expand/collapse behavior to avoid layout jumps.

## Non-Negotiables

- Publish as a standalone package: @functions-oneui/organism-smart-container
- React 18+, Fluent UI v9, Griffel styling only
- No hardcoded colors: use tokens/theme values
- Full keyboard accessibility and ARIA requirements (per spec)
- Prefers-reduced-motion fully respected (disable animations)
- No data-source specifics: fetchers and item rendering are provided by consumer config
- Deterministic section body height based on rowHeightPx and visible item count
- Parallel fetching: all enabled sections fetch simultaneously on query submit
- Abort handling: cancel previous in-flight requests per section on new query
- Query cleared resets all to idle

## Deliverables

### Public API
Export from src/index.ts only:
- SmartContainer component
- Types:
  - SmartContainerProps
  - SmartContainerConfig (global)
  - SectionConfig<TItem>
  - SectionState (idle/loading/slow/success/empty/error)
  - Event types + payloads

### Section state machine
Implement per-section lifecycle:

idle → loading → slow(optional) → success | empty | error

Rules:
- slow after threshold (default 1200ms)
- slow/empty/error auto-collapse
- new query starts loading and auto-expands
- retry re-fetches only that section
- section settles independently; container never waits to render others

### Layout
- Desktop two columns with % split (defaults: 65/35)
- Mobile collapse to single column below breakpoint (default 768px)
- Sections assigned to left/right via config and sorted by order
- Configurable gaps, max width, padding

### Accordion behavior
- Header toggles expand/collapse (mouse + keyboard Enter/Space)
- Header shows: icon, title, optional count badge, loading spinner, chevron
- Body height is deterministic:
  - collapsed shows initialVisibleCount
  - expanded shows maxExpandedCount
  - height = visibleCount × rowHeightPx (+ optional padding)
- Smooth expand/collapse transition; disabled when prefers-reduced-motion

### Item rendering and actions
- renderItem(item, context) supplied by section config
- "Show N more" button if more items exist
- Optional "View more →" link using getViewMoreHref
- Error state shows retry button
- Slow/empty/error auto-collapse; expanded view can show more detail (error details in expanded)

### Global states
- Results summary banner when all enabled sections settled and totalCount>0
- Global empty state when all settled and totalCount=0
- ARIA live region announces summary when all settle

### Events
Emit events with sectionId:
- retry, expand, collapse, viewMore, settled

### Demo implementation
Provide demo stories that include 9 demo sections and simulate:
- success, slow, error+retry, empty, staggered items
Use fake fetchers with setTimeout and abort support.

## Testing Requirements

- Unit tests:
  - section state transitions (idle/loading/slow/success/empty/error)
  - abort behavior on new query
  - retry triggers only one section refetch
  - deterministic height calculation
  - sorting/column assignment
- Accessibility tests:
  - axe on default render and key states
  - keyboard toggling works (Enter/Space)
  - aria-expanded/controls/region labeling correct
  - aria-live summary announced (test for DOM updates)
- Storybook:
  - Default demo (9 sections)
  - Reduced motion story (animations disabled)
  - Mobile breakpoint story
  - Error+Retry story
  - Empty-all story

## Success Criteria

- Package builds independently, passes tests, appears in aggregate Storybook
- No layout jump (deterministic heights)
- Fast sections render without waiting for slow ones
- All CI gates pass (lint/typecheck/test/build/storybook build)