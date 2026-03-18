# @functions-oneui/organism-action-card

Responsive premium action surface for OneUI.

## Purpose

`ActionCard` is a generic, publishable organism for structured workflow-style content that may include:

- an optional eyebrow
- a required title
- optional metadata
- optional status content
- optional actions
- optional footer content

It is intended for reusable patterns such as approvals, requests, reviews, records, notifications, and assignments without baking any of those concepts into the public API.

Internally the component preserves a strict layout grammar with explicit regions:

- `contentRegion`
- `statusRegion`
- `dividerRegion`
- `actionsRegion`
- `footerRegion`

That structure is what gives the card its dedicated action rail, visible divider, and predictable responsive behavior.

## What It Is Not For

Do not use `ActionCard` for:

- data fetching
- list filtering or tabs
- workflow orchestration
- routing decisions
- business-specific field semantics
- free-form page layout

Those responsibilities stay outside the organism.

## Usage

```tsx
import {
  OneUIBadge,
  OneUIButton,
  OneUILink,
  OneUIText
} from "@functions-oneui/atoms";
import { ActionCard } from "@functions-oneui/organism-action-card";

<ActionCard
  eyebrow="ITEM | REF-10024"
  title="Quarterly access review"
  meta={
    <>
      <OneUIText block tone="secondary">
        Owner <OneUILink href="/people/maya-rivera">Maya Rivera</OneUILink>
      </OneUIText>
      <OneUIText block tone="secondary">
        Updated 03 Mar 2024, 10:13 GMT
      </OneUIText>
    </>
  }
  status={<OneUIBadge tone="warning">Due 16 Apr 2025</OneUIBadge>}
  actions={
    <>
      <OneUIButton>Approve</OneUIButton>
      <OneUIButton appearance="secondary">Reject</OneUIButton>
      <OneUILink href="/details/10024">Full details</OneUILink>
    </>
  }
/>;
```

## Props Summary

- `eyebrow`: optional compact top metadata
- `title`: required title content
- `meta`: optional supporting content below the title
- `status`: optional badge or status region
- `actions`: optional buttons or links
- `footer`: optional content below the main regions
- `layout`: `"auto" | "horizontal" | "stacked"`
- `density`: `"default" | "compact"`
- `isDisabled`: disables the shell semantically and visually
- `headingLevel`: semantic heading level for the title

## Internal Layout

On wide containers the main grid is arranged as:

- content region: flexible dominant column
- status region: compact inline status zone
- divider region: dedicated visual separator
- actions region: fixed-feel action rail

The footer is separated below the main grid by a horizontal divider when present.

## Slot Guidance

- Keep `title` concise and prominent.
- Use `meta` for supporting metadata or small descriptive blocks.
- Use `status` for badges, chips, or compact state content.
- Use `actions` for real buttons and links only.
- Use `footer` for secondary content such as summaries or supplementary actions.

## Responsive Behavior

- `layout="auto"` uses named container queries and adapts to the card’s available width instead of only the viewport.
- Wide containers preserve the full content/status/divider/actions grammar.
- Medium containers tighten the action rail and horizontal spacing while preserving the same grammar.
- Narrow containers switch to a stacked layout and replace the vertical divider with a horizontal separation pattern.
- `layout="horizontal"` forces the wide rail layout.
- `layout="stacked"` forces the stacked mobile-style layout.

## Design-System Contract

`ActionCard` is driven by semantic component tokens from the theme and token packages, including:

- shell background, border, radius, and shadow
- desktop/tablet/mobile padding
- content, status, divider, and action-rail gaps
- action-rail width targets
- typography and color roles for eyebrow, title, meta, footer, and link text

If spacing, divider, or shell treatment needs to change, update the token/theme layer first rather than patching the component with local magic values.

## Accessibility Notes

- The shell uses the title as `aria-labelledby`.
- DOM order remains content, then status, then actions, then footer.
- `isDisabled` applies `aria-disabled` to the shell, but slotted actions must still be disabled individually when needed.
- Actions should always be semantic buttons or links.

## When To Use It

Use `ActionCard` when the UI needs structured content plus optional status and actions inside a reusable responsive shell with a dedicated action rail.

Use a simpler atom or smaller composition when:

- there is no action region
- the content is purely decorative
- the layout does not need this level of structure

Use `ActionSection` alongside `ActionCard` when multiple cards need to be grouped under a shared header, count, and optional header action.

## Development Commands

- `pnpm --filter @functions-oneui/organism-action-card build`
- `pnpm --filter @functions-oneui/organism-action-card test`
- `pnpm --filter @functions-oneui/organism-action-card typecheck`
