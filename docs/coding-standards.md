# Coding Standards

## Token-First Styling

- Prefer token/theme values for all visual styles.
- Components should consume theme outputs, not raw token internals.
- New styling primitives must be introduced in tokens/theme before component usage.
- Branded gradients must flow through named semantic gradient roles from `@functions-oneui/theme`.

## No Hardcoded Colors

- Do not hardcode colors in components or stories.
- Color values must come from semantic tokens or Fluent theme values.
- Exception: internal token source definitions in `@functions-oneui/tokens` where semantic values are authored.

## No Arbitrary Raw Gradients

- Do not author raw CSS gradient strings directly in atoms or organisms as the default pattern.
- Approved gradient usage should reference semantic gradient roles such as `heroPrimary` or `iconAccent`.
- If a new component needs a gradient variant, extend the design contract first instead of embedding gradient literals in the component.

## Responsive Layout Rules

- Keep raw breakpoint values in the token/theme layer; do not scatter literal viewport widths through organism styles.
- Prefer shared responsive helpers from `@functions-oneui/theme` when authoring media or container queries.
- Prefer container queries for component-level layout adaptation and viewport media queries for page-level layout.

## Accessibility Alignment

- Ensure color and state styling remains compatible with focus visibility and contrast requirements.
- Theme changes that impact interaction states should be covered by tests and Storybook verification.
- Do not rely on gradients alone to communicate status, affordance, or focus.

## Script Policy

- Use direct local binaries through `pnpm run`.
- Do not rely on `corepack`, `cross-env`, inline POSIX environment assignment, or required `.sh` / `.bat` scripts in the workspace execution path.
- Missing required tooling is a failure that must be fixed, not skipped.
