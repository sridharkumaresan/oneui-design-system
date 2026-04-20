# Surface System

## Why Semantic Keys Exist

Persist semantic surface keys such as `heroPrimary` or `heroDeep`, not raw CSS gradients or hex values.

That rule gives us:

- stable saved webpart data even when brand colors change later
- one central place to remap raw gradient families or solid values
- consistent banner and component behavior across HeroBanner, existing SPFx webparts, and future reusable surfaces
- a safe path to deprecate old variants without breaking existing page instances

Saved data should contain only the selected semantic key.

## Layering

The surface system is intentionally split into three layers:

1. `@functions-oneui/tokens`
   - owns raw gradient primitives and raw solid primitives as structured data
   - examples: `rawGradientTokens.gradientCyanGreen`, `rawSolidTokens.navy`
2. `@functions-oneui/theme`
   - maps those primitives into semantic reusable surface recipes
   - examples: `heroPrimary`, `heroSoft`, `iconPrimary`, `ctaPrimary`
3. shared registry and policy helpers in `@functions-oneui/theme`
   - registry metadata for labels, categories, preview swatches, deprecation state, and text-tone guidance
   - page/webpart policies for allowlists and defaults
   - resolver and property-pane helpers for consumers

Do not introduce page-specific gradients directly in components or webparts.

## Raw To Semantic Mapping

Raw primitives remain design-oriented.

Examples:

- raw gradient `gradientCyanGreen` powers semantic roles such as `heroPrimary` and `iconPrimary`
- raw gradient `gradientNavyCyan` powers semantic roles such as `heroSecondary` and `panelSpotlight`
- raw solid `navy` powers semantic role `heroDeep`
- raw solid `brandBlue` powers semantic roles such as `accentStrong` and `ctaPrimary`

Consumers should not use those raw primitive names as their standard saved or public API.

## Semantic Surface Roles

Current reusable semantic roles include:

- banner and hero roles: `heroPrimary`, `heroSecondary`, `heroSoft`, `heroFresh`, `heroDeep`, `heroBlue`, `heroLight`, `heroPastel`
- reusable component roles: `iconPrimary`, `iconSecondary`, `accentStrong`, `accentSoft`, `featuredCard`, `ctaPrimary`, `panelSpotlight`, `decorativeSurface`

Each role resolves a surface recipe that can include:

- default background
- fallback background color
- recommended foreground tone
- optional border color
- optional hover and active backgrounds
- guidance metadata for text tone and overlays

## Consumer-Owned Policies

The design-system package should not own business page keys such as `connections-home` or `hub-site`.

Instead, each consuming app or webpart defines its own local policy names and maps them to generic OneUI policy objects.

Each policy defines:

- `allowedVariantKeys`
- `allowedTypes`
- `defaultVariantKey`

That lets each page or webpart family expose a curated subset without forking the surface system, while keeping business naming outside `@functions-oneui/theme`.

## Existing Webpart Adoption

Existing banner webparts do not need to migrate to `HeroBanner` immediately.

Low-friction adoption path:

1. define a local surface policy in the consuming app or webpart
2. replace the current solid background dropdown with `createOneUISurfacePropertyPaneOptions(policy, ...)`
3. persist only the selected semantic surface key
4. call `resolveOneUISurfaceStyle(selectedKey, { policy })`
5. apply the resolved background, fallback color, and optional border to the existing banner DOM
6. optionally use the resolved recipe metadata for text tone or overlay decisions

Recommended persistence field name:

- `bannerSurfaceKey`

Do not persist:

- raw gradient CSS strings
- raw hex values
- generated preview markup

## HeroBanner Usage

`HeroBanner` consumes the same shared semantic surface system.

Preferred usage:

```tsx
<HeroBanner
  surfaceKey="heroPrimary"
  title="Good morning, Sridhar"
  description="Welcome back"
/>
```

Use semantic `surfaceKey` values such as `heroPrimary` or `heroDeep`. Raw gradient names and raw solid names are not part of the HeroBanner public API.

`BrandedHeroBanner` remains the constrained adoption wrapper and defaults to `heroPrimary` rather than maintaining a second source of truth.

## Reuse Beyond Banners

The surface system is not banner-only.

Approved examples:

- icon containers using `iconPrimary` or `iconSecondary`
- featured tiles or cards using `featuredCard`
- utility chips using `accentSoft`
- selective CTA buttons using `ctaPrimary`
- compact spotlight panels using `panelSpotlight`
- supporting decorative surfaces using `decorativeSurface`

Do not add component APIs that accept arbitrary gradient CSS strings as the standard pattern.

## Adding New Variants

When adding a new branded surface:

1. add or refine the raw primitive in `@functions-oneui/tokens`
2. add a semantic recipe in `@functions-oneui/theme`
3. register the surface metadata in the shared registry
4. decide which consumer-owned policies, if any, should allow it
5. add Storybook coverage
6. add or update tests
7. add a changeset for the publishable packages affected

## Property Pane Integration Notes

The theme package intentionally returns generic option metadata rather than taking a hard dependency on SPFx property-pane packages.

That metadata includes:

- stable option key
- label text
- preview swatch data
- grouping metadata

Webpart teams can map that data into:

- a custom property-pane field with preview swatches
- a built-in dropdown when only text labels are needed
- future richer selection controls without rebuilding filtering logic

## SPFx Banner Picker Pattern

When an existing banner webpart needs to keep its current layout and only adopt the OneUI surface system, use the SPFx-oriented banner picker adapter from `@functions-oneui/theme`.

Recommended webpart property:

- `bannerSurfaceKey?: string`

Recommended consumer-owned policy map:

```ts
import { defineOneUISurfacePolicyMap } from "@functions-oneui/theme";

export const bannerSurfacePolicies = defineOneUISurfacePolicyMap({
  connectionsHome: {
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
  },
  searchBanner: {
    label: "Search banner",
    allowedVariantKeys: [
      "heroSoft",
      "heroFresh",
      "heroDeep",
      "heroBlue",
      "heroLight",
      "heroPastel"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "heroSoft"
  }
});
```

Recommended webpart-owned config:

- `availability: "gradientOnly" | "solidOnly" | "both"`
- `policy: bannerSurfacePolicies.connectionsHome`

Example:

```ts
import {
  defineOneUISurfacePolicy,
  buildOneUIBannerSurfacePickerOptions,
  getOneUIDefaultSurfaceVariantKey,
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

const selectedKey =
  properties.bannerSurfaceKey ?? getOneUIDefaultSurfaceVariantKey(bannerSurfacePolicy);

const style = getOneUIBannerSurfaceStyle({
  policy: bannerSurfacePolicy,
  availability: "both",
  selectedKey
});
```

The adapter returns:

- `defaultKey`
- `effectiveKey`
- `options[]` with `isDefault` and `preview`

That lets a custom property pane renderer:

- show only gradients, only solids, or both
- render square swatches from `option.preview.backgroundColor` and `option.preview.backgroundImage`
- mark the design-system or webpart default

Example custom field row:

```tsx
<button
  type="button"
  aria-pressed={selectedKey === option.key}
  className={styles.optionRow}
  onClick={() => onChange(option.key)}
>
  <span
    className={styles.swatch}
    style={{
      backgroundColor: option.preview.backgroundColor,
      backgroundImage: option.preview.backgroundImage,
      borderColor: option.preview.borderColor ?? "#d0d0d0"
    }}
  />
  <span className={styles.label}>{option.text}</span>
  {option.isDefault ? <span className={styles.badge}>Default</span> : null}
</button>
```

Recommended rule:

- do not persist `availability`
- do not persist preview CSS
- persist only `bannerSurfaceKey`

## Easy Usage Guide

Use this when wiring an existing banner webpart.

1. Define a local policy in the consumer app

```ts
const homeBannerPolicy = defineOneUISurfacePolicy({
  label: "Connections home banner",
  allowedVariantKeys: ["heroPrimary", "heroSecondary", "heroDeep", "heroBlue", "heroLight"],
  allowedTypes: ["gradient", "solid"],
  defaultVariantKey: "heroPrimary"
});
```

2. Build property pane options

```ts
const picker = buildOneUIBannerSurfacePickerOptions({
  policy: homeBannerPolicy,
  availability: "both",
  selectedKey: properties.bannerSurfaceKey
});
```

3. Save only the semantic key

```ts
properties.bannerSurfaceKey = nextSelectedKey;
```

4. Resolve styles at render time

```ts
const bannerStyle = getOneUIBannerSurfaceStyle({
  policy: homeBannerPolicy,
  availability: "both",
  selectedKey: properties.bannerSurfaceKey
});
```

If UX changes the solid blue background values later, update them in [solids.ts](/Users/sridhar/codex%20workspaces/oneui-design-system/packages/tokens/src/solids.ts):

- `navy`
- `cyan`
- `lightBlue`

5. Apply those styles to the existing banner DOM

```ts
{
  backgroundColor: bannerStyle.backgroundColor,
  backgroundImage: bannerStyle.backgroundImage,
  color: bannerStyle.color,
  borderColor: bannerStyle.borderColor
}
```
