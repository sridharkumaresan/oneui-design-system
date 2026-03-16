import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  createOneUIContainerQueryDown,
  createOneUIContainerQueryUp,
  createOneUIMediaQueryDown,
  createOneUIMediaQueryUp,
  createOneuiGradientRoles,
  createOneuiTheme,
  OneUIProvider,
  oneuiDarkGradientRoles,
  oneuiDarkTheme,
  oneuiGradientRoleNames,
  oneuiLightGradientRoles,
  oneuiLightTheme,
  oneuiThemeModes,
  semanticPathToThemeKeyMap,
  useOneUIGradients
} from "../dist/index.js";
import {
  rawGradientTokens,
  requiredSemanticTokenPaths,
  semanticTokens
} from "../../tokens/dist/index.js";

const expectedGradientMapping = {
  heroPrimary: "deepSpectrum",
  heroSecondary: "midnightBlue",
  featureSurface: "limeSky",
  softPromotionalSurface: "softAqua",
  iconAccent: "tealShift",
  decorativePastelSurface: "pastelHorizon"
};

const getByPath = (source, path) => {
  return path.split(".").reduce((value, segment) => {
    if (value && typeof value === "object" && segment in value) {
      return value[segment];
    }

    return undefined;
  }, source);
};

test("exports light and dark OneUI themes", () => {
  assert.deepEqual(oneuiThemeModes, ["light", "dark"]);

  assert.equal(typeof oneuiLightTheme, "object");
  assert.equal(typeof oneuiDarkTheme, "object");
  assert.notEqual(oneuiLightTheme.colorNeutralBackground1, undefined);
  assert.notEqual(oneuiDarkTheme.colorNeutralBackground1, undefined);
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

test("exports semantic gradient roles for light and dark themes", () => {
  assert.deepEqual(oneuiGradientRoleNames, [
    "heroPrimary",
    "heroSecondary",
    "featureSurface",
    "softPromotionalSurface",
    "iconAccent",
    "decorativePastelSurface"
  ]);

  for (const gradientRoles of [oneuiLightGradientRoles, oneuiDarkGradientRoles]) {
    for (const roleName of oneuiGradientRoleNames) {
      const resolvedRole = gradientRoles[roleName];
      const expectedGradientId = expectedGradientMapping[roleName];
      const rawGradient = rawGradientTokens[expectedGradientId];

      assert.equal(resolvedRole.role, roleName);
      assert.equal(resolvedRole.gradientId, expectedGradientId);
      assert.equal(resolvedRole.type, rawGradient.type);
      assert.equal(resolvedRole.direction, rawGradient.direction);
      assert.equal(resolvedRole.angle, rawGradient.angle);
      assert.equal(resolvedRole.css, rawGradient.css);
      assert.equal(resolvedRole.fallbackSolidColor, rawGradient.fallbackSolidColor);
      assert.deepEqual(resolvedRole.stops, rawGradient.stops);
    }
  }
});

test("createOneuiGradientRoles defaults to light mode for invalid values", () => {
  assert.deepEqual(createOneuiGradientRoles("dark"), oneuiDarkGradientRoles);
  assert.deepEqual(createOneuiGradientRoles("unknown"), oneuiLightGradientRoles);
});

test("useOneUIGradients follows OneUIProvider mode and defaults to light gradients", () => {
  let outsideProviderGradients;
  const OutsideProbe = () => {
    outsideProviderGradients = useOneUIGradients();
    return React.createElement("div", null, "outside-provider");
  };

  renderToStaticMarkup(React.createElement(OutsideProbe));
  assert.equal(
    outsideProviderGradients.heroPrimary.css,
    oneuiLightGradientRoles.heroPrimary.css
  );

  let darkModeGradients;
  const DarkProbe = () => {
    darkModeGradients = useOneUIGradients();
    return React.createElement("div", null, "inside-provider");
  };

  renderToStaticMarkup(
    React.createElement(OneUIProvider, { mode: "dark" }, React.createElement(DarkProbe))
  );

  assert.equal(darkModeGradients.heroPrimary.css, oneuiDarkGradientRoles.heroPrimary.css);
  assert.equal(
    darkModeGradients.decorativePastelSurface.fallbackSolidColor,
    oneuiDarkGradientRoles.decorativePastelSurface.fallbackSolidColor
  );
});
