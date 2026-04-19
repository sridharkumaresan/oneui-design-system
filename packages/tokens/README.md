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
- `zIndex`

The semantic contract includes these required categories:

- `color`
- `typography`
- `spacing`
- `radius`
- `shadows`
- `motion`
- `zIndex`
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
- `@functions-oneui/tokens/styles.css`: static CSS variable and utility contract for CSS-only consumers

If UX updates the three shared solid blue background options later, change them in:

- `packages/tokens/src/solids.ts`
  - `navy`
  - `cyan`
  - `lightBlue`

## Consumption Guidance

- CSS-only usage: import `@functions-oneui/tokens/styles.css` and apply `data-oneui-theme="light"` or `data-oneui-theme="dark"` to a root element or subtree
- Theme package usage: map semantic tokens into Fluent UI v9 theme slots and expose raw gradients through canonical gradient names
- Font asset usage: import `@functions-oneui/fonts/styles.css` once so the exported brand font family resolves correctly at runtime
- Component package usage: consume semantic names from theme output, not raw token internals
- Cross-platform usage: Angular, Vue, Swift, or CSS adapters should derive from the same token source or generated CSS variables instead of inventing a second design system
- Avoid importing private internals (raw palette or helper files); only use exports from the package root

## CSS Runtime Contract

Use the static CSS assets when a consumer cannot or should not depend on React or Fluent:

```css
@import "@functions-oneui/tokens/styles.css";
```

```html
<main data-oneui-theme="dark">
  <section class="oneui-layer-surface">
    CSS-only consumers can use OneUI variables.
  </section>
</main>
```

The static CSS assets provide:

- `styles/layers.css`: cascade layer order for `oneui.reset`, `oneui.tokens`, `oneui.base`, `oneui.components`, `oneui.utilities`, and `oneui.overrides`
- `styles/variables.css`: root, light, and dark CSS custom properties
- `styles/utilities.css`: opt-in container query, dynamic viewport, fluid sizing, and surface utility classes
- `styles/index.css`: bundled import for all of the above

CSS variables use kebab-case names such as:

- `--oneui-color-background-surface`
- `--oneui-color-text-primary`
- `--oneui-motion-duration-normal`
- `--oneui-z-index-modal`

The JavaScript helper `createOneuiCssVariables()` keeps backward-compatible camelCase variable names and also emits kebab-case aliases.

## Modern CSS Guidance

- Use container queries for reusable components that must adapt to their parent width.
- Keep viewport media queries for app shells, page chrome, and broad layout changes.
- Use fluid sizing utilities only where a surface benefits from responsive rhythm; dense enterprise screens can remain static.
- Use `100dvh` utilities for full-height layouts that should behave better on mobile browser chrome, with `100vh` fallback.
- Treat `:has()` as progressive enhancement. The utility layer includes only a small optional parent-state helper.
- Keep `@scope`, anchor positioning, scroll-driven animation, and subgrid as future progressive enhancements until a concrete component need exists.

## Validation

Contract checks run via:

- `pnpm --filter @functions-oneui/tokens test`

The tests verify required semantic keys exist for both `light` and `dark` token sets and verify all branded gradients expose the required structured fields.
They also verify the CSS-only assets include theme scopes, cascade layer declarations, and the modern utility hooks.
