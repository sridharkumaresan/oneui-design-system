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

const testSurfacePolicies = defineOneUISurfacePolicyMap({
  connectionsHome: {
    label: "Connections home banner",
    allowedVariantKeys: [
      "gradientCyanGreen",
      "gradientNavyCyan",
      "gradientCyanLightBlue",
      "gradientCyanYellow",
      "gradientCyanPink",
      "navy",
      "cyan",
      "lightBlue"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "gradientCyanGreen"
  },
  hubSiteBanner: {
    label: "Hub site banner",
    allowedVariantKeys: [
      "gradientCyanGreen",
      "gradientNavyCyan",
      "navy",
      "cyan",
      "lightBlue",
      "gradientCyanPink"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "gradientNavyCyan"
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

      assert.equal(gradients.deepSpectrum.name, "deepSpectrum");
      assert.equal(gradients.deepSpectrum.css, gradients.gradientCyanGreen.css);
      assert.equal(gradients.cyanGreen.css, gradients.gradientCyanGreen.css);
      assert.equal(gradients.limeSky.css, gradients.gradientCyanYellow.css);
      assert.equal(gradients.softAqua.css, gradients.gradientCyanLightBlue.css);
      assert.equal(gradients.tealShift.css, gradients.gradientCyanGreen.css);
      assert.equal(gradients.midnightBlue.css, gradients.gradientNavyCyan.css);
      assert.equal(gradients.pastelHorizon.css, gradients.gradientCyanPink.css);
    }
  });

test("createOneuiGradients defaults to light mode for invalid values", () => {
  assert.deepEqual(createOneuiGradients("dark"), oneuiDarkGradients);
  assert.deepEqual(createOneuiGradients("unknown"), oneuiLightGradients);
});

test("exports semantic surface recipes and a legacy-safe registry", () => {
  assert.deepEqual(oneuiSurfaceRoleNames, [
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
  ]);

  assert.equal(oneuiLightSurfaceRecipes.gradientCyanGreen.rawGradientName, "gradientCyanGreen");
  assert.equal(oneuiDarkSurfaceRecipes.gradientNavyCyan.rawGradientName, "gradientNavyCyan");
  assert.equal(oneuiLightSurfaceRecipes.navy.rawSolidName, "navy");
  assert.equal(oneuiLightSurfaceRecipes.cyan.rawSolidName, "cyan");
  assert.equal(oneuiLightSurfaceRecipes.lightBlue.rawSolidName, "lightBlue");
  assert.equal(oneuiLightSurfaceRecipes.ctaPrimary.type, "solid");

  const registry = createOneUISurfaceVariantRegistry({ mode: "dark" });
  assert.equal(registry.gradientCyanGreen.surfaceRole, "gradientCyanGreen");
  assert.equal(registry.primary.deprecated.replacementKey, "gradientCyanGreen");
  assert.equal(registry.midnightBlue.deprecated.replacementKey, "gradientNavyCyan");
});

test("resolves semantic surface keys, consumer-defined policies, and property-pane options", () => {
  assert.equal(
    resolveOneUISurfaceVariantKey(undefined, testSurfacePolicies.connectionsHome),
    testSurfacePolicies.connectionsHome.defaultVariantKey
  );
  assert.equal(resolveOneUISurfaceVariantKey("deepSpectrum"), "gradientCyanGreen");
  assert.equal(
    getOneUIDefaultSurfaceVariantKey(oneuiDefaultSurfacePolicy),
    "gradientCyanGreen"
  );

  const resolution = resolveOneUISurfaceVariant("midnightBlue", {
    policy: testSurfacePolicies.connectionsHome
  });
  assert.equal(resolution.resolvedKey, "gradientNavyCyan");
  assert.equal(resolution.isDeprecatedSelection, true);
  assert.equal(resolution.policy.defaultVariantKey, "gradientCyanGreen");

  const style = resolveOneUISurfaceStyle("navy");
  assert.equal(style.backgroundColor, oneuiLightSurfaceRecipes.navy.background.backgroundColor);
  assert.equal(typeof style.color, "string");

  const options = createOneUISurfacePropertyPaneOptions(
    testSurfacePolicies.connectionsHome,
    {
    selectedKey: "deepSpectrum"
    }
  );
  assert.ok(options.some((option) => option.key === "gradientCyanGreen"));
  assert.ok(
    options.some(
      (option) => option.key === "deepSpectrum" && option.hiddenFromSelections
    )
  );
});

test("builds banner surface picker options with availability filtering and defaults", () => {
  const gradientOnlyPicker = buildOneUIBannerSurfacePickerOptions({
    policy: testSurfacePolicies.connectionsHome,
    availability: "gradientOnly",
  });

  assert.equal(gradientOnlyPicker.defaultKey, "gradientCyanGreen");
  assert.equal(gradientOnlyPicker.effectiveKey, "gradientCyanGreen");
  assert.ok(gradientOnlyPicker.options.length > 0);
  assert.ok(gradientOnlyPicker.options.every((option) => option.type === "gradient"));
  assert.ok(
    gradientOnlyPicker.options.some(
      (option) => option.key === "gradientCyanGreen" && option.isDefault
    )
  );

  const solidOnlyPicker = buildOneUIBannerSurfacePickerOptions({
    policy: testSurfacePolicies.connectionsHome,
    availability: "solidOnly",
  });

  assert.ok(solidOnlyPicker.options.every((option) => option.type === "solid"));
  assert.deepEqual(
    solidOnlyPicker.options
      .filter((option) => !option.hiddenFromSelections)
      .map((option) => option.key),
    ["navy", "cyan", "lightBlue"]
  );
  assert.ok(solidOnlyPicker.options.some((option) => option.isDefault));
  assert.equal(solidOnlyPicker.defaultKey, solidOnlyPicker.options[0].key);
});

test("preserves a hidden current selection and resolves banner style through the picker adapter", () => {
  const picker = buildOneUIBannerSurfacePickerOptions({
    policy: testSurfacePolicies.connectionsHome,
    availability: "solidOnly",
    selectedKey: "deepSpectrum"
  });

  assert.equal(getOneUIBannerSurfaceEffectiveKey({
    policy: testSurfacePolicies.connectionsHome,
    availability: "solidOnly",
    selectedKey: "deepSpectrum"
  }), "deepSpectrum");
  assert.ok(
    picker.options.some(
      (option) => option.key === "deepSpectrum" && option.hiddenFromSelections
    )
  );

  const style = getOneUIBannerSurfaceStyle({
    policy: testSurfacePolicies.connectionsHome,
    availability: "solidOnly",
    selectedKey: "deepSpectrum"
  });

  assert.equal(style.backgroundImage, oneuiLightSurfaceRecipes.gradientCyanGreen.background.backgroundImage);
  assert.equal(style.backgroundColor, oneuiLightSurfaceRecipes.gradientCyanGreen.background.backgroundColor);
});

test("useOneUIGradients follows OneUIProvider mode and defaults to light gradients", () => {
  let outsideProviderGradients;
  const OutsideProbe = () => {
    outsideProviderGradients = useOneUIGradients();
    return React.createElement("div", null, "outside-provider");
  };

  renderToStaticMarkup(React.createElement(OutsideProbe));
  assert.equal(
    outsideProviderGradients.deepSpectrum.css,
    oneuiLightGradients.deepSpectrum.css
  );

  let darkModeGradients;
  const DarkProbe = () => {
    darkModeGradients = useOneUIGradients();
    return React.createElement("div", null, "inside-provider");
  };

  renderToStaticMarkup(
    React.createElement(OneUIProvider, { mode: "dark" }, React.createElement(DarkProbe))
  );

  assert.equal(darkModeGradients.deepSpectrum.css, oneuiDarkGradients.deepSpectrum.css);
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
    outsideProviderSurfaces.gradientCyanGreen.rawGradientName,
    oneuiLightSurfaceRecipes.gradientCyanGreen.rawGradientName
  );
  assert.equal(
    outsideProviderSurfaces.cyan.rawSolidName,
    oneuiLightSurfaceRecipes.cyan.rawSolidName
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
    darkModeSurfaces.gradientNavyCyan.rawGradientName,
    oneuiDarkSurfaceRecipes.gradientNavyCyan.rawGradientName
  );
  assert.equal(
    darkModeSurfaces.navy.background.backgroundColor,
    oneuiDarkSurfaceRecipes.navy.background.backgroundColor
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
    gradientName = gradients.deepSpectrum.name;
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
  assert.equal(gradientName, "deepSpectrum");
});
