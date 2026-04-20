import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  createOneUIOnboardingCssVariables,
  createOneUIOnboardingVariableStylesheet
} from "../dist/index.js";

test("createOneUIOnboardingCssVariables returns token-driven defaults", () => {
  const variables = createOneUIOnboardingCssVariables();

  assert.equal(variables["--oneui-onboarding-button-primary-background"], "var(--oneui-fluent-colorBrandBackground)");
  assert.equal(variables["--oneui-onboarding-brand-surface-background"], "var(--oneui-fluent-colorBrandBackground)");
  assert.ok(variables["--oneui-onboarding-surface-background"]);
  assert.ok(variables["--oneui-onboarding-full-page-shadow"]);
});

test("createOneUIOnboardingVariableStylesheet scopes variables to the active body scope", () => {
  const stylesheet = createOneUIOnboardingVariableStylesheet({
    scopeId: "demo-tour"
  });

  assert.match(stylesheet, /body\[data-oneui-onboarding-scope="demo-tour"\]/);
});

test("static onboarding stylesheet neutralizes third-party button chrome", async () => {
  const stylesheet = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");

  assert.match(stylesheet, /\.oneui-onboarding-button \{/);
  assert.match(stylesheet, /\.oneui-onboarding-full-page-panel \{/);
  assert.match(stylesheet, /text-shadow: none;/);
  assert.match(stylesheet, /appearance: none;/);
  assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)/);
});
