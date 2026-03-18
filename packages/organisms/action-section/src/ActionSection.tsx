import React from "react";
import { useFluent } from "@fluentui/react-components";
import { oneuiLightTheme } from "@functions-oneui/theme";
import { useOneUIId } from "@functions-oneui/react-utils";

import { useActionSectionClassNames } from "./ActionSection.styles.js";
import type { ActionSectionProps } from "./ActionSection.types.js";

type ThemeTokenBag = Record<string, string | number | undefined>;
type ActionSectionCssVars = React.CSSProperties &
  Record<`--oneui-action-section-${string}`, string | undefined>;

const readThemeToken = (
  theme: ThemeTokenBag,
  key: string,
  fallback: string | number
): string => {
  const value = theme[key];
  return String(value ?? fallback);
};

const getActionSectionThemeVars = (theme: ThemeTokenBag): ActionSectionCssVars => {
  return {
    "--oneui-action-section-header-gap": readThemeToken(theme, "oneuiActionSectionHeaderGap", "12px"),
    "--oneui-action-section-link-color": readThemeToken(theme, "oneuiActionSectionLinkColor", "#006de3"),
    "--oneui-action-section-link-font-size": readThemeToken(
      theme,
      "oneuiActionSectionLinkFontSize",
      "1rem"
    ),
    "--oneui-action-section-link-font-weight": readThemeToken(
      theme,
      "oneuiActionSectionLinkFontWeight",
      600
    ),
    "--oneui-action-section-link-line-height": readThemeToken(
      theme,
      "oneuiActionSectionLinkLineHeight",
      1.4
    ),
    "--oneui-action-section-margin-block": readThemeToken(
      theme,
      "oneuiActionSectionMarginBlock",
      "24px"
    ),
    "--oneui-action-section-stack-gap": readThemeToken(theme, "oneuiActionSectionStackGap", "20px"),
    "--oneui-action-section-title-color": readThemeToken(
      theme,
      "oneuiActionSectionTitleColor",
      "#1a1a1a"
    ),
    "--oneui-action-section-title-font-size": readThemeToken(
      theme,
      "oneuiActionSectionTitleFontSize",
      "1.25rem"
    ),
    "--oneui-action-section-title-font-weight": readThemeToken(
      theme,
      "oneuiActionSectionTitleFontWeight",
      600
    ),
    "--oneui-action-section-title-line-height": readThemeToken(
      theme,
      "oneuiActionSectionTitleLineHeight",
      1.3
    )
  };
};

export const ActionSection = (props: ActionSectionProps): React.JSX.Element => {
  const { children, className, count, headerAction, style, title, ...restProps } = props;
  const fluent = useFluent() as unknown as { theme?: ThemeTokenBag };
  const theme = (fluent.theme ?? oneuiLightTheme) as ThemeTokenBag;
  const titleId = useOneUIId("oneui-action-section-title");
  const classNames = useActionSectionClassNames({ className });
  const resolvedStyle = {
    ...getActionSectionThemeVars(theme),
    ...style
  } as React.CSSProperties;

  return (
    <section
      {...restProps}
      aria-labelledby={titleId}
      className={classNames.root}
      data-oneui-action-section=""
      style={resolvedStyle}
    >
      <div className={classNames.header} data-oneui-action-section-region="header">
        <div className={classNames.titleCluster}>
          <h2 className={classNames.title} id={titleId}>
            {title}
          </h2>
          {count ? <span className={classNames.count}>({count})</span> : null}
        </div>
        {headerAction ? (
          <div className={classNames.headerAction} data-oneui-action-section-region="headerAction">
            {headerAction}
          </div>
        ) : null}
      </div>
      <div className={classNames.stack} data-oneui-action-section-region="stack">
        {children}
      </div>
    </section>
  );
};
