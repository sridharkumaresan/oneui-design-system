import { oneuiOnboardingClassNames } from "@functions-oneui/onboarding-core";
import { createOneuiCssVariables } from "@functions-oneui/tokens";

export type CreateOneUIOnboardingStylesheetOptions = {
  mode?: "light" | "dark";
  scopeId?: string;
  theme?: Record<string, string | number | undefined>;
};

const toCssVariableBlock = (variables: Record<string, string>): string => {
  return Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
};

const resolveThemeValue = (
  value: string | number | undefined,
  fallback: string
): string => {
  return value === undefined ? fallback : String(value);
};

export const createOneUIOnboardingCssVariables = (
  options: CreateOneUIOnboardingStylesheetOptions = {}
): Record<string, string> => {
  const baseVariables = createOneuiCssVariables({
    mode: options.mode ?? "light",
    prefix: "oneui"
  });
  const theme = options.theme ?? {};

  return {
    ...baseVariables,
    "--oneui-onboarding-font-family": resolveThemeValue(
      theme.fontFamilyBase,
      'var(--oneui-typography-fontFamily-base)'
    ),
    "--oneui-onboarding-title-size": resolveThemeValue(
      theme.fontSizeBase500,
      "var(--oneui-fluent-fontSizeBase500)"
    ),
    "--oneui-onboarding-title-weight": resolveThemeValue(theme.fontWeightSemibold, "600"),
    "--oneui-onboarding-body-size": resolveThemeValue(
      theme.fontSizeBase300,
      "var(--oneui-fluent-fontSizeBase300)"
    ),
    "--oneui-onboarding-body-line-height": resolveThemeValue(theme.lineHeightBase300, "1.5"),
    "--oneui-onboarding-progress-size": resolveThemeValue(
      theme.fontSizeBase200,
      "var(--oneui-fluent-fontSizeBase200)"
    ),
    "--oneui-onboarding-surface-background": resolveThemeValue(
      theme.colorNeutralBackground1,
      "var(--oneui-colors-background-canvas)"
    ),
    "--oneui-onboarding-surface-foreground": resolveThemeValue(
      theme.colorNeutralForeground1,
      "var(--oneui-colors-text-primary)"
    ),
    "--oneui-onboarding-surface-muted": resolveThemeValue(
      theme.colorNeutralForeground3,
      "var(--oneui-colors-text-secondary)"
    ),
    "--oneui-onboarding-surface-border": resolveThemeValue(
      theme.colorNeutralStroke1,
      "var(--oneui-colors-border-subtle)"
    ),
    "--oneui-onboarding-surface-shadow": resolveThemeValue(
      theme.shadow64,
      "0 12px 32px rgba(0, 0, 0, 0.24)"
    ),
    "--oneui-onboarding-radius": resolveThemeValue(
      theme.borderRadiusXLarge,
      "var(--oneui-shape-radius-xlarge)"
    ),
    "--oneui-onboarding-overlay-color": resolveThemeValue(
      theme.colorNeutralBackgroundAlpha2,
      "rgba(0, 0, 0, 0.56)"
    ),
    "--oneui-onboarding-button-primary-background": resolveThemeValue(
      theme.colorBrandBackground,
      "var(--oneui-fluent-colorBrandBackground)"
    ),
    "--oneui-onboarding-button-primary-background-hover": resolveThemeValue(
      theme.colorBrandBackgroundHover,
      "var(--oneui-fluent-colorBrandBackgroundHover)"
    ),
    "--oneui-onboarding-button-primary-foreground": resolveThemeValue(
      theme.colorNeutralForegroundOnBrand,
      "var(--oneui-fluent-colorNeutralForegroundOnBrand)"
    ),
    "--oneui-onboarding-button-secondary-background": resolveThemeValue(
      theme.colorNeutralBackground1,
      "var(--oneui-fluent-colorNeutralBackground1)"
    ),
    "--oneui-onboarding-button-secondary-background-hover": resolveThemeValue(
      theme.colorNeutralBackground1Hover,
      "var(--oneui-fluent-colorNeutralBackground1Hover)"
    ),
    "--oneui-onboarding-button-secondary-foreground": resolveThemeValue(
      theme.colorNeutralForeground1,
      "var(--oneui-fluent-colorNeutralForeground1)"
    ),
    "--oneui-onboarding-button-border": resolveThemeValue(
      theme.colorNeutralStroke1,
      "var(--oneui-fluent-colorNeutralStroke1)"
    ),
    "--oneui-onboarding-button-radius": resolveThemeValue(
      theme.borderRadiusMedium,
      "var(--oneui-shape-radius-medium)"
    ),
    "--oneui-onboarding-button-padding-inline": resolveThemeValue(
      theme.spacingHorizontalM,
      "0.75rem"
    ),
    "--oneui-onboarding-button-padding-block": resolveThemeValue(
      theme.spacingVerticalXS,
      "0.375rem"
    ),
    "--oneui-onboarding-button-font-size": resolveThemeValue(
      theme.fontSizeBase300,
      "var(--oneui-fluent-fontSizeBase300)"
    ),
    "--oneui-onboarding-button-font-weight": resolveThemeValue(
      theme.fontWeightRegular,
      "400"
    )
  };
};

export const createOneUIOnboardingVariableStylesheet = (
  options: CreateOneUIOnboardingStylesheetOptions = {}
): string => {
  const scopeSelector = `body[data-oneui-onboarding-scope="${options.scopeId ?? "oneui-onboarding"}"]`;
  const declarations = toCssVariableBlock(createOneUIOnboardingCssVariables(options));

  return `${scopeSelector} {\n${declarations}\n}`;
};

export {
  oneuiOnboardingClassNames
};
