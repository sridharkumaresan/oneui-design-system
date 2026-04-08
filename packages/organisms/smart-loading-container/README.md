# @functions-oneui/organism-smart-loading-container

Compound container organism for multi-section async experiences.

## Purpose

`SmartLoadingContainer` and `SmartLoadingSection` provide reusable section framing for async React experiences where the consumer owns:

- API calls
- data mapping
- retry behavior
- body rendering

The package does not fetch data and does not embed SPFx concerns.

The intent is a calm, page-integrated section shell rather than a bulky dashboard widget:

- refined header with title, description, badge, and optional actions
- compact state treatment for loading, delayed, empty, and error scenarios
- arbitrary child rendering for success and refreshing states
- optional enterprise accordion behavior with concise right-side status summary

## Ownership Boundary

`SmartLoadingContainer` and `SmartLoadingSection` own:

- section framing and header layout
- async state presentation
- retry affordance and optional collapse behavior

Consumers own:

- loader functions and API clients
- business logic and mapping
- arbitrary children rendered for settled content

## Usage

```tsx
import {
  SmartLoadingContainer,
  SmartLoadingSection
} from "@functions-oneui/organism-smart-loading-container";

<SmartLoadingContainer
  description="Results appear as each section responds."
  progressSlot={<ProgressBanner />}
  title="Enterprise search"
>
  <SmartLoadingSection count={3} status="success" title="News">
    <NewsResults />
  </SmartLoadingSection>
  <SmartLoadingSection
    errorMessage="Unable to load this source."
    onRetry={() => void retryResources()}
    status="error"
    title="Resources"
  />
</SmartLoadingContainer>;
```

## Public API

- `SmartLoadingContainer`
- `SmartLoadingSection`
- `SmartLoadingContainerProps`
- `SmartLoadingSectionProps`

## Section Behavior Options

`SmartLoadingSection` supports additional behavior flags for configurable accordion usage:

- `collapsible`
- `defaultCollapsed`
- `autoCollapseOnError`
- `autoCollapseOnDelayed`
- `delayedThresholdMs`
- `statusDisplayMode`
- `expandOnSuccess`
- `collapseOnEmpty`

## Externally Managed State Example

```tsx
<SmartLoadingSection
  count={3}
  emptyMessage="No matching results."
  errorMessage="Unable to load this source."
  onRetry={() => void retrySection("news")}
  status="success"
  title="News"
>
  <NewsResults />
</SmartLoadingSection>
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

{loading.sections.map((section) => (
  <SmartLoadingSection
    key={section.id}
    count={section.count}
    errorMessage={section.errorMessage}
    onRetry={() => void loading.retrySection(section.id)}
    status={section.status}
    title={section.title}
  >
    <NewsResults data={section.data} />
  </SmartLoadingSection>
))}
```

## Arbitrary Children Contract

`SmartLoadingSection` never assumes result card markup. Consumers render arbitrary React children when the section is in `success` or `refreshing`, which keeps the package generic across search, dashboards, approvals, and future SPFx webparts.

## Development Commands

- `pnpm --filter @functions-oneui/organism-smart-loading-container build`
- `pnpm --filter @functions-oneui/organism-smart-loading-container test`
- `pnpm --filter @functions-oneui/organism-smart-loading-container typecheck`
