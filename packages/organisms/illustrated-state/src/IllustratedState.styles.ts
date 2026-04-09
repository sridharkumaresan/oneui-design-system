import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    display: "grid",
    minWidth: 0,
    width: "100%"
  },
  surface: {
    alignContent: "start",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxSizing: "border-box",
    boxShadow: tokens.shadow4,
    display: "grid",
    height: "100%",
    justifyItems: "center",
    maxWidth: "100%",
    minWidth: 0,
    paddingBottom: tokens.spacingVerticalXL,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    paddingTop: tokens.spacingVerticalXL,
    rowGap: tokens.spacingVerticalM,
    width: "100%",
    "@media (max-width: 640px)": {
      paddingBottom: tokens.spacingVerticalL,
      paddingLeft: tokens.spacingHorizontalL,
      paddingRight: tokens.spacingHorizontalL,
      paddingTop: tokens.spacingVerticalL
    }
  },
  surfaceBorderless: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: 0,
    boxShadow: "none",
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0
  },
  illustrationWrap: {
    display: "grid",
    justifyItems: "center",
    minWidth: 0,
    paddingBottom: tokens.spacingVerticalS,
    width: "100%"
  },
  illustrationScene: {
    display: "grid",
    height: "9.5rem",
    placeItems: "center",
    position: "relative",
    width: "12rem"
  },
  illustrationStage: {
    backgroundColor: "var(--oneui-illustrated-state-stage)",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "1.5rem",
    boxShadow: tokens.shadow8,
    height: "6.5rem",
    left: "1.15rem",
    position: "absolute",
    right: "1.15rem",
    top: "1.9rem"
  },
  illustrationHalo: {
    backgroundColor: "var(--oneui-illustrated-state-halo)",
    borderRadius: tokens.borderRadiusCircular,
    height: "5rem",
    left: "50%",
    position: "absolute",
    top: ".7rem",
    transform: "translateX(-50%)",
    width: "5rem"
  },
  illustrationAccentBlock: {
    backgroundColor: "var(--oneui-illustrated-state-accent)",
    borderRadius: tokens.borderRadiusMedium,
    height: "1.35rem",
    position: "absolute",
    right: "1.35rem",
    top: "2.35rem",
    width: "3.1rem"
  },
  illustrationDetailDot: {
    backgroundColor: "var(--oneui-illustrated-state-detail)",
    borderRadius: tokens.borderRadiusCircular,
    height: ".95rem",
    left: "1.75rem",
    position: "absolute",
    top: "3rem",
    width: ".95rem"
  },
  illustrationGlyph: {
    alignItems: "center",
    color: "var(--oneui-illustrated-state-foreground)",
    display: "inline-flex",
    height: "3rem",
    justifyContent: "center",
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "3rem"
  },
  illustrationPaletteBrand: {
    "--oneui-illustrated-state-accent": tokens.colorBrandBackground,
    "--oneui-illustrated-state-detail": tokens.colorBrandBackground2,
    "--oneui-illustrated-state-foreground": tokens.colorBrandForeground1,
    "--oneui-illustrated-state-halo": tokens.colorBrandBackground2,
    "--oneui-illustrated-state-stage": tokens.colorNeutralBackground2
  },
  illustrationPaletteDanger: {
    "--oneui-illustrated-state-accent": tokens.colorPaletteRedBackground3,
    "--oneui-illustrated-state-detail": tokens.colorPaletteRedBackground1,
    "--oneui-illustrated-state-foreground": tokens.colorPaletteRedForeground1,
    "--oneui-illustrated-state-halo": tokens.colorPaletteRedBackground1,
    "--oneui-illustrated-state-stage": tokens.colorNeutralBackground2
  },
  illustrationPaletteInfo: {
    "--oneui-illustrated-state-accent": tokens.colorBrandBackground,
    "--oneui-illustrated-state-detail": tokens.colorBrandBackground2,
    "--oneui-illustrated-state-foreground": tokens.colorBrandForeground1,
    "--oneui-illustrated-state-halo": tokens.colorBrandBackground2,
    "--oneui-illustrated-state-stage": tokens.colorNeutralBackground2
  },
  illustrationPaletteNeutral: {
    "--oneui-illustrated-state-accent": tokens.colorNeutralBackground4,
    "--oneui-illustrated-state-detail": tokens.colorNeutralBackground3,
    "--oneui-illustrated-state-foreground": tokens.colorNeutralForeground3,
    "--oneui-illustrated-state-halo": tokens.colorNeutralBackground3,
    "--oneui-illustrated-state-stage": tokens.colorNeutralBackground2
  },
  illustrationPaletteSuccess: {
    "--oneui-illustrated-state-accent": tokens.colorPaletteGreenBackground3,
    "--oneui-illustrated-state-detail": tokens.colorPaletteGreenBackground2,
    "--oneui-illustrated-state-foreground": tokens.colorPaletteGreenForeground1,
    "--oneui-illustrated-state-halo": tokens.colorPaletteGreenBackground2,
    "--oneui-illustrated-state-stage": tokens.colorNeutralBackground2
  },
  illustrationPaletteWarning: {
    "--oneui-illustrated-state-accent": tokens.colorPaletteGoldBackground2,
    "--oneui-illustrated-state-detail": tokens.colorPaletteGoldBackground2,
    "--oneui-illustrated-state-foreground": tokens.colorPaletteDarkOrangeForeground1,
    "--oneui-illustrated-state-halo": tokens.colorPaletteGoldBackground2,
    "--oneui-illustrated-state-stage": tokens.colorNeutralBackground2
  },
  copy: {
    display: "grid",
    gap: tokens.spacingVerticalS,
    justifyItems: "center",
    maxWidth: "34rem",
    minWidth: 0,
    textAlign: "center",
    width: "100%"
  },
  description: {
    maxWidth: "32rem"
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalS,
    justifyContent: "center"
  },
  extras: {
    display: "grid",
    gap: tokens.spacingVerticalS,
    justifyItems: "center",
    maxWidth: "34rem",
    minWidth: 0,
    width: "100%"
  },
  spinnerGlyph: {
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
  }
});

export const useIllustratedStateClassNames = (className?: string) => {
  const styles = useStyles();

  return {
    actions: styles.actions,
    copy: styles.copy,
    description: styles.description,
    extras: styles.extras,
    illustrationGlyph: styles.illustrationGlyph,
    illustrationPaletteBrand: styles.illustrationPaletteBrand,
    illustrationPaletteDanger: styles.illustrationPaletteDanger,
    illustrationPaletteInfo: styles.illustrationPaletteInfo,
    illustrationPaletteNeutral: styles.illustrationPaletteNeutral,
    illustrationPaletteSuccess: styles.illustrationPaletteSuccess,
    illustrationPaletteWarning: styles.illustrationPaletteWarning,
    illustrationScene: styles.illustrationScene,
    illustrationWrap: styles.illustrationWrap,
    root: mergeClasses(styles.root, className),
    spinnerGlyph: styles.spinnerGlyph,
    stage: styles.illustrationStage,
    stageAccentBlock: styles.illustrationAccentBlock,
    stageDetailDot: styles.illustrationDetailDot,
    stageHalo: styles.illustrationHalo,
    surface: styles.surface,
    surfaceBorderless: styles.surfaceBorderless
  };
};
