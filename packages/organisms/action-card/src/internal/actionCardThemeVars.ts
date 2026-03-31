import React from "react";

type ThemeTokenBag = Record<string, string | number | undefined>;

export type ActionCardCssVars = React.CSSProperties &
  Record<`--oneui-action-card-${string}`, string | undefined>;

const defaults = {
  actionsRailMaxWidthDesktop: "320px",
  actionsRailMinWidthDesktop: "280px",
  actionsRailMinWidthTablet: "240px",
  actionGapCompact: "10px",
  actionGapDefault: "12px",
  backgroundLight: "#ffffff",
  backgroundDark: "#1a1a1a",
  borderColorLight: "#d8d8d8",
  borderColorDark: "#4a4a4a",
  borderWidth: "1px",
  buttonMinHeight: "44px",
  buttonMinWidth: "120px",
  contentStatusGapDesktop: "32px",
  contentStatusGapTablet: "24px",
  dividerColorLight: "#d8d8d8",
  dividerColorDark: "#4a4a4a",
  dividerWidth: "1px",
  eyebrowFontSize: "0.75rem",
  eyebrowFontWeight: 500,
  eyebrowLineHeight: 1.4,
  footerDividerMargin: "20px",
  footerFontSize: "0.875rem",
  footerFontWeight: 400,
  footerLineHeight: 1.6,
  linkFontWeight: 600,
  linkLineHeight: 1.4,
  mainGapMobile: "16px",
  metaGap: "8px",
  metaLineHeight: 1.6,
  metaFontWeight: 400,
  paddingBlockDesktop: "24px",
  paddingBlockTablet: "20px",
  paddingBlockMobile: "16px",
  paddingInlineDesktop: "32px",
  paddingInlineTablet: "24px",
  paddingInlineMobile: "16px",
  radius: "16px",
  shadowLight: "0 8px 24px -18px rgba(0, 0, 0, 0.28)",
  shadowDark: "0 10px 28px -18px rgba(0, 0, 0, 0.54)",
  statusDividerGapDesktop: "24px",
  statusDividerGapTablet: "20px",
  statusMinHeight: "30px",
  statusPaddingInline: "13px",
  titleLineHeight: 1.22,
  titleMetaGap: "12px",
  topGap: "12px"
} as const;

const readThemeToken = (
  theme: ThemeTokenBag,
  key: string,
  fallback: string | number
): string => {
  const value = theme[key];
  return String(value ?? fallback);
};

const resolveMode = (theme: ThemeTokenBag): "light" | "dark" => {
  const background = String(theme.colorNeutralBackground1 ?? "").toLowerCase();
  return background === "#ffffff" || background === "#fff" ? "light" : "dark";
};

const getGridTemplates = (hasStatus: boolean, hasActions: boolean) => {
  if (hasStatus && hasActions) {
    return {
      medium:
        "minmax(0, 1fr) auto var(--oneui-action-card-divider-width) minmax(var(--oneui-action-card-actions-rail-min-width-tablet), var(--oneui-action-card-actions-rail-max-width-desktop))",
      stacked: "minmax(0, 1fr)",
      wide:
        "minmax(0, 1fr) auto var(--oneui-action-card-divider-width) minmax(var(--oneui-action-card-actions-rail-min-width-desktop), var(--oneui-action-card-actions-rail-max-width-desktop))"
    };
  }

  if (hasActions) {
    return {
      medium:
        "minmax(0, 1fr) var(--oneui-action-card-divider-width) minmax(var(--oneui-action-card-actions-rail-min-width-tablet), var(--oneui-action-card-actions-rail-max-width-desktop))",
      stacked: "minmax(0, 1fr)",
      wide:
        "minmax(0, 1fr) var(--oneui-action-card-divider-width) minmax(var(--oneui-action-card-actions-rail-min-width-desktop), var(--oneui-action-card-actions-rail-max-width-desktop))"
    };
  }

  if (hasStatus) {
    return {
      medium: "minmax(0, 1fr) auto",
      stacked: "minmax(0, 1fr)",
      wide: "minmax(0, 1fr) auto"
    };
  }

  return {
    medium: "minmax(0, 1fr)",
    stacked: "minmax(0, 1fr)",
    wide: "minmax(0, 1fr)"
  };
};

export const createActionCardThemeVars = (options: {
  density: "default" | "compact";
  hasActions: boolean;
  hasStatus: boolean;
  theme: ThemeTokenBag;
}): ActionCardCssVars => {
  const { density, hasActions, hasStatus, theme } = options;
  const mode = resolveMode(theme);
  const paddingDesktopReduction = density === "compact" ? readThemeToken(theme, "spacingHorizontalS", "8px") : "0px";
  const paddingTabletReduction = density === "compact" ? readThemeToken(theme, "spacingHorizontalS", "8px") : "0px";
  const paddingMobileReduction = density === "compact" ? readThemeToken(theme, "spacingHorizontalXS", "4px") : "0px";
  const gridTemplates = getGridTemplates(hasStatus, hasActions);

  return {
    "--oneui-action-card-actions-rail-max-width-desktop": defaults.actionsRailMaxWidthDesktop,
    "--oneui-action-card-actions-rail-min-width-desktop": defaults.actionsRailMinWidthDesktop,
    "--oneui-action-card-actions-rail-min-width-tablet": defaults.actionsRailMinWidthTablet,
    "--oneui-action-card-action-gap":
      density === "compact" ? defaults.actionGapCompact : defaults.actionGapDefault,
    "--oneui-action-card-background": readThemeToken(
      theme,
      "colorNeutralBackground1",
      mode === "light" ? defaults.backgroundLight : defaults.backgroundDark
    ),
    "--oneui-action-card-border-color": readThemeToken(
      theme,
      "colorNeutralStroke1",
      mode === "light" ? defaults.borderColorLight : defaults.borderColorDark
    ),
    "--oneui-action-card-border-width": defaults.borderWidth,
    "--oneui-action-card-button-min-height": defaults.buttonMinHeight,
    "--oneui-action-card-button-min-width": defaults.buttonMinWidth,
    "--oneui-action-card-content-status-gap-desktop": defaults.contentStatusGapDesktop,
    "--oneui-action-card-content-status-gap-tablet": defaults.contentStatusGapTablet,
    "--oneui-action-card-content-status-padding-end-desktop": hasStatus ? "8px" : "0px",
    "--oneui-action-card-content-status-padding-end-tablet": hasStatus ? "4px" : "0px",
    "--oneui-action-card-divider-color": readThemeToken(
      theme,
      "colorNeutralStroke1",
      mode === "light" ? defaults.dividerColorLight : defaults.dividerColorDark
    ),
    "--oneui-action-card-divider-width": defaults.dividerWidth,
    "--oneui-action-card-eyebrow-color": readThemeToken(theme, "colorNeutralForeground2", "#515151"),
    "--oneui-action-card-eyebrow-font-size": readThemeToken(theme, "fontSizeBase100", defaults.eyebrowFontSize),
    "--oneui-action-card-eyebrow-font-weight": String(defaults.eyebrowFontWeight),
    "--oneui-action-card-eyebrow-line-height": String(defaults.eyebrowLineHeight),
    "--oneui-action-card-footer-color": readThemeToken(theme, "colorNeutralForeground2", "#515151"),
    "--oneui-action-card-footer-divider-margin": defaults.footerDividerMargin,
    "--oneui-action-card-footer-font-size": readThemeToken(theme, "fontSizeBase200", defaults.footerFontSize),
    "--oneui-action-card-footer-font-weight": String(defaults.footerFontWeight),
    "--oneui-action-card-footer-line-height": String(defaults.footerLineHeight),
    "--oneui-action-card-grid-columns-medium": gridTemplates.medium,
    "--oneui-action-card-grid-columns-stacked": gridTemplates.stacked,
    "--oneui-action-card-grid-columns-wide": gridTemplates.wide,
    "--oneui-action-card-link-color": readThemeToken(theme, "colorBrandForegroundLink", "#006de3"),
    "--oneui-action-card-link-font-size": readThemeToken(theme, "fontSizeBase300", "1rem"),
    "--oneui-action-card-link-font-weight": String(defaults.linkFontWeight),
    "--oneui-action-card-link-line-height": String(defaults.linkLineHeight),
    "--oneui-action-card-main-gap-mobile": defaults.mainGapMobile,
    "--oneui-action-card-meta-color": readThemeToken(theme, "colorNeutralForeground2", "#515151"),
    "--oneui-action-card-meta-font-size": readThemeToken(theme, "fontSizeBase300", "1rem"),
    "--oneui-action-card-meta-font-weight": String(defaults.metaFontWeight),
    "--oneui-action-card-meta-gap": defaults.metaGap,
    "--oneui-action-card-meta-line-height": String(defaults.metaLineHeight),
    "--oneui-action-card-padding-block-desktop": `calc(${defaults.paddingBlockDesktop} - ${paddingDesktopReduction})`,
    "--oneui-action-card-padding-block-mobile": `calc(${defaults.paddingBlockMobile} - ${paddingMobileReduction})`,
    "--oneui-action-card-padding-block-tablet": `calc(${defaults.paddingBlockTablet} - ${paddingTabletReduction})`,
    "--oneui-action-card-padding-inline-desktop": `calc(${defaults.paddingInlineDesktop} - ${paddingDesktopReduction})`,
    "--oneui-action-card-padding-inline-mobile": `calc(${defaults.paddingInlineMobile} - ${paddingMobileReduction})`,
    "--oneui-action-card-padding-inline-tablet": `calc(${defaults.paddingInlineTablet} - ${paddingTabletReduction})`,
    "--oneui-action-card-radius": readThemeToken(theme, "borderRadiusLarge", defaults.radius),
    "--oneui-action-card-shadow": readThemeToken(
      theme,
      "shadow16",
      mode === "light" ? defaults.shadowLight : defaults.shadowDark
    ),
    "--oneui-action-card-status-divider-gap-desktop": defaults.statusDividerGapDesktop,
    "--oneui-action-card-status-divider-gap-tablet": defaults.statusDividerGapTablet,
    "--oneui-action-card-status-min-height": defaults.statusMinHeight,
    "--oneui-action-card-status-padding-inline": defaults.statusPaddingInline,
    "--oneui-action-card-title-color": readThemeToken(theme, "colorNeutralForeground1", "#1a1a1a"),
    "--oneui-action-card-title-font-size": readThemeToken(theme, "fontSizeBase600", "1.5rem"),
    "--oneui-action-card-title-font-weight": readThemeToken(theme, "fontWeightSemibold", 600),
    "--oneui-action-card-title-line-height": String(defaults.titleLineHeight),
    "--oneui-action-card-title-meta-gap": defaults.titleMetaGap,
    "--oneui-action-card-top-gap": defaults.topGap
  };
};
