import { makeStyles, mergeClasses, shorthands } from "@fluentui/react-components";

const actionSectionContainerBreakpoints = {
  medium: "680px"
} as const;

const mediumUpQuery = `@container oneui-action-section (min-width: ${actionSectionContainerBreakpoints.medium})`;

const useStyles = makeStyles({
  root: {
    containerName: "oneui-action-section",
    containerType: "inline-size",
    display: "grid",
    gap: "var(--oneui-action-section-stack-gap)",
    marginBlock: "var(--oneui-action-section-margin-block)",
    width: "100%"
  },
  header: {
    alignItems: "start",
    display: "grid",
    gap: "var(--oneui-action-section-header-gap)",
    width: "100%",
    [mediumUpQuery]: {
      alignItems: "center",
      gridTemplateColumns: "minmax(0, 1fr) auto"
    }
  },
  titleCluster: {
    alignItems: "baseline",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    minWidth: 0
  },
  title: {
    color: "var(--oneui-action-section-title-color)",
    fontSize: "var(--oneui-action-section-title-font-size)",
    fontWeight: "var(--oneui-action-section-title-font-weight)",
    lineHeight: "var(--oneui-action-section-title-line-height)",
    marginBlock: 0,
    minWidth: 0
  },
  count: {
    color: "var(--oneui-action-section-title-color)",
    fontSize: "var(--oneui-action-section-title-font-size)",
    fontWeight: "var(--oneui-action-section-title-font-weight)",
    lineHeight: "var(--oneui-action-section-title-line-height)",
    opacity: 0.78
  },
  headerAction: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-start",
    minWidth: 0,
    "& [data-oneui-link]": {
      color: "var(--oneui-action-section-link-color)",
      fontSize: "var(--oneui-action-section-link-font-size)",
      fontWeight: "var(--oneui-action-section-link-font-weight)",
      lineHeight: "var(--oneui-action-section-link-line-height)"
    },
    [mediumUpQuery]: {
      justifyContent: "flex-end"
    }
  },
  stack: {
    display: "grid",
    gap: "var(--oneui-action-section-stack-gap)",
    minWidth: 0,
    width: "100%"
  }
});

export const useActionSectionClassNames = (options: { className?: string }) => {
  const styles = useStyles();

  return {
    count: styles.count,
    header: styles.header,
    headerAction: styles.headerAction,
    root: mergeClasses(styles.root, options.className),
    stack: styles.stack,
    title: styles.title,
    titleCluster: styles.titleCluster
  };
};
