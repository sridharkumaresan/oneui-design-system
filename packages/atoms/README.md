# @functions-oneui/atoms

Atomic building blocks for OneUI.

## Current Atoms

- `OneUIButton`
- `OneUIText`
- `OneUIHeading`
- `OneUIStack`
- `OneUICard`

Golden template (not exported):

- `src/components/_template/`

Use `_template` as the copy source when creating new atoms.

## Public API

Import from package root only:

```ts
import {
  OneUIButton,
  OneUICard,
  OneUIHeading,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";
```

Do not rely on deep imports.

## Add a New Atom

1. Copy `src/components/_template` into a new component folder.
2. Implement component logic with Griffel and OneUI theme-driven tokens.
3. Export the component from `src/components/index.ts` and `src/index.ts`.
4. Add required tests:
   - Render and behavior tests with Vitest + React Testing Library
   - Accessibility test using `expectNoAxeViolations` from `@functions-oneui/testing`
5. Add colocated Storybook stories for defaults, variants, and key states.

## Professional Rules

- No hardcoded colors in atom components.
- Prefer Fluent theme tokens from `@functions-oneui/theme` through Fluent v9 token variables.
- Keep APIs small and composable.
- Avoid deep imports and internal helper exports.
- New atoms must ship with stories and automated accessibility checks.

## Test Commands

- `pnpm --filter @functions-oneui/atoms test`
- `pnpm --filter @functions-oneui/atoms typecheck`
- `pnpm --filter @functions-oneui/atoms build`
