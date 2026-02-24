import React from "react";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import { OneUIButton } from "@functions-oneui/atoms";
import { oneuiLightTheme } from "@functions-oneui/theme";

export type ActionPanelLayout = "inline" | "stacked";

export type ActionPanelAction = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export type ActionPanelProps = {
  title: string;
  description?: string;
  primaryAction: ActionPanelAction;
  secondaryAction?: ActionPanelAction;
  layout?: ActionPanelLayout;
  className?: string;
};

type OneUIButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  stretch?: boolean;
  tone?: "brand" | "neutral";
};

const ButtonComponent = OneUIButton as unknown as React.ComponentType<OneUIButtonProps>;
const fallbackBorderRadius = String(oneuiLightTheme.borderRadiusMedium);

const useStyles = makeStyles({
  root: {
    display: "flex",
    gap: tokens.spacingHorizontalL,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: fallbackBorderRadius,
    backgroundColor: tokens.colorNeutralBackground2,
    borderTopStyle: "solid",
    borderTopWidth: tokens.strokeWidthThin,
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightStyle: "solid",
    borderRightWidth: tokens.strokeWidthThin,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomStyle: "solid",
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftStyle: "solid",
    borderLeftWidth: tokens.strokeWidthThin,
    borderLeftColor: tokens.colorNeutralStroke1
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  stacked: {
    flexDirection: "column",
    alignItems: "stretch"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    minWidth: "0",
    flexGrow: 1
  },
  title: {
    margin: "0",
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: oneuiLightTheme.fontWeightSemibold,
    overflowWrap: "anywhere"
  },
  description: {
    margin: "0",
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: "anywhere"
  },
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap"
  },
  actionsInline: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  actionsStacked: {
    justifyContent: "flex-start",
    alignItems: "stretch",
    width: "100%"
  }
});

export const ActionPanel = React.forwardRef<HTMLDivElement, ActionPanelProps>(function ActionPanel(props, ref) {
  const { title, description, primaryAction, secondaryAction, layout = "inline", className } = props;
  const styles = useStyles();
  const titleId = React.useId();
  const isStacked = layout === "stacked";

  return React.createElement(
    "section",
    {
      ref,
      className: mergeClasses(styles.root, isStacked ? styles.stacked : styles.inline, className),
      "aria-labelledby": titleId,
      "data-layout": layout
    },
    React.createElement(
      "div",
      { className: styles.content },
      React.createElement("h2", { className: styles.title, id: titleId }, title),
      description ? React.createElement("p", { className: styles.description }, description) : null
    ),
    React.createElement(
      "div",
      { className: mergeClasses(styles.actions, isStacked ? styles.actionsStacked : styles.actionsInline) },
      React.createElement(
        ButtonComponent,
        {
          disabled: primaryAction.disabled,
          onClick: primaryAction.onClick,
          stretch: isStacked
        },
        primaryAction.label
      ),
      secondaryAction
        ? React.createElement(
            ButtonComponent,
            {
              disabled: secondaryAction.disabled,
              onClick: secondaryAction.onClick,
              stretch: isStacked,
              tone: "neutral"
            },
            secondaryAction.label
          )
        : null
    )
  );
});
