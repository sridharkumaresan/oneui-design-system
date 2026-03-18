# @functions-oneui/theme

Fluent UI v9 compatible OneUI theme composition built from semantic tokens in `@functions-oneui/tokens`.

## Purpose

- Map semantic token names to Fluent UI theme keys
- Provide ready-to-use light and dark theme objects
- Expose canonical gradient names for branded decorative usage
- Enable safe theme customization without deep imports

## Public API

- `oneuiLightTheme`
- `oneuiDarkTheme`
- `createOneuiTheme(overrides?)`
- `oneuiLightGradients`
- `oneuiDarkGradients`
- `createOneuiGradients(mode?)`
- `useOneUIGradients()`
- `OneUIProvider`
- `oneuiThemeModes`
- `oneuiGradientNames`
- `oneuiBreakpoints`
- `createOneUIMediaQueryUp()` / `createOneUIMediaQueryDown()`
- `createOneUIContainerQueryUp()` / `createOneUIContainerQueryDown()`
- `semanticPathToThemeKeyMap`

## Basic Usage

```ts
import { FluentProvider } from "@fluentui/react-components";
import { oneuiLightTheme } from "@functions-oneui/theme";

<FluentProvider theme={oneuiLightTheme}>{/* app */}</FluentProvider>;
```

## Provider Usage

```ts
import { OneUIProvider } from "@functions-oneui/theme";

<OneUIProvider mode="dark">{/* app */}</OneUIProvider>;
```

Use `themeOverrides` to customize safely:

```ts
<OneUIProvider
  mode="light"
  themeOverrides={{
    semanticTokens: {
      color: {
        text: { primary: "var(--app-primary-text)" }
      }
    }
  }}
>
  {/* app */}
</OneUIProvider>;
```

## Gradient Usage

```ts
import { useOneUIGradients } from "@functions-oneui/theme";

function HeroSurface(): JSX.Element {
  const gradients = useOneUIGradients();
  const deepSpectrum = gradients.deepSpectrum;

  return (
    <section
      style={{
        backgroundColor: deepSpectrum.fallbackSolidColor,
        backgroundImage: deepSpectrum.css
      }}
    />
  );
}
```

Use the canonical gradients for decorative hero surfaces, icon backplates, and section accents. Do not introduce raw gradient strings directly in atoms or organisms as the default styling pattern.

## SPFx Host Bridge

Use the SPFx bridge helpers when a SharePoint host theme needs to influence compatible OneUI theme values without replacing the OneUI brand surface contract.

```ts
import {
  OneUISpfxProvider,
  createOneuiThemeFromSpfxTheme
} from "@functions-oneui/theme";
```

- `createOneuiThemeOverridesFromSpfxTheme(spfxTheme)`
  - maps a SharePoint-style palette/semantic color input into safe OneUI Fluent overrides
- `createOneuiThemeFromSpfxTheme(spfxTheme, overrides?)`
  - returns a full OneUI theme using the SPFx host theme as an override source
- `OneUISpfxProvider`
  - composes the host theme bridge into `OneUIProvider`

Recommended rule:

- let the SharePoint host theme influence compatible neutral and brand-adjacent Fluent values
- keep canonical OneUI gradients such as `deepSpectrum` and `midnightBlue` as OneUI-owned brand surfaces
- do not let arbitrary host colors replace the approved hero gradient shell

## Responsive Helpers

Use the exported breakpoint and query helpers when authoring responsive styles so component packages do not hardcode viewport values repeatedly.

## Switching Light and Dark

Switch by selecting `mode: "light" | "dark"` with `OneUIProvider`, or by passing `oneuiLightTheme` / `oneuiDarkTheme` directly to `FluentProvider`.

## Adding New Tokens Safely

1. Add semantic tokens or raw gradient primitives in `@functions-oneui/tokens` first.
2. Add Fluent mappings and expose the new gradient name in `@functions-oneui/theme`.
3. Keep gradients out of the flat Fluent theme key map.
4. Run `pnpm --filter @functions-oneui/theme test` to confirm contract coverage for light and dark.

No deep imports are required for consumers.
