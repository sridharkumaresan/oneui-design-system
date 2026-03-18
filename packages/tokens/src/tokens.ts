import { rawPalette } from "./internal/palette.js";

export const tokenCategories = [
  "color",
  "typography",
  "spacing",
  "radius",
  "shadows",
  "components",
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

export const oneuiBreakpoints = {
  xs: "360px",
  sm: "480px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  xxl: "1536px"
};

export const oneuiActionCardContainerBreakpoints = {
  medium: "680px",
  wide: "960px"
} as const;

const actionCardComponentTokensLight = {
  background: rawPalette.neutral[0],
  borderColor: rawPalette.neutral[200],
  borderWidth: "1px",
  radius: "16px",
  shadow: "0 8px 24px -18px rgba(0, 0, 0, 0.28)",
  paddingInline: {
    desktop: "32px",
    tablet: "24px",
    mobile: "16px"
  },
  paddingBlock: {
    desktop: "24px",
    tablet: "20px",
    mobile: "16px"
  },
  gap: {
    contentToStatus: {
      desktop: "32px",
      tablet: "24px"
    },
    statusToDivider: {
      desktop: "24px",
      tablet: "20px"
    },
    dividerToActions: {
      desktop: "24px",
      tablet: "20px"
    },
    stacked: {
      mobile: "16px"
    },
    actionItems: {
      desktop: "12px",
      tablet: "10px"
    },
    eyebrowToTitle: "12px",
    titleToMeta: "12px",
    metaItems: "8px",
    footerDividerMargin: "20px"
  },
  actionsRail: {
    minWidth: {
      desktop: "280px",
      tablet: "240px"
    },
    maxWidth: {
      desktop: "320px"
    }
  },
  divider: {
    color: rawPalette.neutral[200],
    width: "1px"
  },
  button: {
    minHeight: "44px",
    minWidth: "120px"
  },
  status: {
    minHeight: "30px",
    paddingInline: "13px"
  },
  eyebrow: {
    typography: {
      fontSize: typographyScale.fontSize.caption,
      fontWeight: typographyScale.fontWeight.medium,
      lineHeight: typographyScale.lineHeight.normal
    },
    color: rawPalette.neutral[500]
  },
  title: {
    typography: {
      fontSize: typographyScale.fontSize.headline,
      fontWeight: typographyScale.fontWeight.semibold,
      lineHeight: 1.22
    },
    color: rawPalette.neutral[900]
  },
  meta: {
    typography: {
      fontSize: typographyScale.fontSize.bodyLarge,
      fontWeight: typographyScale.fontWeight.regular,
      lineHeight: typographyScale.lineHeight.relaxed
    },
    color: rawPalette.neutral[500]
  },
  footer: {
    typography: {
      fontSize: typographyScale.fontSize.body,
      fontWeight: typographyScale.fontWeight.regular,
      lineHeight: typographyScale.lineHeight.relaxed
    },
    color: rawPalette.neutral[500]
  },
  link: {
    typography: {
      fontSize: typographyScale.fontSize.bodyLarge,
      fontWeight: typographyScale.fontWeight.semibold,
      lineHeight: typographyScale.lineHeight.normal
    },
    color: rawPalette.brand.interactive
  }
};

const actionCardComponentTokensDark = {
  ...actionCardComponentTokensLight,
  background: rawPalette.neutral[900],
  borderColor: rawPalette.neutral[700],
  shadow: "0 10px 28px -18px rgba(0, 0, 0, 0.54)",
  divider: {
    color: rawPalette.neutral[700],
    width: "1px"
  },
  eyebrow: {
    ...actionCardComponentTokensLight.eyebrow,
    color: rawPalette.neutral[300]
  },
  title: {
    ...actionCardComponentTokensLight.title,
    color: rawPalette.neutral[0]
  },
  meta: {
    ...actionCardComponentTokensLight.meta,
    color: rawPalette.neutral[300]
  },
  footer: {
    ...actionCardComponentTokensLight.footer,
    color: rawPalette.neutral[300]
  },
  link: {
    ...actionCardComponentTokensLight.link,
    color: rawPalette.brand.primary
  }
};

const actionSectionComponentTokensLight = {
  header: {
    gap: "12px"
  },
  stack: {
    gap: "20px"
  },
  marginBlock: "24px",
  title: {
    typography: {
      fontSize: typographyScale.fontSize.title,
      fontWeight: typographyScale.fontWeight.semibold,
      lineHeight: 1.3
    },
    color: rawPalette.neutral[900]
  },
  link: {
    typography: {
      fontSize: typographyScale.fontSize.bodyLarge,
      fontWeight: typographyScale.fontWeight.semibold,
      lineHeight: typographyScale.lineHeight.normal
    },
    color: rawPalette.brand.interactive
  }
};

const actionSectionComponentTokensDark = {
  ...actionSectionComponentTokensLight,
  title: {
    ...actionSectionComponentTokensLight.title,
    color: rawPalette.neutral[0]
  },
  link: {
    ...actionSectionComponentTokensLight.link,
    color: rawPalette.brand.primary
  }
};

export const lightThemeTokens = {
  color: {
    background: {
      canvas: rawPalette.status.neutralTintLight,
      surface: rawPalette.neutral[0],
      elevated: rawPalette.neutral[0],
      brand: rawPalette.brand.primary,
      brandStrong: rawPalette.brand.interactive,
      dangerSubtle: rawPalette.status.dangerTint,
      dangerSubtleLight: rawPalette.status.dangerTintLight,
      successSubtle: rawPalette.status.successTint,
      successSubtleLight: rawPalette.status.successTintLight,
      warningSubtle: rawPalette.status.warningTint,
      warningSubtleLight: rawPalette.status.warningTintLight,
      infoSubtle: rawPalette.status.infoTint,
      infoSubtleLight: rawPalette.status.infoTintLight,
      neutralSubtle: rawPalette.status.neutralTint,
      neutralSubtleLight: rawPalette.status.neutralTintLight
    },
    text: {
      primary: rawPalette.neutral[900],
      secondary: rawPalette.neutral[500],
      inverse: rawPalette.neutral[0],
      brand: rawPalette.brand.interactive,
      link: rawPalette.brand.interactive,
      linkHover: rawPalette.brand.interactiveAlt,
      linkPressed: rawPalette.brand.interactivePressed,
      danger: rawPalette.status.danger,
      success: rawPalette.status.success,
      warning: rawPalette.derived.warningText,
      info: rawPalette.status.info,
      onBrand: rawPalette.neutral[0],
      onDanger: rawPalette.derived.dangerOnFill,
      onSuccess: rawPalette.derived.successOnFill,
      onWarning: rawPalette.derived.warningOnFill,
      onInfo: rawPalette.derived.infoOnFill,
      onNeutral: rawPalette.derived.neutralOnFill
    },
    border: {
      subtle: rawPalette.status.neutralTint,
      default: rawPalette.neutral[200],
      strong: rawPalette.neutral[300],
      focus: rawPalette.brand.interactive,
      brand: rawPalette.brand.interactive,
      danger: rawPalette.status.dangerAlt,
      success: rawPalette.status.success,
      warning: rawPalette.derived.warningBorder,
      info: rawPalette.status.info,
      neutral: rawPalette.neutral[200]
    },
    icon: {
      primary: rawPalette.neutral[700],
      secondary: rawPalette.neutral[500],
      brand: rawPalette.brand.interactive,
      inverse: rawPalette.neutral[0],
      danger: rawPalette.status.danger,
      success: rawPalette.status.success,
      warning: rawPalette.derived.warningText,
      info: rawPalette.status.info
    },
    status: {
      success: rawPalette.status.success,
      warning: rawPalette.status.warning,
      danger: rawPalette.status.danger,
      info: rawPalette.status.info,
      neutral: rawPalette.status.neutral
    },
    interaction: {
      primary: {
        background: rawPalette.brand.interactive,
        backgroundHover: rawPalette.brand.interactiveAlt,
        backgroundPressed: rawPalette.brand.interactivePressed,
        foreground: rawPalette.neutral[0]
      },
      secondary: {
        background: rawPalette.neutral[0],
        backgroundHover: rawPalette.status.neutralTintLight,
        backgroundPressed: rawPalette.status.neutralTint,
        foreground: rawPalette.neutral[900],
        border: rawPalette.neutral[200],
        borderHover: rawPalette.neutral[300],
        borderPressed: rawPalette.neutral[300]
      },
      subtle: {
        background: rawPalette.status.infoTintLight,
        backgroundHover: rawPalette.status.infoTint,
        backgroundPressed: rawPalette.status.infoTint,
        foreground: rawPalette.brand.interactive,
        border: "transparent",
        borderHover: "transparent",
        borderPressed: "transparent"
      },
      transparent: {
        background: "transparent",
        backgroundHover: rawPalette.status.infoTintLight,
        backgroundPressed: rawPalette.status.infoTint,
        foreground: rawPalette.brand.interactive,
        border: "transparent",
        borderHover: "transparent",
        borderPressed: "transparent"
      },
      disabled: {
        background: rawPalette.status.neutralTintLight,
        foreground: rawPalette.neutral[400],
        border: rawPalette.status.neutralTint
      }
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
    focusRing: `0 0 0 2px ${rawPalette.brand.interactive}`
  },
  components: {
    actionCard: actionCardComponentTokensLight,
    actionSection: actionSectionComponentTokensLight
  },
  breakpoints: oneuiBreakpoints
};

export const darkThemeTokens = {
  color: {
    background: {
      canvas: rawPalette.neutral[1000],
      surface: rawPalette.neutral[900],
      elevated: rawPalette.neutral[800],
      brand: rawPalette.brand.primary,
      brandStrong: rawPalette.brand.interactive,
      dangerSubtle: rawPalette.derived.darkDangerTint,
      dangerSubtleLight: rawPalette.derived.darkDangerTintLight,
      successSubtle: rawPalette.derived.darkSuccessTint,
      successSubtleLight: rawPalette.derived.darkSuccessTintLight,
      warningSubtle: rawPalette.derived.darkWarningTint,
      warningSubtleLight: rawPalette.derived.darkWarningTintLight,
      infoSubtle: rawPalette.derived.darkInfoTint,
      infoSubtleLight: rawPalette.derived.darkInfoTintLight,
      neutralSubtle: rawPalette.derived.darkNeutralTint,
      neutralSubtleLight: rawPalette.derived.darkNeutralTintLight
    },
    text: {
      primary: rawPalette.neutral[0],
      secondary: rawPalette.neutral[300],
      inverse: rawPalette.neutral[1000],
      brand: rawPalette.brand.primary,
      link: rawPalette.brand.primary,
      linkHover: "#4bc9ff",
      linkPressed: "#7ad8ff",
      danger: rawPalette.derived.darkDangerText,
      success: rawPalette.derived.darkSuccessText,
      warning: rawPalette.derived.darkWarningText,
      info: rawPalette.derived.darkInfoText,
      onBrand: rawPalette.neutral[0],
      onDanger: rawPalette.derived.dangerOnFill,
      onSuccess: rawPalette.derived.successOnFill,
      onWarning: rawPalette.derived.warningOnFill,
      onInfo: rawPalette.derived.infoOnFill,
      onNeutral: rawPalette.derived.neutralOnFill
    },
    border: {
      subtle: rawPalette.neutral[800],
      default: rawPalette.neutral[700],
      strong: rawPalette.neutral[400],
      focus: rawPalette.brand.primary,
      brand: rawPalette.brand.primary,
      danger: rawPalette.derived.darkDangerText,
      success: rawPalette.derived.darkSuccessText,
      warning: rawPalette.derived.darkWarningText,
      info: rawPalette.derived.darkInfoText,
      neutral: rawPalette.neutral[700]
    },
    icon: {
      primary: rawPalette.neutral[100],
      secondary: rawPalette.neutral[300],
      brand: rawPalette.brand.primary,
      inverse: rawPalette.neutral[900],
      danger: rawPalette.derived.darkDangerText,
      success: rawPalette.derived.darkSuccessText,
      warning: rawPalette.derived.darkWarningText,
      info: rawPalette.derived.darkInfoText
    },
    status: {
      success: rawPalette.status.success,
      warning: rawPalette.status.warning,
      danger: rawPalette.status.danger,
      info: rawPalette.status.info,
      neutral: rawPalette.status.neutral
    },
    interaction: {
      primary: {
        background: rawPalette.brand.interactive,
        backgroundHover: rawPalette.brand.interactiveAlt,
        backgroundPressed: rawPalette.brand.interactivePressed,
        foreground: rawPalette.neutral[0]
      },
      secondary: {
        background: rawPalette.neutral[900],
        backgroundHover: rawPalette.neutral[800],
        backgroundPressed: rawPalette.neutral[700],
        foreground: rawPalette.neutral[0],
        border: rawPalette.neutral[700],
        borderHover: rawPalette.neutral[400],
        borderPressed: rawPalette.neutral[400]
      },
      subtle: {
        background: rawPalette.derived.darkInfoTint,
        backgroundHover: rawPalette.derived.darkInfoTintLight,
        backgroundPressed: rawPalette.derived.darkInfoTintLight,
        foreground: rawPalette.brand.primary,
        border: "transparent",
        borderHover: "transparent",
        borderPressed: "transparent"
      },
      transparent: {
        background: "transparent",
        backgroundHover: rawPalette.derived.darkInfoTint,
        backgroundPressed: rawPalette.derived.darkInfoTintLight,
        foreground: rawPalette.brand.primary,
        border: "transparent",
        borderHover: "transparent",
        borderPressed: "transparent"
      },
      disabled: {
        background: rawPalette.neutral[800],
        foreground: rawPalette.neutral[400],
        border: rawPalette.neutral[700]
      }
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
    focusRing: `0 0 0 2px ${rawPalette.brand.primary}`
  },
  components: {
    actionCard: actionCardComponentTokensDark,
    actionSection: actionSectionComponentTokensDark
  },
  breakpoints: oneuiBreakpoints
};

export const semanticTokens = {
  light: lightThemeTokens,
  dark: darkThemeTokens
};

export type OneUIBreakpointName = keyof typeof oneuiBreakpoints;
