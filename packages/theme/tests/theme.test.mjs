import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  buildOneUIBannerSurfacePickerOptions,
  createOneUISurfacePropertyPaneOptions,
  defineOneUISurfacePolicyMap,
  createOneUISurfaceVariantRegistry,
  createOneUIContainerQueryDown,
  createOneUIContainerQueryUp,
  createOneUIMediaQueryDown,
  createOneUIMediaQueryUp,
  getOneUIBannerSurfaceEffectiveKey,
  getOneUIBannerSurfaceStyle,
  getOneUIDefaultSurfaceVariantKey,
  createOneuiGradients,
  createOneuiThemeFromSpfxTheme,
  createOneuiThemeOverridesFromSpfxTheme,
  createOneuiTheme,
  OneUIProvider,
  OneUISpfxProvider,
  oneuiDarkGradients,
  oneuiDarkSurfaceRecipes,
  oneuiDarkTheme,
  oneuiDefaultSurfacePolicy,
  oneuiFluidTypographySlots,
  oneuiGradientNames,
  oneuiLightSurfaceRecipes,
  oneuiLightGradients,
  oneuiLightTheme,
  oneuiSurfaceRoleNames,
  oneuiThemeModes,
  resolveOneUISurfaceStyle,
  resolveOneUISurfaceVariant,
  resolveOneUISurfaceVariantKey,
  semanticPathToThemeKeyMap,
  useOneUIGradients,
  useOneUISurfaces
} from "../dist/index.js";
import {
  oneuiBorderScale,
  rawGradientTokenNames,
  rawGradientTokens,
  requiredSemanticTokenPaths,
  semanticTokens
} from "../../tokens/dist/index.js";

const getByPath = (source, path) => {
  return path.split(".").reduce((value, segment) => {
    if (value && typeof value === "object" && segment in value) {
      return value[segment];
    }

    return undefined;
  }, source);
};

const cssLengthPattern =
  /^(?:0|-?\d+(?:\.\d+)?(?:px|rem|em|vh|vw|vmin|vmax|%))$/;
const cssDurationPattern = /^\d+(?:\.\d+)?(?:ms|s)$/;
const cssCurvePattern =
  /^(?:linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\([^)]+\))$/;
const cssColorPattern =
  /^(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|transparent|currentColor|var\([^)]+\)|[a-zA-Z]+)$/;

const assertCssLengthToken = (theme, key) => {
  assert.match(String(theme[key]), cssLengthPattern, `${key} must be a CSS length`);
};

const assertCssColorToken = (theme, key) => {
  const value = String(theme[key]);

  assert.match(value, cssColorPattern, `${key} must be a CSS color`);
  assert.doesNotMatch(value, /\d+\s+\d+\s+\d+/, `${key} must not be a shadow value`);
};

const assertThemeTokenShapes = (theme, label) => {
  const colorKeys = Object.keys(theme).filter((key) => {
    return (
      key.startsWith("color") ||
      key.startsWith("oneuiColorBackground") ||
      key.startsWith("oneuiColorBorder") ||
      key.startsWith("oneuiColorIcon") ||
      key.startsWith("oneuiColorInteraction") ||
      key.startsWith("oneuiColorStatus") ||
      key.startsWith("oneuiColorText")
    );
  });
  const lengthKeys = Object.keys(theme).filter((key) => {
    return (
      key.startsWith("borderRadius") ||
      key.startsWith("spacingHorizontal") ||
      key.startsWith("spacingVertical") ||
      key.startsWith("strokeWidth") ||
      key.startsWith("oneuiSize")
    );
  });

  assert.ok(colorKeys.length > 0, `${label}: expected color tokens`);
  assert.ok(lengthKeys.length > 0, `${label}: expected length tokens`);

  for (const key of colorKeys) {
    assertCssColorToken(theme, key);
  }

  for (const key of lengthKeys) {
    assertCssLengthToken(theme, key);
  }

  for (const key of ["durationNormal", "durationGentle"]) {
    assert.match(String(theme[key]), cssDurationPattern, `${label}: ${key} must be a duration`);
  }

  for (const key of ["curveEasyEase", "curveAccelerateMid"]) {
    assert.match(String(theme[key]), cssCurvePattern, `${label}: ${key} must be a timing curve`);
  }

  for (const key of ["shadow4", "shadow8", "shadow16", "shadow64", "shadowFocusRing"]) {
    assert.equal(typeof theme[key], "string", `${label}: ${key} must be a string`);
    assert.ok(theme[key].length > 0, `${label}: ${key} must not be empty`);
  }
};

const testSurfacePolicies = defineOneUISurfacePolicyMap({
  connectionsHome: {
    label: "Connections home banner",
    allowedVariantKeys: [
      "heroPrimary",
      "heroSecondary",
      "heroSoft",
      "heroFresh",
      "heroPastel",
      "heroDeep",
      "heroBlue",
      "heroLight"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "heroPrimary"
  },
  hubSiteBanner: {
    label: "Hub site banner",
    allowedVariantKeys: [
      "heroPrimary",
      "heroSecondary",
      "heroDeep",
      "heroBlue",
      "heroLight",
      "heroPastel"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "heroSecondary"
  }
});

test("exports light and dark OneUI themes", () => {
  assert.deepEqual(oneuiThemeModes, ["light", "dark"]);

  assert.equal(typeof oneuiLightTheme, "object");
  assert.equal(typeof oneuiDarkTheme, "object");
  assert.notEqual(oneuiLightTheme.colorNeutralBackground1, undefined);
  assert.notEqual(oneuiDarkTheme.colorNeutralBackground1, undefined);
  assert.match(String(oneuiLightTheme.fontFamilyBase), /Barclays Effra/);
  assert.equal(oneuiLightTheme.oneuiButtonFontWeight, 400);
  assert.equal(oneuiLightTheme.durationNormal, "200ms");
  assert.equal(oneuiLightTheme.oneuiZIndexModal, 1300);
  assert.equal(oneuiLightTheme.oneuiZIndexTooltip, 1500);
});

test("maps Fluent stroke widths to CSS length border tokens", () => {
  for (const theme of [oneuiLightTheme, oneuiDarkTheme, createOneuiTheme({ mode: "light" })]) {
    assert.equal(theme.strokeWidthThin, oneuiBorderScale.thin);
    assert.equal(theme.strokeWidthThick, oneuiBorderScale.thick);
    assert.doesNotMatch(String(theme.strokeWidthThick), /0 0 0/);
  }
});

test("keeps OneUI Fluent theme values in compatible CSS value categories", () => {
  const spfxTheme = createOneuiThemeFromSpfxTheme({
    palette: {
      neutralLight: "#dddddd",
      neutralLighter: "#eeeeee",
      neutralLighterAlt: "#fafafa",
      neutralPrimary: "#1a1a1a",
      neutralSecondary: "#555555",
      neutralTertiary: "#888888",
      themeDark: "#003f8f",
      themeDarkAlt: "#0057b8",
      themeDarker: "#002b63",
      themePrimary: "#006de3",
      white: "#ffffff"
    },
    semanticColors: {
      bodyBackground: "#fafafa",
      bodyText: "#1a1a1a",
      disabledBackground: "#eeeeee",
      disabledBodyText: "#888888",
      inputBorder: "#dddddd",
      inputBorderHovered: "#bbbbbb",
      link: "#006de3",
      linkHovered: "#0057b8",
      primaryButtonBackground: "#006de3",
      primaryButtonBackgroundHovered: "#0057b8",
      primaryButtonText: "#ffffff",
      primaryButtonTextHovered: "#ffffff"
    }
  });

  for (const [label, theme] of [
    ["light", oneuiLightTheme],
    ["dark", oneuiDarkTheme],
    ["created-light", createOneuiTheme({ mode: "light" })],
    ["created-dark", createOneuiTheme({ mode: "dark" })],
    ["spfx", spfxTheme]
  ]) {
    assertThemeTokenShapes(theme, label);
  }
});

test("exports centralized viewport and container query helpers", () => {
  assert.equal(createOneUIMediaQueryUp("lg"), "@media (min-width: 1024px)");
  assert.equal(createOneUIMediaQueryDown("md"), "@media (max-width: 768px)");
  assert.equal(
    createOneUIContainerQueryUp("lg", "oneui-action-card"),
    "@container oneui-action-card (min-width: 1024px)"
  );
  assert.equal(
    createOneUIContainerQueryDown("md", "oneui-action-card"),
    "@container oneui-action-card (max-width: 768px)"
  );
});

test("maps all required semantic token paths into theme keys for light and dark", () => {
  for (const mode of oneuiThemeModes) {
    const semanticSet = semanticTokens[mode];
    const mappedTheme = mode === "dark" ? oneuiDarkTheme : oneuiLightTheme;

    for (const [category, requiredPaths] of Object.entries(requiredSemanticTokenPaths)) {
      const categoryMap = semanticPathToThemeKeyMap[category];
      assert.ok(categoryMap, `missing category map for '${category}'`);

      for (const path of requiredPaths) {
        const themeKey = categoryMap[path];
        assert.ok(themeKey, `${mode}: no mapped theme key for '${category}.${path}'`);

        const semanticValue = getByPath(semanticSet[category], path);
        assert.notEqual(
          semanticValue,
          undefined,
          `${mode}: missing semantic value '${category}.${path}'`
        );
        assert.equal(
          mappedTheme[themeKey],
          semanticValue,
          `${mode}: '${category}.${path}' is not mapped to '${themeKey}'`
        );
      }
    }
  }
});

test("createOneuiTheme supports safe semantic and fluent overrides", () => {
  const themed = createOneuiTheme({
    mode: "dark",
    semanticTokens: {
      color: {
        text: {
          primary: "override-dark-primary"
        }
      }
    },
    fluentTheme: {
      colorBrandBackground: "override-brand-background"
    }
  });

  assert.equal(themed.colorNeutralForeground1, "override-dark-primary");
  assert.equal(themed.colorBrandBackground, "override-brand-background");
  assert.equal(themed.colorNeutralBackground1, oneuiDarkTheme.colorNeutralBackground1);
});

test("createOneuiTheme keeps fluid typography disabled by default", () => {
  const staticTheme = createOneuiTheme({ mode: "light" });

  assert.match(String(staticTheme.fontSizeBase200), /rem/);
  assert.doesNotMatch(String(staticTheme.fontSizeBase200), /clamp\(/);
});

test("createOneuiTheme supports fluid typography settings across all fluent size slots", () => {
  const fluidTheme = createOneuiTheme({
    mode: "light",
    fluidTypography: {
      enabled: true,
      maxViewport: 1440,
      minViewport: 320,
      scale: "comfortable"
    }
  });

  for (const slot of oneuiFluidTypographySlots) {
    assert.match(String(fluidTheme[slot]), /clamp\(/);
  }
});

test("createOneuiTheme fluid typography caps the upper bound at the static fluent size", () => {
  const staticTheme = createOneuiTheme({ mode: "light" });
  const fluidTheme = createOneuiTheme({
    mode: "light",
    fluidTypography: {
      enabled: true,
      maxViewport: 1440,
      minViewport: 320,
      scale: "expressive"
    }
  });

  const toPxString = (value) => {
    if (typeof value !== "string") {
      return String(value);
    }

    if (value.endsWith("rem")) {
      return `${(Number.parseFloat(value) * 16).toFixed(2)}px`;
    }

    return value;
  };

  assert.match(
    String(fluidTheme.fontSizeHero700),
    new RegExp(`${toPxString(staticTheme.fontSizeHero700).replace(".", "\\.")}\\)$`)
  );
  assert.match(
    String(fluidTheme.fontSizeBase400),
    new RegExp(`${toPxString(staticTheme.fontSizeBase400).replace(".", "\\.")}\\)$`)
  );
});

test("createOneuiTheme fluid typography also applies to font-size overrides", () => {
  const fluidTheme = createOneuiTheme({
    mode: "light",
    fluidTypography: {
      enabled: true
    },
    fluentTheme: {
      fontSizeBase400: "2rem"
    }
  });

  assert.match(String(fluidTheme.fontSizeBase400), /clamp\(/);
});

test("createOneuiTheme supports the shorthand typography fluid flag", () => {
  const fluidTheme = createOneuiTheme({
    mode: "light",
    typography: {
      fluid: true
    }
  });

  assert.match(String(fluidTheme.fontSizeBase500), /clamp\(/);
});

test("createOneuiTheme keeps backward compatibility for typographyMode", () => {
  const fluidTheme = createOneuiTheme({ mode: "light", typographyMode: "fluid" });

  assert.match(String(fluidTheme.fontSizeHero700), /clamp\(/);
});

test("createOneuiTheme defaults to light mode for invalid mode values", () => {
  const themed = createOneuiTheme({ mode: "unknown" });
  assert.equal(themed.colorNeutralBackground1, oneuiLightTheme.colorNeutralBackground1);
});

test("maps SharePoint theme input into safe OneUI theme overrides", () => {
  const overrides = createOneuiThemeOverridesFromSpfxTheme({
    palette: {
      neutralLight: "#dddddd",
      neutralPrimary: "#111111",
      themeDark: "#003f9a",
      themeDarkAlt: "#0058c9",
      themePrimary: "#0078d4",
      white: "#ffffff"
    },
    semanticColors: {
      bodyBackground: "#fafafa",
      bodyText: "#1a1a1a",
      link: "#0f6cbd",
      primaryButtonBackground: "#115ea3",
      primaryButtonText: "#ffffff"
    }
  });

  assert.equal(overrides.fluentTheme.colorNeutralBackground1, "#fafafa");
  assert.equal(overrides.fluentTheme.colorNeutralForeground1, "#1a1a1a");
  assert.equal(overrides.fluentTheme.colorBrandBackground, "#115ea3");
  assert.equal(overrides.fluentTheme.colorBrandForegroundLink, "#0f6cbd");
  assert.equal(overrides.fluentTheme.colorNeutralStroke1, "#dddddd");
});

test("createOneuiThemeFromSpfxTheme resolves mode from the host theme inversion flag", () => {
  const themed = createOneuiThemeFromSpfxTheme(
    {
      isInverted: true,
      palette: {
        neutralPrimary: "#ffffff",
        themePrimary: "#00aeef",
        white: "#000063"
      },
      semanticColors: {
        bodyBackground: "#000063",
        bodyText: "#ffffff"
      }
    },
    {}
  );

  assert.equal(themed.colorNeutralBackground1, "#000063");
  assert.equal(themed.colorNeutralForeground1, "#ffffff");
});

test("exports canonical gradients for light and dark themes", () => {
  assert.deepEqual(oneuiGradientNames, rawGradientTokenNames);

  for (const gradients of [oneuiLightGradients, oneuiDarkGradients]) {
    for (const gradientName of oneuiGradientNames) {
      const resolvedGradient = gradients[gradientName];
      const rawGradient = rawGradientTokens[gradientName];

      assert.equal(resolvedGradient.name, gradientName);
      assert.equal(resolvedGradient.label, rawGradient.label);
      assert.equal(resolvedGradient.type, rawGradient.type);
      assert.equal(resolvedGradient.direction, rawGradient.direction);
      assert.equal(resolvedGradient.cssDirection, rawGradient.cssDirection);
      assert.equal(resolvedGradient.angle, rawGradient.angle);
      assert.equal(resolvedGradient.css, rawGradient.css);
      assert.equal(resolvedGradient.fallbackSolidColor, rawGradient.fallbackSolidColor);
      assert.deepEqual(resolvedGradient.stops, rawGradient.stops);
    }

    assert.equal(Object.keys(gradients).length, oneuiGradientNames.length);
  }
});

test("createOneuiGradients defaults to light mode for invalid values", () => {
  assert.deepEqual(createOneuiGradients("dark"), oneuiDarkGradients);
  assert.deepEqual(createOneuiGradients("unknown"), oneuiLightGradients);
});

test("exports semantic surface recipes and registry entries", () => {
  assert.deepEqual(oneuiSurfaceRoleNames, [
    "heroPrimary",
    "heroSecondary",
    "heroSoft",
    "heroFresh",
    "heroPastel",
    "heroDeep",
    "heroBlue",
    "heroLight",
    "iconPrimary",
    "iconSecondary",
    "accentStrong",
    "accentSoft",
    "featuredCard",
    "ctaPrimary",
    "panelSpotlight",
    "decorativeSurface"
  ]);

  assert.equal(oneuiLightSurfaceRecipes.heroPrimary.rawGradientName, "gradientCyanGreen");
  assert.equal(oneuiDarkSurfaceRecipes.heroSecondary.rawGradientName, "gradientNavyCyan");
  assert.equal(oneuiLightSurfaceRecipes.heroDeep.rawSolidName, "navy");
  assert.equal(oneuiLightSurfaceRecipes.heroBlue.rawSolidName, "cyan");
  assert.equal(oneuiLightSurfaceRecipes.heroLight.rawSolidName, "lightBlue");
  assert.equal(oneuiLightSurfaceRecipes.ctaPrimary.type, "solid");

  const registry = createOneUISurfaceVariantRegistry({ mode: "dark" });
  assert.equal(registry.heroPrimary.surfaceRole, "heroPrimary");
  assert.equal(registry.heroSecondary.surfaceRole, "heroSecondary");
  assert.equal(registry.heroDeep.type, "solid");
  assert.equal(registry.heroFresh.type, "gradient");
});

test("resolves semantic surface keys, consumer-defined policies, and property-pane options", () => {
  assert.equal(
    resolveOneUISurfaceVariantKey(undefined, testSurfacePolicies.connectionsHome),
    testSurfacePolicies.connectionsHome.defaultVariantKey
  );
  assert.equal(resolveOneUISurfaceVariantKey("unknown-surface"), "heroPrimary");
  assert.equal(getOneUIDefaultSurfaceVariantKey(oneuiDefaultSurfacePolicy), "heroPrimary");

  const resolution = resolveOneUISurfaceVariant("heroSecondary", {
    policy: testSurfacePolicies.connectionsHome
  });
  assert.equal(resolution.resolvedKey, "heroSecondary");
  assert.equal(resolution.policy.defaultVariantKey, "heroPrimary");

  const style = resolveOneUISurfaceStyle("heroDeep");
  assert.equal(style.backgroundColor, oneuiLightSurfaceRecipes.heroDeep.background.backgroundColor);
  assert.equal(typeof style.color, "string");

  const options = createOneUISurfacePropertyPaneOptions(testSurfacePolicies.connectionsHome);
  assert.ok(options.some((option) => option.key === "heroPrimary"));
  assert.ok(options.every((option) => option.key.startsWith("hero")));
});

test("builds banner surface picker options with availability filtering and defaults", () => {
  const gradientOnlyPicker = buildOneUIBannerSurfacePickerOptions({
    policy: testSurfacePolicies.connectionsHome,
    availability: "gradientOnly"
  });

  assert.equal(gradientOnlyPicker.defaultKey, "heroPrimary");
  assert.equal(gradientOnlyPicker.effectiveKey, "heroPrimary");
  assert.ok(gradientOnlyPicker.options.length > 0);
  assert.ok(gradientOnlyPicker.options.every((option) => option.type === "gradient"));
  assert.ok(
    gradientOnlyPicker.options.some(
      (option) => option.key === "heroPrimary" && option.isDefault
    )
  );

  const solidOnlyPicker = buildOneUIBannerSurfacePickerOptions({
    policy: testSurfacePolicies.connectionsHome,
    availability: "solidOnly"
  });

  assert.ok(solidOnlyPicker.options.every((option) => option.type === "solid"));
  assert.deepEqual(
    solidOnlyPicker.options
      .map((option) => option.key),
    ["heroDeep", "heroBlue", "heroLight"]
  );
  assert.ok(solidOnlyPicker.options.some((option) => option.isDefault));
  assert.equal(solidOnlyPicker.defaultKey, solidOnlyPicker.options[0].key);
});

test("falls back to the visible default when a banner surface selection is invalid", () => {
  const picker = buildOneUIBannerSurfacePickerOptions({
    policy: testSurfacePolicies.connectionsHome,
    availability: "solidOnly",
    selectedKey: "unknown-surface"
  });

  assert.equal(
    getOneUIBannerSurfaceEffectiveKey({
      policy: testSurfacePolicies.connectionsHome,
      availability: "solidOnly",
      selectedKey: "unknown-surface"
    }),
    "heroDeep"
  );
  assert.equal(picker.defaultKey, "heroDeep");
  assert.ok(picker.options.every((option) => option.key.startsWith("hero")));

  const style = getOneUIBannerSurfaceStyle({
    policy: testSurfacePolicies.connectionsHome,
    availability: "solidOnly",
    selectedKey: "unknown-surface"
  });

  assert.equal(
    style.backgroundImage,
    oneuiLightSurfaceRecipes.heroDeep.background.backgroundImage
  );
  assert.equal(
    style.backgroundColor,
    oneuiLightSurfaceRecipes.heroDeep.background.backgroundColor
  );
});

test("useOneUIGradients follows OneUIProvider mode and defaults to light gradients", () => {
  let outsideProviderGradients;
  const OutsideProbe = () => {
    outsideProviderGradients = useOneUIGradients();
    return React.createElement("div", null, "outside-provider");
  };

  renderToStaticMarkup(React.createElement(OutsideProbe));
  assert.equal(outsideProviderGradients.gradientCyanGreen.css, oneuiLightGradients.gradientCyanGreen.css);

  let darkModeGradients;
  const DarkProbe = () => {
    darkModeGradients = useOneUIGradients();
    return React.createElement("div", null, "inside-provider");
  };

  renderToStaticMarkup(
    React.createElement(OneUIProvider, { mode: "dark" }, React.createElement(DarkProbe))
  );

  assert.equal(darkModeGradients.gradientCyanGreen.css, oneuiDarkGradients.gradientCyanGreen.css);
  assert.equal(
    darkModeGradients.gradientCyanPink.fallbackSolidColor,
    oneuiDarkGradients.gradientCyanPink.fallbackSolidColor
  );
});

test("useOneUISurfaces follows OneUIProvider mode and defaults to light recipes", () => {
  let outsideProviderSurfaces;
  const OutsideProbe = () => {
    outsideProviderSurfaces = useOneUISurfaces();
    return React.createElement("div", null, "outside-provider-surfaces");
  };

  renderToStaticMarkup(React.createElement(OutsideProbe));
  assert.equal(
    outsideProviderSurfaces.heroPrimary.rawGradientName,
    oneuiLightSurfaceRecipes.heroPrimary.rawGradientName
  );
  assert.equal(
    outsideProviderSurfaces.heroBlue.rawSolidName,
    oneuiLightSurfaceRecipes.heroBlue.rawSolidName
  );

  let darkModeSurfaces;
  const DarkProbe = () => {
    darkModeSurfaces = useOneUISurfaces();
    return React.createElement("div", null, "inside-provider-surfaces");
  };

  renderToStaticMarkup(
    React.createElement(OneUIProvider, { mode: "dark" }, React.createElement(DarkProbe))
  );

  assert.equal(
    darkModeSurfaces.heroSecondary.rawGradientName,
    oneuiDarkSurfaceRecipes.heroSecondary.rawGradientName
  );
  assert.equal(
    darkModeSurfaces.heroDeep.background.backgroundColor,
    oneuiDarkSurfaceRecipes.heroDeep.background.backgroundColor
  );
});

test("OneUISpfxProvider applies SharePoint theme overrides while preserving OneUI gradients", () => {
  let themedBackground;
  let gradientName;

  const Probe = () => {
    const gradients = useOneUIGradients();
    const theme = createOneuiThemeFromSpfxTheme({
      palette: {
        themePrimary: "#0078d4",
        white: "#ffffff"
      },
      semanticColors: {
        bodyBackground: "#f5f5f5",
        bodyText: "#222222"
      }
    });

    themedBackground = theme.colorNeutralBackground1;
    gradientName = gradients.gradientCyanGreen.name;
    return React.createElement("div", null, "spfx-provider");
  };

  renderToStaticMarkup(
    React.createElement(
      OneUISpfxProvider,
      {
        spfxTheme: {
          palette: {
            themePrimary: "#0078d4",
            white: "#ffffff"
          },
          semanticColors: {
            bodyBackground: "#f5f5f5",
            bodyText: "#222222"
          }
        }
      },
      React.createElement(Probe)
    )
  );

  assert.equal(themedBackground, "#f5f5f5");
  assert.equal(gradientName, "gradientCyanGreen");
});

test("createOneuiThemeFromSpfxTheme preserves base theme tokens when SPFx overrides are partial", () => {
  const theme = createOneuiThemeFromSpfxTheme({
    palette: {
      themePrimary: "#0078d4"
    },
    semanticColors: {
      bodyBackground: "#f5f5f5"
    }
  });

  assert.equal(theme.colorNeutralBackground1, "#f5f5f5");
  assert.ok(typeof theme.colorBrandBackground === "string" && theme.colorBrandBackground.length > 0);
  assert.ok(
    typeof theme.colorNeutralForeground1 === "string" && theme.colorNeutralForeground1.length > 0
  );
  assert.ok(
    typeof theme.oneuiColorBackgroundCanvas === "string" &&
      theme.oneuiColorBackgroundCanvas.length > 0
  );
});
