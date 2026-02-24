---
name: add-atom
description: Add a new Atom component to @functions-oneui/atoms with required structure, stories, tests, and accessibility checks
---

## Objective

Create a new Atom component inside the @functions-oneui/atoms package following OneUI standards.

Atoms are foundational primitives. They must be small, composable, token-driven, and extremely reliable.

## Inputs (ask if not provided)

- Atom name (PascalCase), e.g. "Button", "Text", "Card"
- Intended role/type: interactive | display | layout
- Controlled/uncontrolled needs (if any)
- Required variants (size, appearance, state)
- Any Fluent UI primitives to compose (v9 only)

If any input is missing, make a reasonable default and document it in the component README/stories.

## Folder & File Layout (required)

Create under:

packages/atoms/src/components/<AtomName>/

Required files:
- <AtomName>.tsx
- <AtomName>.styles.ts           (Griffel makeStyles + mergeClasses)
- <AtomName>.types.ts            (public prop types + internal types as needed)
- <AtomName>.test.tsx            (RTL + Vitest)
- <AtomName>.a11y.test.tsx       (axe checks; may be combined if repo standard does so)
- <AtomName>.stories.tsx         (Storybook)

Also:
- Export the component from packages/atoms/src/index.ts
- Do NOT export internal helpers or templates

## Implementation Rules (non-negotiable)

- React 18+ only
- Fluent UI v9 only
- Griffel-only styling
- No hardcoded colors; use tokens/theme values only
- Keyboard accessible for interactive atoms
- Visible focus indicators
- Prefer composition; keep API minimal
- Avoid unnecessary dependencies
- No default export for components

## Accessibility Requirements

For interactive atoms, ensure:
- Proper element semantics (button/link/etc.)
- Disabled states are conveyed correctly
- Keyboard interactions behave correctly (Enter/Space where applicable)
- Focus order is logical
- ARIA attributes only where needed (avoid ARIA overuse)

Add automated axe checks for the default story render or component render.

## Stories (required set)

Minimum stories:
- Default
- Variants (all appearances/sizes)
- States (disabled/loading/selected/etc. as relevant)
- AccessibilityNotes (docs-only story or story description)

Use controls for key props. Keep stories simple and focused.

## Tests (required set)

- Render test (smoke)
- Behavior test(s) (click/keyboard if interactive)
- Props test(s) (e.g., disabled prevents handler)
- Accessibility: axe check on default render

## Definition of Done

- Component exported from @functions-oneui/atoms root
- Lint/typecheck/tests pass
- Storybook renders the stories
- No token/theming rule violations
- No deep-import requirement for consumers

## Success Criteria

A developer can:
- import the atom from @functions-oneui/atoms
- view it in Storybook
- run tests and see them pass
- rely on it as a base for organisms