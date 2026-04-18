import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type { SmartLoadingLayout } from "./SmartLoadingContainer.types.js";

const oneuiColorBorderInfo = "var(--oneuiColorBorderInfo)";
const oneuiColorBorderSuccess = "var(--oneuiColorBorderSuccess)";
const oneuiColorBorderWarning = "var(--oneuiColorBorderWarning)";
const oneuiColorBorderDanger = "var(--oneuiColorBorderDanger)";
const oneuiColorBackgroundInfoSubtle = "var(--oneuiColorBackgroundInfoSubtle)";
const oneuiColorBackgroundSuccessSubtle = "var(--oneuiColorBackgroundSuccessSubtle)";
const oneuiColorBackgroundWarningSubtle = "var(--oneuiColorBackgroundWarningSubtle)";
const oneuiColorBackgroundDangerSubtle = "var(--oneuiColorBackgroundDangerSubtle)";
const oneuiColorTextInfo = "var(--oneuiColorTextInfo)";
const oneuiColorTextSuccess = "var(--oneuiColorTextSuccess)";
const oneuiColorTextWarning = "var(--oneuiColorTextWarning)";
const oneuiColorTextDanger = "var(--oneuiColorTextDanger)";

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
    borderBottomColor: tokens.colorNeutralStroke2,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderLeftStyle: "solid",
    borderLeftWidth: "1px",
    borderLeftColor: tokens.colorNeutralStroke2,
    borderRadius: 0,
    borderRightColor: tokens.colorNeutralStroke2,
    borderRightStyle: "solid",
    borderRightWidth: "1px",
    borderTopStyle: "solid",
    borderTopWidth: "2px",
    borderTopColor: tokens.colorNeutralStroke2,
    boxSizing: "border-box",
    display: "grid",
    gap: 0,
    gridTemplateRows: "auto auto",
    overflow: "hidden",
    boxShadow: "none"
  },
  sectionRounded: {
    borderRadius: tokens.borderRadiusLarge
  },
  sectionSquare: {
    borderRadius: 0
  },
  sectionFlat: {
    boxShadow: "none"
  },
  sectionAccentBrand: {
    borderTopColor: tokens.colorBrandStroke1
  },
  sectionAccentInfo: {
    borderTopColor: oneuiColorBorderInfo
  },
  sectionAccentSuccess: {
    borderTopColor: oneuiColorBorderSuccess
  },
  sectionAccentWarning: {
    borderTopColor: oneuiColorBorderWarning
  },
  sectionAccentDanger: {
    borderTopColor: oneuiColorBorderDanger
  },
  sectionAccentNeutral: {
    borderTopColor: tokens.colorNeutralStroke1
  },
  sectionHeader: {
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "grid",
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: "minmax(0, 1fr) auto",
    minHeight: "3rem",
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
  sectionHeaderRounded: {
    borderTopLeftRadius: tokens.borderRadiusLarge,
    borderTopRightRadius: tokens.borderRadiusLarge
  },
  sectionHeaderSquare: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  sectionHeaderAccentBrand: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackground} 3%, ${tokens.colorNeutralBackground1} 97%)`
  },
  sectionHeaderAccentInfo: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundInfoSubtle} 6%, ${tokens.colorNeutralBackground1} 94%)`
  },
  sectionHeaderAccentSuccess: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundSuccessSubtle} 6%, ${tokens.colorNeutralBackground1} 94%)`
  },
  sectionHeaderAccentWarning: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundWarningSubtle} 7%, ${tokens.colorNeutralBackground1} 93%)`
  },
  sectionHeaderAccentDanger: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundDangerSubtle} 6%, ${tokens.colorNeutralBackground1} 94%)`
  },
  sectionHeaderAccentNeutral: {
    backgroundColor: tokens.colorNeutralBackground1
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
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: 0,
    color: tokens.colorBrandForeground1,
    display: "inline-flex",
    flexShrink: 0,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    height: "1.75rem",
    justifyContent: "center",
    lineHeight: 1,
    width: "1.75rem"
  },
  sectionAvatarAccentBrand: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorBrandBackground} 5%, ${tokens.colorNeutralBackground1} 95%)`,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderTopColor: tokens.colorBrandStroke1,
    color: tokens.colorBrandForeground1
  },
  sectionAvatarAccentInfo: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundInfoSubtle} 18%, ${tokens.colorNeutralBackground1} 82%)`,
    borderBottomColor: oneuiColorBorderInfo,
    borderLeftColor: oneuiColorBorderInfo,
    borderRightColor: oneuiColorBorderInfo,
    borderTopColor: oneuiColorBorderInfo,
    color: tokens.colorBrandForeground1
  },
  sectionAvatarAccentSuccess: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundSuccessSubtle} 18%, ${tokens.colorNeutralBackground1} 82%)`,
    borderBottomColor: oneuiColorBorderSuccess,
    borderLeftColor: oneuiColorBorderSuccess,
    borderRightColor: oneuiColorBorderSuccess,
    borderTopColor: oneuiColorBorderSuccess,
    color: oneuiColorTextSuccess
  },
  sectionAvatarAccentWarning: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundWarningSubtle} 20%, ${tokens.colorNeutralBackground1} 80%)`,
    borderBottomColor: oneuiColorBorderWarning,
    borderLeftColor: oneuiColorBorderWarning,
    borderRightColor: oneuiColorBorderWarning,
    borderTopColor: oneuiColorBorderWarning,
    color: oneuiColorTextWarning
  },
  sectionAvatarAccentDanger: {
    backgroundColor: `color-mix(in srgb, ${oneuiColorBackgroundDangerSubtle} 18%, ${tokens.colorNeutralBackground1} 82%)`,
    borderBottomColor: oneuiColorBorderDanger,
    borderLeftColor: oneuiColorBorderDanger,
    borderRightColor: oneuiColorBorderDanger,
    borderTopColor: oneuiColorBorderDanger,
    color: oneuiColorTextDanger
  },
  sectionAvatarAccentNeutral: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderTopColor: tokens.colorNeutralStroke1,
    color: tokens.colorNeutralForeground3
  },
  sectionHeading: {
    display: "grid",
    gap: "2px",
    minWidth: 0
  },
  sectionTitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: 0,
    lineHeight: tokens.lineHeightBase400,
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
  sectionAvatarLabel: {
    display: "inline-flex",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: "0.03em",
    lineHeight: 1,
    textTransform: "uppercase"
  },
  sectionMetaRail: {
    alignItems: "center",
    display: "flex",
    flexWrap: "nowrap",
    gap: tokens.spacingHorizontalXS,
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
    gap: tokens.spacingHorizontalXS,
    justifyContent: "flex-end",
    minWidth: 0,
    "@media (max-width: 960px)": {
      justifyContent: "flex-start"
    }
  },
  statusInline: {
    alignItems: "center",
    backgroundColor: tokens.colorTransparentBackground,
    border: `1px solid ${tokens.colorTransparentStroke}`,
    borderRadius: 0,
    display: "inline-flex",
    gap: "0.25rem",
    maxWidth: "18rem",
    minWidth: 0,
    "@media (max-width: 960px)": {
      maxWidth: "none",
      width: "100%"
    }
  },
  statusInlineInfo: {
    backgroundColor: tokens.colorTransparentBackground,
    borderBottomColor: tokens.colorTransparentStroke,
    borderLeftColor: tokens.colorTransparentStroke,
    borderRightColor: tokens.colorTransparentStroke,
    borderTopColor: tokens.colorTransparentStroke
  },
  statusInlineWarning: {
    backgroundColor: tokens.colorTransparentBackground,
    borderBottomColor: tokens.colorTransparentStroke,
    borderLeftColor: tokens.colorTransparentStroke,
    borderRightColor: tokens.colorTransparentStroke,
    borderTopColor: tokens.colorTransparentStroke
  },
  statusInlineDanger: {
    backgroundColor: tokens.colorTransparentBackground,
    borderBottomColor: tokens.colorTransparentStroke,
    borderLeftColor: tokens.colorTransparentStroke,
    borderRightColor: tokens.colorTransparentStroke,
    borderTopColor: tokens.colorTransparentStroke
  },
  statusInlineIcon: {
    alignItems: "center",
    color: tokens.colorNeutralForeground3,
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    paddingLeft: 0
  },
  statusInlineIconInfo: {
    color: oneuiColorTextInfo
  },
  statusInlineIconWarning: {
    color: oneuiColorTextWarning
  },
  statusInlineIconDanger: {
    color: oneuiColorTextDanger
  },
  statusInlineIconNeutral: {
    color: tokens.colorNeutralForeground3
  },
  statusInlineMessage: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    lineHeight: tokens.lineHeightBase200,
    overflow: "hidden",
    paddingBottom: 0,
    paddingRight: 0,
    paddingTop: 0,
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
    color: oneuiColorTextInfo
  },
  statusInlineMessageWarning: {
    color: oneuiColorTextWarning
  },
  statusInlineMessageDanger: {
    color: oneuiColorTextDanger
  },
  countBadge: {
    flexShrink: 0,
    borderRadius: tokens.borderRadiusCircular,
    minHeight: "1.5rem",
    paddingBottom: "0.125rem",
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: "0.125rem",
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
    borderRadius: tokens.borderRadiusCircular,
    minHeight: "1.5rem",
    paddingBottom: "0.125rem",
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: "0.125rem",
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
    gap: tokens.spacingHorizontalXS,
    justifyContent: "flex-end",
    "@media (max-width: 960px)": {
      justifyContent: "flex-start"
    }
  },
  chevronButton: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: tokens.colorTransparentBackground,
    border: `1px solid ${tokens.colorTransparentStroke}`,
    borderRadius: 0,
    color: tokens.colorNeutralForeground2,
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: "1.5rem",
    justifyContent: "center",
    padding: 0,
    transitionDuration: tokens.durationNormal,
    transitionProperty: "background-color, border-color, color, transform",
    transitionTimingFunction: tokens.curveEasyEase,
    width: "1.5rem",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
      borderBottomColor: tokens.colorNeutralStroke2,
      borderLeftColor: tokens.colorNeutralStroke2,
      borderRightColor: tokens.colorNeutralStroke2,
      borderTopColor: tokens.colorNeutralStroke2
    },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: "2px"
    },
    "@media (max-width: 960px)": {
      marginLeft: "auto"
    }
  },
  chevronExpanded: {
    borderBottom: `2px solid ${tokens.colorNeutralForeground2}`,
    borderRight: `2px solid ${tokens.colorNeutralForeground2}`,
    display: "inline-block",
    height: "0.375rem",
    transform: "rotate(45deg)",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "transform",
    transitionTimingFunction: tokens.curveEasyEase,
    width: "0.375rem"
  },
  chevronCollapsed: {
    borderBottom: `2px solid ${tokens.colorNeutralForeground2}`,
    borderRight: `2px solid ${tokens.colorNeutralForeground2}`,
    display: "inline-block",
    height: "0.375rem",
    transform: "rotate(-45deg)",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "transform",
    transitionTimingFunction: tokens.curveEasyEase,
    width: "0.375rem"
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
    paddingTop: tokens.spacingVerticalS,
    "@media (max-width: 640px)": {
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM
    }
  },
  bodySquare: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
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
    bodySquare: styles.bodySquare,
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
    sectionAvatarLabel: styles.sectionAvatarLabel,
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
    sectionRounded: styles.sectionRounded,
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
    sectionSquare: styles.sectionSquare,
    sectionHeader: styles.sectionHeader,
    sectionHeaderRounded: styles.sectionHeaderRounded,
    sectionHeaderSquare: styles.sectionHeaderSquare,
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
