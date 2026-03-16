import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";

import type {
  OneUIBadgeAppearance,
  OneUIBadgeShape,
  OneUIBadgeSize,
  OneUIBadgeTone
} from "./OneUIBadge.types.js";

const useStyles = makeStyles({
  root: {
    ...shorthands.border("1px", "solid", "transparent"),
    alignItems: "center",
    display: "inline-flex",
    fontWeight: tokens.fontWeightSemibold,
    gap: tokens.spacingHorizontalXXS,
    maxWidth: "100%",
    whiteSpace: "nowrap"
  },
  icon: {
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center"
  },
  content: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  sizeSm: {
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalS),
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase200
  },
  sizeMd: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  shapeRounded: {
    borderRadius: tokens.borderRadiusMedium
  },
  shapePill: {
    borderRadius: tokens.borderRadiusCircular
  },
  filledNeutral: {
    backgroundColor: tokens.colorNeutralBackground4,
    color: tokens.colorNeutralForeground1
  },
  softNeutral: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2
  },
  outlinedNeutral: {
    ...shorthands.border("1px", "solid", tokens.colorNeutralStrokeAccessible),
    backgroundColor: tokens.colorTransparentBackground,
    color: tokens.colorNeutralForeground2
  },
  filledBrand: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand
  },
  softBrand: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForegroundOnBrand
  },
  outlinedBrand: {
    ...shorthands.border("1px", "solid", tokens.colorBrandStroke1),
    backgroundColor: tokens.colorTransparentBackground,
    color: tokens.colorBrandForeground1
  },
  filledSuccess: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
    color: tokens.colorNeutralForegroundOnBrand
  },
  softSuccess: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1
  },
  outlinedSuccess: {
    ...shorthands.border("1px", "solid", tokens.colorPaletteGreenBorder2),
    backgroundColor: tokens.colorTransparentBackground,
    color: tokens.colorPaletteGreenForeground2
  },
  filledWarning: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground3,
    color: tokens.colorNeutralForegroundOnBrand
  },
  softWarning: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1
  },
  outlinedWarning: {
    ...shorthands.border("1px", "solid", tokens.colorPaletteDarkOrangeBorder2),
    backgroundColor: tokens.colorTransparentBackground,
    color: tokens.colorPaletteDarkOrangeForeground2
  },
  filledDanger: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand
  },
  softDanger: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1
  },
  outlinedDanger: {
    ...shorthands.border("1px", "solid", tokens.colorPaletteRedBorder2),
    backgroundColor: tokens.colorTransparentBackground,
    color: tokens.colorPaletteRedForeground2
  },
  filledInfo: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForegroundOnBrand
  },
  softInfo: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorBrandForeground2
  },
  outlinedInfo: {
    ...shorthands.border("1px", "solid", tokens.colorBrandStroke1),
    backgroundColor: tokens.colorTransparentBackground,
    color: tokens.colorBrandForeground2
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

const appearanceToneClassMap: Record<
  OneUIBadgeAppearance,
  Record<OneUIBadgeTone, keyof ReturnType<typeof useStyles>>
> = {
  filled: {
    brand: "filledBrand",
    danger: "filledDanger",
    info: "filledInfo",
    neutral: "filledNeutral",
    success: "filledSuccess",
    warning: "filledWarning"
  },
  outlined: {
    brand: "outlinedBrand",
    danger: "outlinedDanger",
    info: "outlinedInfo",
    neutral: "outlinedNeutral",
    success: "outlinedSuccess",
    warning: "outlinedWarning"
  },
  soft: {
    brand: "softBrand",
    danger: "softDanger",
    info: "softInfo",
    neutral: "softNeutral",
    success: "softSuccess",
    warning: "softWarning"
  }
};

export const useOneUIBadgeClassNames = (options: {
  appearance: OneUIBadgeAppearance;
  className?: string;
  shape: OneUIBadgeShape;
  size: OneUIBadgeSize;
  tone: OneUIBadgeTone;
}) => {
  const styles = useStyles();

  return {
    content: styles.content,
    icon: styles.icon,
    root: mergeClasses(
      styles.root,
      styles[sizeClassMap[options.size]],
      styles[shapeClassMap[options.shape]],
      styles[appearanceToneClassMap[options.appearance][options.tone]],
      options.className
    )
  };
};
