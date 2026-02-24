# @functions-oneui/tokens

Semantic design tokens for OneUI. This package defines stable token names for themes and components so consumers depend on meaning (`text.primary`, `background.surface`) instead of raw color or size constants.

## Purpose

- Provide a semantic token contract shared across the design system
- Supply light and dark token values under the same semantic keys
- Act as the foundation layer for `@functions-oneui/theme`, atoms, and organisms

## Token Categories

The semantic contract includes these required categories:

- `color`
- `typography`
- `spacing`
- `radius`
- `shadows`
- `breakpoints`

## Public API

- `semanticTokens`: `{ light, dark }` semantic token sets
- `lightThemeTokens`: semantic tokens for light mode
- `darkThemeTokens`: semantic tokens for dark mode
- `tokenCategories`: required top-level semantic categories
- `requiredSemanticTokenPaths`: explicit required semantic keys per category
- `semanticTokenContract`: explicit semantic token contract shape

## Consumption Guidance

- Theme package usage: map semantic tokens into Fluent UI v9 theme slots
- Component package usage: consume semantic names from theme output, not raw token internals
- Avoid importing private internals (raw palette or helper files); only use exports from `src/index.ts`

## Validation

Contract checks run via:

- `pnpm --filter @functions-oneui/tokens test`

The tests verify required semantic keys exist for both `light` and `dark` token sets.
