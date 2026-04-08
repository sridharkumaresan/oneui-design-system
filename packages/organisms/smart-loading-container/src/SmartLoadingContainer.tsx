import React from "react";

import { OneUIHeading, OneUIStack, OneUIText } from "@functions-oneui/atoms";

import { useSmartLoadingContainerClassNames } from "./SmartLoadingContainer.styles.js";
import type { SmartLoadingContainerProps } from "./SmartLoadingContainer.types.js";

export const SmartLoadingContainer = (props: SmartLoadingContainerProps): React.JSX.Element => {
  const {
    actions,
    as = "section",
    children,
    className,
    description,
    headingLevel = 2,
    layout = "split",
    progressSlot,
    title,
    ...restProps
  } = props;
  const classNames = useSmartLoadingContainerClassNames(layout, className);
  const Component = as as React.ElementType;

  return React.createElement(
    Component,
    {
      ...restProps,
      className: classNames.container,
      "data-oneui-smart-loading-container": ""
    },
    <>
      <header className={classNames.header}>
        <div className={classNames.headerRow}>
          <OneUIStack gap="xs">
            <OneUIHeading level={headingLevel}>{title}</OneUIHeading>
            {description ? <OneUIText tone="secondary">{description}</OneUIText> : null}
          </OneUIStack>
          {actions ? <div className={classNames.sectionActions}>{actions}</div> : null}
        </div>
        {progressSlot}
      </header>
      <div className={classNames.contentGrid}>{children}</div>
    </>
  );
};
