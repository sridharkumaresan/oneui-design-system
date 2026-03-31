import { makeStyles, mergeClasses, shorthands } from "@fluentui/react-components";

import type { ActionCardDensity, ActionCardLayout } from "./ActionCard.types.js";

const actionCardContainerBreakpoints = {
  medium: "680px",
  wide: "960px"
} as const;

const mediumUpQuery = `@container oneui-action-card (min-width: ${actionCardContainerBreakpoints.medium})`;
const wideUpQuery = `@container oneui-action-card (min-width: ${actionCardContainerBreakpoints.wide})`;

const useStyles = makeStyles({
  root: {
    ...shorthands.border(
      "var(--oneui-action-card-border-width)",
      "solid",
      "var(--oneui-action-card-border-color)"
    ),
    ...shorthands.padding(
      "var(--oneui-action-card-padding-block-mobile)",
      "var(--oneui-action-card-padding-inline-mobile)"
    ),
    backgroundColor: "var(--oneui-action-card-background)",
    borderRadius: "var(--oneui-action-card-radius)",
    boxShadow: "var(--oneui-action-card-shadow)",
    boxSizing: "border-box",
    containerName: "oneui-action-card",
    containerType: "inline-size",
    minWidth: 0,
    width: "100%",
    [mediumUpQuery]: {
      paddingBlock: "var(--oneui-action-card-padding-block-tablet)",
      paddingInline: "var(--oneui-action-card-padding-inline-tablet)"
    },
    [wideUpQuery]: {
      paddingBlock: "var(--oneui-action-card-padding-block-desktop)",
      paddingInline: "var(--oneui-action-card-padding-inline-desktop)"
    }
  },
  disabled: {
    opacity: 0.68
  },
  mainGrid: {
    alignItems: "start",
    display: "grid",
    gridTemplateColumns: "var(--oneui-action-card-grid-columns-stacked)",
    minWidth: 0,
    rowGap: "var(--oneui-action-card-main-gap-mobile)",
    width: "100%"
  },
  mainGridAuto: {
    [mediumUpQuery]: {
      columnGap: "var(--oneui-action-card-status-divider-gap-tablet)",
      gridTemplateColumns: "var(--oneui-action-card-grid-columns-medium)",
      rowGap: 0
    },
    [wideUpQuery]: {
      columnGap: "var(--oneui-action-card-status-divider-gap-desktop)",
      gridTemplateColumns: "var(--oneui-action-card-grid-columns-wide)"
    }
  },
  mainGridHorizontal: {
    columnGap: "var(--oneui-action-card-status-divider-gap-desktop)",
    gridTemplateColumns: "var(--oneui-action-card-grid-columns-wide)",
    rowGap: 0
  },
  mainGridStacked: {
    gridTemplateColumns: "var(--oneui-action-card-grid-columns-stacked)",
    rowGap: "var(--oneui-action-card-main-gap-mobile)"
  },
  contentRegion: {
    display: "grid",
    gap: "var(--oneui-action-card-top-gap)",
    minWidth: 0
  },
  contentRegionWithStatus: {
    [mediumUpQuery]: {
      paddingInlineEnd: "var(--oneui-action-card-content-status-padding-end-tablet)"
    },
    [wideUpQuery]: {
      paddingInlineEnd: "var(--oneui-action-card-content-status-padding-end-desktop)"
    }
  },
  contentRegionWithStatusHorizontal: {
    paddingInlineEnd: "var(--oneui-action-card-content-status-padding-end-desktop)"
  },
  eyebrow: {
    color: "var(--oneui-action-card-eyebrow-color)",
    fontSize: "var(--oneui-action-card-eyebrow-font-size)",
    fontWeight: "var(--oneui-action-card-eyebrow-font-weight)",
    letterSpacing: "0.02em",
    lineHeight: "var(--oneui-action-card-eyebrow-line-height)",
    minWidth: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "var(--oneui-action-card-title-color)",
    fontSize: "var(--oneui-action-card-title-font-size)",
    fontWeight: "var(--oneui-action-card-title-font-weight)",
    lineHeight: "var(--oneui-action-card-title-line-height)",
    marginBlock: 0,
    minWidth: 0,
    textWrap: "balance"
  },
  meta: {
    color: "var(--oneui-action-card-meta-color)",
    display: "grid",
    fontSize: "var(--oneui-action-card-meta-font-size)",
    fontWeight: "var(--oneui-action-card-meta-font-weight)",
    gap: "var(--oneui-action-card-meta-gap)",
    lineHeight: "var(--oneui-action-card-meta-line-height)",
    minWidth: 0
  },
  statusRegion: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    minHeight: "var(--oneui-action-card-status-min-height)",
    minWidth: 0,
    "& [data-oneui-badge]": {
      minHeight: "var(--oneui-action-card-status-min-height)",
      paddingInline: "var(--oneui-action-card-status-padding-inline)"
    }
  },
  statusRegionAuto: {
    [mediumUpQuery]: {
      alignSelf: "center",
      justifySelf: "end"
    }
  },
  statusRegionHorizontal: {
    alignSelf: "center",
    justifySelf: "end"
  },
  dividerRegion: {
    alignSelf: "stretch",
    backgroundColor: "var(--oneui-action-card-divider-color)",
    height: "var(--oneui-action-card-divider-width)",
    width: "100%"
  },
  dividerRegionAuto: {
    [mediumUpQuery]: {
      height: "auto",
      minHeight: "100%",
      width: "var(--oneui-action-card-divider-width)"
    }
  },
  dividerRegionHorizontal: {
    height: "auto",
    minHeight: "100%",
    width: "var(--oneui-action-card-divider-width)"
  },
  actionsRegion: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--oneui-action-card-action-gap)",
    minWidth: 0,
    width: "100%",
    "& [data-oneui-button]": {
      minHeight: "var(--oneui-action-card-button-min-height)",
      minWidth: "var(--oneui-action-card-button-min-width)"
    },
    "& [data-oneui-link]": {
      color: "var(--oneui-action-card-link-color)",
      fontSize: "var(--oneui-action-card-link-font-size)",
      fontWeight: "var(--oneui-action-card-link-font-weight)",
      lineHeight: "var(--oneui-action-card-link-line-height)",
      minHeight: "var(--oneui-action-card-button-min-height)"
    },
  },
  actionsRegionAuto: {
    [mediumUpQuery]: {
      alignSelf: "center"
    }
  },
  actionsRegionHorizontal: {
    alignSelf: "center"
  },
  footerRegion: {
    ...shorthands.borderTop(
      "var(--oneui-action-card-divider-width)",
      "solid",
      "var(--oneui-action-card-divider-color)"
    ),
    color: "var(--oneui-action-card-footer-color)",
    fontSize: "var(--oneui-action-card-footer-font-size)",
    fontWeight: "var(--oneui-action-card-footer-font-weight)",
    lineHeight: "var(--oneui-action-card-footer-line-height)",
    marginTop: "var(--oneui-action-card-footer-divider-margin)",
    minWidth: 0,
    paddingTop: "var(--oneui-action-card-footer-divider-margin)"
  }
});

const mainGridLayoutClassMap: Record<ActionCardLayout, keyof ReturnType<typeof useStyles>> = {
  auto: "mainGridAuto",
  horizontal: "mainGridHorizontal",
  stacked: "mainGridStacked"
};

export const useActionCardClassNames = (options: {
  className?: string;
  density: ActionCardDensity;
  hasActions: boolean;
  hasFooter: boolean;
  hasStatus: boolean;
  isDisabled: boolean;
  layout: ActionCardLayout;
}) => {
  const styles = useStyles();
  const horizontal = options.layout === "horizontal";

  return {
    actionsRegion: mergeClasses(
      styles.actionsRegion,
      options.layout === "auto" ? styles.actionsRegionAuto : undefined,
      horizontal ? styles.actionsRegionHorizontal : undefined
    ),
    contentRegion: mergeClasses(
      styles.contentRegion,
      options.hasStatus && options.layout === "auto" ? styles.contentRegionWithStatus : undefined,
      options.hasStatus && horizontal ? styles.contentRegionWithStatusHorizontal : undefined
    ),
    dividerRegion: mergeClasses(
      styles.dividerRegion,
      options.layout === "auto" ? styles.dividerRegionAuto : undefined,
      horizontal ? styles.dividerRegionHorizontal : undefined
    ),
    eyebrow: styles.eyebrow,
    footerRegion: options.hasFooter ? styles.footerRegion : undefined,
    mainGrid: mergeClasses(styles.mainGrid, styles[mainGridLayoutClassMap[options.layout]]),
    meta: styles.meta,
    root: mergeClasses(
      styles.root,
      options.isDisabled ? styles.disabled : undefined,
      options.className
    ),
    statusRegion: mergeClasses(
      styles.statusRegion,
      options.layout === "auto" ? styles.statusRegionAuto : undefined,
      horizontal ? styles.statusRegionHorizontal : undefined
    ),
    title: styles.title
  };
};
