import React from "react";

import { OneUIHeading, OneUIStack, OneUIText } from "@functions-oneui/atoms";

import { SmartLoadingSurfaceAppearanceContext } from "./SmartLoadingContainer.context.js";
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
    surfaceAppearance = "raised",
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
      "data-oneui-surface-appearance": surfaceAppearance,
      "data-oneui-smart-loading-container": ""
    },
    <SmartLoadingSurfaceAppearanceContext.Provider value={surfaceAppearance}>
      <header className={classNames.header}>
        <div className={classNames.headerRow}>
          <OneUIStack gap="xs">
            <OneUIHeading className={classNames.containerTitle} level={headingLevel}>
              {title}
            </OneUIHeading>
            {description ? <OneUIText tone="secondary">{description}</OneUIText> : null}
          </OneUIStack>
          {actions ? <div className={classNames.sectionActions}>{actions}</div> : null}
        </div>
        {progressSlot}
      </header>
      <div className={classNames.contentGrid}>{children}</div>
    </SmartLoadingSurfaceAppearanceContext.Provider>
  );
};
