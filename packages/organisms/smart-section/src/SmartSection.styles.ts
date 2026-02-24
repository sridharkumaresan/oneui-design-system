import { makeStyles, tokens } from "@fluentui/react-components";

import { oneuiLightTheme } from "@functions-oneui/theme";

const fallbackRadius = String(oneuiLightTheme.borderRadiusMedium);

export const useSmartSectionStyles = makeStyles({
  root: {
    width: "100%",
    minWidth: "0",
    borderTopStyle: "solid",
    borderTopWidth: tokens.strokeWidthThin,
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightStyle: "solid",
    borderRightWidth: tokens.strokeWidthThin,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomStyle: "solid",
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftStyle: "solid",
    borderLeftWidth: tokens.strokeWidthThin,
    borderLeftColor: tokens.colorNeutralStroke1,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: fallbackRadius,
    overflow: "hidden"
  },
  header: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    borderBottomStyle: "solid",
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomColor: tokens.colorNeutralStroke1,
    backgroundColor: tokens.colorNeutralBackground2
  },
  headerToggle: {
    flexGrow: 1,
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none",
    margin: "0",
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    font: "inherit",
    ":focus-visible": {
      outlineStyle: "solid",
      outlineWidth: tokens.strokeWidthThick,
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: "-2px"
    }
  },
  headerMain: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
    minWidth: "0"
  },
  titleLine: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    minWidth: "0"
  },
  title: {
    margin: "0",
    fontWeight: oneuiLightTheme.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: "anywhere"
  },
  titleSkeleton: {
    width: "12rem",
    maxWidth: "40vw",
    height: tokens.lineHeightBase300,
    borderRadius: String(oneuiLightTheme.borderRadiusSmall)
  },
  description: {
    margin: "0",
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    overflowWrap: "anywhere"
  },
  descriptionSkeleton: {
    width: "9rem",
    maxWidth: "32vw",
    height: tokens.lineHeightBase200,
    borderRadius: String(oneuiLightTheme.borderRadiusSmall)
  },
  countBadge: {
    borderRadius: String(oneuiLightTheme.borderRadiusCircular),
    borderTopStyle: "solid",
    borderTopWidth: tokens.strokeWidthThin,
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightStyle: "solid",
    borderRightWidth: tokens.strokeWidthThin,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomStyle: "solid",
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftStyle: "solid",
    borderLeftWidth: tokens.strokeWidthThin,
    borderLeftColor: tokens.colorNeutralStroke1,
    paddingTop: tokens.spacingVerticalXXS,
    paddingBottom: tokens.spacingVerticalXXS,
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
    minWidth: "1.5rem",
    textAlign: "center",
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground1,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  countSkeleton: {
    width: "2rem",
    height: "1.25rem",
    borderRadius: String(oneuiLightTheme.borderRadiusCircular)
  },
  headerMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    flexShrink: 0
  },
  chevron: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300
  },
  status: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    whiteSpace: "nowrap"
  },
  statusSkeleton: {
    width: "4.5rem",
    height: tokens.lineHeightBase200,
    borderRadius: String(oneuiLightTheme.borderRadiusSmall)
  },
  chevronSkeleton: {
    width: "0.75rem",
    height: tokens.lineHeightBase300,
    borderRadius: String(oneuiLightTheme.borderRadiusSmall)
  },
  headerExtras: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingRight: tokens.spacingHorizontalM
  },
  viewMoreLink: {
    color: tokens.colorBrandForegroundLink,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    textDecorationLine: "none",
    fontWeight: oneuiLightTheme.fontWeightSemibold,
    ":hover": {
      textDecorationLine: "underline"
    },
    ":focus-visible": {
      outlineStyle: "solid",
      outlineWidth: tokens.strokeWidthThick,
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: "2px"
    }
  },
  collapsedSummary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottomStyle: "solid",
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomColor: tokens.colorNeutralStroke1
  },
  body: {
    overflow: "hidden",
    willChange: "height"
  },
  bodyInner: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    minWidth: "0",
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM
  },
  list: {
    listStyleType: "none",
    margin: "0",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    minWidth: "0"
  },
  row: {
    width: "100%",
    boxSizing: "border-box",
    minWidth: "0",
    borderRadius: String(oneuiLightTheme.borderRadiusSmall),
    borderTopStyle: "solid",
    borderTopWidth: tokens.strokeWidthThin,
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightStyle: "solid",
    borderRightWidth: tokens.strokeWidthThin,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomStyle: "solid",
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftStyle: "solid",
    borderLeftWidth: tokens.strokeWidthThin,
    borderLeftColor: tokens.colorNeutralStroke1,
    backgroundColor: tokens.colorNeutralBackground1,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    overflow: "hidden"
  },
  placeholderRow: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: String(oneuiLightTheme.borderRadiusSmall),
    backgroundColor: tokens.colorNeutralBackground3
  },
  stateMessage: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    overflowWrap: "anywhere"
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap"
  },
  visuallyHidden: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none"
  }
});
