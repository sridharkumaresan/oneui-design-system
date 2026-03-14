import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

import type { ActionPanelLayout } from "./ActionPanel.types.js";

const useStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    minWidth: 0,
    width: "100%"
  },
  content: {
    alignItems: "flex-start",
    display: "flex",
    gap: tokens.spacingHorizontalL,
    minWidth: 0,
    width: "100%"
  },
  layoutInline: {
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  layoutStacked: {
    flexDirection: "column"
  },
  textBlock: {
    flex: "1 1 20rem",
    minWidth: 0
  },
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    minWidth: 0
  },
  actionsInline: {
    alignItems: "center",
    flex: "0 1 auto",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end"
  },
  actionsStacked: {
    alignSelf: "stretch",
    flexDirection: "column",
    width: "100%"
  }
});

const layoutClassMap: Record<ActionPanelLayout, keyof ReturnType<typeof useStyles>> = {
  inline: "layoutInline",
  stacked: "layoutStacked"
};

const actionLayoutClassMap: Record<ActionPanelLayout, keyof ReturnType<typeof useStyles>> = {
  inline: "actionsInline",
  stacked: "actionsStacked"
};

export const useActionPanelClassNames = (layout: ActionPanelLayout, className?: string) => {
  const styles = useStyles();

  return {
    root: mergeClasses(styles.root, className),
    content: mergeClasses(styles.content, styles[layoutClassMap[layout]]),
    textBlock: styles.textBlock,
    actions: mergeClasses(styles.actions, styles[actionLayoutClassMap[layout]])
  };
};
