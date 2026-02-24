import { rawPalette } from "./internal/palette.js";

export const tokenCategories = [
  "color",
  "typography",
  "spacing",
  "radius",
  "shadows",
  "breakpoints"
];

const typographyScale = {
  fontFamily: {
    base: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    monospace: '"Cascadia Mono", "SFMono-Regular", Menlo, monospace'
  },
  fontSize: {
    caption: "0.75rem",
    body: "0.875rem",
    bodyLarge: "1rem",
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
};

const spacingScale = {
  xxs: "0.125rem",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  xxl: "2rem"
};

const radiusScale = {
  none: "0",
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.5rem",
  full: "9999px"
};

const breakpoints = {
  xs: "360px",
  sm: "480px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  xxl: "1536px"
};

export const lightThemeTokens = {
  color: {
    background: {
      canvas: rawPalette.neutral[0],
      surface: rawPalette.neutral[50],
      elevated: rawPalette.neutral[0],
      brand: rawPalette.brand[600],
      dangerSubtle: "#fff2f3",
      successSubtle: "#ecfaf3"
    },
    text: {
      primary: rawPalette.neutral[900],
      secondary: rawPalette.neutral[700],
      inverse: rawPalette.neutral[0],
      brand: rawPalette.brand[700],
      danger: rawPalette.status.danger,
      success: rawPalette.status.success
    },
    border: {
      subtle: rawPalette.neutral[100],
      default: rawPalette.neutral[200],
      strong: rawPalette.neutral[300],
      focus: rawPalette.brand[500],
      brand: rawPalette.brand[500],
      danger: rawPalette.status.danger
    },
    icon: {
      primary: rawPalette.neutral[800],
      secondary: rawPalette.neutral[500],
      brand: rawPalette.brand[600],
      inverse: rawPalette.neutral[0]
    },
    status: {
      success: rawPalette.status.success,
      warning: rawPalette.status.warning,
      danger: rawPalette.status.danger,
      info: rawPalette.status.info
    }
  },
  typography: typographyScale,
  spacing: spacingScale,
  radius: radiusScale,
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.12)",
    md: "0 4px 10px 0 rgba(0, 0, 0, 0.16)",
    lg: "0 8px 18px -2px rgba(0, 0, 0, 0.18)",
    xl: "0 16px 28px -4px rgba(0, 0, 0, 0.22)",
    focusRing: `0 0 0 2px ${rawPalette.brand[500]}`
  },
  breakpoints
};

export const darkThemeTokens = {
  color: {
    background: {
      canvas: rawPalette.neutral[1000],
      surface: rawPalette.neutral[900],
      elevated: rawPalette.neutral[800],
      brand: rawPalette.brand[500],
      dangerSubtle: "#3b1218",
      successSubtle: "#113326"
    },
    text: {
      primary: rawPalette.neutral[50],
      secondary: rawPalette.neutral[300],
      inverse: rawPalette.neutral[1000],
      brand: rawPalette.brand[200],
      danger: "#ff8b97",
      success: "#7ee4b2"
    },
    border: {
      subtle: rawPalette.neutral[800],
      default: rawPalette.neutral[700],
      strong: rawPalette.neutral[500],
      focus: rawPalette.brand[400],
      brand: rawPalette.brand[400],
      danger: "#ff6c7d"
    },
    icon: {
      primary: rawPalette.neutral[100],
      secondary: rawPalette.neutral[300],
      brand: rawPalette.brand[200],
      inverse: rawPalette.neutral[900]
    },
    status: {
      success: "#42c88a",
      warning: "#f0b35e",
      danger: "#ff6c7d",
      info: "#73a5ff"
    }
  },
  typography: typographyScale,
  spacing: spacingScale,
  radius: radiusScale,
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.30)",
    md: "0 4px 10px 0 rgba(0, 0, 0, 0.34)",
    lg: "0 8px 18px -2px rgba(0, 0, 0, 0.38)",
    xl: "0 16px 28px -4px rgba(0, 0, 0, 0.42)",
    focusRing: `0 0 0 2px ${rawPalette.brand[400]}`
  },
  breakpoints
};

export const semanticTokens = {
  light: lightThemeTokens,
  dark: darkThemeTokens
};
