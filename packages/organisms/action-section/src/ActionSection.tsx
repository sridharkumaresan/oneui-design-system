import React from "react";
import { useFluent } from "@fluentui/react-components";
import { oneuiLightTheme } from "@functions-oneui/theme";
import { useOneUIId } from "@functions-oneui/react-utils";

import { useActionSectionClassNames } from "./ActionSection.styles.js";
import { createActionSectionThemeVars } from "./internal/actionSectionThemeVars.js";
import type { ActionSectionProps } from "./ActionSection.types.js";

type ThemeTokenBag = Record<string, string | number | undefined>;

export const ActionSection = (props: ActionSectionProps): React.JSX.Element => {
  const { children, className, count, headerAction, style, title, ...restProps } = props;
  const fluent = useFluent() as unknown as { theme?: ThemeTokenBag };
  const theme = (fluent.theme ?? oneuiLightTheme) as ThemeTokenBag;
  const titleId = useOneUIId("oneui-action-section-title");
  const classNames = useActionSectionClassNames({ className });
  const resolvedStyle = {
    ...createActionSectionThemeVars(theme),
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
