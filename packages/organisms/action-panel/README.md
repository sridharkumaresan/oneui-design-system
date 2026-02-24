# @functions-oneui/organism-action-panel

Composable ActionPanel organism for OneUI applications.

## Purpose

- Present a clear action area with a required heading
- Optionally show supporting description text
- Render primary and secondary calls-to-action with OneUI atoms

## Usage

```ts
import { ActionPanel } from "@functions-oneui/organism-action-panel";

<ActionPanel
  title="Review Request"
  description="Approve or request changes for this item."
  layout="inline"
  primaryAction={{ label: "Approve", onClick: handleApprove }}
  secondaryAction={{ label: "Request Changes", onClick: handleRequestChanges }}
/>;
```

## Props API

- `title` (`string`, required): Heading shown for the panel
- `description` (`string`, optional): Supporting text under the title
- `layout` (`"inline" | "stacked"`, optional): Action and content arrangement (default: `"inline"`)
- `primaryAction` (`ActionPanelAction`, required): Primary action config
- `secondaryAction` (`ActionPanelAction`, optional): Secondary action config
- `className` (`string`, optional): Additional class for root panel styling

`ActionPanelAction`:
- `label` (`string`, required): Button label
- `onClick` (`MouseEventHandler<HTMLButtonElement>`, optional): Click handler
- `disabled` (`boolean`, optional): Disabled state

## Accessibility Notes

- Uses semantic heading markup for the title
- Uses native button semantics through `@functions-oneui/atoms` buttons
- Preserves keyboard tab order by rendering actions in DOM order
- Focus indicators are not removed by organism styles
- Includes automated axe checks in unit tests
