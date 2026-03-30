import assert from "node:assert/strict";
import test from "node:test";

import {
  createOneuiCssVariables,
  createOneuiCssVariablesStylesheet,
  oneuiBreakpoints,
  oneuiBrandColors,
  oneuiFluentTypographyAliases,
  oneuiFluentThemeOverrides,
  oneuiFluentTokenCategories,
  rawGradientTokenNames,
  rawGradientTokens,
  rawSolidTokenNames,
  rawSolidTokens,
  requiredSemanticTokenPaths,
  semanticTokens,
  tokenCategories
} from "../dist/index.js";

const getByPath = (source, path) => {
  return path.split(".").reduce((value, segment) => {
    if (value && typeof value === "object" && segment in value) {
      return value[segment];
    }

    return undefined;
  }, source);
};

test("exports the required semantic token categories", () => {
  assert.deepEqual(tokenCategories, [
    "color",
    "typography",
    "spacing",
    "radius",
    "shadows",
    "components",
    "breakpoints"
  ]);
});

test("exports centralized breakpoint tokens", () => {
  assert.deepEqual(oneuiBreakpoints, {
    xs: "360px",
    sm: "480px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    xxl: "1536px"
  });
});

test("exports Fluent-aligned foundation categories and brand values", () => {
  assert.deepEqual(oneuiFluentTokenCategories, [
    "colors",
    "typography",
    "fonts",
    "spacing",
    "radii",
    "shadows",
    "borders",
    "motion",
    "sizes"
  ]);

  assert.equal(oneuiBrandColors.primary, "#00AEEF");
  assert.equal(oneuiBrandColors.interactive, "#006DE3");
  assert.equal(oneuiBrandColors.interactive2, "#272727");
  assert.equal(oneuiFluentThemeOverrides.light.colorBrandBackground, "#006DE3");
  assert.equal(oneuiFluentTypographyAliases.caption2.fontWeight, 500);
});

test("light and dark semantic token sets contain all required contract keys", () => {
  for (const [themeName, tokens] of Object.entries(semanticTokens)) {
    for (const [category, paths] of Object.entries(requiredSemanticTokenPaths)) {
      const categoryTokens = tokens[category];
      assert.ok(categoryTokens, `${themeName}: missing '${category}' category`);

      for (const path of paths) {
        const value = getByPath(categoryTokens, path);
        assert.notEqual(
          value,
          undefined,
          `${themeName}: missing semantic token '${category}.${path}'`
        );
      }
    }
  }
});

test("exports the five structured branded raw gradient tokens", () => {
  assert.deepEqual(rawGradientTokenNames, [
    "gradientNavyCyan",
    "gradientCyanGreen",
    "gradientCyanYellow",
    "gradientCyanLightBlue",
    "gradientCyanPink"
  ]);

  for (const gradientName of rawGradientTokenNames) {
    const gradient = rawGradientTokens[gradientName];

    assert.equal(gradient.id, gradientName);
    assert.equal(gradient.type, "linear");
    assert.equal(gradient.direction, "toTopRight");
    assert.equal(gradient.cssDirection, "to top right");
    assert.equal(gradient.angle, 45);
    assert.ok(Array.isArray(gradient.stops));
    assert.ok(gradient.stops.length >= 2, `${gradientName}: expected at least two stops`);
    assert.match(gradient.css, /^linear-gradient\(to top right, /);
    assert.equal(
      gradient.fallbackSolidColor,
      gradient.stops[gradient.stops.length - 1].color,
      `${gradientName}: fallback solid color should match the final stop`
    );

    assert.equal(gradient.stops[0].position, "0%");

    for (let index = 1; index < gradient.stops.length; index += 1) {
      const previous = Number.parseFloat(gradient.stops[index - 1].position);
      const current = Number.parseFloat(gradient.stops[index].position);
      assert.ok(current > previous, `${gradientName}: stop positions must be ordered`);
    }
  }
});

test("exports the structured raw solid surface primitives", () => {
  assert.deepEqual(rawSolidTokenNames, [
    "brandSky",
    "brandBlue",
    "brandMidnight",
    "brandMint",
    "brandAqua",
    "brandPastel",
    "cyan",
    "navy",
    "lightBlue",
    "surfaceBlueDark",
    "surfaceBlueLight",
    "surfaceBlueLightest"
  ]);

  for (const solidName of rawSolidTokenNames) {
    const solid = rawSolidTokens[solidName];

    assert.equal(solid.id, solidName);
    assert.equal(solid.type, "solid");
    assert.equal(typeof solid.label, "string");
    assert.equal(typeof solid.value, "string");
    assert.match(solid.value, /^#/);
    assert.equal(solid.css, solid.value);
    assert.equal(solid.fallbackSolidColor, solid.value);
  }
});

test("exports CSS variable generation from the same token source of truth", () => {
  const variables = createOneuiCssVariables({ mode: "light" });
  const stylesheet = createOneuiCssVariablesStylesheet({ mode: "dark" });

  assert.equal(variables["--oneui-fluent-colorBrandBackground"], "#006DE3");
  assert.equal(variables["--oneui-gradient-gradientCyanGreen-fallback"], "#00AEEF");
  assert.equal(variables["--oneui-solid-cyan"], "#00AEEF");
  assert.match(stylesheet, /^:root \{/);
  assert.match(stylesheet, /--oneui-fluent-colorNeutralBackground1:/);
});
