import assert from "node:assert/strict";
import test from "node:test";

import {
  oneuiBreakpoints,
  rawGradientTokenNames,
  rawGradientTokens,
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

test("exports the six structured raw gradient tokens", () => {
  assert.deepEqual(rawGradientTokenNames, [
    "deepSpectrum",
    "limeSky",
    "softAqua",
    "tealShift",
    "midnightBlue",
    "pastelHorizon"
  ]);

  for (const gradientName of rawGradientTokenNames) {
    const gradient = rawGradientTokens[gradientName];

    assert.equal(gradient.id, gradientName);
    assert.equal(gradient.type, "linear");
    assert.equal(gradient.direction, "to bottom");
    assert.equal(gradient.angle, 180);
    assert.ok(Array.isArray(gradient.stops));
    assert.ok(gradient.stops.length >= 2, `${gradientName}: expected at least two stops`);
    assert.match(gradient.css, /^linear-gradient\(180deg, /);
    assert.equal(
      gradient.fallbackSolidColor,
      gradient.stops[gradient.stops.length - 1].color,
      `${gradientName}: fallback solid color should match the final stop`
    );

    assert.equal(gradient.stops[0].position, "0%");
    assert.equal(gradient.stops[gradient.stops.length - 1].position, "100%");

    for (let index = 1; index < gradient.stops.length; index += 1) {
      const previous = Number.parseFloat(gradient.stops[index - 1].position);
      const current = Number.parseFloat(gradient.stops[index].position);
      assert.ok(current > previous, `${gradientName}: stop positions must be ordered`);
    }
  }
});
