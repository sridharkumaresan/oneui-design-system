import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";

import type {
  OneUILinkTone,
  OneUILinkUnderline
} from "./OneUILink.types.js";

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    backgroundColor: tokens.colorTransparentBackground,
    border: "0",
    color: tokens.colorBrandForegroundLink,
    columnGap: tokens.spacingHorizontalXXS,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    justifyContent: "flex-start",
    lineHeight: tokens.lineHeightBase200,
    maxWidth: "100%",
    padding: 0,
    textAlign: "left",
    textDecorationColor: "currentColor",
    textDecorationThickness: "from-font",
    textUnderlineOffset: "0.15em",
    width: "fit-content",
    ":focus-visible": {
      ...shorthands.outline("2px", "solid", tokens.colorStrokeFocus2),
      outlineOffset: "2px"
    }
  },
  interactive: {
    ":hover": {
      color: tokens.colorBrandForegroundLinkHover
    },
    ":active": {
      color: tokens.colorBrandForegroundLinkPressed
    }
  },
  disabled: {
    color: tokens.colorNeutralForegroundDisabled,
    cursor: "not-allowed",
    textDecorationLine: "none"
  },
  content: {
    minWidth: 0
  },
  icon: {
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center"
  },
  toneBrand: {
    color: tokens.colorBrandForegroundLink,
    ":hover": {
      color: tokens.colorBrandForegroundLinkHover
    },
    ":active": {
      color: tokens.colorBrandForegroundLinkPressed
    }
  },
  toneNeutral: {
    color: tokens.colorNeutralForeground2,
    ":hover": {
      color: tokens.colorNeutralForeground1
    },
    ":active": {
      color: tokens.colorNeutralForeground1
    }
  },
  toneInverse: {
    color: tokens.colorNeutralForegroundInverted,
    ":hover": {
      color: tokens.colorNeutralForegroundInvertedHover
    },
    ":active": {
      color: tokens.colorNeutralForegroundInvertedPressed
    }
  },
  underlineAlways: {
    textDecorationLine: "underline"
  },
  underlineHover: {
    textDecorationLine: "none",
    ":hover": {
      textDecorationLine: "underline"
    }
  },
  underlineNone: {
    textDecorationLine: "none"
  }
});

const toneClassMap: Record<OneUILinkTone, keyof ReturnType<typeof useStyles>> = {
  brand: "toneBrand",
  inverse: "toneInverse",
  neutral: "toneNeutral"
};

const underlineClassMap: Record<OneUILinkUnderline, keyof ReturnType<typeof useStyles>> = {
  always: "underlineAlways",
  hover: "underlineHover",
  none: "underlineNone"
};

export const useOneUILinkClassNames = (options: {
  className?: string;
  disabled: boolean;
  interactive: boolean;
  tone: OneUILinkTone;
  underline: OneUILinkUnderline;
}) => {
  const styles = useStyles();

  return {
    content: styles.content,
    icon: styles.icon,
    root: mergeClasses(
      styles.root,
      styles[toneClassMap[options.tone]],
      styles[underlineClassMap[options.underline]],
      options.interactive ? styles.interactive : undefined,
      options.disabled ? styles.disabled : undefined,
      options.className
    )
  };
};
