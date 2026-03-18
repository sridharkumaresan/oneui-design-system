import React from "react";
import { useFluent } from "@fluentui/react-components";
import { oneuiLightTheme } from "@functions-oneui/theme";
import { useOneUIId } from "@functions-oneui/react-utils";

import { useActionCardClassNames } from "./ActionCard.styles.js";
import type { ActionCardProps } from "./ActionCard.types.js";

type ThemeTokenBag = Record<string, string | number | undefined>;
type ActionCardCssVars = React.CSSProperties &
  Record<`--oneui-action-card-${string}`, string | undefined>;

const readThemeToken = (
  theme: ThemeTokenBag,
  key: string,
  fallback: string | number
): string => {
  const value = theme[key];
  return String(value ?? fallback);
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

const getActionCardThemeVars = (
  theme: ThemeTokenBag,
  density: NonNullable<ActionCardProps["density"]>,
  hasStatus: boolean,
  hasActions: boolean
): ActionCardCssVars => {
  const paddingDesktopReduction =
    density === "compact" ? readThemeToken(theme, "spacingHorizontalS", "8px") : "0px";
  const paddingTabletReduction =
    density === "compact" ? readThemeToken(theme, "spacingHorizontalS", "8px") : "0px";
  const paddingMobileReduction =
    density === "compact" ? readThemeToken(theme, "spacingHorizontalXS", "4px") : "0px";
  const compactGapOverride =
    density === "compact"
      ? readThemeToken(theme, "oneuiActionCardGapActionItemsTablet", "10px")
      : readThemeToken(theme, "oneuiActionCardGapActionItemsDesktop", "12px");
  const gridTemplates = getGridTemplates(hasStatus, hasActions);

  return {
    "--oneui-action-card-actions-rail-max-width-desktop": readThemeToken(
      theme,
      "oneuiActionCardActionsRailMaxWidthDesktop",
      "320px"
    ),
    "--oneui-action-card-actions-rail-min-width-desktop": readThemeToken(
      theme,
      "oneuiActionCardActionsRailMinWidthDesktop",
      "280px"
    ),
    "--oneui-action-card-actions-rail-min-width-tablet": readThemeToken(
      theme,
      "oneuiActionCardActionsRailMinWidthTablet",
      "240px"
    ),
    "--oneui-action-card-action-gap": compactGapOverride,
    "--oneui-action-card-background": readThemeToken(theme, "oneuiActionCardBackground", "#ffffff"),
    "--oneui-action-card-border-color": readThemeToken(
      theme,
      "oneuiActionCardBorderColor",
      "#d8d8d8"
    ),
    "--oneui-action-card-border-width": readThemeToken(theme, "oneuiActionCardBorderWidth", "1px"),
    "--oneui-action-card-button-min-height": readThemeToken(
      theme,
      "oneuiActionCardButtonMinHeight",
      "44px"
    ),
    "--oneui-action-card-button-min-width": readThemeToken(
      theme,
      "oneuiActionCardButtonMinWidth",
      "120px"
    ),
    "--oneui-action-card-content-status-gap-desktop": readThemeToken(
      theme,
      "oneuiActionCardGapContentToStatusDesktop",
      "32px"
    ),
    "--oneui-action-card-content-status-gap-tablet": readThemeToken(
      theme,
      "oneuiActionCardGapContentToStatusTablet",
      "24px"
    ),
    "--oneui-action-card-content-status-padding-end-desktop": hasStatus ? "8px" : "0px",
    "--oneui-action-card-content-status-padding-end-tablet": hasStatus ? "4px" : "0px",
    "--oneui-action-card-divider-color": readThemeToken(
      theme,
      "oneuiActionCardDividerColor",
      "#d8d8d8"
    ),
    "--oneui-action-card-divider-width": readThemeToken(theme, "oneuiActionCardDividerWidth", "1px"),
    "--oneui-action-card-eyebrow-color": readThemeToken(
      theme,
      "oneuiActionCardEyebrowColor",
      "#515151"
    ),
    "--oneui-action-card-eyebrow-font-size": readThemeToken(
      theme,
      "oneuiActionCardEyebrowFontSize",
      "0.75rem"
    ),
    "--oneui-action-card-eyebrow-font-weight": readThemeToken(
      theme,
      "oneuiActionCardEyebrowFontWeight",
      500
    ),
    "--oneui-action-card-eyebrow-line-height": readThemeToken(
      theme,
      "oneuiActionCardEyebrowLineHeight",
      1.4
    ),
    "--oneui-action-card-footer-color": readThemeToken(
      theme,
      "oneuiActionCardFooterColor",
      "#515151"
    ),
    "--oneui-action-card-footer-divider-margin": readThemeToken(
      theme,
      "oneuiActionCardGapFooterDividerMargin",
      "20px"
    ),
    "--oneui-action-card-footer-font-size": readThemeToken(
      theme,
      "oneuiActionCardFooterFontSize",
      "0.875rem"
    ),
    "--oneui-action-card-footer-font-weight": readThemeToken(
      theme,
      "oneuiActionCardFooterFontWeight",
      400
    ),
    "--oneui-action-card-footer-line-height": readThemeToken(
      theme,
      "oneuiActionCardFooterLineHeight",
      1.6
    ),
    "--oneui-action-card-grid-columns-medium": gridTemplates.medium,
    "--oneui-action-card-grid-columns-stacked": gridTemplates.stacked,
    "--oneui-action-card-grid-columns-wide": gridTemplates.wide,
    "--oneui-action-card-link-color": readThemeToken(theme, "oneuiActionCardLinkColor", "#006de3"),
    "--oneui-action-card-link-font-size": readThemeToken(
      theme,
      "oneuiActionCardLinkFontSize",
      "1rem"
    ),
    "--oneui-action-card-link-font-weight": readThemeToken(
      theme,
      "oneuiActionCardLinkFontWeight",
      600
    ),
    "--oneui-action-card-link-line-height": readThemeToken(
      theme,
      "oneuiActionCardLinkLineHeight",
      1.4
    ),
    "--oneui-action-card-main-gap-mobile": readThemeToken(
      theme,
      "oneuiActionCardGapStackedMobile",
      "16px"
    ),
    "--oneui-action-card-meta-color": readThemeToken(theme, "oneuiActionCardMetaColor", "#515151"),
    "--oneui-action-card-meta-font-size": readThemeToken(
      theme,
      "oneuiActionCardMetaFontSize",
      "1rem"
    ),
    "--oneui-action-card-meta-font-weight": readThemeToken(
      theme,
      "oneuiActionCardMetaFontWeight",
      400
    ),
    "--oneui-action-card-meta-gap": readThemeToken(theme, "oneuiActionCardGapMetaItems", "8px"),
    "--oneui-action-card-meta-line-height": readThemeToken(
      theme,
      "oneuiActionCardMetaLineHeight",
      1.6
    ),
    "--oneui-action-card-padding-block-desktop": `calc(${readThemeToken(
      theme,
      "oneuiActionCardPaddingBlockDesktop",
      "24px"
    )} - ${paddingDesktopReduction})`,
    "--oneui-action-card-padding-block-mobile": `calc(${readThemeToken(
      theme,
      "oneuiActionCardPaddingBlockMobile",
      "16px"
    )} - ${paddingMobileReduction})`,
    "--oneui-action-card-padding-block-tablet": `calc(${readThemeToken(
      theme,
      "oneuiActionCardPaddingBlockTablet",
      "20px"
    )} - ${paddingTabletReduction})`,
    "--oneui-action-card-padding-inline-desktop": `calc(${readThemeToken(
      theme,
      "oneuiActionCardPaddingInlineDesktop",
      "32px"
    )} - ${paddingDesktopReduction})`,
    "--oneui-action-card-padding-inline-mobile": `calc(${readThemeToken(
      theme,
      "oneuiActionCardPaddingInlineMobile",
      "16px"
    )} - ${paddingMobileReduction})`,
    "--oneui-action-card-padding-inline-tablet": `calc(${readThemeToken(
      theme,
      "oneuiActionCardPaddingInlineTablet",
      "24px"
    )} - ${paddingTabletReduction})`,
    "--oneui-action-card-radius": readThemeToken(theme, "oneuiActionCardRadius", "16px"),
    "--oneui-action-card-shadow": readThemeToken(
      theme,
      "oneuiActionCardShadow",
      "0 8px 24px -18px rgba(0, 0, 0, 0.28)"
    ),
    "--oneui-action-card-status-divider-gap-desktop": readThemeToken(
      theme,
      "oneuiActionCardGapStatusToDividerDesktop",
      "24px"
    ),
    "--oneui-action-card-status-divider-gap-tablet": readThemeToken(
      theme,
      "oneuiActionCardGapStatusToDividerTablet",
      "20px"
    ),
    "--oneui-action-card-status-min-height": readThemeToken(
      theme,
      "oneuiActionCardStatusMinHeight",
      "30px"
    ),
    "--oneui-action-card-status-padding-inline": readThemeToken(
      theme,
      "oneuiActionCardStatusPaddingInline",
      "13px"
    ),
    "--oneui-action-card-title-color": readThemeToken(theme, "oneuiActionCardTitleColor", "#1a1a1a"),
    "--oneui-action-card-title-font-size": readThemeToken(
      theme,
      "oneuiActionCardTitleFontSize",
      "1.75rem"
    ),
    "--oneui-action-card-title-font-weight": readThemeToken(
      theme,
      "oneuiActionCardTitleFontWeight",
      600
    ),
    "--oneui-action-card-title-line-height": readThemeToken(
      theme,
      "oneuiActionCardTitleLineHeight",
      1.22
    ),
    "--oneui-action-card-title-meta-gap": readThemeToken(
      theme,
      "oneuiActionCardGapTitleToMeta",
      "12px"
    ),
    "--oneui-action-card-top-gap": readThemeToken(theme, "oneuiActionCardGapEyebrowToTitle", "12px")
  };
};

export const ActionCard = (props: ActionCardProps): React.JSX.Element => {
  const {
    actions,
    as = "article",
    className,
    density = "default",
    eyebrow,
    footer,
    headingLevel = 3,
    isDisabled = false,
    layout = "auto",
    meta,
    status,
    style,
    title,
    ...restProps
  } = props;
  const fluent = useFluent() as unknown as { theme?: ThemeTokenBag };
  const theme = (fluent.theme ?? oneuiLightTheme) as ThemeTokenBag;
  const hasActions = Boolean(actions);
  const hasFooter = Boolean(footer);
  const hasStatus = Boolean(status);
  const classNames = useActionCardClassNames({
    className,
    density,
    hasActions,
    hasFooter,
    hasStatus,
    isDisabled,
    layout
  });
  const titleId = useOneUIId("oneui-action-card-title");
  const HeadingTag = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;
  const Root = as as React.ElementType;
  const resolvedStyle = {
    ...getActionCardThemeVars(theme, density, hasStatus, hasActions),
    ...style
  } as React.CSSProperties;

  return (
    <Root
      {...restProps}
      aria-disabled={isDisabled || undefined}
      aria-labelledby={titleId}
      className={classNames.root}
      data-oneui-action-card=""
      data-oneui-action-card-density={density}
      data-oneui-action-card-layout={layout}
      data-oneui-action-card-with-actions={hasActions || undefined}
      data-oneui-action-card-with-footer={hasFooter || undefined}
      data-oneui-action-card-with-status={hasStatus || undefined}
      style={resolvedStyle}
    >
      <div className={classNames.mainGrid} data-oneui-action-card-region="mainGrid">
        <div className={classNames.contentRegion} data-oneui-action-card-region="contentRegion">
          {eyebrow ? (
            <div className={classNames.eyebrow} data-oneui-action-card-region="eyebrow">
              {eyebrow}
            </div>
          ) : null}
          <HeadingTag className={classNames.title} id={titleId}>
            {title}
          </HeadingTag>
          {meta ? (
            <div className={classNames.meta} data-oneui-action-card-region="meta">
              {meta}
            </div>
          ) : null}
        </div>
        {status ? (
          <div className={classNames.statusRegion} data-oneui-action-card-region="statusRegion">
            {status}
          </div>
        ) : null}
        {hasActions ? (
          <div
            aria-hidden="true"
            className={classNames.dividerRegion}
            data-oneui-action-card-region="dividerRegion"
          />
        ) : null}
        {actions ? (
          <div className={classNames.actionsRegion} data-oneui-action-card-region="actionsRegion">
            {actions}
          </div>
        ) : null}
      </div>
      {footer ? (
        <div className={classNames.footerRegion} data-oneui-action-card-region="footerRegion">
          {footer}
        </div>
      ) : null}
    </Root>
  );
};
