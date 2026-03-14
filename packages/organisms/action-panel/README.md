# @functions-oneui/organism-action-panel

Composable action panel organism for concise decision points, empty states, and summary callouts.

## Purpose

`ActionPanel` combines OneUI atoms into a publishable organism with:

- required title
- optional description
- required primary action
- optional secondary action
- inline or stacked action layouts

It stays UI-only and delegates behavior through callbacks.

## Usage

```tsx
import { ActionPanel } from "@functions-oneui/organism-action-panel";

<ActionPanel
  title="Release review"
  description="Validate the latest deployment status before continuing."
  primaryAction={{
    label: "Approve",
    onClick: () => {
      /* handle approve */
    }
  }}
  secondaryAction={{
    label: "View details",
    onClick: () => {
      /* handle details */
    }
  }}
  layout="inline"
/>;
```

## Props Summary

- `title`: required heading content
- `description`: optional supporting text
- `primaryAction`: required primary button configuration
- `secondaryAction`: optional secondary button configuration
- `layout`: `"inline" | "stacked"`
- `headingLevel`: semantic heading level for the title

## Accessibility Notes

- The panel renders as a labeled region using the title as `aria-labelledby`.
- Buttons are rendered in DOM order: secondary first, primary last.
- Focus visibility is preserved through the underlying OneUI button atom.

## Development Commands

- `pnpm --filter @functions-oneui/organism-action-panel build`
- `pnpm --filter @functions-oneui/organism-action-panel test`
- `pnpm --filter @functions-oneui/organism-action-panel typecheck`
