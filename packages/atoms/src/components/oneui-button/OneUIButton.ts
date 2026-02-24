// @ts-nocheck
import React from "react";

import { Button, makeStyles, mergeClasses, useFluent } from "@fluentui/react-components";

import { oneuiLightTheme } from "@functions-oneui/theme";
import { semanticTokens } from "@functions-oneui/tokens";

const useStyles = makeStyles({
  root: {
    borderRadius: oneuiLightTheme.borderRadiusMedium,
    fontWeight: oneuiLightTheme.fontWeightSemibold
  }
});

const lightFallback = semanticTokens.light;

const getToneStyles = (theme, tone) => {
  if (tone === "neutral") {
    return {
      backgroundColor: theme.colorNeutralBackground2 ?? lightFallback.color.background.surface,
      color: theme.colorNeutralForeground1 ?? lightFallback.color.text.primary,
      borderColor: theme.colorNeutralStroke1 ?? lightFallback.color.border.default
    };
  }

  return {
    backgroundColor: theme.colorBrandBackground ?? lightFallback.color.background.brand,
    color: theme.colorNeutralForegroundInverted ?? lightFallback.color.text.inverse,
    borderColor: theme.colorBrandStroke1 ?? lightFallback.color.border.brand
  };
};

export const OneUIButton = React.forwardRef(function OneUIButton(props, ref) {
  const {
    tone = "brand",
    stretch = false,
    className,
    style,
    children,
    ...buttonProps
  } = props;

  const styles = useStyles();
  const fluent = useFluent();
  const toneStyles = getToneStyles(fluent.theme ?? {}, tone);
  const stretchStyle = stretch ? { width: "100%" } : undefined;

  return React.createElement(
    Button,
    {
      ...buttonProps,
      ref,
      appearance: "secondary",
      className: mergeClasses(styles.root, className),
      style: {
        ...toneStyles,
        ...stretchStyle,
        ...style
      }
    },
    children
  );
});
