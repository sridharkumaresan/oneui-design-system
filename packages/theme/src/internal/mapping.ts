export const semanticPathToThemeKeyMap = {
  color: {
    "background.canvas": "colorNeutralBackground1",
    "background.surface": "colorNeutralBackground2",
    "background.elevated": "colorNeutralBackground3",
    "background.brand": "colorBrandBackground",
    "background.dangerSubtle": "colorPaletteRedBackground1",
    "background.successSubtle": "colorPaletteGreenBackground1",
    "text.primary": "colorNeutralForeground1",
    "text.secondary": "colorNeutralForeground2",
    "text.inverse": "colorNeutralForegroundInverted",
    "text.brand": "colorBrandForeground1",
    "text.danger": "colorStatusDangerForeground1",
    "text.success": "colorStatusSuccessForeground1",
    "border.subtle": "colorNeutralStrokeAccessible",
    "border.default": "colorNeutralStroke1",
    "border.strong": "colorNeutralStroke2",
    "border.focus": "colorStrokeFocus2",
    "border.brand": "colorBrandStroke1",
    "border.danger": "colorStatusDangerBorder1",
    "icon.primary": "colorNeutralForeground3",
    "icon.secondary": "colorNeutralForeground4",
    "icon.brand": "colorBrandForeground2",
    "icon.inverse": "oneuiColorIconInverse",
    "status.success": "colorStatusSuccessForeground2",
    "status.warning": "colorStatusWarningForeground1",
    "status.danger": "colorStatusDangerForeground2",
    "status.info": "colorStatusWarningForeground2"
  },
  typography: {
    "fontFamily.base": "fontFamilyBase",
    "fontFamily.monospace": "fontFamilyMonospace",
    "fontSize.caption": "fontSizeBase100",
    "fontSize.body": "fontSizeBase200",
    "fontSize.bodyLarge": "fontSizeBase300",
    "fontSize.title": "fontSizeBase500",
    "fontSize.headline": "fontSizeHero700",
    "fontWeight.regular": "fontWeightRegular",
    "fontWeight.medium": "fontWeightMedium",
    "fontWeight.semibold": "fontWeightSemibold",
    "fontWeight.bold": "fontWeightBold",
    "lineHeight.compact": "lineHeightBase200",
    "lineHeight.normal": "lineHeightBase300",
    "lineHeight.relaxed": "lineHeightBase400"
  },
  spacing: {
    xxs: "spacingHorizontalXXS",
    xs: "spacingHorizontalXS",
    sm: "spacingHorizontalS",
    md: "spacingHorizontalM",
    lg: "spacingHorizontalL",
    xl: "spacingHorizontalXL",
    xxl: "spacingHorizontalXXL"
  },
  radius: {
    none: "borderRadiusNone",
    sm: "borderRadiusSmall",
    md: "borderRadiusMedium",
    lg: "borderRadiusLarge",
    full: "borderRadiusCircular"
  },
  shadows: {
    sm: "shadow4",
    md: "shadow8",
    lg: "shadow16",
    xl: "shadow64",
    focusRing: "shadowFocusRing"
  },
  breakpoints: {
    xs: "oneuiBreakpointXs",
    sm: "oneuiBreakpointSm",
    md: "oneuiBreakpointMd",
    lg: "oneuiBreakpointLg",
    xl: "oneuiBreakpointXl",
    xxl: "oneuiBreakpointXxl"
  }
};

export const requiredFluentThemeKeys = Object.values(semanticPathToThemeKeyMap).flatMap((paths) => {
  return Object.values(paths);
});
