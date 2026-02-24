# @functions-oneui/atoms

Atomic building blocks for OneUI.

## Structure

Atoms live in `src/components/<atom-name>/`.

Current reference implementation:

- `src/components/oneui-button/`

Golden template (not exported):

- `src/components/_template/`

Use `_template` as the copy source when creating new atoms.

## Public API

Import from package root only:

```ts
import { OneUIButton } from "@functions-oneui/atoms";
```

Do not rely on deep imports.

## Add a New Atom

1. Copy `src/components/_template` into a new component folder.
2. Implement component logic with Fluent UI v9 and Griffel.
3. Export the component in `src/components/index.ts` and `src/index.ts`.
4. Add required tests:
   - Unit behavior test (Vitest + React Testing Library)
   - Accessibility test using `expectNoAxeViolations` from `@functions-oneui/testing`
5. Add a colocated Storybook story for the public atom.

## Token and Theme Rules

- No hardcoded colors in atom components.
- Prefer values from Fluent theme context (produced by `@functions-oneui/theme`).
- Use semantic token fallbacks from `@functions-oneui/tokens` only when needed.
- Keep component styling token-first and theme-driven.

## Test Commands

- `pnpm --filter @functions-oneui/atoms test`
- `pnpm --filter @functions-oneui/atoms typecheck`
- `pnpm --filter @functions-oneui/atoms build`
