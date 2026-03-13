# Architecture

## Dependency Direction

`tokens -> theme -> atoms -> organisms -> apps/webparts`

- Lower layers must not depend on higher layers.
- `tokens` has no UI-layer dependency.
- `theme` depends on `tokens` and exposes Fluent UI v9-compatible theme objects.
- Internal utilities (`utils`, `react-utils`, `testing`, `standards`) can be consumed across layers.

## Package Responsibilities

- `@functions-oneui/tokens`
  - Owns semantic token contract and token values.
- `@functions-oneui/theme`
  - Maps semantic tokens to Fluent UI v9 theme objects and exports `OneUIProvider`.
- `@functions-oneui/testing`
  - Provides shared accessibility helpers for Vitest + React Testing Library.
- `@functions-oneui/atoms`
  - Hosts the first publishable UI layer and reference atom patterns.

## Workspace Layout

- `packages/` for publishable libraries and internal scaffolds
- `apps/` for Storybook
- `configs/` for shared tooling configuration
- `docs/` for contributor and architecture guidance

## Phase-1 Scope

- Active publishable packages: `tokens`, `theme`, `testing`, `atoms`
- Active app: `storybook`
- Deferred until the base workspace passes on macOS and native Windows:
  - organism packages
  - mock/demo apps beyond Storybook
  - local publish smoke tooling
