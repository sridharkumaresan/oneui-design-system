# @functions-oneui/organism-smart-progress-bar

Aggregate progress summary organism for multi-section async loading experiences.

## Purpose

`SmartProgressBar` renders a token-aligned progress summary for independent async sections without fetching data itself.

Use it when the consuming app already knows section status and wants a reusable summary banner with:

- explicit total/completed/loading/success/empty/error/delayed counts
- optional summary text and supporting description
- slim progress treatment for page-level layouts
- per-section status pills that keep the source label stable and communicate status with subtle glyphs

## Ownership Boundary

`SmartProgressBar` owns:

- page-level progress presentation
- compact source status chips
- accessible progress semantics

Consumers own:

- API calls and orchestration
- domain-specific copy
- data mapping into summary counters and chip items

## Usage

```tsx
import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";

<SmartProgressBar
  completed={4}
  delayed={1}
  error={1}
  items={[
    { id: "news", label: "News", status: "success", count: 3 },
    { id: "people", label: "People", status: "loading" },
    { id: "resources", label: "Resources", status: "error" }
  ]}
  success={2}
  title="Searching across enterprise systems"
  total={7}
/>;
```

## Public API

- `SmartProgressBar`
- `SmartProgressBarProps`
- `SmartProgressBarItem`

## Externally Managed State Example

```tsx
<SmartProgressBar
  completed={4}
  delayed={1}
  empty={1}
  error={1}
  items={[
    { id: "news", label: "News", status: "success", count: 12 },
    { id: "resources", label: "Resources", status: "error" }
  ]}
  loading={1}
  percent={57}
  success={2}
  title="Enterprise search"
  total={7}
/>;
```

## Hook-Managed State Example

```tsx
const loading = useProgressiveLoading({
  sections: [
    {
      id: "news",
      title: "News",
      loader: async ({ signal }) => fetchNews(signal),
      getCount: (data) => data.items.length
    }
  ]
});

<SmartProgressBar
  completed={loading.progress.completed}
  delayed={loading.progress.delayed}
  empty={loading.progress.empty}
  error={loading.progress.error}
  items={loading.sections.map((section) => ({
    id: section.id,
    label: section.title,
    status: section.status,
    count: section.count
  }))}
  loading={loading.progress.loading}
  percent={loading.progress.percent}
  refreshing={loading.progress.refreshing}
  success={loading.progress.success}
  title="Async sections"
  total={loading.progress.total}
/>;
```

## Development Commands

- `pnpm --filter @functions-oneui/organism-smart-progress-bar build`
- `pnpm --filter @functions-oneui/organism-smart-progress-bar test`
- `pnpm --filter @functions-oneui/organism-smart-progress-bar typecheck`
