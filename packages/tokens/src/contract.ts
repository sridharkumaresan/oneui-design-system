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
    actionCard: {
      background: "",
      borderColor: "",
      borderWidth: "",
      radius: "",
      shadow: "",
      paddingInline: {
        desktop: "",
        tablet: "",
        mobile: ""
      },
      paddingBlock: {
        desktop: "",
        tablet: "",
        mobile: ""
      },
      gap: {
        contentToStatus: {
          desktop: "",
          tablet: ""
        },
        statusToDivider: {
          desktop: "",
          tablet: ""
        },
        dividerToActions: {
          desktop: "",
          tablet: ""
        },
        stacked: {
          mobile: ""
        },
        actionItems: {
          desktop: "",
          tablet: ""
        },
        eyebrowToTitle: "",
        titleToMeta: "",
        metaItems: "",
        footerDividerMargin: ""
      },
      actionsRail: {
        minWidth: {
          desktop: "",
          tablet: ""
        },
        maxWidth: {
          desktop: ""
        }
      },
      divider: {
        color: "",
        width: ""
      },
      button: {
        minHeight: "",
        minWidth: ""
      },
      status: {
        minHeight: "",
        paddingInline: ""
      },
      eyebrow: {
        typography: {
          fontSize: "",
          fontWeight: 0,
          lineHeight: 0
        },
        color: ""
      },
      title: {
        typography: {
          fontSize: "",
          fontWeight: 0,
          lineHeight: 0
        },
        color: ""
      },
      meta: {
        typography: {
          fontSize: "",
          fontWeight: 0,
          lineHeight: 0
        },
        color: ""
      },
      footer: {
        typography: {
          fontSize: "",
          fontWeight: 0,
          lineHeight: 0
        },
        color: ""
      },
      link: {
        typography: {
          fontSize: "",
          fontWeight: 0,
          lineHeight: 0
        },
        color: ""
      }
    },
    actionSection: {
      header: {
        gap: ""
      },
      stack: {
        gap: ""
      },
      marginBlock: "",
      title: {
        typography: {
          fontSize: "",
          fontWeight: 0,
          lineHeight: 0
        },
        color: ""
      },
      link: {
        typography: {
          fontSize: "",
          fontWeight: 0,
          lineHeight: 0
        },
        color: ""
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
  components: [
    "actionCard.background",
    "actionCard.borderColor",
    "actionCard.borderWidth",
    "actionCard.radius",
    "actionCard.shadow",
    "actionCard.paddingInline.desktop",
    "actionCard.paddingInline.tablet",
    "actionCard.paddingInline.mobile",
    "actionCard.paddingBlock.desktop",
    "actionCard.paddingBlock.tablet",
    "actionCard.paddingBlock.mobile",
    "actionCard.gap.contentToStatus.desktop",
    "actionCard.gap.contentToStatus.tablet",
    "actionCard.gap.statusToDivider.desktop",
    "actionCard.gap.statusToDivider.tablet",
    "actionCard.gap.dividerToActions.desktop",
    "actionCard.gap.dividerToActions.tablet",
    "actionCard.gap.stacked.mobile",
    "actionCard.gap.actionItems.desktop",
    "actionCard.gap.actionItems.tablet",
    "actionCard.gap.eyebrowToTitle",
    "actionCard.gap.titleToMeta",
    "actionCard.gap.metaItems",
    "actionCard.gap.footerDividerMargin",
    "actionCard.actionsRail.minWidth.desktop",
    "actionCard.actionsRail.minWidth.tablet",
    "actionCard.actionsRail.maxWidth.desktop",
    "actionCard.divider.color",
    "actionCard.divider.width",
    "actionCard.button.minHeight",
    "actionCard.button.minWidth",
    "actionCard.status.minHeight",
    "actionCard.status.paddingInline",
    "actionCard.eyebrow.typography.fontSize",
    "actionCard.eyebrow.typography.fontWeight",
    "actionCard.eyebrow.typography.lineHeight",
    "actionCard.eyebrow.color",
    "actionCard.title.typography.fontSize",
    "actionCard.title.typography.fontWeight",
    "actionCard.title.typography.lineHeight",
    "actionCard.title.color",
    "actionCard.meta.typography.fontSize",
    "actionCard.meta.typography.fontWeight",
    "actionCard.meta.typography.lineHeight",
    "actionCard.meta.color",
    "actionCard.footer.typography.fontSize",
    "actionCard.footer.typography.fontWeight",
    "actionCard.footer.typography.lineHeight",
    "actionCard.footer.color",
    "actionCard.link.typography.fontSize",
    "actionCard.link.typography.fontWeight",
    "actionCard.link.typography.lineHeight",
    "actionCard.link.color",
    "actionSection.header.gap",
    "actionSection.stack.gap",
    "actionSection.marginBlock",
    "actionSection.title.typography.fontSize",
    "actionSection.title.typography.fontWeight",
    "actionSection.title.typography.lineHeight",
    "actionSection.title.color",
    "actionSection.link.typography.fontSize",
    "actionSection.link.typography.fontWeight",
    "actionSection.link.typography.lineHeight",
    "actionSection.link.color"
  ],
  breakpoints: ["xs", "sm", "md", "lg", "xl", "xxl"]
};
