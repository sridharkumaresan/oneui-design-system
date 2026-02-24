# Theming

## Layering

The theming system follows this flow:

`tokens -> theme -> components`

- `tokens`: semantic token contract + light/dark token values
- `theme`: maps semantic tokens into Fluent UI v9-compatible theme keys
- `components`: consume theme values (not raw token internals)

## Semantic Token Rules

- Use semantic names (`color.text.primary`, `spacing.md`) instead of raw palette references.
- Keep required semantic categories complete:
  - `color`
  - `typography`
  - `spacing`
  - `radius`
  - `shadows`
  - `breakpoints`
- Token changes must preserve contract stability for downstream packages.

## Adding Tokens Safely

1. Add/adjust semantic keys in `@functions-oneui/tokens`.
2. Update token contract validation/tests in `@functions-oneui/tokens`.
3. Map new semantic keys in `@functions-oneui/theme`.
4. Update theme tests to verify mapping coverage for light and dark.
5. Release with Changesets when runtime behavior changes.

Avoid introducing component-level assumptions directly in tokens. Keep tokens semantic and reusable.
