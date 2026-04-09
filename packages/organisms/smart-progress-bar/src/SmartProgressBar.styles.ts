import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

const spinnerSize = "0.75rem";

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxSizing: "border-box",
    display: "grid",
    gap: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    paddingTop: tokens.spacingVerticalM,
    width: "100%"
  },
  rootSlim: {
    background: `linear-gradient(180deg, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorNeutralBackground2} 100%)`,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderTopColor: tokens.colorNeutralStroke2,
    gap: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalS
  },
  header: {
    alignItems: "start",
    display: "grid",
    gap: tokens.spacingVerticalXS,
    gridTemplateColumns: "1fr auto"
  },
  headerSlimButton: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    display: "grid",
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: "minmax(0, 1fr) auto",
    margin: 0,
    padding: 0,
    textAlign: "left",
    width: "100%"
  },
  headerTitleGroup: {
    display: "grid",
    gap: "2px",
    minWidth: 0
  },
  title: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: "-0.01em",
    lineHeight: tokens.lineHeightBase500
  },
  titleSlim: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  descriptionSlim: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  headerRight: {
    alignItems: "center",
    display: "inline-flex",
    gap: tokens.spacingHorizontalS
  },
  metricBadge: {
    alignItems: "center",
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorPaletteLightTealBackground2} 100%)`,
    borderBottom: `1px solid color-mix(in srgb, ${tokens.colorBrandStroke1} 72%, ${tokens.colorPaletteLightTealBorderActive} 28%)`,
    borderLeft: `1px solid color-mix(in srgb, ${tokens.colorBrandStroke1} 72%, ${tokens.colorPaletteLightTealBorderActive} 28%)`,
    borderRadius: tokens.borderRadiusCircular,
    borderRight: `1px solid color-mix(in srgb, ${tokens.colorBrandStroke1} 72%, ${tokens.colorPaletteLightTealBorderActive} 28%)`,
    borderTop: `1px solid color-mix(in srgb, ${tokens.colorBrandStroke1} 72%, ${tokens.colorPaletteLightTealBorderActive} 28%)`,
    boxShadow: `0 8px 18px color-mix(in srgb, ${tokens.colorBrandBackground} 18%, transparent)`,
    color: tokens.colorNeutralForegroundOnBrand,
    display: "inline-flex",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    gap: tokens.spacingHorizontalXS,
    lineHeight: tokens.lineHeightBase200,
    minHeight: "2rem",
    paddingBottom: "0.25rem",
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    paddingTop: "0.25rem"
  },
  metricBadgeValue: {
    fontSize: tokens.fontSizeBase300
  },
  metricBadgeTotal: {
    color: "color-mix(in srgb, white 82%, transparent)",
    fontWeight: tokens.fontWeightMedium
  },
  chevronButtonGlyph: {
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
  chevronButtonGlyphExpanded: {
    transform: "rotate(-135deg)"
  },
  detailsViewport: {
    display: "grid",
    gridTemplateRows: "0fr",
    opacity: 0,
    overflow: "hidden",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "grid-template-rows, opacity",
    transitionTimingFunction: tokens.curveEasyEase,
    "@media (prefers-reduced-motion: reduce)": {
      transitionDuration: "0ms"
    }
  },
  detailsViewportExpanded: {
    gridTemplateRows: "1fr",
    opacity: 1
  },
  detailsViewportInner: {
    minHeight: 0,
    overflow: "hidden"
  },
  detailsBody: {
    display: "grid",
    gap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalXS
  },
  summary: {
    alignItems: "baseline",
    color: tokens.colorNeutralForeground2,
    display: "grid",
    gap: tokens.spacingVerticalXXS,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    textWrap: "balance"
  },
  summaryBreakdown: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  meterTrack: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusCircular,
    height: "0.375rem",
    overflow: "hidden",
    width: "100%"
  },
  meterTrackSlim: {
    height: "0.25rem"
  },
  meterFill: {
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusCircular,
    height: "100%",
    transitionDuration: tokens.durationSlower,
    transitionProperty: "width",
    transitionTimingFunction: tokens.curveEasyEase
  },
  itemList: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalSNudge,
    margin: 0,
    padding: 0
  },
  item: {
    listStyleType: "none"
  },
  itemLabel: {
    display: "inline-block",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  statusGlyphIdle: {
    backgroundColor: tokens.colorNeutralForeground4,
    borderRadius: tokens.borderRadiusCircular,
    display: "inline-block",
    height: spinnerSize,
    opacity: 0.8,
    width: spinnerSize
  },
  statusGlyphLoading: {
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
    borderBottom: `1.5px solid ${tokens.colorBrandForeground1}`,
    borderLeft: `1.5px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusCircular,
    borderRight: `1.5px solid ${tokens.colorNeutralStroke2}`,
    borderTop: `1.5px solid ${tokens.colorNeutralStroke2}`,
    boxSizing: "border-box",
    display: "inline-block",
    height: spinnerSize,
    width: spinnerSize
  },
  statusGlyphDelayed: {
    animationDuration: "1.6s",
    animationIterationCount: "infinite",
    animationName: {
      "0%": {
        opacity: 0.9,
        transform: "rotate(0deg) scale(1)"
      },
      "50%": {
        opacity: 0.7,
        transform: "rotate(180deg) scale(0.92)"
      },
      "100%": {
        opacity: 0.9,
        transform: "rotate(360deg) scale(1)"
      }
    },
    animationTimingFunction: "ease-in-out",
    borderBottom: `1.5px solid ${tokens.colorNeutralForeground3}`,
    borderLeft: `1.5px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusCircular,
    borderRight: `1.5px solid ${tokens.colorNeutralStroke2}`,
    borderTop: `1.5px solid ${tokens.colorNeutralStroke2}`,
    boxSizing: "border-box",
    display: "inline-block",
    height: spinnerSize,
    width: spinnerSize
  },
  statusGlyphSuccess: {
    alignItems: "center",
    backgroundColor: tokens.colorPaletteGreenBackground3,
    borderRadius: tokens.borderRadiusCircular,
    display: "inline-flex",
    height: spinnerSize,
    justifyContent: "center",
    transformOrigin: "center",
    width: spinnerSize
  },
  statusGlyphSuccessMark: {
    animationDuration: tokens.durationSlow,
    animationFillMode: "both",
    animationName: {
      from: {
        opacity: 0,
        transform: "scale(0.65)"
      },
      to: {
        opacity: 1,
        transform: "scale(1)"
      }
    },
    borderBottom: `1.5px solid ${tokens.colorPaletteGreenForeground1}`,
    borderRight: `1.5px solid ${tokens.colorPaletteGreenForeground1}`,
    boxSizing: "border-box",
    display: "inline-block",
    height: "0.35rem",
    transform: "rotate(45deg)",
    width: "0.2rem"
  },
  statusGlyphError: {
    alignItems: "center",
    backgroundColor: tokens.colorPaletteRedBackground3,
    borderRadius: tokens.borderRadiusCircular,
    display: "inline-flex",
    height: spinnerSize,
    justifyContent: "center",
    width: spinnerSize
  },
  statusGlyphErrorMark: {
    animationDuration: tokens.durationSlow,
    animationFillMode: "both",
    animationName: {
      from: {
        opacity: 0,
        transform: "translateY(-1px)"
      },
      to: {
        opacity: 1,
        transform: "translateY(0)"
      }
    },
    backgroundColor: tokens.colorPaletteRedForeground1,
    borderRadius: tokens.borderRadiusCircular,
    display: "inline-block",
    height: "0.45rem",
    position: "relative",
    width: "1.5px"
  },
  statusGlyphEmpty: {
    alignItems: "center",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusCircular,
    boxSizing: "border-box",
    display: "inline-flex",
    height: spinnerSize,
    justifyContent: "center",
    width: spinnerSize
  },
  statusGlyphEmptyMark: {
    backgroundColor: tokens.colorNeutralForeground4,
    borderRadius: tokens.borderRadiusCircular,
    display: "inline-block",
    height: "1.5px",
    width: "0.35rem"
  }
});

export const useSmartProgressBarClassNames = (className?: string) => {
  const styles = useStyles();

  return {
    chevronButtonGlyph: styles.chevronButtonGlyph,
    chevronButtonGlyphExpanded: styles.chevronButtonGlyphExpanded,
    description: styles.description,
    descriptionSlim: styles.descriptionSlim,
    detailsBody: styles.detailsBody,
    detailsViewport: styles.detailsViewport,
    detailsViewportExpanded: styles.detailsViewportExpanded,
    detailsViewportInner: styles.detailsViewportInner,
    header: styles.header,
    headerRight: styles.headerRight,
    headerSlimButton: styles.headerSlimButton,
    headerTitleGroup: styles.headerTitleGroup,
    item: styles.item,
    itemLabel: styles.itemLabel,
    itemList: styles.itemList,
    meterFill: styles.meterFill,
    meterTrack: styles.meterTrack,
    meterTrackSlim: styles.meterTrackSlim,
    metricBadge: styles.metricBadge,
    metricBadgeTotal: styles.metricBadgeTotal,
    metricBadgeValue: styles.metricBadgeValue,
    root: mergeClasses(styles.root, className),
    rootSlim: styles.rootSlim,
    statusGlyphDelayed: styles.statusGlyphDelayed,
    statusGlyphEmpty: styles.statusGlyphEmpty,
    statusGlyphEmptyMark: styles.statusGlyphEmptyMark,
    statusGlyphError: styles.statusGlyphError,
    statusGlyphErrorMark: styles.statusGlyphErrorMark,
    statusGlyphIdle: styles.statusGlyphIdle,
    statusGlyphLoading: styles.statusGlyphLoading,
    statusGlyphSuccess: styles.statusGlyphSuccess,
    statusGlyphSuccessMark: styles.statusGlyphSuccessMark,
    summary: styles.summary,
    summaryBreakdown: styles.summaryBreakdown,
    title: styles.title,
    titleSlim: styles.titleSlim
  };
};
