import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type { OneUIHeadingAlign, OneUIHeadingTone } from "./OneUIHeading.types.js";

const useStyles = makeStyles({
  root: {
    color: tokens.colorNeutralForeground1,
    margin: 0
  },
  level1: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    lineHeight: tokens.lineHeightHero800
  },
  level2: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    lineHeight: tokens.lineHeightHero700
  },
  level3: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase600
  },
  level4: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase500
  },
  level5: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400
  },
  level6: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase300
  },
  toneDefault: {
    color: tokens.colorNeutralForeground1
  },
  toneSecondary: {
    color: tokens.colorNeutralForeground2
  },
  toneBrand: {
    color: tokens.colorBrandForeground1
  },
  toneInverse: {
    color: tokens.colorNeutralForegroundInverted
  },
  alignStart: {
    textAlign: "left"
  },
  alignCenter: {
    textAlign: "center"
  },
  alignEnd: {
    textAlign: "right"
  }
});

const levelClassMap = {
  1: "level1",
  2: "level2",
  3: "level3",
  4: "level4",
  5: "level5",
  6: "level6"
} as const;

const toneClassMap: Record<OneUIHeadingTone, keyof ReturnType<typeof useStyles>> = {
  default: "toneDefault",
  secondary: "toneSecondary",
  brand: "toneBrand",
  inverse: "toneInverse"
};

const alignClassMap: Record<OneUIHeadingAlign, keyof ReturnType<typeof useStyles>> = {
  start: "alignStart",
  center: "alignCenter",
  end: "alignEnd"
};

export const useOneUIHeadingClassName = (options: {
  align: OneUIHeadingAlign;
  className?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  tone: OneUIHeadingTone;
}) => {
  const styles = useStyles();

  return mergeClasses(
    styles.root,
    styles[levelClassMap[options.level]],
    styles[toneClassMap[options.tone]],
    styles[alignClassMap[options.align]],
    options.className
  );
};
