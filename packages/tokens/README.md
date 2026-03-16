# @functions-oneui/tokens

Semantic design tokens for OneUI. This package defines stable token names for themes and components so consumers depend on meaning (`text.primary`, `background.surface`) instead of raw color or size constants.

## Purpose

- Provide a semantic token contract shared across the design system
- Supply light and dark token values under the same semantic keys
- Provide raw branded gradient definitions as structured token data
- Act as the foundation layer for `@functions-oneui/theme`, atoms, and organisms

## Token Domains

The semantic contract includes these required categories:

- `color`
- `typography`
- `spacing`
- `radius`
- `shadows`
- `breakpoints`

The package also exports raw gradients separately from the semantic contract:

- `rawGradientTokens`
- `rawGradientTokenNames`

Each raw gradient includes:

- `id`
- `type`
- `direction`
- `angle`
- `stops`
- `css`
- `fallbackSolidColor`

## Public API

- `semanticTokens`: `{ light, dark }` semantic token sets
- `lightThemeTokens`: semantic tokens for light mode
- `darkThemeTokens`: semantic tokens for dark mode
- `tokenCategories`: required top-level semantic categories
- `requiredSemanticTokenPaths`: explicit required semantic keys per category
- `semanticTokenContract`: explicit semantic token contract shape
- `oneuiBreakpoints`: canonical breakpoint values for responsive helpers
- `rawGradientTokens`: structured branded gradients for adapter layers
- `rawGradientTokenNames`: exported gradient names for stable referencing

## Consumption Guidance

- Theme package usage: map semantic tokens into Fluent UI v9 theme slots and raw gradients into semantic gradient roles
- Component package usage: consume semantic names from theme output, not raw token internals
- Cross-platform usage: future adapters for Angular, Vue, Swift, or CSS output should consume the same raw gradient definitions from this package
- Avoid importing private internals (raw palette or helper files); only use exports from the package root

## Validation

Contract checks run via:

- `pnpm --filter @functions-oneui/tokens test`

The tests verify required semantic keys exist for both `light` and `dark` token sets and verify all branded gradients expose the required structured fields.
