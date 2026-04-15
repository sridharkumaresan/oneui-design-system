import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";

import type {
  OneUIBadgeAppearance,
  OneUIBadgeShape,
  OneUIBadgeSize
} from "./OneUIBadge.types.js";

const useStyles = makeStyles({
  root: {
    ...shorthands.border("1px", "solid", "var(--oneui-badge-border, transparent)"),
    alignItems: "center",
    backgroundColor: "var(--oneui-badge-background, transparent)",
    boxSizing: "border-box",
    color: "var(--oneui-badge-foreground, inherit)",
    columnGap: "0.375rem",
    display: "inline-flex",
    fontWeight: tokens.fontWeightBold,
    letterSpacing: "0.03em",
    lineHeight: 1,
    maxWidth: "100%",
    whiteSpace: "nowrap"
  },
  icon: {
    alignItems: "center",
    color: "inherit",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center"
  },
  content: {
    display: "inline-flex",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "uppercase"
  },
  sizeSm: {
    ...shorthands.padding("0.1875rem", "0.75rem"),
    fontSize: tokens.fontSizeBase100,
    minHeight: "1.75rem"
  },
  sizeMd: {
    ...shorthands.padding("0.3125rem", "0.8125rem"),
    fontSize: tokens.fontSizeBase200,
    minHeight: "1.875rem"
  },
  shapeRounded: {
    borderRadius: tokens.borderRadiusMedium
  },
  shapePill: {
    borderRadius: tokens.borderRadiusCircular
  },
  filled: {
    boxShadow: "none"
  },
  soft: {
    boxShadow: "none"
  },
  outlined: {
    boxShadow: "none"
  },
  iconSizeSm: {
    minWidth: "0.75rem"
  },
  iconSizeMd: {
    minWidth: "0.875rem"
  }
});

const sizeClassMap: Record<OneUIBadgeSize, keyof ReturnType<typeof useStyles>> = {
  md: "sizeMd",
  sm: "sizeSm"
};

const shapeClassMap: Record<OneUIBadgeShape, keyof ReturnType<typeof useStyles>> = {
  pill: "shapePill",
  rounded: "shapeRounded"
};

const appearanceClassMap: Record<OneUIBadgeAppearance, keyof ReturnType<typeof useStyles>> = {
  filled: "filled",
  outlined: "outlined",
  soft: "soft"
};

export const useOneUIBadgeClassNames = (options: {
  appearance: OneUIBadgeAppearance;
  className?: string;
  shape: OneUIBadgeShape;
  size: OneUIBadgeSize;
}) => {
  const styles = useStyles();

  return {
    content: styles.content,
    icon: mergeClasses(
      styles.icon,
      options.size === "sm" ? styles.iconSizeSm : styles.iconSizeMd
    ),
    root: mergeClasses(
      styles.root,
      styles[sizeClassMap[options.size]],
      styles[shapeClassMap[options.shape]],
      styles[appearanceClassMap[options.appearance]],
      options.className
    )
  };
};
