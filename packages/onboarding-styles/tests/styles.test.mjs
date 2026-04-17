import test from "node:test";
import assert from "node:assert/strict";

import {
  createOneUIOnboardingCssVariables,
  createOneUIOnboardingVariableStylesheet
} from "../dist/index.js";

test("createOneUIOnboardingCssVariables returns token-driven defaults", () => {
  const variables = createOneUIOnboardingCssVariables();

  assert.equal(variables["--oneui-onboarding-button-primary-background"], "var(--oneui-fluent-colorBrandBackground)");
  assert.equal(variables["--oneui-onboarding-brand-surface-background"], "var(--oneui-fluent-colorBrandBackground)");
  assert.ok(variables["--oneui-onboarding-surface-background"]);
});

test("createOneUIOnboardingVariableStylesheet scopes variables to the active body scope", () => {
  const stylesheet = createOneUIOnboardingVariableStylesheet({
    scopeId: "demo-tour"
  });

  assert.match(stylesheet, /body\[data-oneui-onboarding-scope="demo-tour"\]/);
});
