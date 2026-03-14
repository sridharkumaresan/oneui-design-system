import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type {
  OneUIStackAlign,
  OneUIStackDirection,
  OneUIStackGap,
  OneUIStackJustify
} from "./OneUIStack.types.js";

const useStyles = makeStyles({
  root: {
    display: "flex",
    minWidth: 0
  },
  directionRow: {
    flexDirection: "row"
  },
  directionColumn: {
    flexDirection: "column"
  },
  gapNone: {
    gap: tokens.spacingHorizontalNone
  },
  gapXXS: {
    gap: tokens.spacingHorizontalXXS
  },
  gapXS: {
    gap: tokens.spacingHorizontalXS
  },
  gapS: {
    gap: tokens.spacingHorizontalS
  },
  gapM: {
    gap: tokens.spacingHorizontalM
  },
  gapL: {
    gap: tokens.spacingHorizontalL
  },
  gapXL: {
    gap: tokens.spacingHorizontalXL
  },
  gapXXL: {
    gap: tokens.spacingHorizontalXXL
  },
  alignStart: {
    alignItems: "flex-start"
  },
  alignCenter: {
    alignItems: "center"
  },
  alignEnd: {
    alignItems: "flex-end"
  },
  alignStretch: {
    alignItems: "stretch"
  },
  justifyStart: {
    justifyContent: "flex-start"
  },
  justifyCenter: {
    justifyContent: "center"
  },
  justifyEnd: {
    justifyContent: "flex-end"
  },
  justifyBetween: {
    justifyContent: "space-between"
  },
  wrap: {
    flexWrap: "wrap"
  },
  stretch: {
    width: "100%"
  }
});

const directionClassMap: Record<OneUIStackDirection, keyof ReturnType<typeof useStyles>> = {
  row: "directionRow",
  column: "directionColumn"
};

const gapClassMap: Record<OneUIStackGap, keyof ReturnType<typeof useStyles>> = {
  none: "gapNone",
  xxs: "gapXXS",
  xs: "gapXS",
  sm: "gapS",
  md: "gapM",
  lg: "gapL",
  xl: "gapXL",
  xxl: "gapXXL"
};

const alignClassMap: Record<OneUIStackAlign, keyof ReturnType<typeof useStyles>> = {
  start: "alignStart",
  center: "alignCenter",
  end: "alignEnd",
  stretch: "alignStretch"
};

const justifyClassMap: Record<OneUIStackJustify, keyof ReturnType<typeof useStyles>> = {
  start: "justifyStart",
  center: "justifyCenter",
  end: "justifyEnd",
  between: "justifyBetween"
};

export const useOneUIStackClassName = (options: {
  align: OneUIStackAlign;
  className?: string;
  direction: OneUIStackDirection;
  gap: OneUIStackGap;
  justify: OneUIStackJustify;
  stretch: boolean;
  wrap: boolean;
}) => {
  const styles = useStyles();

  return mergeClasses(
    styles.root,
    styles[directionClassMap[options.direction]],
    styles[gapClassMap[options.gap]],
    styles[alignClassMap[options.align]],
    styles[justifyClassMap[options.justify]],
    options.wrap ? styles.wrap : undefined,
    options.stretch ? styles.stretch : undefined,
    options.className
  );
};
