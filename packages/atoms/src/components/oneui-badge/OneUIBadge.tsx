import React from "react";
import { useFluent } from "@fluentui/react-components";
import { oneuiLightTheme } from "@functions-oneui/theme";

import { useOneUIBadgeClassNames } from "./OneUIBadge.styles.js";
import type { OneUIBadgeProps } from "./OneUIBadge.types.js";

const toCssValue = (value: string | number | undefined, fallback = ""): string => {
  return String(value ?? fallback);
};

const getBadgeThemeVars = (
  appearance: NonNullable<OneUIBadgeProps["appearance"]>,
  tone: NonNullable<OneUIBadgeProps["tone"]>,
  theme: Record<string, string | number | undefined>
) => {
  const feedbackConfig = {
    brand: {
      border: theme.colorBrandStroke1,
      filledBackground: theme.oneuiColorBackgroundBrandStrong ?? theme.colorBrandBackground,
      filledForeground: theme.colorNeutralForegroundOnBrand,
      softBackground: theme.oneuiColorBackgroundInfoSubtle ?? theme.colorBrandBackground2,
      softForeground: theme.colorBrandForeground1,
      outlinedForeground: theme.colorBrandForeground1
    },
    danger: {
      border: theme.oneuiColorBorderDanger,
      filledBackground: theme.oneuiColorStatusDanger,
      filledForeground: theme.oneuiColorTextOnDanger,
      softBackground: theme.oneuiColorBackgroundDangerSubtle,
      softForeground: theme.oneuiColorTextDanger,
      outlinedForeground: theme.oneuiColorTextDanger
    },
    info: {
      border: theme.oneuiColorBorderInfo,
      filledBackground: theme.oneuiColorStatusInfo,
      filledForeground: theme.oneuiColorTextOnInfo,
      softBackground: theme.oneuiColorBackgroundInfoSubtle,
      softForeground: theme.oneuiColorTextInfo,
      outlinedForeground: theme.oneuiColorTextInfo
    },
    neutral: {
      border: theme.oneuiColorBorderNeutral ?? theme.colorNeutralStroke1,
      filledBackground: theme.oneuiColorStatusNeutral ?? theme.colorNeutralForeground3,
      filledForeground: theme.oneuiColorTextOnNeutral ?? theme.colorNeutralForegroundInverted,
      softBackground: theme.oneuiColorBackgroundNeutralSubtle ?? theme.colorNeutralBackground3,
      softForeground: theme.colorNeutralForeground2,
      outlinedForeground: theme.colorNeutralForeground2
    },
    success: {
      border: theme.oneuiColorBorderSuccess,
      filledBackground: theme.oneuiColorStatusSuccess,
      filledForeground: theme.oneuiColorTextOnSuccess,
      softBackground: theme.oneuiColorBackgroundSuccessSubtle,
      softForeground: theme.oneuiColorTextSuccess,
      outlinedForeground: theme.oneuiColorTextSuccess
    },
    warning: {
      border: theme.oneuiColorBorderWarning,
      filledBackground: theme.oneuiColorStatusWarning,
      filledForeground: theme.oneuiColorTextOnWarning,
      softBackground: theme.oneuiColorBackgroundWarningSubtle,
      softForeground: theme.oneuiColorTextWarning,
      outlinedForeground: theme.oneuiColorTextWarning
    }
  } as const;
  const toneConfig = feedbackConfig[tone];

  if (appearance === "filled") {
    return {
      "--oneui-badge-background": toCssValue(toneConfig.filledBackground),
      "--oneui-badge-border": toCssValue(toneConfig.border, "transparent"),
      "--oneui-badge-foreground": toCssValue(toneConfig.filledForeground)
    };
  }

  if (appearance === "outlined") {
    return {
      "--oneui-badge-background": "transparent",
      "--oneui-badge-border": toCssValue(toneConfig.border),
      "--oneui-badge-foreground": toCssValue(toneConfig.outlinedForeground)
    };
  }

  return {
    "--oneui-badge-background": toCssValue(toneConfig.softBackground),
    "--oneui-badge-border": "transparent",
    "--oneui-badge-foreground": toCssValue(toneConfig.softForeground)
  };
};

export const OneUIBadge = React.forwardRef<HTMLSpanElement, OneUIBadgeProps>((props, ref) => {
  const {
    appearance = "soft",
    children,
    className,
    icon,
    shape = "pill",
    size = "md",
    tone = "neutral",
    style,
    ...restProps
  } = props;
  const theme = ((useFluent() as unknown as { theme?: Record<string, string | number | undefined> })
    .theme ?? oneuiLightTheme) as Record<string, string | number | undefined>;
  const classNames = useOneUIBadgeClassNames({
    appearance,
    className,
    shape,
    size
  });
  const resolvedStyle = {
    ...getBadgeThemeVars(
      appearance,
      tone,
      theme
    ),
    ...style
  } as React.CSSProperties;

  return (
    <span
      {...restProps}
      className={classNames.root}
      data-oneui-badge=""
      data-oneui-badge-appearance={appearance}
      data-oneui-badge-tone={tone}
      ref={ref}
      style={resolvedStyle}
    >
      {icon ? <span className={classNames.icon}>{icon}</span> : null}
      <span className={classNames.content}>{children}</span>
    </span>
  );
});

OneUIBadge.displayName = "OneUIBadge";
