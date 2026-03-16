# @functions-oneui/theme

Fluent UI v9 compatible OneUI theme composition built from semantic tokens in `@functions-oneui/tokens`.

## Purpose

- Map semantic token names to Fluent UI theme keys
- Provide ready-to-use light and dark theme objects
- Expose semantic gradient roles for branded decorative usage
- Enable safe theme customization without deep imports

## Public API

- `oneuiLightTheme`
- `oneuiDarkTheme`
- `createOneuiTheme(overrides?)`
- `oneuiLightGradientRoles`
- `oneuiDarkGradientRoles`
- `createOneuiGradientRoles(mode?)`
- `useOneUIGradients()`
- `OneUIProvider`
- `oneuiThemeModes`
- `oneuiGradientRoleNames`
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
  const heroPrimary = gradients.heroPrimary;

  return (
    <section
      style={{
        backgroundColor: heroPrimary.fallbackSolidColor,
        backgroundImage: heroPrimary.css
      }}
    />
  );
}
```

Use gradient roles for decorative hero surfaces, icon backplates, and section accents. Do not introduce raw gradient strings directly in atoms or organisms as the default styling pattern.

## Responsive Helpers

Use the exported breakpoint and query helpers when authoring responsive styles so component packages do not hardcode viewport values repeatedly.

## Switching Light and Dark

Switch by selecting `mode: "light" | "dark"` with `OneUIProvider`, or by passing `oneuiLightTheme` / `oneuiDarkTheme` directly to `FluentProvider`.

## Adding New Tokens Safely

1. Add semantic tokens or raw gradient primitives in `@functions-oneui/tokens` first.
2. Add Fluent mappings or semantic gradient-role mappings in `@functions-oneui/theme`.
3. Keep gradients out of the flat Fluent theme key map.
4. Run `pnpm --filter @functions-oneui/theme test` to confirm contract coverage for light and dark.

No deep imports are required for consumers.
