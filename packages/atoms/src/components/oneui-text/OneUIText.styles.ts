import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type { OneUITextSize, OneUITextTone, OneUITextWeight } from "./OneUIText.types.js";

const useStyles = makeStyles({
  root: {
    color: tokens.colorNeutralForeground1,
    margin: 0
  },
  block: {
    display: "block"
  },
  truncate: {
    display: "block",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  tonePrimary: {
    color: tokens.colorNeutralForeground1
  },
  toneSecondary: {
    color: tokens.colorNeutralForeground2
  },
  toneBrand: {
    color: tokens.colorBrandForeground1
  },
  toneSuccess: {
    color: tokens.colorPaletteGreenForeground1
  },
  toneDanger: {
    color: tokens.colorPaletteRedForeground1
  },
  toneInverse: {
    color: tokens.colorNeutralForegroundInverted
  },
  sizeCaption: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  sizeBody: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300
  },
  sizeBodyLarge: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400
  },
  weightRegular: {
    fontWeight: tokens.fontWeightRegular
  },
  weightMedium: {
    fontWeight: tokens.fontWeightMedium
  },
  weightSemibold: {
    fontWeight: tokens.fontWeightSemibold
  },
  weightBold: {
    fontWeight: tokens.fontWeightBold
  }
});

const toneClassMap: Record<OneUITextTone, keyof ReturnType<typeof useStyles>> = {
  primary: "tonePrimary",
  secondary: "toneSecondary",
  brand: "toneBrand",
  success: "toneSuccess",
  danger: "toneDanger",
  inverse: "toneInverse"
};

const sizeClassMap: Record<OneUITextSize, keyof ReturnType<typeof useStyles>> = {
  caption: "sizeCaption",
  body: "sizeBody",
  bodyLarge: "sizeBodyLarge"
};

const weightClassMap: Record<OneUITextWeight, keyof ReturnType<typeof useStyles>> = {
  regular: "weightRegular",
  medium: "weightMedium",
  semibold: "weightSemibold",
  bold: "weightBold"
};

export const useOneUITextClassName = (options: {
  block: boolean;
  className?: string;
  size: OneUITextSize;
  tone: OneUITextTone;
  truncate: boolean;
  weight: OneUITextWeight;
}) => {
  const styles = useStyles();

  return mergeClasses(
    styles.root,
    options.block ? styles.block : undefined,
    options.truncate ? styles.truncate : undefined,
    styles[toneClassMap[options.tone]],
    styles[sizeClassMap[options.size]],
    styles[weightClassMap[options.weight]],
    options.className
  );
};
