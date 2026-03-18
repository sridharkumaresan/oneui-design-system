# Theming

## Layering

The theming system now follows this flow:

`raw gradient tokens + semantic tokens -> theme adapters -> components`

- `@functions-oneui/tokens`
  - owns semantic tokens for color, typography, spacing, radius, shadows, and breakpoints
  - owns raw branded gradient definitions as structured data
- `@functions-oneui/theme`
  - maps semantic tokens into Fluent UI v9 theme keys
  - exposes the canonical gradient names for component usage
- components
  - consume Fluent theme values and canonical gradient names
  - should not assemble raw gradients inline as the default pattern

## Semantic Token Rules

- Use semantic names (`color.text.primary`, `spacing.md`) instead of raw palette references.
- Keep the required semantic categories complete:
  - `color`
  - `typography`
  - `spacing`
  - `radius`
  - `shadows`
  - `breakpoints`
- Keep gradients separate from the semantic token contract. Raw gradients are design primitives, and `@functions-oneui/theme` exposes those canonical names for component usage.
- Use canonical names such as `deepSpectrum` and `midnightBlue` in component APIs and documentation. Do not invent secondary aliases for the public contract.
- Token changes must preserve contract stability for downstream packages.

## Gradient Rules

Use the canonical gradient names for:

- hero and branded banner backgrounds
- icon chips, backplates, and decorative accent containers
- section/header accent bars or low-density promotional surfaces

Avoid gradients for:

- body text backgrounds
- dense content surfaces and default card bodies
- default interactive state communication
- focus, error, success, warning, or other accessibility-critical state cues

If a component needs a gradient variant, add component-level semantic/state tokens first. Do not reuse raw gradients ad hoc inside atoms or organisms.

## Adding Tokens Safely

1. Add or update semantic tokens in `@functions-oneui/tokens` when the change is part of the shared semantic contract.
2. Add raw gradient tokens in `@functions-oneui/tokens` when the change is a brand gradient primitive.
3. Update validation/tests in `@functions-oneui/tokens`.
4. Map new semantic keys or gradient roles in `@functions-oneui/theme`.
5. Update theme tests to verify coverage for light and dark.
6. Update Storybook docs/showcases to demonstrate approved usage.
7. Release with Changesets when runtime behavior changes.
