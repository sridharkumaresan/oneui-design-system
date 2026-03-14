import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

export const oneUIButtonClassNames = {
  root: "oneui-Button"
} as const;

const useStyles = makeStyles({
  root: {
    borderRadius: tokens.borderRadiusMedium,
    fontWeight: tokens.fontWeightSemibold,
    minWidth: "fit-content"
  },
  stretch: {
    width: "100%"
  }
});

export const useOneUIButtonClassName = (stretch: boolean, className?: string): string => {
  const styles = useStyles();

  return mergeClasses(
    oneUIButtonClassNames.root,
    styles.root,
    stretch ? styles.stretch : undefined,
    className
  );
};
