import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type { OneUICardAccent, OneUICardElevation, OneUICardPadding } from "./OneUICard.types.js";

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    color: tokens.colorNeutralForeground1,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    borderTopStyle: "solid",
    borderTopWidth: "3px",
    borderTopColor: tokens.colorTransparentStroke
  },
  elevationFlat: {
    boxShadow: "none"
  },
  elevationRaised: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8
  },
  paddingSm: {
    padding: tokens.spacingHorizontalS
  },
  paddingMd: {
    padding: tokens.spacingHorizontalM
  },
  paddingLg: {
    padding: tokens.spacingHorizontalL
  },
  accentNone: {
    borderTopColor: tokens.colorTransparentStroke
  },
  accentBrand: {
    borderTopColor: tokens.colorBrandStroke1
  },
  accentSuccess: {
    borderTopColor: tokens.colorPaletteGreenBorderActive
  },
  accentDanger: {
    borderTopColor: tokens.colorPaletteRedBorderActive
  }
});

const elevationClassMap: Record<OneUICardElevation, keyof ReturnType<typeof useStyles>> = {
  flat: "elevationFlat",
  raised: "elevationRaised"
};

const paddingClassMap: Record<OneUICardPadding, keyof ReturnType<typeof useStyles>> = {
  sm: "paddingSm",
  md: "paddingMd",
  lg: "paddingLg"
};

const accentClassMap: Record<OneUICardAccent, keyof ReturnType<typeof useStyles>> = {
  none: "accentNone",
  brand: "accentBrand",
  success: "accentSuccess",
  danger: "accentDanger"
};

export const useOneUICardClassName = (options: {
  accent: OneUICardAccent;
  className?: string;
  elevation: OneUICardElevation;
  padding: OneUICardPadding;
}) => {
  const styles = useStyles();

  return mergeClasses(
    styles.root,
    styles[elevationClassMap[options.elevation]],
    styles[paddingClassMap[options.padding]],
    styles[accentClassMap[options.accent]],
    options.className
  );
};
