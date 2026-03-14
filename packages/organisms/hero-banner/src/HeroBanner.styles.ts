import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type {
  HeroBannerContentTone,
  HeroBannerHeight,
  HeroBannerImagePosition
} from "./HeroBanner.types.js";

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorBrandBackground,
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
    width: "100%"
  },
  inner: {
    alignItems: "stretch",
    display: "flex",
    minWidth: 0,
    width: "100%",
    "@media (max-width: 768px)": {
      flexDirection: "column"
    }
  },
  content: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flex: "1 1 56%",
    minWidth: 0,
    paddingBlock: tokens.spacingVerticalXXL,
    paddingInline: tokens.spacingHorizontalXXL,
    "@media (max-width: 768px)": {
      order: 0,
      paddingBlock: tokens.spacingVerticalXL,
      paddingInline: tokens.spacingHorizontalL
    }
  },
  contentBody: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    maxWidth: "36rem",
    minWidth: 0
  },
  contentStart: {
    order: 1,
    "@media (max-width: 768px)": {
      order: 0
    }
  },
  contentEnd: {
    order: 0,
    "@media (max-width: 768px)": {
      order: 0
    }
  },
  media: {
    alignSelf: "stretch",
    display: "flex",
    flex: "1 1 44%",
    justifyContent: "flex-end",
    minHeight: "16rem",
    minWidth: 0,
    overflow: "hidden",
    "@media (max-width: 768px)": {
      minHeight: "12rem",
      order: 1,
      width: "100%"
    }
  },
  mediaStart: {
    order: 0,
    "@media (max-width: 768px)": {
      order: 1
    }
  },
  mediaEnd: {
    order: 1,
    "@media (max-width: 768px)": {
      order: 1
    }
  },
  image: {
    display: "block",
    height: "100%",
    objectFit: "cover",
    width: "100%"
  },
  toneDefault: {
    color: tokens.colorNeutralForeground1
  },
  toneInverse: {
    color: tokens.colorNeutralForegroundInverted
  },
  heightComfortable: {
    minHeight: "22rem"
  },
  heightImmersive: {
    minHeight: "28rem"
  }
});

const contentToneClassMap: Record<HeroBannerContentTone, keyof ReturnType<typeof useStyles>> = {
  default: "toneDefault",
  inverse: "toneInverse"
};

const imagePositionContentClassMap: Record<
  HeroBannerImagePosition,
  keyof ReturnType<typeof useStyles>
> = {
  start: "contentStart",
  end: "contentEnd"
};

const imagePositionMediaClassMap: Record<
  HeroBannerImagePosition,
  keyof ReturnType<typeof useStyles>
> = {
  start: "mediaStart",
  end: "mediaEnd"
};

const heightClassMap: Record<HeroBannerHeight, keyof ReturnType<typeof useStyles>> = {
  comfortable: "heightComfortable",
  immersive: "heightImmersive"
};

export const useHeroBannerClassNames = (options: {
  className?: string;
  contentTone: HeroBannerContentTone;
  height: HeroBannerHeight;
  imagePosition: HeroBannerImagePosition;
}) => {
  const styles = useStyles();

  return {
    root: mergeClasses(
      styles.root,
      styles[contentToneClassMap[options.contentTone]],
      options.className
    ),
    inner: mergeClasses(styles.inner, styles[heightClassMap[options.height]]),
    content: mergeClasses(
      styles.content,
      styles[imagePositionContentClassMap[options.imagePosition]]
    ),
    contentBody: styles.contentBody,
    media: mergeClasses(styles.media, styles[imagePositionMediaClassMap[options.imagePosition]]),
    image: styles.image
  };
};
