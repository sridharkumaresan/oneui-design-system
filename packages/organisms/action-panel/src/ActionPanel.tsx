import React from "react";

import {
  OneUIButton,
  OneUICard,
  OneUIHeading,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";
import { useOneUIId } from "@functions-oneui/react-utils";

import { useActionPanelClassNames } from "./ActionPanel.styles.js";
import type { ActionPanelAction, ActionPanelProps } from "./ActionPanel.types.js";

const renderAction = (
  action: ActionPanelAction,
  appearance: "primary" | "secondary",
  stretch: boolean
): React.JSX.Element => {
  const { disabled = false, icon, label, onClick, size = "medium" } = action;

  return (
    <OneUIButton
      appearance={appearance}
      disabled={disabled}
      icon={icon}
      onClick={onClick}
      size={size}
      stretch={stretch}
    >
      {label}
    </OneUIButton>
  );
};

export const ActionPanel = (props: ActionPanelProps): React.JSX.Element => {
  const {
    as = "section",
    className,
    description,
    headingLevel = 3,
    layout = "inline",
    primaryAction,
    secondaryAction,
    title,
    ...restProps
  } = props;
  const classNames = useActionPanelClassNames(layout, className);
  const titleId = useOneUIId("oneui-action-panel-title");
  const descriptionId = description
    ? useOneUIId("oneui-action-panel-description")
    : undefined;
  const stretchActions = layout === "stacked";

  return (
    <OneUICard
      {...restProps}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      as={as}
      className={classNames.root}
      data-oneui-action-panel=""
      data-oneui-action-panel-layout={layout}
      elevation="raised"
      padding="lg"
      role="region"
    >
      <div className={classNames.content}>
        <OneUIStack className={classNames.textBlock} gap="xs">
          <OneUIHeading id={titleId} level={headingLevel}>
            {title}
          </OneUIHeading>
          {description ? (
            <OneUIText block id={descriptionId} tone="secondary">
              {description}
            </OneUIText>
          ) : null}
        </OneUIStack>
        <div className={classNames.actions}>
          {secondaryAction ? renderAction(secondaryAction, "secondary", stretchActions) : null}
          {renderAction(primaryAction, "primary", stretchActions)}
        </div>
      </div>
    </OneUICard>
  );
};
