import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxSizing: "border-box",
    display: "grid",
    justifyItems: "center",
    overflow: "hidden",
    position: "relative",
    width: "100%"
  },
  image: {
    borderRadius: "inherit",
    display: "block",
    height: "100%",
    objectFit: "cover",
    width: "100%"
  },
  statusLayer: {
    alignContent: "center",
    borderRadius: "inherit",
    color: tokens.colorNeutralForeground3,
    display: "grid",
    gap: tokens.spacingVerticalS,
    justifyItems: "center",
    inset: 0,
    padding: tokens.spacingHorizontalM,
    position: "absolute",
    textAlign: "center"
  },
  statusText: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  skeleton: {
    animationDuration: "1.4s",
    animationIterationCount: "infinite",
    animationName: {
      "0%": {
        opacity: 0.65
      },
      "50%": {
        opacity: 1
      },
      "100%": {
        opacity: 0.65
      }
    },
    animationTimingFunction: "ease-in-out",
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: "inherit",
    inset: 0,
    position: "absolute",
    "@media (prefers-reduced-motion: reduce)": {
      animationDuration: "0ms"
    }
  },
  retryButton: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground2,
    cursor: "pointer",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalXS
  }
});

export const useOneUIImageClassNames = (className?: string) => {
  const styles = useStyles();

  return {
    image: styles.image,
    retryButton: styles.retryButton,
    root: mergeClasses(styles.root, className),
    skeleton: styles.skeleton,
    statusLayer: styles.statusLayer,
    statusText: styles.statusText
  };
};
