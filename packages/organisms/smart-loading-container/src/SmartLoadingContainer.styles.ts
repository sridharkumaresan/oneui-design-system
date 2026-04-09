import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type { SmartLoadingLayout } from "./SmartLoadingContainer.types.js";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gap: tokens.spacingVerticalL,
    width: "100%"
  },
  header: {
    display: "grid",
    gap: tokens.spacingVerticalS
  },
  containerTitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: "-0.01em",
    lineHeight: tokens.lineHeightBase600
  },
  headerRow: {
    alignItems: "start",
    display: "grid",
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: "1fr auto",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  },
  contentGrid: {
    alignItems: "start",
    display: "grid",
    gap: tokens.spacingHorizontalL
  },
  split: {
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(18rem, 1fr)",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  },
  single: {
    gridTemplateColumns: "minmax(0, 1fr)"
  },
  section: {
    alignContent: "start",
    alignSelf: "start",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    borderTopStyle: "solid",
    borderTopWidth: "3px",
    borderTopColor: tokens.colorTransparentStroke,
    boxSizing: "border-box",
    display: "grid",
    gap: 0,
    gridTemplateRows: "auto auto",
    overflow: "hidden",
    boxShadow: tokens.shadow4
  },
  sectionFlat: {
    boxShadow: "none"
  },
  sectionAccentBrand: {
    borderTopColor: tokens.colorBrandStroke1
  },
  sectionAccentInfo: {
    borderTopColor: tokens.colorBrandStroke1
  },
  sectionAccentSuccess: {
    borderTopColor: tokens.colorPaletteGreenBorderActive
  },
  sectionAccentWarning: {
    borderTopColor: tokens.colorPaletteDarkOrangeBorder2
  },
  sectionAccentDanger: {
    borderTopColor: tokens.colorPaletteRedBorder2
  },
  sectionAccentNeutral: {
    borderTopColor: tokens.colorNeutralStroke1
  },
  sectionHeader: {
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: "grid",
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: "minmax(0, 1fr) auto",
    minHeight: "4rem",
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    paddingTop: tokens.spacingVerticalXS,
    "@media (max-width: 960px)": {
      alignItems: "start",
      gridTemplateColumns: "minmax(0, 1fr)",
      minHeight: "unset",
      rowGap: tokens.spacingVerticalS
    }
  },
  sectionHeaderAccentBrand: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackground} 7%, ${tokens.colorNeutralBackground1} 93%)`
  },
  sectionHeaderAccentInfo: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackground} 7%, ${tokens.colorNeutralBackground1} 93%)`
  },
  sectionHeaderAccentSuccess: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorPaletteGreenBackground3} 18%, ${tokens.colorNeutralBackground1} 82%)`
  },
  sectionHeaderAccentWarning: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorPaletteGoldBackground2} 22%, ${tokens.colorNeutralBackground1} 78%)`
  },
  sectionHeaderAccentDanger: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorPaletteRedBackground1} 20%, ${tokens.colorNeutralBackground1} 80%)`
  },
  sectionHeaderAccentNeutral: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorNeutralBackground2} 55%, ${tokens.colorNeutralBackground1} 45%)`
  },
  sectionHeaderMain: {
    alignItems: "center",
    display: "grid",
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: "auto minmax(0, 1fr)",
    minWidth: 0,
    "@media (max-width: 640px)": {
      gap: tokens.spacingHorizontalS
    }
  },
  sectionAvatar: {
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorBrandForeground1,
    display: "inline-flex",
    flexShrink: 0,
    height: "2rem",
    justifyContent: "center",
    width: "2rem"
  },
  sectionAvatarAccentBrand: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1
  },
  sectionAvatarAccentInfo: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1
  },
  sectionAvatarAccentSuccess: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorPaletteGreenForeground1
  },
  sectionAvatarAccentWarning: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1
  },
  sectionAvatarAccentDanger: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorPaletteRedForeground1
  },
  sectionAvatarAccentNeutral: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground3
  },
  sectionHeading: {
    display: "grid",
    gap: "2px",
    minWidth: 0
  },
  sectionTitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: "-0.01em",
    lineHeight: tokens.lineHeightBase500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "@media (max-width: 960px)": {
      overflow: "visible",
      textOverflow: "clip",
      whiteSpace: "normal",
      wordBreak: "break-word"
    }
  },
  sectionMetaRail: {
    alignItems: "center",
    display: "flex",
    flexWrap: "nowrap",
    gap: tokens.spacingHorizontalS,
    justifyContent: "flex-end",
    minWidth: 0,
    "@media (max-width: 960px)": {
      flexWrap: "wrap",
      gap: tokens.spacingHorizontalS,
      justifyContent: "flex-start"
    }
  },
  headerMeta: {
    alignItems: "center",
    display: "flex",
    flexWrap: "nowrap",
    gap: tokens.spacingHorizontalS,
    justifyContent: "flex-end",
    minWidth: 0,
    "@media (max-width: 960px)": {
      justifyContent: "flex-start"
    }
  },
  statusInline: {
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusCircular,
    display: "inline-flex",
    gap: tokens.spacingHorizontalXS,
    maxWidth: "18rem",
    minWidth: 0,
    "@media (max-width: 960px)": {
      maxWidth: "none",
      width: "100%"
    }
  },
  statusInlineInfo: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackground2} 24%, ${tokens.colorNeutralBackground1} 76%)`,
    borderBottomColor: tokens.colorBrandStroke2,
    borderLeftColor: tokens.colorBrandStroke2,
    borderRightColor: tokens.colorBrandStroke2,
    borderTopColor: tokens.colorBrandStroke2
  },
  statusInlineWarning: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorPaletteGoldBackground2} 34%, ${tokens.colorNeutralBackground1} 66%)`,
    borderBottomColor: tokens.colorPaletteDarkOrangeBorder2,
    borderLeftColor: tokens.colorPaletteDarkOrangeBorder2,
    borderRightColor: tokens.colorPaletteDarkOrangeBorder2,
    borderTopColor: tokens.colorPaletteDarkOrangeBorder2
  },
  statusInlineDanger: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorPaletteRedBackground1} 26%, ${tokens.colorNeutralBackground1} 74%)`,
    borderBottomColor: tokens.colorPaletteRedBorder2,
    borderLeftColor: tokens.colorPaletteRedBorder2,
    borderRightColor: tokens.colorPaletteRedBorder2,
    borderTopColor: tokens.colorPaletteRedBorder2
  },
  statusInlineIcon: {
    alignItems: "center",
    color: tokens.colorNeutralForeground3,
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    paddingLeft: tokens.spacingHorizontalS
  },
  statusInlineIconInfo: {
    color: tokens.colorBrandForeground1
  },
  statusInlineIconWarning: {
    color: tokens.colorPaletteDarkOrangeForeground1
  },
  statusInlineIconDanger: {
    color: tokens.colorPaletteRedForeground1
  },
  statusInlineIconNeutral: {
    color: tokens.colorNeutralForeground3
  },
  statusInlineMessage: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    lineHeight: tokens.lineHeightBase200,
    overflow: "hidden",
    paddingBottom: "0.3125rem",
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: "0.3125rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "@media (max-width: 960px)": {
      overflow: "visible",
      textOverflow: "clip",
      whiteSpace: "normal",
      wordBreak: "break-word"
    }
  },
  statusInlineMessageSubtle: {
    color: tokens.colorNeutralForeground3
  },
  statusInlineMessageInfo: {
    color: tokens.colorBrandForeground1
  },
  statusInlineMessageWarning: {
    color: tokens.colorPaletteDarkOrangeForeground1
  },
  statusInlineMessageDanger: {
    color: tokens.colorPaletteRedForeground1
  },
  countBadge: {
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  spinnerIcon: {
    animationDuration: "1.2s",
    animationIterationCount: "infinite",
    animationName: {
      from: {
        transform: "rotate(0deg)"
      },
      to: {
        transform: "rotate(360deg)"
      }
    },
    animationTimingFunction: "linear",
    "@media (prefers-reduced-motion: reduce)": {
      animationDuration: "0ms"
    }
  },
  metaAction: {
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0
  },
  statusBadge: {
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  statusSummary: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    maxWidth: "16rem",
    overflow: "hidden",
    paddingTop: tokens.spacingVerticalXXS,
    textAlign: "right",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "@media (max-width: 960px)": {
      maxWidth: "none",
      overflow: "visible",
      textAlign: "left",
      textOverflow: "clip",
      whiteSpace: "normal"
    }
  },
  statusSummaryMinimal: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase200,
    maxWidth: "11rem",
    overflow: "hidden",
    paddingTop: tokens.spacingVerticalXXS,
    textAlign: "right",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "@media (max-width: 960px)": {
      maxWidth: "none",
      overflow: "visible",
      textAlign: "left",
      textOverflow: "clip",
      whiteSpace: "normal"
    }
  },
  sectionActions: {
    alignItems: "center",
    display: "inline-flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalS,
    justifyContent: "flex-end",
    "@media (max-width: 960px)": {
      justifyContent: "flex-start"
    }
  },
  chevronButton: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    border: `1px solid transparent`,
    borderRadius: tokens.borderRadiusCircular,
    color: tokens.colorNeutralForeground3,
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: "2rem",
    justifyContent: "center",
    padding: 0,
    transitionDuration: tokens.durationNormal,
    transitionProperty: "background-color, border-color, color, transform",
    transitionTimingFunction: tokens.curveEasyEase,
    width: "2rem",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2
    },
    "@media (max-width: 960px)": {
      marginLeft: "auto"
    }
  },
  chevronExpanded: {
    borderBottom: `1.5px solid ${tokens.colorNeutralForeground3}`,
    borderRight: `1.5px solid ${tokens.colorNeutralForeground3}`,
    display: "inline-block",
    height: "0.45rem",
    transform: "rotate(45deg)",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "transform",
    transitionTimingFunction: tokens.curveEasyEase,
    width: "0.45rem"
  },
  chevronCollapsed: {
    borderBottom: `1.5px solid ${tokens.colorNeutralForeground3}`,
    borderRight: `1.5px solid ${tokens.colorNeutralForeground3}`,
    display: "inline-block",
    height: "0.45rem",
    transform: "rotate(-45deg)",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "transform",
    transitionTimingFunction: tokens.curveEasyEase,
    width: "0.45rem"
  },
  bodyViewport: {
    display: "grid",
    gridTemplateRows: "1fr",
    opacity: 1,
    overflow: "hidden",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "grid-template-rows, opacity",
    transitionTimingFunction: tokens.curveEasyEase,
    "@media (prefers-reduced-motion: reduce)": {
      transitionDuration: "0ms"
    }
  },
  bodyViewportCollapsed: {
    gridTemplateRows: "0fr",
    opacity: 0,
    pointerEvents: "none"
  },
  bodyViewportInner: {
    minHeight: 0,
    overflow: "hidden"
  },
  body: {
    display: "grid",
    gap: tokens.spacingVerticalS,
    minWidth: 0,
    paddingBottom: tokens.spacingVerticalL,
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    paddingTop: tokens.spacingVerticalM,
    "@media (max-width: 640px)": {
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM
    }
  },
  bodyCollapsed: {
    display: "none"
  },
  stateRegion: {
    display: "grid",
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    minHeight: "10rem",
    width: "100%"
  },
  stateRegionFeedback: {
    alignContent: "center",
    justifyItems: "center",
    textAlign: "center"
  },
  stateBanner: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalXS
  },
  stateBody: {
    display: "grid",
    gap: tokens.spacingVerticalS
  },
  customStateSlot: {
    display: "grid",
    justifyItems: "center",
    maxWidth: "100%",
    minWidth: 0,
    width: "100%"
  },
  stateMessage: {
    display: "grid",
    gap: tokens.spacingVerticalM,
    justifyItems: "center",
    maxWidth: "28rem",
    textAlign: "center",
    width: "100%"
  },
  stateFeedback: {
    display: "grid",
    gap: tokens.spacingVerticalS,
    justifyItems: "center",
    width: "100%"
  },
  stateFeedbackIcon: {
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusCircular,
    color: tokens.colorNeutralForeground3,
    display: "inline-flex",
    height: "3rem",
    justifyContent: "center",
    width: "3rem"
  },
  stateFeedbackIconBare: {
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center"
  },
  stateFeedbackIconInfo: {
    color: tokens.colorBrandForeground1
  },
  stateFeedbackIconWarning: {
    color: tokens.colorPaletteDarkOrangeForeground1
  },
  stateFeedbackIconDanger: {
    color: tokens.colorPaletteRedForeground1
  },
  stateFeedbackIconNeutral: {
    color: tokens.colorNeutralForeground3
  },
  stateFeedbackMessage: {
    maxWidth: "24rem"
  },
  stateActionsRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS
  },
  loadingSkeleton: {
    display: "grid",
    gap: tokens.spacingVerticalXS
  },
  loadingLinePrimary: {
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: tokens.borderRadiusCircular,
    height: tokens.spacingVerticalXS,
    width: "38%"
  },
  loadingLineSecondary: {
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: tokens.borderRadiusCircular,
    height: tokens.spacingVerticalXS,
    width: "84%"
  },
  loadingLineTertiary: {
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: tokens.borderRadiusCircular,
    height: tokens.spacingVerticalXS,
    width: "62%"
  }
});

const layoutMap: Record<SmartLoadingLayout, keyof ReturnType<typeof useStyles>> = {
  single: "single",
  split: "split"
};

export const useSmartLoadingContainerClassNames = (
  layout: SmartLoadingLayout,
  className?: string
) => {
  const styles = useStyles();

  return {
    body: styles.body,
    bodyCollapsed: styles.bodyCollapsed,
    bodyViewport: styles.bodyViewport,
    bodyViewportCollapsed: styles.bodyViewportCollapsed,
    bodyViewportInner: styles.bodyViewportInner,
    chevronButton: styles.chevronButton,
    chevronCollapsed: styles.chevronCollapsed,
    chevronExpanded: styles.chevronExpanded,
    container: mergeClasses(styles.container, className),
    countBadge: styles.countBadge,
    contentGrid: mergeClasses(styles.contentGrid, styles[layoutMap[layout]]),
    containerTitle: styles.containerTitle,
    header: styles.header,
    headerMeta: styles.headerMeta,
    headerRow: styles.headerRow,
    metaAction: styles.metaAction,
    sectionAvatar: styles.sectionAvatar,
    sectionAvatarAccentBrand: styles.sectionAvatarAccentBrand,
    sectionAvatarAccentDanger: styles.sectionAvatarAccentDanger,
    sectionAvatarAccentInfo: styles.sectionAvatarAccentInfo,
    sectionAvatarAccentNeutral: styles.sectionAvatarAccentNeutral,
    sectionAvatarAccentSuccess: styles.sectionAvatarAccentSuccess,
    sectionAvatarAccentWarning: styles.sectionAvatarAccentWarning,
    sectionAccentBrand: styles.sectionAccentBrand,
    sectionAccentDanger: styles.sectionAccentDanger,
    sectionAccentInfo: styles.sectionAccentInfo,
    sectionAccentNeutral: styles.sectionAccentNeutral,
    sectionAccentSuccess: styles.sectionAccentSuccess,
    sectionAccentWarning: styles.sectionAccentWarning,
    sectionMetaRail: styles.sectionMetaRail,
    sectionHeaderAccentBrand: styles.sectionHeaderAccentBrand,
    sectionHeaderAccentDanger: styles.sectionHeaderAccentDanger,
    sectionHeaderAccentInfo: styles.sectionHeaderAccentInfo,
    sectionHeaderAccentNeutral: styles.sectionHeaderAccentNeutral,
    sectionHeaderAccentSuccess: styles.sectionHeaderAccentSuccess,
    sectionHeaderAccentWarning: styles.sectionHeaderAccentWarning,
    statusInline: styles.statusInline,
    statusInlineDanger: styles.statusInlineDanger,
    statusInlineInfo: styles.statusInlineInfo,
    statusInlineIcon: styles.statusInlineIcon,
    statusInlineIconDanger: styles.statusInlineIconDanger,
    statusInlineIconInfo: styles.statusInlineIconInfo,
    statusInlineIconNeutral: styles.statusInlineIconNeutral,
    statusInlineIconWarning: styles.statusInlineIconWarning,
    statusInlineMessage: styles.statusInlineMessage,
    statusInlineMessageDanger: styles.statusInlineMessageDanger,
    statusInlineMessageInfo: styles.statusInlineMessageInfo,
    statusInlineMessageSubtle: styles.statusInlineMessageSubtle,
    statusInlineMessageWarning: styles.statusInlineMessageWarning,
    statusInlineWarning: styles.statusInlineWarning,
    section: styles.section,
    sectionActions: styles.sectionActions,
    sectionFlat: styles.sectionFlat,
    sectionHeader: styles.sectionHeader,
    sectionHeaderMain: styles.sectionHeaderMain,
    sectionHeading: styles.sectionHeading,
    sectionTitle: styles.sectionTitle,
    sectionStatusArea: styles.sectionMetaRail,
    stateActionsRow: styles.stateActionsRow,
    statusSummary: styles.statusSummary,
    statusBadge: styles.statusBadge,
    spinnerIcon: styles.spinnerIcon,
    statusSummaryMinimal: styles.statusSummaryMinimal,
    stateBanner: styles.stateBanner,
    stateBody: styles.stateBody,
    customStateSlot: styles.customStateSlot,
    stateFeedback: styles.stateFeedback,
    stateFeedbackIcon: styles.stateFeedbackIcon,
    stateFeedbackIconBare: styles.stateFeedbackIconBare,
    stateFeedbackIconDanger: styles.stateFeedbackIconDanger,
    stateFeedbackIconInfo: styles.stateFeedbackIconInfo,
    stateFeedbackIconNeutral: styles.stateFeedbackIconNeutral,
    stateFeedbackIconWarning: styles.stateFeedbackIconWarning,
    stateFeedbackMessage: styles.stateFeedbackMessage,
    stateMessage: styles.stateMessage,
    stateRegion: styles.stateRegion,
    stateRegionFeedback: styles.stateRegionFeedback,
    loadingLinePrimary: styles.loadingLinePrimary,
    loadingLineSecondary: styles.loadingLineSecondary,
    loadingLineTertiary: styles.loadingLineTertiary,
    loadingSkeleton: styles.loadingSkeleton
  };
};
