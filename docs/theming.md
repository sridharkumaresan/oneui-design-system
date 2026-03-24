# Theming

## Layering

The theming system now follows this flow:

`raw gradient and solid primitives + semantic tokens -> theme adapters and surface recipes -> components`

- `@functions-oneui/tokens`
  - owns semantic tokens for color, typography, spacing, radius, shadows, and breakpoints
  - owns raw branded gradient and solid surface definitions as structured data
- `@functions-oneui/theme`
  - maps semantic tokens into Fluent UI v9 theme keys
  - exposes raw gradient families plus semantic surface recipes and policy helpers
- components
  - consume Fluent theme values and semantic surface roles
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
- Keep raw surface primitives separate from the semantic token contract. Gradients and solids are design primitives, and `@functions-oneui/theme` exposes semantic surface roles for component usage.
- Use semantic surface keys such as `heroPrimary` and `panelSpotlight` in component APIs and documentation. Do not persist raw gradient names as the public contract.
- Token changes must preserve contract stability for downstream packages.

## Gradient Rules

Use semantic surface roles for:

- hero and branded banner backgrounds
- icon chips, backplates, and decorative accent containers
- section/header accent bars or low-density promotional surfaces

Avoid gradients for:

- body text backgrounds
- dense content surfaces and default card bodies
- default interactive state communication
- focus, error, success, warning, or other accessibility-critical state cues

If a component needs a branded surface variant, add semantic surface roles first. Do not reuse raw gradients ad hoc inside atoms or organisms.

## Adding Tokens Safely

1. Add or update semantic tokens in `@functions-oneui/tokens` when the change is part of the shared semantic contract.
2. Add raw gradient or solid primitives in `@functions-oneui/tokens` when the change is a brand surface primitive.
3. Update validation/tests in `@functions-oneui/tokens`.
4. Map new semantic surface roles in `@functions-oneui/theme`.
5. Update theme tests to verify coverage for light and dark.
6. Update Storybook docs/showcases to demonstrate approved usage.
7. Release with Changesets when runtime behavior changes.
