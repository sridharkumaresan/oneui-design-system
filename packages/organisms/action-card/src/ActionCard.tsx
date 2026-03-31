import React from "react";
import { useFluent } from "@fluentui/react-components";
import { oneuiLightTheme } from "@functions-oneui/theme";
import { useOneUIId } from "@functions-oneui/react-utils";

import { useActionCardClassNames } from "./ActionCard.styles.js";
import { createActionCardThemeVars } from "./internal/actionCardThemeVars.js";
import type { ActionCardProps } from "./ActionCard.types.js";

type ThemeTokenBag = Record<string, string | number | undefined>;

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
    ...createActionCardThemeVars({
      density,
      hasActions,
      hasStatus,
      theme
    }),
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
