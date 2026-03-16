import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

export const oneUIInputClassNames = {
  root: "oneui-Input"
} as const;

const useStyles = makeStyles({
  root: {
    borderRadius: tokens.borderRadiusLarge,
    minWidth: 0
  },
  stretch: {
    width: "100%"
  }
});

export const useOneUIInputClassName = (stretch: boolean, className?: string): string => {
  const styles = useStyles();

  return mergeClasses(
    oneUIInputClassNames.root,
    styles.root,
    stretch ? styles.stretch : undefined,
    className
  );
};
