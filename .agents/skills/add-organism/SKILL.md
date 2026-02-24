---
name: add-organism
description: Create a new individually publishable organism package under @functions-oneui/organism-<name> with stories, tests, and a11y gates
---

## Objective

Create a new organism as an independently publishable package.

Each organism must be its own package:
@functions-oneui/organism-<kebab-name>

Organisms compose atoms and implement richer UI patterns, but remain UI-only (no direct service calls) unless explicitly allowed.

## Inputs (ask if not provided)

- Organism package suffix (kebab-case), e.g. "action-panel", "carousel"
- Primary component name (PascalCase), e.g. "ActionPanel"
- Required props and slots
- Any layout variants and states
- Whether it is UI-only (default) or needs data-access injection (rare)

If missing, choose UI-only defaults and document assumptions.

## Package Location (required)

Create:

packages/organisms/<kebab-name>/

Package name must be:

@functions-oneui/organism-<kebab-name>

This package must be publishable on its own and must not rely on repo-only paths.

## Required Files

- src/index.ts                          (public exports only)
- src/<ComponentName>.tsx
- src/<ComponentName>.styles.ts
- src/<ComponentName>.types.ts
- src/<ComponentName>.test.tsx
- src/<ComponentName>.a11y.test.tsx     (or combined with main tests per repo standard)
- src/<ComponentName>.stories.tsx
- README.md
- CHANGELOG.md (optional; Changesets can generate per-package changelog)

## Dependency Rules

- Depends on @functions-oneui/atoms and @functions-oneui/theme
- Depends on @functions-oneui/tokens only if necessary (prefer theme)
- React and ReactDOM are peerDependencies
- No circular dependencies
- No deep imports from atoms/theme; only public exports

## Implementation Rules

- Compose atoms; do not duplicate atom behaviors
- Griffel styling only; token/theme driven; no hardcoded colors
- Provide composition-friendly API (slots/props patterns)
- Avoid embedding data fetching; accept data + callbacks
- If data access is needed, use dependency injection (pass client interfaces)

## Stories (required set)

Minimum stories:
- Default
- Variant(s) / Layouts
- WithLongContent (wrap/overflow checks)
- States (disabled/loading etc.)
- AccessibilityNotes

Use Storybook controls for key props.

## Tests (required set)

- Render smoke test
- Behavior tests (interactions, callbacks)
- Layout/variant tests as appropriate
- Accessibility: axe check for default render

## Publishing Readiness (required checks)

Ensure:
- Independent build works for this package
- Exports map is correct and clean
- sideEffects policy is appropriate
- A Changeset is added for new organism introduction or meaningful changes

## Definition of Done

- Importable via @functions-oneui/organism-<name>
- Visible in aggregate Storybook
- Tests and a11y checks pass
- Ready for independent versioning and publishing