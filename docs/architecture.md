# Architecture

## Dependency Direction

`tokens -> theme -> atoms -> organisms -> apps/webparts`

- Lower layers must not depend on higher layers.
- `tokens` has no UI-layer dependency.
- `theme` depends on `tokens` and exposes Fluent UI v9-compatible theme objects plus semantic surface recipes and raw gradient families.
- Internal utilities (`utils`, `react-utils`, `testing`, `standards`) can be consumed across layers.

## Package Responsibilities

- `@functions-oneui/tokens`
  - Owns the semantic token contract and light/dark token values.
  - Owns raw branded gradient and solid surface primitive definitions as structured data.
- `@functions-oneui/theme`
  - Maps semantic tokens to Fluent UI v9 theme objects.
  - Exposes raw gradient families plus semantic reusable surface recipes, policies, and resolvers.
  - Exports `OneUIProvider`, gradient access, and surface access for React consumers.
- `@functions-oneui/testing`
  - Provides shared accessibility helpers for Vitest + React Testing Library.
- `@functions-oneui/react-utils`
  - Hosts React-specific helpers that sit above core utilities, including the structured logging provider/hooks layer exposed from `@functions-oneui/react-utils/logging`.
- `@functions-oneui/atoms`
  - Hosts the first publishable UI layer and reference atom patterns.

## Gradient Architecture

- Raw gradients and solids belong in `tokens` because they are brand primitives shared across platforms.
- Semantic surface roles belong in `theme` because usage meaning is platform and component-facing.
- Components should consume semantic surface roles rather than importing raw gradient definitions directly.
- Future platform adapters can reuse the same raw gradient definitions without inheriting the Fluent theme shape.

## Workspace Layout

- `packages/` for publishable libraries and internal scaffolds
- `apps/` for Storybook
- `configs/` for shared tooling configuration
- `docs/` for contributor and architecture guidance

## Phase-1 Scope

- Active publishable packages: `tokens`, `theme`, `testing`, `react-utils`, `atoms`
- Active app: `storybook`
- Deferred until the base workspace passes on macOS and native Windows:
  - additional organism packages beyond the current validated set
  - mock/demo apps beyond Storybook
  - production registry publish automation beyond the local/Nexus release flow
