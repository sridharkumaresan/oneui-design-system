export const oneuiFluentTokenCategories = [
  "colors",
  "typography",
  "fonts",
  "spacing",
  "radii",
  "shadows",
  "borders",
  "motion",
  "sizes"
] as const;

export type OneUIFluentTokenCategory = (typeof oneuiFluentTokenCategories)[number];

export const oneuiBrandGradientStopPositions = [
  "0%",
  "15%",
  "30%",
  "45%",
  "55%",
  "70%",
  "85%",
  "100%"
] as const;

export const oneuiTypographyScale = {
  fontFamily: {
    base: '"Barclays Effra", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    brand: '"Barclays Effra", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    monospace: '"Cascadia Mono", "SFMono-Regular", Menlo, monospace'
  },
  fontSize: {
    caption: "0.75rem",
    body: "0.875rem",
    bodyLarge: "1rem",
    bodyStrong: "1rem",
    title: "1.25rem",
    headline: "1.75rem"
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    compact: 1.2,
    normal: 1.4,
    relaxed: 1.6
  }
} as const;

export const oneuiSpacingScale = {
  xxs: "0.125rem",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  xxl: "2rem"
} as const;

export const oneuiRadiusScale = {
  none: "0",
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.5rem",
  full: "9999px"
} as const;

export const oneuiBorderScale = {
  thin: "1px",
  thick: "2px"
} as const;

export const oneuiMotionScale = {
  durationNormal: "200ms",
  durationGentle: "300ms",
  curveEasyEase: "cubic-bezier(0.33, 0, 0.67, 1)",
  curveAccelerateMid: "cubic-bezier(0.7, 0, 1, 0.5)"
} as const;

export const oneuiSizeScale = {
  controlHeightSmall: "2rem",
  controlHeightMedium: "2.75rem",
  controlHeightLarge: "3rem",
  iconSizeSmall: "1rem",
  iconSizeMedium: "1.25rem",
  iconSizeLarge: "1.5rem"
} as const;

export const oneuiFluentTypographyAliases = {
  caption2: {
    fontFamily: oneuiTypographyScale.fontFamily.base,
    fontSize: oneuiTypographyScale.fontSize.caption,
    fontWeight: oneuiTypographyScale.fontWeight.medium,
    lineHeight: oneuiTypographyScale.lineHeight.normal
  },
  body1: {
    fontFamily: oneuiTypographyScale.fontFamily.base,
    fontSize: oneuiTypographyScale.fontSize.bodyLarge,
    fontWeight: oneuiTypographyScale.fontWeight.regular,
    lineHeight: oneuiTypographyScale.lineHeight.relaxed
  },
  body1Strong: {
    fontFamily: oneuiTypographyScale.fontFamily.base,
    fontSize: oneuiTypographyScale.fontSize.bodyStrong,
    fontWeight: oneuiTypographyScale.fontWeight.semibold,
    lineHeight: oneuiTypographyScale.lineHeight.relaxed
  },
  title3: {
    fontFamily: oneuiTypographyScale.fontFamily.brand,
    fontSize: oneuiTypographyScale.fontSize.title,
    fontWeight: oneuiTypographyScale.fontWeight.semibold,
    lineHeight: 1.3
  },
  hero: {
    fontFamily: oneuiTypographyScale.fontFamily.brand,
    fontSize: oneuiTypographyScale.fontSize.headline,
    fontWeight: oneuiTypographyScale.fontWeight.semibold,
    lineHeight: 1.22
  }
} as const;
