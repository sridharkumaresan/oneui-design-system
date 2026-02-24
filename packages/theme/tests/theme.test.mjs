import assert from "node:assert/strict";
import test from "node:test";

import {
  createOneuiTheme,
  oneuiDarkTheme,
  oneuiLightTheme,
  oneuiThemeModes,
  semanticPathToThemeKeyMap
} from "../dist/index.js";
import { requiredSemanticTokenPaths, semanticTokens } from "../../tokens/dist/index.js";

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
        assert.notEqual(semanticValue, undefined, `${mode}: missing semantic value '${category}.${path}'`);
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
