# @functions-oneui/tokens

Semantic design tokens for OneUI. This package defines stable token names for themes and components so consumers depend on meaning (`text.primary`, `background.surface`) instead of raw color or size constants.

This package is Fluent-first. It keeps Fluent token categories as the baseline mental model, then layers OneUI brand primitives and semantic aliases on top.

## Purpose

- Provide a semantic token contract shared across the design system
- Supply light and dark token values under the same semantic keys
- Provide raw branded gradient definitions as structured token data
- Act as the foundation layer for `@functions-oneui/theme`, atoms, and organisms

## Token Domains

Fluent-aligned foundation categories are exported via `oneuiFluentTokenCategories`:

- `colors`
- `typography`
- `fonts`
- `spacing`
- `radii`
- `shadows`
- `borders`
- `motion`
- `sizes`

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
- `rawSolidTokens`
- `rawSolidTokenNames`
- `oneuiFluentThemeOverrides`
- `oneuiBrandColors`
- `oneuiBrandFonts`
- `oneuiFluentTypographyAliases`
- `createOneuiCssVariables()`
- `createOneuiCssVariablesStylesheet()`

Each raw gradient includes:

- `id`
- `label`
- `type`
- `direction`
- `cssDirection`
- `angle`
- `stops`
- `css`
- `fallbackSolidColor`

The branded gradients are now stored as structured definitions with semantic direction names such as `toTopRight`. The token builder generates ordered stop positions, CSS-ready directions, and the final gradient string from that input.

Important:

- `direction` is a per-variant property, not a global hardcoded rule
- the current shipped company variants all use `toTopRight` because that is what the active brand spec provided
- if one gradient changes later, update only that variant in `packages/tokens/src/gradients.ts`

Example:

```ts
gradientNavyCyan: {
  label: "Navy-Cyan",
  direction: "toBottomLeft",
  stops: ["#00AEEF", "#0095DA", "#0067B6", "#004298"]
}
```

That will generate CSS like:

```css
linear-gradient(to bottom left, ...)
```

If UX updates the branded gradient stop list later, change it in:

- `packages/tokens/src/gradients.ts`

Each raw solid includes:

- `id`
- `label`
- `type`
- `value`
- `css`
- `fallbackSolidColor`

## Public API

- `semanticTokens`: `{ light, dark }` semantic token sets
- `lightThemeTokens`: semantic tokens for light mode
- `darkThemeTokens`: semantic tokens for dark mode
- `tokenCategories`: required top-level semantic categories
- `oneuiFluentTokenCategories`: Fluent-first foundation categories
- `requiredSemanticTokenPaths`: explicit required semantic keys per category
- `semanticTokenContract`: explicit semantic token contract shape
- `oneuiBreakpoints`: canonical breakpoint values for responsive helpers
- `oneuiBrandColors`: central OneUI brand colors
- `oneuiBrandFonts`: central OneUI brand font families
- `oneuiFluentThemeOverrides`: Fluent-compatible baseline theme overrides for light and dark
- `oneuiFluentTypographyAliases`: Fluent-friendly aliases such as `caption2`, `body1`, and `body1Strong`
- `rawGradientTokens`: structured branded gradients for adapter layers
- `rawGradientTokenNames`: exported gradient names for stable referencing
- `rawSolidTokens`: structured branded solid primitives for shared surfaces
- `rawSolidTokenNames`: exported solid primitive names for stable referencing
- `createOneuiCssVariables()` / `createOneuiCssVariablesStylesheet()`: generated CSS variables from the same token source for future non-React consumers

If UX updates the three shared solid blue background options later, change them in:

- `packages/tokens/src/solids.ts`
  - `navy`
  - `cyan`
  - `lightBlue`

## Consumption Guidance

- Theme package usage: map semantic tokens into Fluent UI v9 theme slots and expose raw gradients through canonical gradient names
- Font asset usage: import `@functions-oneui/fonts/styles.css` once so the exported brand font family resolves correctly at runtime
- Component package usage: consume semantic names from theme output, not raw token internals
- Cross-platform usage: Angular, Vue, Swift, or CSS adapters should derive from the same token source or generated CSS variables instead of inventing a second design system
- Avoid importing private internals (raw palette or helper files); only use exports from the package root

## Validation

Contract checks run via:

- `pnpm --filter @functions-oneui/tokens test`

The tests verify required semantic keys exist for both `light` and `dark` token sets and verify all branded gradients expose the required structured fields.
