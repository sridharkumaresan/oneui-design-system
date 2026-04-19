import { rawPalette } from "./internal/palette.js";
import {
  oneuiBorderScale,
  oneuiFluentTypographyAliases,
  oneuiMotionScale,
  oneuiRadiusScale,
  oneuiSizeScale,
  oneuiSpacingScale,
  oneuiTypographyScale,
  oneuiZIndexScale
} from "./foundations.js";

export const oneuiBrandColors = {
  primary: "#00AEEF",
  interactive: "#006DE3",
  interactive2: "#272727",
  lightBlue: "#E7F6FD",
  navy: "#000063",
  cyan: "#00AEEF"
} as const;

export const oneuiBrandFonts = {
  base: oneuiTypographyScale.fontFamily.base,
  brand: oneuiTypographyScale.fontFamily.brand,
  monospace: oneuiTypographyScale.fontFamily.monospace
} as const;

const sharedFluentThemeOverrides = {
  fontFamilyBase: oneuiBrandFonts.base,
  fontFamilyMonospace: oneuiBrandFonts.monospace,
  fontSizeBase100: oneuiTypographyScale.fontSize.caption,
  fontSizeBase200: oneuiTypographyScale.fontSize.body,
  fontSizeBase300: oneuiTypographyScale.fontSize.bodyLarge,
  fontSizeBase400: "1.125rem",
  fontSizeBase500: oneuiTypographyScale.fontSize.title,
  fontSizeBase600: "1.5rem",
  fontSizeHero700: oneuiTypographyScale.fontSize.headline,
  fontWeightRegular: oneuiTypographyScale.fontWeight.regular,
  fontWeightMedium: oneuiTypographyScale.fontWeight.medium,
  fontWeightSemibold: oneuiTypographyScale.fontWeight.semibold,
  fontWeightBold: oneuiTypographyScale.fontWeight.bold,
  lineHeightBase200: oneuiTypographyScale.lineHeight.compact,
  lineHeightBase300: oneuiTypographyScale.lineHeight.normal,
  lineHeightBase400: oneuiTypographyScale.lineHeight.relaxed,
  spacingHorizontalXXS: oneuiSpacingScale.xxs,
  spacingHorizontalXS: oneuiSpacingScale.xs,
  spacingHorizontalS: oneuiSpacingScale.sm,
  spacingHorizontalM: oneuiSpacingScale.md,
  spacingHorizontalL: oneuiSpacingScale.lg,
  spacingHorizontalXL: oneuiSpacingScale.xl,
  spacingHorizontalXXL: oneuiSpacingScale.xxl,
  spacingVerticalXXS: oneuiSpacingScale.xxs,
  spacingVerticalXS: oneuiSpacingScale.xs,
  spacingVerticalS: oneuiSpacingScale.sm,
  spacingVerticalM: oneuiSpacingScale.md,
  spacingVerticalL: oneuiSpacingScale.lg,
  spacingVerticalXL: oneuiSpacingScale.xl,
  spacingVerticalXXL: oneuiSpacingScale.xxl,
  borderRadiusNone: oneuiRadiusScale.none,
  borderRadiusSmall: oneuiRadiusScale.sm,
  borderRadiusMedium: oneuiRadiusScale.md,
  borderRadiusLarge: oneuiRadiusScale.lg,
  borderRadiusCircular: oneuiRadiusScale.full,
  strokeWidthThin: oneuiBorderScale.thin,
  strokeWidthThick: oneuiBorderScale.thick,
  durationNormal: oneuiMotionScale.durationNormal,
  durationGentle: oneuiMotionScale.durationGentle,
  curveEasyEase: oneuiMotionScale.curveEasyEase,
  curveAccelerateMid: oneuiMotionScale.curveAccelerateMid,
  shadow4: "0 1px 2px 0 rgba(0, 0, 0, 0.12)",
  shadow8: "0 4px 10px 0 rgba(0, 0, 0, 0.16)",
  shadow16: "0 8px 18px -2px rgba(0, 0, 0, 0.18)",
  shadow64: "0 16px 28px -4px rgba(0, 0, 0, 0.22)",
  shadowFocusRing: `0 0 0 2px ${oneuiBrandColors.interactive}`,
  oneuiSizeControlHeightSmall: oneuiSizeScale.controlHeightSmall,
  oneuiSizeControlHeightMedium: oneuiSizeScale.controlHeightMedium,
  oneuiSizeControlHeightLarge: oneuiSizeScale.controlHeightLarge,
  oneuiSizeIconSmall: oneuiSizeScale.iconSizeSmall,
  oneuiSizeIconMedium: oneuiSizeScale.iconSizeMedium,
  oneuiSizeIconLarge: oneuiSizeScale.iconSizeLarge
} as const;

export const oneuiFluentThemeOverrides = {
  light: {
    ...sharedFluentThemeOverrides,
    colorNeutralBackground1: rawPalette.neutral[0],
    colorNeutralBackground2: rawPalette.neutral[0],
    colorNeutralForeground1: rawPalette.neutral[900],
    colorNeutralForeground2: rawPalette.neutral[500],
    colorNeutralForeground3: rawPalette.neutral[700],
    colorNeutralForeground4: rawPalette.neutral[500],
    colorNeutralForegroundInverted: rawPalette.neutral[0],
    colorNeutralForegroundOnBrand: rawPalette.neutral[0],
    colorNeutralStroke1: rawPalette.neutral[200],
    colorNeutralStroke2: rawPalette.neutral[300],
    colorNeutralStrokeAccessible: rawPalette.status.neutralTint,
    colorBrandBackground: oneuiBrandColors.interactive,
    colorBrandBackgroundHover: rawPalette.brand.interactiveAlt,
    colorBrandBackgroundPressed: rawPalette.brand.interactivePressed,
    colorBrandForeground1: oneuiBrandColors.interactive,
    colorBrandForeground2: oneuiBrandColors.interactive,
    colorBrandForegroundLink: oneuiBrandColors.interactive,
    colorBrandForegroundLinkHover: rawPalette.brand.interactiveAlt,
    colorBrandForegroundLinkPressed: rawPalette.brand.interactivePressed,
    colorBrandStroke1: oneuiBrandColors.interactive
  },
  dark: {
    ...sharedFluentThemeOverrides,
    shadow4: "0 1px 2px 0 rgba(0, 0, 0, 0.30)",
    shadow8: "0 4px 10px 0 rgba(0, 0, 0, 0.34)",
    shadow16: "0 8px 18px -2px rgba(0, 0, 0, 0.38)",
    shadow64: "0 16px 28px -4px rgba(0, 0, 0, 0.42)",
    shadowFocusRing: `0 0 0 2px ${oneuiBrandColors.primary}`,
    colorNeutralBackground1: rawPalette.neutral[900],
    colorNeutralBackground2: rawPalette.neutral[800],
    colorNeutralForeground1: rawPalette.neutral[0],
    colorNeutralForeground2: rawPalette.neutral[300],
    colorNeutralForeground3: rawPalette.neutral[100],
    colorNeutralForeground4: rawPalette.neutral[300],
    colorNeutralForegroundInverted: rawPalette.neutral[1000],
    colorNeutralForegroundOnBrand: rawPalette.neutral[0],
    colorNeutralStroke1: rawPalette.neutral[700],
    colorNeutralStroke2: rawPalette.neutral[400],
    colorNeutralStrokeAccessible: rawPalette.neutral[800],
    colorBrandBackground: oneuiBrandColors.interactive,
    colorBrandBackgroundHover: rawPalette.brand.interactiveAlt,
    colorBrandBackgroundPressed: rawPalette.brand.interactivePressed,
    colorBrandForeground1: oneuiBrandColors.primary,
    colorBrandForeground2: oneuiBrandColors.primary,
    colorBrandForegroundLink: oneuiBrandColors.primary,
    colorBrandForegroundLinkHover: "#4bc9ff",
    colorBrandForegroundLinkPressed: "#7ad8ff",
    colorBrandStroke1: oneuiBrandColors.primary
  }
} as const;

export const oneuiFluentFoundations = {
  fonts: oneuiBrandFonts,
  typography: oneuiFluentTypographyAliases,
  spacing: oneuiSpacingScale,
  radii: oneuiRadiusScale,
  shadows: {
    light: {
      shadow4: oneuiFluentThemeOverrides.light.shadow4,
      shadow8: oneuiFluentThemeOverrides.light.shadow8,
      shadow16: oneuiFluentThemeOverrides.light.shadow16,
      shadow64: oneuiFluentThemeOverrides.light.shadow64
    },
    dark: {
      shadow4: oneuiFluentThemeOverrides.dark.shadow4,
      shadow8: oneuiFluentThemeOverrides.dark.shadow8,
      shadow16: oneuiFluentThemeOverrides.dark.shadow16,
      shadow64: oneuiFluentThemeOverrides.dark.shadow64
    }
  },
  borders: oneuiBorderScale,
  motion: oneuiMotionScale,
  zIndex: oneuiZIndexScale,
  sizes: oneuiSizeScale
} as const;
