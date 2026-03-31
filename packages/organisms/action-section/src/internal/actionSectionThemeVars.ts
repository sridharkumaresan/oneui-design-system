import React from "react";

type ThemeTokenBag = Record<string, string | number | undefined>;

export type ActionSectionCssVars = React.CSSProperties &
  Record<`--oneui-action-section-${string}`, string | undefined>;

const defaults = {
  headerGap: "12px",
  linkColor: "#006de3",
  linkFontSize: "1rem",
  linkFontWeight: 600,
  linkLineHeight: 1.4,
  marginBlock: "24px",
  stackGap: "20px",
  titleFontSize: "1.25rem",
  titleFontWeight: 600,
  titleLineHeight: 1.3
} as const;

const readThemeToken = (
  theme: ThemeTokenBag,
  key: string,
  fallback: string | number
): string => {
  const value = theme[key];
  return String(value ?? fallback);
};

export const createActionSectionThemeVars = (theme: ThemeTokenBag): ActionSectionCssVars => {
  return {
    "--oneui-action-section-header-gap": defaults.headerGap,
    "--oneui-action-section-link-color": readThemeToken(theme, "colorBrandForegroundLink", defaults.linkColor),
    "--oneui-action-section-link-font-size": readThemeToken(theme, "fontSizeBase300", defaults.linkFontSize),
    "--oneui-action-section-link-font-weight": String(defaults.linkFontWeight),
    "--oneui-action-section-link-line-height": String(defaults.linkLineHeight),
    "--oneui-action-section-margin-block": defaults.marginBlock,
    "--oneui-action-section-stack-gap": defaults.stackGap,
    "--oneui-action-section-title-color": readThemeToken(theme, "colorNeutralForeground1", "#1a1a1a"),
    "--oneui-action-section-title-font-size": readThemeToken(theme, "fontSizeBase500", defaults.titleFontSize),
    "--oneui-action-section-title-font-weight": readThemeToken(theme, "fontWeightSemibold", defaults.titleFontWeight),
    "--oneui-action-section-title-line-height": String(defaults.titleLineHeight)
  };
};
