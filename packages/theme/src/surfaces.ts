import { rawSolidTokens, type RawSolidTokenName } from "@functions-oneui/tokens";

import {
  createOneuiGradients,
  oneuiDarkGradients,
  oneuiLightGradients,
  type OneUIGradientName,
  type OneUIResolvableGradientName,
  type OneUIGradients
} from "./gradients.js";
import {
  createOneuiTheme,
  oneuiDarkTheme,
  oneuiLightTheme,
  type OneUIFluentTheme
} from "./theme.js";

export const oneuiSurfaceRoleNames = [
  "gradientCyanGreen",
  "gradientNavyCyan",
  "gradientCyanLightBlue",
  "gradientCyanYellow",
  "gradientCyanPink",
  "navy",
  "cyan",
  "lightBlue",
  "iconPrimary",
  "iconSecondary",
  "accentStrong",
  "accentSoft",
  "featuredCard",
  "ctaPrimary",
  "panelSpotlight",
  "decorativeSurface"
] as const;

export type OneUISurfaceRoleName = (typeof oneuiSurfaceRoleNames)[number];
export type OneUISurfaceVariantKey = OneUISurfaceRoleName;
export const oneuiSurfaceVariantKeys = oneuiSurfaceRoleNames;

export const oneuiLegacySurfaceVariantKeys = [
  "navyCyan",
  "cyanGreen",
  "cyanYellow",
  "cyanLightBlue",
  "cyanPink",
  "heroPrimary",
  "heroSecondary",
  "heroSoft",
  "heroFresh",
  "heroDeep",
  "heroBlue",
  "heroLight",
  "heroPastel",
  "primary",
  "secondary",
  "deepSpectrum",
  "midnightBlue"
] as const;

export type OneUILegacySurfaceVariantKey =
  (typeof oneuiLegacySurfaceVariantKeys)[number];
export type OneUIResolvableSurfaceVariantKey =
  | OneUISurfaceVariantKey
  | OneUILegacySurfaceVariantKey;
export const oneuiSurfaceKinds = ["gradient", "solid"] as const;
export type OneUISurfaceKind = (typeof oneuiSurfaceKinds)[number];
export type OneUISurfaceTextTone = "default" | "inverse" | "brand";
export type OneUISurfaceCategory =
  | "banner"
  | "icon"
  | "accent"
  | "card"
  | "cta"
  | "panel"
  | "decorative";

export type OneUISurfaceBackgroundStyle = {
  backgroundColor: string;
  backgroundImage?: string;
};

export type OneUISurfaceRecipe = {
  key: OneUISurfaceRoleName;
  label: string;
  type: OneUISurfaceKind;
  category: OneUISurfaceCategory;
  group: string;
  description: string;
  rawGradientName?: OneUIGradientName;
  rawSolidName?: RawSolidTokenName;
  background: OneUISurfaceBackgroundStyle;
  fallbackBackground: string;
  recommendedForeground: OneUISurfaceTextTone;
  borderColor?: string;
  hoverBackground?: OneUISurfaceBackgroundStyle;
  activeBackground?: OneUISurfaceBackgroundStyle;
  textToneGuidance?: string;
  overlayGuidance?: string;
};

export type OneUISurfaceRecipes = Record<OneUISurfaceRoleName, OneUISurfaceRecipe>;

export type OneUISurfacePreview = {
  backgroundColor: string;
  backgroundImage?: string;
  borderColor?: string;
  foregroundColor: string;
  cssText: string;
};

export type OneUISurfaceVariantRegistryEntry = {
  key: OneUIResolvableSurfaceVariantKey;
  label: string;
  type: OneUISurfaceKind;
  category: OneUISurfaceCategory;
  group: string;
  sortOrder: number;
  surfaceRole: OneUISurfaceRoleName;
  description: string;
  fallbackColor: string;
  preview: OneUISurfacePreview;
  hiddenFromSelections: boolean;
  deprecated?: {
    replacementKey: OneUISurfaceVariantKey;
    reason: string;
  };
  textToneGuidance?: string;
  overlayGuidance?: string;
};

export type OneUISurfaceVariantRegistry = Record<
  OneUIResolvableSurfaceVariantKey,
  OneUISurfaceVariantRegistryEntry
>;

export type OneUISurfacePolicy = {
  label?: string;
  allowedVariantKeys: OneUISurfaceVariantKey[];
  allowedTypes: OneUISurfaceKind[];
  defaultVariantKey: OneUISurfaceVariantKey;
};

export type OneUISurfacePolicyInput = {
  label?: string;
  allowedVariantKeys?: OneUISurfaceVariantKey[];
  allowedTypes?: OneUISurfaceKind[];
  defaultVariantKey?: OneUISurfaceVariantKey;
};

export type OneUISurfacePolicyMap<TPolicyName extends string = string> = Record<
  TPolicyName,
  OneUISurfacePolicy
>;

export type ResolveOneUISurfaceVariantOptions = {
  mode?: string;
  policy?: OneUISurfacePolicyInput | OneUISurfacePolicy;
  theme?: Partial<OneUIFluentTheme>;
};

export type OneUISurfaceResolution = {
  requestedKey?: string;
  requestedKeyWasMissing: boolean;
  resolvedKey: OneUISurfaceVariantKey;
  resolvedEntry: OneUISurfaceVariantRegistryEntry;
  recipe: OneUISurfaceRecipe;
  isDeprecatedSelection: boolean;
  policy?: OneUISurfacePolicy;
};

export type OneUISurfacePropertyPaneOption = {
  key: string;
  text: string;
  surfaceRole: OneUISurfaceRoleName;
  type: OneUISurfaceKind;
  group: string;
  description: string;
  preview: OneUISurfacePreview;
  hiddenFromSelections: boolean;
  deprecated: boolean;
  replacementKey?: OneUISurfaceVariantKey;
};

const normalizeMode = (mode: string | undefined): "light" | "dark" => {
  return mode === "dark" ? "dark" : "light";
};

const cloneSurfaceVariantKeys = (
  variantKeys: readonly OneUISurfaceVariantKey[]
): OneUISurfaceVariantKey[] => {
  return [...variantKeys];
};

const cloneSurfaceKinds = (
  kinds: readonly OneUISurfaceKind[]
): OneUISurfaceKind[] => {
  return [...kinds];
};

const getThemeValue = (
  theme: OneUIFluentTheme,
  key: string,
  fallback = ""
): string => {
  const value = theme[key];
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return fallback;
};

const createGradientBackground = (
  gradients: OneUIGradients,
  gradientName: OneUIResolvableGradientName
): OneUISurfaceBackgroundStyle => {
  const gradient = gradients[gradientName];

  return {
    backgroundColor: gradient.fallbackSolidColor,
    backgroundImage: gradient.css
  };
};

const createSolidBackground = (
  solidName: RawSolidTokenName
): OneUISurfaceBackgroundStyle => {
  const solid = rawSolidTokens[solidName];

  return {
    backgroundColor: solid.value
  };
};

const resolveForegroundColor = (
  theme: OneUIFluentTheme,
  tone: OneUISurfaceTextTone
): string => {
  if (tone === "inverse") {
    return getThemeValue(
      theme,
      "colorNeutralForegroundInverted",
      getThemeValue(theme, "colorNeutralForegroundOnBrand", "#ffffff")
    );
  }

  if (tone === "brand") {
    return getThemeValue(
      theme,
      "colorBrandForeground1",
      getThemeValue(theme, "colorNeutralForeground1", "#1a1a1a")
    );
  }

  return getThemeValue(theme, "colorNeutralForeground1", "#1a1a1a");
};

const createPreview = (
  theme: OneUIFluentTheme,
  recipe: OneUISurfaceRecipe
): OneUISurfacePreview => {
  const foregroundColor = resolveForegroundColor(theme, recipe.recommendedForeground);
  const declarations = [
    `background-color: ${recipe.background.backgroundColor}`,
    recipe.background.backgroundImage
      ? `background-image: ${recipe.background.backgroundImage}`
      : undefined,
    recipe.borderColor ? `border: 1px solid ${recipe.borderColor}` : undefined,
    `color: ${foregroundColor}`
  ].filter(Boolean);

  return {
    backgroundColor: recipe.background.backgroundColor,
    backgroundImage: recipe.background.backgroundImage,
    borderColor: recipe.borderColor,
    foregroundColor,
    cssText: declarations.join("; ")
  };
};

const createSurfaceRecipes = (
  theme: OneUIFluentTheme,
  gradients: OneUIGradients
): OneUISurfaceRecipes => {
  return {
    gradientCyanGreen: {
      key: "gradientCyanGreen",
      label: "Cyan-Green",
      type: "gradient",
      category: "banner",
      group: "Brand gradients",
      description: "Primary branded cyan-green gradient for banners, headers, and featured surfaces.",
      rawGradientName: "gradientCyanGreen",
      background: createGradientBackground(gradients, "gradientCyanGreen"),
      fallbackBackground: gradients.gradientCyanGreen.fallbackSolidColor,
      recommendedForeground: "inverse",
      textToneGuidance: "Use inverse text and controls for maximum contrast.",
      overlayGuidance: "Optional neutral or alpha overlays can be used behind dense widgets."
    },
    gradientNavyCyan: {
      key: "gradientNavyCyan",
      label: "Navy-Cyan",
      type: "gradient",
      category: "banner",
      group: "Brand gradients",
      description: "Dark navy-to-cyan gradient for deeper branded headers and spotlight panels.",
      rawGradientName: "gradientNavyCyan",
      background: createGradientBackground(gradients, "gradientNavyCyan"),
      fallbackBackground: gradients.gradientNavyCyan.fallbackSolidColor,
      recommendedForeground: "inverse",
      textToneGuidance: "Pair with inverse content and low-noise overlays only."
    },
    gradientCyanLightBlue: {
      key: "gradientCyanLightBlue",
      label: "Cyan-LightBlue",
      type: "gradient",
      category: "banner",
      group: "Brand gradients",
      description: "Light cyan-to-blue gradient for softer banners and supporting branded surfaces.",
      rawGradientName: "gradientCyanLightBlue",
      background: createGradientBackground(gradients, "gradientCyanLightBlue"),
      fallbackBackground: gradients.gradientCyanLightBlue.fallbackSolidColor,
      recommendedForeground: "default",
      borderColor: getThemeValue(theme, "colorNeutralStroke1"),
      textToneGuidance: "Prefer default foregrounds and avoid stacked dark overlays."
    },
    gradientCyanYellow: {
      key: "gradientCyanYellow",
      label: "Cyan-Yellow",
      type: "gradient",
      category: "banner",
      group: "Brand gradients",
      description: "Bright cyan-to-yellow gradient for search, discovery, and optimistic feature areas.",
      rawGradientName: "gradientCyanYellow",
      background: createGradientBackground(gradients, "gradientCyanYellow"),
      fallbackBackground: gradients.gradientCyanYellow.fallbackSolidColor,
      recommendedForeground: "default",
      borderColor: getThemeValue(theme, "colorNeutralStroke1"),
      textToneGuidance: "Use default or branded text rather than inverse UI."
    },
    navy: {
      key: "navy",
      label: "Navy",
      type: "solid",
      category: "banner",
      group: "Brand solids",
      description: "Solid navy branded surface for banners, headers, and low-motion alternatives.",
      rawSolidName: "navy",
      background: createSolidBackground("navy"),
      fallbackBackground: rawSolidTokens.navy.value,
      recommendedForeground: "inverse",
      textToneGuidance: "Use inverse text and preserve strong focus contrast."
    },
    cyan: {
      key: "cyan",
      label: "Cyan",
      type: "solid",
      category: "banner",
      group: "Brand solids",
      description: "Solid cyan branded surface for straightforward page headers and banner shells.",
      rawSolidName: "cyan",
      background: createSolidBackground("cyan"),
      fallbackBackground: rawSolidTokens.cyan.value,
      recommendedForeground: "inverse",
      textToneGuidance: "Use inverse text or controls to preserve contrast on the core brand blue."
    },
    lightBlue: {
      key: "lightBlue",
      label: "Light Blue",
      type: "solid",
      category: "banner",
      group: "Brand solids",
      description: "Light blue branded surface for gentle page headers and lighter UI treatments.",
      rawSolidName: "lightBlue",
      background: createSolidBackground("lightBlue"),
      fallbackBackground: rawSolidTokens.lightBlue.value,
      recommendedForeground: "default",
      borderColor: getThemeValue(theme, "colorNeutralStroke1"),
      textToneGuidance: "Prefer default foreground tones and quiet supporting chrome."
    },
    gradientCyanPink: {
      key: "gradientCyanPink",
      label: "Cyan-Pink",
      type: "gradient",
      category: "banner",
      group: "Brand gradients",
      description: "Pastel cyan-to-pink gradient for softer editorial and people-focused moments.",
      rawGradientName: "gradientCyanPink",
      background: createGradientBackground(gradients, "gradientCyanPink"),
      fallbackBackground: gradients.gradientCyanPink.fallbackSolidColor,
      recommendedForeground: "default",
      borderColor: getThemeValue(theme, "colorNeutralStroke1"),
      textToneGuidance: "Keep copy dark and reduce decorative overlays."
    },
    iconPrimary: {
      key: "iconPrimary",
      label: "Icon Primary",
      type: "gradient",
      category: "icon",
      group: "Compact Surfaces",
      description: "Primary compact gradient for icon containers and small branded indicators.",
      rawGradientName: "gradientCyanGreen",
      background: createGradientBackground(gradients, "gradientCyanGreen"),
      fallbackBackground: gradients.gradientCyanGreen.fallbackSolidColor,
      recommendedForeground: "inverse"
    },
    iconSecondary: {
      key: "iconSecondary",
      label: "Icon Secondary",
      type: "gradient",
      category: "icon",
      group: "Compact Surfaces",
      description: "Alternative compact gradient for lighter icon plates and metric callouts.",
      rawGradientName: "gradientCyanLightBlue",
      background: createGradientBackground(gradients, "gradientCyanLightBlue"),
      fallbackBackground: gradients.gradientCyanLightBlue.fallbackSolidColor,
      recommendedForeground: "inverse"
    },
    accentStrong: {
      key: "accentStrong",
      label: "Accent Strong",
      type: "solid",
      category: "accent",
      group: "Accent",
      description: "Solid high-emphasis branded surface for badges, strips, and highlight rails.",
      rawSolidName: "brandBlue",
      background: createSolidBackground("brandBlue"),
      fallbackBackground: rawSolidTokens.brandBlue.value,
      recommendedForeground: "inverse",
      hoverBackground: {
        backgroundColor: getThemeValue(
          theme,
          "colorBrandBackgroundHover",
          rawSolidTokens.brandSky.value
        )
      },
      activeBackground: {
        backgroundColor: getThemeValue(
          theme,
          "colorBrandBackgroundPressed",
          rawSolidTokens.brandMidnight.value
        )
      }
    },
    accentSoft: {
      key: "accentSoft",
      label: "Accent Soft",
      type: "solid",
      category: "accent",
      group: "Accent",
      description: "Low-intensity branded surface for chips, supporting highlights, and quiet emphasis.",
      rawSolidName: "brandAqua",
      background: createSolidBackground("brandAqua"),
      fallbackBackground: rawSolidTokens.brandAqua.value,
      recommendedForeground: "default",
      borderColor: getThemeValue(theme, "colorNeutralStroke1")
    },
    featuredCard: {
      key: "featuredCard",
      label: "Featured Card",
      type: "gradient",
      category: "card",
      group: "Reusable Components",
      description: "Featured card surface that reuses the lighter branded family without changing card structure.",
      rawGradientName: "gradientCyanYellow",
      background: createGradientBackground(gradients, "gradientCyanYellow"),
      fallbackBackground: gradients.gradientCyanYellow.fallbackSolidColor,
      recommendedForeground: "default",
      borderColor: getThemeValue(theme, "colorNeutralStroke1")
    },
    ctaPrimary: {
      key: "ctaPrimary",
      label: "CTA Primary",
      type: "solid",
      category: "cta",
      group: "Reusable Components",
      description: "Primary solid CTA surface for selective branded buttons and prominent callouts.",
      rawSolidName: "brandBlue",
      background: {
        backgroundColor: getThemeValue(
          theme,
          "colorBrandBackground",
          rawSolidTokens.brandBlue.value
        )
      },
      fallbackBackground: getThemeValue(
        theme,
        "colorBrandBackground",
        rawSolidTokens.brandBlue.value
      ),
      recommendedForeground: "inverse",
      borderColor: getThemeValue(
        theme,
        "colorBrandBackground",
        rawSolidTokens.brandBlue.value
      ),
      hoverBackground: {
        backgroundColor: getThemeValue(
          theme,
          "colorBrandBackgroundHover",
          rawSolidTokens.brandSky.value
        )
      },
      activeBackground: {
        backgroundColor: getThemeValue(
          theme,
          "colorBrandBackgroundPressed",
          rawSolidTokens.brandMidnight.value
        )
      }
    },
    panelSpotlight: {
      key: "panelSpotlight",
      label: "Panel Spotlight",
      type: "gradient",
      category: "panel",
      group: "Reusable Components",
      description: "Compact gradient panel for spotlight modules, KPI overlays, and featured side content.",
      rawGradientName: "gradientNavyCyan",
      background: createGradientBackground(gradients, "gradientNavyCyan"),
      fallbackBackground: gradients.gradientNavyCyan.fallbackSolidColor,
      recommendedForeground: "inverse"
    },
    decorativeSurface: {
      key: "decorativeSurface",
      label: "Decorative Surface",
      type: "gradient",
      category: "decorative",
      group: "Reusable Components",
      description: "Controlled decorative branded surface for visual support, not for default content backgrounds.",
      rawGradientName: "gradientCyanPink",
      background: createGradientBackground(gradients, "gradientCyanPink"),
      fallbackBackground: gradients.gradientCyanPink.fallbackSolidColor,
      recommendedForeground: "default",
      borderColor: getThemeValue(theme, "colorNeutralStroke1"),
      textToneGuidance: "Reserve for decorative or low-density supporting surfaces."
    }
  };
};

const oneuiSurfaceLegacyAliasMap: Record<
  OneUILegacySurfaceVariantKey,
  {
    replacementKey: OneUISurfaceVariantKey;
    reason: string;
  }
> = {
  navyCyan: {
    replacementKey: "gradientNavyCyan",
    reason: "Legacy shorthand is deprecated in favor of the canonical brand key."
  },
  cyanGreen: {
    replacementKey: "gradientCyanGreen",
    reason: "Legacy shorthand is deprecated in favor of the canonical brand key."
  },
  cyanYellow: {
    replacementKey: "gradientCyanYellow",
    reason: "Legacy shorthand is deprecated in favor of the canonical brand key."
  },
  cyanLightBlue: {
    replacementKey: "gradientCyanLightBlue",
    reason: "Legacy shorthand is deprecated in favor of the canonical brand key."
  },
  cyanPink: {
    replacementKey: "gradientCyanPink",
    reason: "Legacy shorthand is deprecated in favor of the canonical brand key."
  },
  heroPrimary: {
    replacementKey: "gradientCyanGreen",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand gradient keys."
  },
  heroSecondary: {
    replacementKey: "gradientNavyCyan",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand gradient keys."
  },
  heroSoft: {
    replacementKey: "gradientCyanLightBlue",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand gradient keys."
  },
  heroFresh: {
    replacementKey: "gradientCyanYellow",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand gradient keys."
  },
  heroDeep: {
    replacementKey: "navy",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand solid keys."
  },
  heroBlue: {
    replacementKey: "cyan",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand solid keys."
  },
  heroLight: {
    replacementKey: "lightBlue",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand solid keys."
  },
  heroPastel: {
    replacementKey: "gradientCyanPink",
    reason: "Hero-prefixed keys are deprecated in favor of the canonical brand gradient keys."
  },
  primary: {
    replacementKey: "gradientCyanGreen",
    reason: "Legacy phase-1 banner enum preserved for existing web-part instances."
  },
  secondary: {
    replacementKey: "gradientNavyCyan",
    reason: "Legacy phase-1 banner enum preserved for existing web-part instances."
  },
  deepSpectrum: {
    replacementKey: "gradientCyanGreen",
    reason: "Raw gradient names are deprecated in favor of semantic surface keys."
  },
  midnightBlue: {
    replacementKey: "gradientNavyCyan",
    reason: "Raw gradient names are deprecated in favor of semantic surface keys."
  }
};

export const defineOneUISurfacePolicy = (
  policy: OneUISurfacePolicyInput = {}
): OneUISurfacePolicy => {
  const defaultVariantKey = policy.defaultVariantKey ?? "gradientCyanGreen";
  const allowedVariantKeys =
    policy.allowedVariantKeys && policy.allowedVariantKeys.length > 0
      ? cloneSurfaceVariantKeys(policy.allowedVariantKeys)
      : cloneSurfaceVariantKeys(oneuiSurfaceVariantKeys);
  const allowedTypes =
    policy.allowedTypes && policy.allowedTypes.length > 0
      ? cloneSurfaceKinds(policy.allowedTypes)
      : cloneSurfaceKinds(oneuiSurfaceKinds);

  if (!allowedVariantKeys.includes(defaultVariantKey)) {
    allowedVariantKeys.unshift(defaultVariantKey);
  }

  return {
    label: policy.label,
    allowedVariantKeys,
    allowedTypes,
    defaultVariantKey
  };
};

export const defineOneUISurfacePolicyMap = <
  TPolicyName extends string
>(
  policies: Record<TPolicyName, OneUISurfacePolicyInput>
): OneUISurfacePolicyMap<TPolicyName> => {
  return Object.fromEntries(
    (Object.entries(policies) as Array<[TPolicyName, OneUISurfacePolicyInput]>).map(
      ([policyName, policy]) => {
        return [policyName, defineOneUISurfacePolicy(policy)];
      }
    )
  ) as OneUISurfacePolicyMap<TPolicyName>;
};

export const oneuiDefaultSurfacePolicy = defineOneUISurfacePolicy({
  label: "All OneUI surfaces",
  allowedVariantKeys: cloneSurfaceVariantKeys(oneuiSurfaceVariantKeys),
  allowedTypes: cloneSurfaceKinds(oneuiSurfaceKinds),
  defaultVariantKey: "gradientCyanGreen"
});

const createSurfaceRegistry = (
  theme: OneUIFluentTheme,
  recipes: OneUISurfaceRecipes
): OneUISurfaceVariantRegistry => {
  const currentEntries = Object.fromEntries(
    oneuiSurfaceVariantKeys.map((key, index) => {
      const recipe = recipes[key];
      const entry: OneUISurfaceVariantRegistryEntry = {
        key,
        label: recipe.label,
        type: recipe.type,
        category: recipe.category,
        group: recipe.group,
        sortOrder: index + 1,
        surfaceRole: recipe.key,
        description: recipe.description,
        fallbackColor: recipe.fallbackBackground,
        preview: createPreview(theme, recipe),
        hiddenFromSelections: false,
        textToneGuidance: recipe.textToneGuidance,
        overlayGuidance: recipe.overlayGuidance
      };

      return [key, entry];
    })
  ) as Record<OneUISurfaceVariantKey, OneUISurfaceVariantRegistryEntry>;

  const legacyEntries = Object.fromEntries(
    oneuiLegacySurfaceVariantKeys.map((legacyKey, index) => {
      const alias = oneuiSurfaceLegacyAliasMap[legacyKey];
      const recipe = recipes[alias.replacementKey];
      const entry: OneUISurfaceVariantRegistryEntry = {
        key: legacyKey,
        label: currentEntries[alias.replacementKey].label,
        type: recipe.type,
        category: recipe.category,
        group: recipe.group,
        sortOrder: 1000 + index,
        surfaceRole: alias.replacementKey,
        description: recipe.description,
        fallbackColor: recipe.fallbackBackground,
        preview: createPreview(theme, recipe),
        hiddenFromSelections: true,
        deprecated: {
          replacementKey: alias.replacementKey,
          reason: alias.reason
        },
        textToneGuidance: recipe.textToneGuidance,
        overlayGuidance: recipe.overlayGuidance
      };

      return [legacyKey, entry];
    })
  ) as Record<OneUILegacySurfaceVariantKey, OneUISurfaceVariantRegistryEntry>;

  return {
    ...currentEntries,
    ...legacyEntries
  };
};

const createResolvedSurfaceSystem = (options: ResolveOneUISurfaceVariantOptions = {}) => {
  const mode = normalizeMode(options.mode);
  const theme = createOneuiTheme({
    mode,
    fluentTheme: options.theme
  });
  const gradients = createOneuiGradients(mode);
  const recipes = createSurfaceRecipes(theme, gradients);
  const registry = createSurfaceRegistry(theme, recipes);

  return {
    gradients,
    mode,
    recipes,
    registry,
    theme
  };
};

const isCurrentVariantKey = (
  key: string | undefined
): key is OneUISurfaceVariantKey => {
  return Boolean(key && oneuiSurfaceVariantKeys.includes(key as OneUISurfaceVariantKey));
};

const isLegacyVariantKey = (
  key: string | undefined
): key is OneUILegacySurfaceVariantKey => {
  return Boolean(
    key && oneuiLegacySurfaceVariantKeys.includes(key as OneUILegacySurfaceVariantKey)
  );
};

const resolveOneUISurfacePolicy = (
  policy?: OneUISurfacePolicyInput | OneUISurfacePolicy
): OneUISurfacePolicy => {
  return defineOneUISurfacePolicy(policy);
};

export const resolveOneUISurfaceVariantKey = (
  requestedKey?: string,
  policy?: OneUISurfacePolicyInput | OneUISurfacePolicy
): OneUISurfaceVariantKey => {
  if (isCurrentVariantKey(requestedKey)) {
    return requestedKey;
  }

  if (isLegacyVariantKey(requestedKey)) {
    return oneuiSurfaceLegacyAliasMap[requestedKey].replacementKey;
  }

  return resolveOneUISurfacePolicy(policy).defaultVariantKey;
};

export const oneuiLightSurfaceRecipes = createSurfaceRecipes(
  oneuiLightTheme,
  oneuiLightGradients
);
export const oneuiDarkSurfaceRecipes = createSurfaceRecipes(
  oneuiDarkTheme,
  oneuiDarkGradients
);

export const createOneUISurfaceRecipes = (
  options: ResolveOneUISurfaceVariantOptions = {}
): OneUISurfaceRecipes => {
  if (!options.theme && normalizeMode(options.mode) === "dark") {
    return oneuiDarkSurfaceRecipes;
  }

  if (!options.theme && normalizeMode(options.mode) === "light") {
    return oneuiLightSurfaceRecipes;
  }

  return createResolvedSurfaceSystem(options).recipes;
};

export const oneuiLightSurfaceVariantRegistry = createSurfaceRegistry(
  oneuiLightTheme,
  oneuiLightSurfaceRecipes
);
export const oneuiDarkSurfaceVariantRegistry = createSurfaceRegistry(
  oneuiDarkTheme,
  oneuiDarkSurfaceRecipes
);

export const createOneUISurfaceVariantRegistry = (
  options: ResolveOneUISurfaceVariantOptions = {}
): OneUISurfaceVariantRegistry => {
  if (!options.theme && normalizeMode(options.mode) === "dark") {
    return oneuiDarkSurfaceVariantRegistry;
  }

  if (!options.theme && normalizeMode(options.mode) === "light") {
    return oneuiLightSurfaceVariantRegistry;
  }

  return createResolvedSurfaceSystem(options).registry;
};

export const getOneUIDefaultSurfaceVariantKey = (
  policy?: OneUISurfacePolicyInput | OneUISurfacePolicy
): OneUISurfaceVariantKey => {
  return resolveOneUISurfacePolicy(policy).defaultVariantKey;
};

export const getAllOneUISurfaceVariants = (
  options: ResolveOneUISurfaceVariantOptions & {
    includeDeprecated?: boolean;
  } = {}
): OneUISurfaceVariantRegistryEntry[] => {
  const registry = createOneUISurfaceVariantRegistry(options);

  return Object.values(registry)
    .filter((entry) => options.includeDeprecated || !entry.deprecated)
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

export const getAllowedOneUISurfaceVariants = (
  policy?: OneUISurfacePolicyInput | OneUISurfacePolicy,
  options: ResolveOneUISurfaceVariantOptions = {}
): OneUISurfaceVariantRegistryEntry[] => {
  const resolvedPolicy = resolveOneUISurfacePolicy(policy);
  const registry = createOneUISurfaceVariantRegistry(options);

  return resolvedPolicy.allowedVariantKeys
    .map((key) => registry[key])
    .filter((entry) => resolvedPolicy.allowedTypes.includes(entry.type))
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

export const resolveOneUISurfaceVariant = (
  requestedKey: string | undefined,
  options: ResolveOneUISurfaceVariantOptions = {}
): OneUISurfaceResolution => {
  const policy = options.policy
    ? resolveOneUISurfacePolicy(options.policy)
    : undefined;
  const resolvedKey = resolveOneUISurfaceVariantKey(requestedKey, options.policy);
  const registry = createOneUISurfaceVariantRegistry(options);
  const recipes = createOneUISurfaceRecipes(options);
  const resolvedEntry = registry[requestedKey as OneUIResolvableSurfaceVariantKey] ?? registry[resolvedKey];

  return {
    requestedKey,
    requestedKeyWasMissing: !requestedKey,
    resolvedKey,
    resolvedEntry,
    recipe: recipes[resolvedKey],
    isDeprecatedSelection: Boolean(resolvedEntry.deprecated),
    policy
  };
};

export const resolveOneUISurfaceStyle = (
  requestedKey: string | undefined,
  options: ResolveOneUISurfaceVariantOptions = {}
): OneUISurfaceBackgroundStyle & {
  borderColor?: string;
  color: string;
} => {
  const { recipe } = resolveOneUISurfaceVariant(requestedKey, options);
  const { theme } = createResolvedSurfaceSystem(options);

  return {
    ...recipe.background,
    borderColor: recipe.borderColor,
    color: resolveForegroundColor(theme, recipe.recommendedForeground)
  };
};

export const createOneUISurfacePropertyPaneOptions = (
  policy?: OneUISurfacePolicyInput | OneUISurfacePolicy,
  options: ResolveOneUISurfaceVariantOptions & {
    selectedKey?: string;
  } = {}
): OneUISurfacePropertyPaneOption[] => {
  const entries = getAllowedOneUISurfaceVariants(policy, options).map((entry) => ({
    key: entry.key,
    text: entry.label,
    surfaceRole: entry.surfaceRole,
    type: entry.type,
    group: entry.group,
    description: entry.description,
    preview: entry.preview,
    hiddenFromSelections: entry.hiddenFromSelections,
    deprecated: Boolean(entry.deprecated),
    replacementKey: entry.deprecated?.replacementKey
  }));

  const selectedKey = options.selectedKey;
  if (!selectedKey || entries.some((entry) => entry.key === selectedKey)) {
    return entries;
  }

  const resolved = resolveOneUISurfaceVariant(selectedKey, {
    mode: options.mode,
    policy,
    theme: options.theme
  });

  if (!resolved.isDeprecatedSelection) {
    return entries;
  }

  return [
    ...entries,
    {
      key: selectedKey,
      text: `${resolved.resolvedEntry.label} (Legacy)`,
      surfaceRole: resolved.recipe.key,
      type: resolved.recipe.type,
      group: resolved.recipe.group,
      description: resolved.resolvedEntry.deprecated?.reason ?? resolved.recipe.description,
      preview: resolved.resolvedEntry.preview,
      hiddenFromSelections: true,
      deprecated: true,
      replacementKey: resolved.resolvedKey
    }
  ];
};
