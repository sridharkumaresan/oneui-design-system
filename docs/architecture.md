# Architecture

## Dependency Direction

`tokens -> theme -> atoms -> organisms -> apps/webparts`

- Lower layers must not depend on higher layers.
- `tokens` has no UI-layer dependency.
- `theme` depends on `tokens` and exposes Fluent UI v9-compatible theme objects.
- Utilities (`utils`, `react-utils`, `testing`, `standards`) can be consumed across layers.

## Package Responsibilities

- `@functions-oneui/tokens`
  - Owns semantic design token contract and token values (light/dark).
  - Exposes semantic categories (color, typography, spacing, radius, shadows, breakpoints).
  - Does not expose component styling decisions.
- `@functions-oneui/theme`
  - Maps semantic tokens to Fluent UI v9 theme keys.
  - Exposes `oneuiLightTheme`, `oneuiDarkTheme`, and `createOneuiTheme`.
  - Provides provider-level theme wiring for Storybook/apps.

## Workspace Layout

- `packages/` for publishable libraries
- `apps/` for Storybook and local playgrounds
- `configs/` for shared tooling configuration
- `docs/` for contributor and architecture guidance
