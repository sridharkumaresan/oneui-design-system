export const semanticTokenContract = {
  color: {
    background: {
      canvas: "",
      surface: "",
      elevated: "",
      brand: "",
      brandStrong: "",
      dangerSubtle: "",
      dangerSubtleLight: "",
      successSubtle: "",
      successSubtleLight: "",
      warningSubtle: "",
      warningSubtleLight: "",
      infoSubtle: "",
      infoSubtleLight: "",
      neutralSubtle: "",
      neutralSubtleLight: ""
    },
    text: {
      primary: "",
      secondary: "",
      inverse: "",
      brand: "",
      link: "",
      linkHover: "",
      linkPressed: "",
      danger: "",
      success: "",
      warning: "",
      info: "",
      onBrand: "",
      onDanger: "",
      onSuccess: "",
      onWarning: "",
      onInfo: "",
      onNeutral: ""
    },
    border: {
      subtle: "",
      default: "",
      strong: "",
      focus: "",
      brand: "",
      danger: "",
      success: "",
      warning: "",
      info: "",
      neutral: ""
    },
    icon: {
      primary: "",
      secondary: "",
      brand: "",
      inverse: "",
      danger: "",
      success: "",
      warning: "",
      info: ""
    },
    status: {
      success: "",
      warning: "",
      danger: "",
      info: "",
      neutral: ""
    },
    interaction: {
      primary: {
        background: "",
        backgroundHover: "",
        backgroundPressed: "",
        foreground: ""
      },
      secondary: {
        background: "",
        backgroundHover: "",
        backgroundPressed: "",
        foreground: "",
        border: "",
        borderHover: "",
        borderPressed: ""
      },
      subtle: {
        background: "",
        backgroundHover: "",
        backgroundPressed: "",
        foreground: "",
        border: "",
        borderHover: "",
        borderPressed: ""
      },
      transparent: {
        background: "",
        backgroundHover: "",
        backgroundPressed: "",
        foreground: "",
        border: "",
        borderHover: "",
        borderPressed: ""
      },
      disabled: {
        background: "",
        foreground: "",
        border: ""
      }
    }
  },
  typography: {
    fontFamily: {
      base: "",
      monospace: ""
    },
    fontSize: {
      caption: "",
      body: "",
      bodyLarge: "",
      title: "",
      headline: ""
    },
    fontWeight: {
      regular: 0,
      medium: 0,
      semibold: 0,
      bold: 0
    },
    lineHeight: {
      compact: 0,
      normal: 0,
      relaxed: 0
    }
  },
  spacing: {
    xxs: "",
    xs: "",
    sm: "",
    md: "",
    lg: "",
    xl: "",
    xxl: ""
  },
  radius: {
    none: "",
    sm: "",
    md: "",
    lg: "",
    full: ""
  },
  shadows: {
    sm: "",
    md: "",
    lg: "",
    xl: "",
    focusRing: ""
  },
  components: {
    button: {
      typography: {
        fontWeight: 0
      }
    }
  },
  breakpoints: {
    xs: "",
    sm: "",
    md: "",
    lg: "",
    xl: "",
    xxl: ""
  }
};

export const requiredSemanticTokenPaths = {
  color: [
    "background.canvas",
    "background.surface",
    "background.elevated",
    "background.brand",
    "background.brandStrong",
    "background.dangerSubtle",
    "background.dangerSubtleLight",
    "background.successSubtle",
    "background.successSubtleLight",
    "background.warningSubtle",
    "background.warningSubtleLight",
    "background.infoSubtle",
    "background.infoSubtleLight",
    "background.neutralSubtle",
    "background.neutralSubtleLight",
    "text.primary",
    "text.secondary",
    "text.inverse",
    "text.brand",
    "text.link",
    "text.linkHover",
    "text.linkPressed",
    "text.danger",
    "text.success",
    "text.warning",
    "text.info",
    "text.onBrand",
    "text.onDanger",
    "text.onSuccess",
    "text.onWarning",
    "text.onInfo",
    "text.onNeutral",
    "border.subtle",
    "border.default",
    "border.strong",
    "border.focus",
    "border.brand",
    "border.danger",
    "border.success",
    "border.warning",
    "border.info",
    "border.neutral",
    "icon.primary",
    "icon.secondary",
    "icon.brand",
    "icon.inverse",
    "icon.danger",
    "icon.success",
    "icon.warning",
    "icon.info",
    "status.success",
    "status.warning",
    "status.danger",
    "status.info",
    "status.neutral",
    "interaction.primary.background",
    "interaction.primary.backgroundHover",
    "interaction.primary.backgroundPressed",
    "interaction.primary.foreground",
    "interaction.secondary.background",
    "interaction.secondary.backgroundHover",
    "interaction.secondary.backgroundPressed",
    "interaction.secondary.foreground",
    "interaction.secondary.border",
    "interaction.secondary.borderHover",
    "interaction.secondary.borderPressed",
    "interaction.subtle.background",
    "interaction.subtle.backgroundHover",
    "interaction.subtle.backgroundPressed",
    "interaction.subtle.foreground",
    "interaction.subtle.border",
    "interaction.subtle.borderHover",
    "interaction.subtle.borderPressed",
    "interaction.transparent.background",
    "interaction.transparent.backgroundHover",
    "interaction.transparent.backgroundPressed",
    "interaction.transparent.foreground",
    "interaction.transparent.border",
    "interaction.transparent.borderHover",
    "interaction.transparent.borderPressed",
    "interaction.disabled.background",
    "interaction.disabled.foreground",
    "interaction.disabled.border"
  ],
  typography: [
    "fontFamily.base",
    "fontFamily.monospace",
    "fontSize.caption",
    "fontSize.body",
    "fontSize.bodyLarge",
    "fontSize.title",
    "fontSize.headline",
    "fontWeight.regular",
    "fontWeight.medium",
    "fontWeight.semibold",
    "fontWeight.bold",
    "lineHeight.compact",
    "lineHeight.normal",
    "lineHeight.relaxed"
  ],
  spacing: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"],
  radius: ["none", "sm", "md", "lg", "full"],
  shadows: ["sm", "md", "lg", "xl", "focusRing"],
  components: ["button.typography.fontWeight"],
  breakpoints: ["xs", "sm", "md", "lg", "xl", "xxl"]
};
