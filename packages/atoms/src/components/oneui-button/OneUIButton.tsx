import React from "react";
import { Button, useFluent } from "@fluentui/react-components";
import { oneuiLightTheme } from "@functions-oneui/theme";

import { useOneUIButtonClassName } from "./OneUIButton.styles.js";
import type { OneUIButtonProps } from "./OneUIButton.types.js";

type ThemeTokenBag = Record<string, string | number | undefined>;
type ButtonPaintVars = React.CSSProperties &
  Record<`--oneui-button-${string}`, string | undefined>;

const readThemeToken = (
  theme: ThemeTokenBag,
  key: string,
  fallback: string
): string => {
  const value = theme[key];
  return typeof value === "string" ? value : fallback;
};

const getButtonPaintVars = (
  theme: ThemeTokenBag,
  appearance: NonNullable<OneUIButtonProps["appearance"]>,
  disabled: boolean
): ButtonPaintVars => {
  if (disabled) {
    const disabledBackground = readThemeToken(
      theme,
      "oneuiColorInteractionDisabledBackground",
      "#f6f6f6"
    );
    const disabledBorder = readThemeToken(
      theme,
      "oneuiColorInteractionDisabledBorder",
      "#eeeeee"
    );
    const disabledForeground = readThemeToken(
      theme,
      "oneuiColorInteractionDisabledForeground",
      "#8b8b8b"
    );

    return {
      "--oneui-button-background": disabledBackground,
      "--oneui-button-background-hover": disabledBackground,
      "--oneui-button-background-pressed": disabledBackground,
      "--oneui-button-border": disabledBorder,
      "--oneui-button-border-hover": disabledBorder,
      "--oneui-button-border-pressed": disabledBorder,
      "--oneui-button-foreground": disabledForeground,
      "--oneui-button-shadow": "none",
      "--oneui-button-shadow-hover": "none",
      "--oneui-button-shadow-pressed": "none"
    };
  }

  if (appearance === "primary") {
    return {
      "--oneui-button-background": readThemeToken(theme, "colorBrandBackground", "#006de3"),
      "--oneui-button-background-hover": readThemeToken(
        theme,
        "colorBrandBackgroundHover",
        "#005bbe"
      ),
      "--oneui-button-background-pressed": readThemeToken(
        theme,
        "colorBrandBackgroundPressed",
        "#004fa8"
      ),
      "--oneui-button-border": readThemeToken(theme, "colorBrandBackground", "#006de3"),
      "--oneui-button-border-hover": readThemeToken(theme, "colorBrandBackgroundHover", "#005bbe"),
      "--oneui-button-border-pressed": readThemeToken(
        theme,
        "colorBrandBackgroundPressed",
        "#004fa8"
      ),
      "--oneui-button-foreground": readThemeToken(
        theme,
        "colorNeutralForegroundOnBrand",
        "#ffffff"
      ),
      "--oneui-button-shadow": readThemeToken(theme, "shadow4", "none"),
      "--oneui-button-shadow-hover": readThemeToken(theme, "shadow8", "none"),
      "--oneui-button-shadow-pressed": readThemeToken(theme, "shadow4", "none")
    };
  }

  if (appearance === "secondary") {
    return {
      "--oneui-button-background": readThemeToken(
        theme,
        "oneuiColorInteractionSecondaryBackground",
        "#ffffff"
      ),
      "--oneui-button-background-hover": readThemeToken(
        theme,
        "oneuiColorInteractionSecondaryBackgroundHover",
        "#f6f6f6"
      ),
      "--oneui-button-background-pressed": readThemeToken(
        theme,
        "oneuiColorInteractionSecondaryBackgroundPressed",
        "#eeeeee"
      ),
      "--oneui-button-border": readThemeToken(
        theme,
        "oneuiColorInteractionSecondaryBorder",
        "#d8d8d8"
      ),
      "--oneui-button-border-hover": readThemeToken(
        theme,
        "oneuiColorInteractionSecondaryBorderHover",
        "#b8b8b8"
      ),
      "--oneui-button-border-pressed": readThemeToken(
        theme,
        "oneuiColorInteractionSecondaryBorderPressed",
        "#b8b8b8"
      ),
      "--oneui-button-foreground": readThemeToken(
        theme,
        "oneuiColorInteractionSecondaryForeground",
        "#1a1a1a"
      ),
      "--oneui-button-shadow": "none",
      "--oneui-button-shadow-hover": "none",
      "--oneui-button-shadow-pressed": "none"
    };
  }

  if (appearance === "subtle") {
    return {
      "--oneui-button-background": readThemeToken(
        theme,
        "oneuiColorInteractionSubtleBackground",
        "#f2f8fe"
      ),
      "--oneui-button-background-hover": readThemeToken(
        theme,
        "oneuiColorInteractionSubtleBackgroundHover",
        "#e7f0fb"
      ),
      "--oneui-button-background-pressed": readThemeToken(
        theme,
        "oneuiColorInteractionSubtleBackgroundPressed",
        "#e7f0fb"
      ),
      "--oneui-button-border": readThemeToken(
        theme,
        "oneuiColorInteractionSubtleBorder",
        "transparent"
      ),
      "--oneui-button-border-hover": readThemeToken(
        theme,
        "oneuiColorInteractionSubtleBorderHover",
        "transparent"
      ),
      "--oneui-button-border-pressed": readThemeToken(
        theme,
        "oneuiColorInteractionSubtleBorderPressed",
        "transparent"
      ),
      "--oneui-button-foreground": readThemeToken(
        theme,
        "oneuiColorInteractionSubtleForeground",
        "#006de3"
      ),
      "--oneui-button-shadow": "none",
      "--oneui-button-shadow-hover": "none",
      "--oneui-button-shadow-pressed": "none"
    };
  }

  return {
    "--oneui-button-background": readThemeToken(
      theme,
      "oneuiColorInteractionTransparentBackground",
      "transparent"
    ),
    "--oneui-button-background-hover": readThemeToken(
      theme,
      "oneuiColorInteractionTransparentBackgroundHover",
      "#f2f8fe"
    ),
    "--oneui-button-background-pressed": readThemeToken(
      theme,
      "oneuiColorInteractionTransparentBackgroundPressed",
      "#e7f0fb"
    ),
    "--oneui-button-border": readThemeToken(
      theme,
      "oneuiColorInteractionTransparentBorder",
      "transparent"
    ),
    "--oneui-button-border-hover": readThemeToken(
      theme,
      "oneuiColorInteractionTransparentBorderHover",
      "transparent"
    ),
    "--oneui-button-border-pressed": readThemeToken(
      theme,
      "oneuiColorInteractionTransparentBorderPressed",
      "transparent"
    ),
    "--oneui-button-foreground": readThemeToken(
      theme,
      "oneuiColorInteractionTransparentForeground",
      "#006de3"
    ),
    "--oneui-button-shadow": "none",
    "--oneui-button-shadow-hover": "none",
    "--oneui-button-shadow-pressed": "none"
  };
};

export const OneUIButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, OneUIButtonProps>(
  (props, ref) => {
    const {
      appearance = "primary",
      children,
      className,
      size = "medium",
      stretch = false,
      ...buttonProps
    } = props;
    const fluent = useFluent() as unknown as { theme?: ThemeTokenBag };
    const theme = (fluent.theme ?? oneuiLightTheme) as ThemeTokenBag;
    const buttonClassName = useOneUIButtonClassName({
      appearance,
      className,
      disabled: Boolean(buttonProps.disabled),
      size,
      stretch
    });
    const buttonPaintVars = getButtonPaintVars(theme, appearance, Boolean(buttonProps.disabled));
    const resolvedButtonProps = buttonProps as React.ComponentProps<typeof Button>;

    return (
      <Button
        {...resolvedButtonProps}
        appearance="transparent"
        className={buttonClassName}
        data-oneui-button=""
        data-oneui-button-appearance={appearance}
        ref={ref}
        size={size}
        style={buttonPaintVars}
      >
        {children}
      </Button>
    );
  }
);

OneUIButton.displayName = "OneUIButton";
