import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { createOneUIMediaQueryDown } from "@functions-oneui/theme";

import type { HeroBannerContentTone, HeroBannerHeight } from "./HeroBanner.types.js";

const compactHeroBannerQuery = createOneUIMediaQueryDown("md");
const stackAsideHeroBannerQuery = createOneUIMediaQueryDown("lg");

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorBrandBackground,
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
    width: "100%"
  },
  inner: {
    boxSizing: "border-box",
    display: "grid",
    gap: tokens.spacingVerticalXL,
    marginInline: "auto",
    maxWidth: "90rem",
    minWidth: 0,
    paddingBlock: tokens.spacingVerticalXXL,
    paddingInline: tokens.spacingHorizontalXXL,
    width: "100%",
    [compactHeroBannerQuery]: {
      gap: tokens.spacingVerticalL,
      paddingBlock: tokens.spacingVerticalXL,
      paddingInline: tokens.spacingHorizontalL
    }
  },
  innerTiny: {
    gap: tokens.spacingVerticalM,
    paddingBlock: tokens.spacingVerticalL,
    paddingInline: tokens.spacingHorizontalXL,
    [compactHeroBannerQuery]: {
      gap: tokens.spacingVerticalS,
      paddingBlock: tokens.spacingVerticalM,
      paddingInline: tokens.spacingHorizontalM
    }
  },
  topRow: {
    alignItems: "start",
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalM,
    justifyContent: "space-between"
  },
  mainGrid: {
    alignItems: "center",
    display: "grid",
    gap: tokens.spacingHorizontalXXL,
    gridTemplateColumns: "minmax(0, 1fr)",
    minWidth: 0,
    [compactHeroBannerQuery]: {
      gap: tokens.spacingVerticalL
    }
  },
  mainGridWithAside: {
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(18rem, 0.9fr)",
    [stackAsideHeroBannerQuery]: {
      gridTemplateColumns: "1fr"
    }
  },
  contentColumn: {
    display: "grid",
    gap: tokens.spacingVerticalL,
    maxWidth: "48rem",
    minWidth: 0
  },
  textBlock: {
    display: "grid",
    gap: tokens.spacingVerticalM,
    minWidth: 0
  },
  supportingContent: {
    minWidth: 0,
    width: "100%"
  },
  aside: {
    justifySelf: "end",
    maxWidth: "100%",
    minWidth: 0,
    width: "100%"
  },
  footer: {
    minWidth: 0,
    width: "100%"
  },
  toneDefault: {
    color: tokens.colorNeutralForeground1
  },
  toneInverse: {
    color: tokens.colorNeutralForegroundInverted
  },
  heightComfortable: {
    minHeight: "10rem"
  },
  heightTiny: {
    minHeight: "6.5rem"
  },
  heightImmersive: {
    minHeight: "26rem"
  }
});

const contentToneClassMap: Record<HeroBannerContentTone, keyof ReturnType<typeof useStyles>> = {
  default: "toneDefault",
  inverse: "toneInverse"
};

const heightClassMap: Record<HeroBannerHeight, keyof ReturnType<typeof useStyles>> = {
  tiny: "heightTiny",
  comfortable: "heightComfortable",
  immersive: "heightImmersive"
};

export const useHeroBannerClassNames = (options: {
  className?: string;
  contentTone: HeroBannerContentTone;
  hasAside: boolean;
  height: HeroBannerHeight;
}) => {
  const styles = useStyles();

  return {
    aside: styles.aside,
    contentColumn: styles.contentColumn,
    footer: styles.footer,
    inner: mergeClasses(
      styles.inner,
      options.height === "tiny" ? styles.innerTiny : undefined,
      styles[heightClassMap[options.height]]
    ),
    mainGrid: mergeClasses(styles.mainGrid, options.hasAside ? styles.mainGridWithAside : undefined),
    root: mergeClasses(styles.root, styles[contentToneClassMap[options.contentTone]], options.className),
    supportingContent: styles.supportingContent,
    textBlock: styles.textBlock,
    topRow: styles.topRow
  };
};
