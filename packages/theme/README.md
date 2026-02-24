# @functions-oneui/theme

Fluent UI v9 compatible OneUI theme composition built from semantic tokens in `@functions-oneui/tokens`.

## Purpose

- Map semantic token names to Fluent UI theme keys
- Provide ready-to-use light and dark theme objects
- Enable safe theme customization without deep imports

## Public API

- `oneuiLightTheme`
- `oneuiDarkTheme`
- `createOneuiTheme(overrides?)`
- `OneUIProvider`
- `oneuiThemeModes`
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

## Switching Light and Dark

Switch by selecting `mode: "light" | "dark"` with `OneUIProvider`, or by passing `oneuiLightTheme` / `oneuiDarkTheme` directly to `FluentProvider`.

## Adding New Tokens Safely

1. Add semantic tokens and required paths in `@functions-oneui/tokens` first.
2. Add mapping entries in `semanticPathToThemeKeyMap`.
3. Ensure `createOneuiTheme` maps the new semantic path to a theme key.
4. Run `pnpm --filter @functions-oneui/theme test` to confirm contract coverage for light and dark.

No deep imports are required for consumers.
