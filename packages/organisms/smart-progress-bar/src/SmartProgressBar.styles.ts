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
  header: {
    alignItems: "start",
    display: "grid",
    gap: tokens.spacingVerticalXS,
    gridTemplateColumns: "1fr auto"
  },
  summary: {
    alignItems: "baseline",
    color: tokens.colorNeutralForeground2,
    display: "grid",
    gap: tokens.spacingVerticalXXS,
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
  meterFill: {
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusCircular,
    height: "100%",
    transitionDuration: tokens.durationSlower,
    transitionProperty: "width",
    transitionTimingFunction: tokens.curveEasyEase
  },
  meterValue: {
    minWidth: "3.5rem",
    textAlign: "right"
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
    header: styles.header,
    item: styles.item,
    itemLabel: styles.itemLabel,
    itemList: styles.itemList,
    meterFill: styles.meterFill,
    meterTrack: styles.meterTrack,
    meterValue: styles.meterValue,
    root: mergeClasses(styles.root, className),
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
    summaryBreakdown: styles.summaryBreakdown
  };
};
