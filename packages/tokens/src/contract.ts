export const semanticTokenContract = {
  color: {
    background: {
      canvas: "",
      surface: "",
      elevated: "",
      brand: "",
      dangerSubtle: "",
      successSubtle: ""
    },
    text: {
      primary: "",
      secondary: "",
      inverse: "",
      brand: "",
      danger: "",
      success: ""
    },
    border: {
      subtle: "",
      default: "",
      strong: "",
      focus: "",
      brand: "",
      danger: ""
    },
    icon: {
      primary: "",
      secondary: "",
      brand: "",
      inverse: ""
    },
    status: {
      success: "",
      warning: "",
      danger: "",
      info: ""
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
    "background.dangerSubtle",
    "background.successSubtle",
    "text.primary",
    "text.secondary",
    "text.inverse",
    "text.brand",
    "text.danger",
    "text.success",
    "border.subtle",
    "border.default",
    "border.strong",
    "border.focus",
    "border.brand",
    "border.danger",
    "icon.primary",
    "icon.secondary",
    "icon.brand",
    "icon.inverse",
    "status.success",
    "status.warning",
    "status.danger",
    "status.info"
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
  breakpoints: ["xs", "sm", "md", "lg", "xl", "xxl"]
};
