# SPFx Progressive Loading Integration Guide

## Recommended Usage Pattern

Use SPFx-specific clients in the webpart layer, then map those loaders into `useProgressiveLoading` or into externally managed section state.

### Reusable Packages

- `@functions-oneui/organism-smart-progress-bar`
- `@functions-oneui/organism-smart-loading-container`
- `@functions-oneui/react-utils/progressive-loading`

### Webpart Layer Owns

- `this.context.spHttpClient`
- `this.context.msGraphClientFactory`
- service modules that call SharePoint/Graph/custom APIs
- transformation from service data into renderable view models

## Hook-Based Example

```tsx
const loading = useProgressiveLoading({
  delayedThresholdMs: 1500,
  sections: [
    {
      id: "sharepoint-news",
      title: "SharePoint News",
      loader: async ({ signal }) => {
        return newsService.getLatestNews({ signal, spHttpClient: context.spHttpClient });
      },
      getCount: (data) => data.items.length
    },
    {
      id: "graph-tasks",
      title: "My Tasks",
      loader: async ({ signal }) => {
        return tasksService.getMyTasks({ signal, graphClientFactory: context.msGraphClientFactory });
      },
      getCount: (data) => data.tasks.length
    }
  ]
});
```

Then render:

```tsx
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
  title="Inbox"
  total={loading.progress.total}
/>;
```

## Externally Managed State Example

If a webpart already has a mature orchestration layer, keep it. Use the shared contracts and helper functions only:

- track section state in the webpart or service layer
- call `calculateProgressSummary(sections)`
- pass the resulting counters into `SmartProgressBar`
- pass each section’s props into `SmartLoadingSection`

## Risks And Watchouts

- always pass `AbortSignal` through long-running loader calls where possible
- avoid placing SPFx `context` objects inside reusable packages
- keep loader return values domain-specific, but map counts and empty-state detection explicitly
- for `refreshing`, keep prior section content visible if that improves UX
- delayed thresholds may need tuning for tenant latency and Graph throttling
