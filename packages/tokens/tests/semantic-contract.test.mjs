import assert from "node:assert/strict";
import test from "node:test";

import {
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
