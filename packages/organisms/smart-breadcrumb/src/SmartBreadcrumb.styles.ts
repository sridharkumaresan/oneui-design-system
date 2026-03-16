import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    minWidth: 0
  },
  currentItem: {
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold
  },
  overflowButton: {
    color: tokens.colorNeutralForeground2
  },
  overflowMenuItem: {
    maxWidth: "20rem"
  }
});

export const useSmartBreadcrumbClassNames = (className?: string) => {
  const styles = useStyles();

  return {
    currentItem: styles.currentItem,
    overflowButton: styles.overflowButton,
    overflowMenuItem: styles.overflowMenuItem,
    root: mergeClasses(styles.root, className)
  };
};
