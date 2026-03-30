# @functions-oneui/theme

Fluent UI v9 compatible OneUI theme composition built from semantic tokens in `@functions-oneui/tokens`.

The theme architecture is Fluent-first: start from Fluent UI React v9 theme tokens, apply OneUI brand foundations and semantic aliases, and only add OneUI-specific extension keys where Fluent does not already provide the right slot.

## Purpose

- Map semantic token names to Fluent UI theme keys
- Apply centrally maintained OneUI brand colors, fonts, spacing, motion, and type decisions onto Fluent-compatible theme slots
- Provide ready-to-use light and dark theme objects
- Expose canonical gradient families and semantic reusable surface recipes
- Provide shared registry, policy, and resolver helpers for banners and branded surfaces
- Enable safe theme customization without deep imports

## Public API

- `oneuiLightTheme`
- `oneuiDarkTheme`
- `createOneuiTheme(overrides?)`
- `oneuiLightGradients`
- `oneuiDarkGradients`
- `createOneuiGradients(mode?)`
- `useOneUIGradients()`
- `oneuiLightSurfaceRecipes`
- `oneuiDarkSurfaceRecipes`
- `createOneUISurfaceRecipes(options?)`
- `defineOneUISurfacePolicy(config?)`
- `defineOneUISurfacePolicyMap(policyMap)`
- `oneuiDefaultSurfacePolicy`
- `resolveOneUISurfaceVariant(key, options?)`
- `resolveOneUISurfaceStyle(key, options?)`
- `getAllowedOneUISurfaceVariants(policy?, options?)`
- `getOneUIDefaultSurfaceVariantKey(policy?)`
- `createOneUISurfacePropertyPaneOptions(policy?, options?)`
- `buildOneUIBannerSurfacePickerOptions(config)`
- `getOneUIBannerSurfaceEffectiveKey(config)`
- `getOneUIBannerSurfaceStyle(config)`
- `OneUIProvider`
- `oneuiThemeModes`
- `oneuiGradientNames`
- `oneuiLegacyGradientNames`
- `oneuiSurfaceRoleNames`
- `oneuiBreakpoints`
- `createOneUIMediaQueryUp()` / `createOneUIMediaQueryDown()`
- `createOneUIContainerQueryUp()` / `createOneUIContainerQueryDown()`
- `semanticPathToThemeKeyMap`

For token-source exports such as brand primitives, Fluent baseline overrides, typography aliases, and CSS variable generation, consume `@functions-oneui/tokens`.
For brand font asset delivery, consume `@functions-oneui/fonts`.

## Basic Usage

```ts
import { FluentProvider } from "@fluentui/react-components";
import "@functions-oneui/fonts/styles.css";
import { oneuiLightTheme } from "@functions-oneui/theme";

<FluentProvider theme={oneuiLightTheme}>{/* app */}</FluentProvider>;
```

## Provider Usage

```ts
import "@functions-oneui/fonts/styles.css";
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
  const cyanGreen = gradients.gradientCyanGreen;

  return (
    <section
      style={{
        backgroundColor: cyanGreen.fallbackSolidColor,
        backgroundImage: cyanGreen.css
      }}
    />
  );
}
```

Use the five canonical branded gradients for decorative hero surfaces, icon backplates, and section accents. Each token now carries a semantic direction such as `toTopRight` and generates the matching CSS direction internally. Do not introduce raw gradient strings directly in atoms or organisms as the default styling pattern. The old `deepSpectrum` name is kept as a legacy alias and resolves to `gradientCyanGreen`.

Clarity note:

- the theme layer does not force `toTopRight`
- it simply exposes whatever direction the raw token variant declares
- all current company variants happen to be `toTopRight`

## Semantic Surface Usage

Use semantic surface keys for HeroBanner, SPFx property panes, and reusable branded surfaces.

```ts
import {
  defineOneUISurfacePolicy,
  createOneUISurfacePropertyPaneOptions,
  getOneUIDefaultSurfaceVariantKey,
  resolveOneUISurfaceStyle
} from "@functions-oneui/theme";

const bannerSurfacePolicy = defineOneUISurfacePolicy({
  label: "Connections home banner",
  allowedVariantKeys: [
    "heroPrimary",
    "heroSecondary",
    "heroSoft",
    "heroFresh",
    "heroDeep",
    "heroBlue",
    "heroLight",
    "heroPastel"
  ],
  allowedTypes: ["gradient", "solid"],
  defaultVariantKey: "heroPrimary"
});

const options = createOneUISurfacePropertyPaneOptions(bannerSurfacePolicy, {
  selectedKey: properties.bannerSurfaceKey
});

const selectedKey =
  properties.bannerSurfaceKey ?? getOneUIDefaultSurfaceVariantKey(bannerSurfacePolicy);

const bannerStyle = resolveOneUISurfaceStyle(selectedKey, {
  policy: bannerSurfacePolicy
});
```

Recommended rule:

- persist only semantic surface keys such as `heroPrimary`
- do not persist raw gradient CSS or raw solid values
- let the shared theme registry own labels, previews, defaults, legacy aliases, and remapping
- use `heroDeep`, `heroBlue`, and `heroLight` as the simple solid blue banner options

If UX changes the three solid blue banner colors later, update them in:

- `packages/tokens/src/solids.ts`
  - `navy`
  - `cyan`
  - `lightBlue`

## SPFx Banner Picker Adapter

Use the banner picker adapter when an existing SPFx banner should keep its current DOM but adopt the shared surface system with:

- `gradientOnly`, `solidOnly`, or `both`
- a default option marker
- preview swatches for a custom property pane field
- a render-time fallback when no selection is saved

```ts
import {
  defineOneUISurfacePolicy,
  buildOneUIBannerSurfacePickerOptions,
  getOneUIBannerSurfaceStyle
} from "@functions-oneui/theme";

const bannerSurfacePolicy = defineOneUISurfacePolicy({
  label: "Connections home banner",
  allowedVariantKeys: [
    "heroPrimary",
    "heroSecondary",
    "heroSoft",
    "heroFresh",
    "heroDeep",
    "heroBlue",
    "heroLight",
    "heroPastel"
  ],
  allowedTypes: ["gradient", "solid"],
  defaultVariantKey: "heroPrimary"
});

const picker = buildOneUIBannerSurfacePickerOptions({
  policy: bannerSurfacePolicy,
  availability: "both",
  selectedKey: properties.bannerSurfaceKey
});

const bannerStyle = getOneUIBannerSurfaceStyle({
  policy: bannerSurfacePolicy,
  availability: "both",
  selectedKey: properties.bannerSurfaceKey
});
```

Recommended rule:

- keep `availability` as a webpart-level config, not saved page data, unless authors must control it
- persist only the selected semantic key
- render the current selection even if it is hidden from new choices because it is legacy or filtered

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
- keep canonical OneUI gradients and semantic surface recipes as OneUI-owned brand surfaces
- do not let arbitrary host colors replace the approved hero gradient shell

## Fluent Alignment

Teams implementing UX specs can stay close to Fluent terminology:

- typography aliases such as `caption2`, `body1`, and `body1Strong` are maintained in `@functions-oneui/tokens`
- Fluent-compatible theme keys such as `colorNeutralForeground1`, `fontSizeBase400`, and `fontWeightSemibold` are composed into the final OneUI theme
- component-specific tuning should only introduce extra `oneui*` theme keys where Fluent does not already provide the right semantic slot

For example, the shared button font weight now flows through the theme key `oneuiButtonFontWeight`, so a UX request like “make all buttons bold” can be handled centrally in the token/theme layer and picked up by consuming components without rewriting each button style separately.

## Responsive Helpers

Use the exported breakpoint and query helpers when authoring responsive styles so component packages do not hardcode viewport values repeatedly.

## Switching Light and Dark

Switch by selecting `mode: "light" | "dark"` with `OneUIProvider`, or by passing `oneuiLightTheme` / `oneuiDarkTheme` directly to `FluentProvider`.

## Adding New Tokens Safely

1. Add semantic tokens or raw surface primitives in `@functions-oneui/tokens` first.
2. Add Fluent mappings and expose the new semantic surface recipe in `@functions-oneui/theme`.
3. Keep gradients out of the flat Fluent theme key map.
4. Run `pnpm --filter @functions-oneui/theme test` to confirm contract coverage for light and dark.

No deep imports are required for consumers.
