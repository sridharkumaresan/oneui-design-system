import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

export const oneUIComboboxClassNames = {
  root: "oneui-Combobox"
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

export const useOneUIComboboxClassName = (stretch: boolean, className?: string): string => {
  const styles = useStyles();

  return mergeClasses(
    oneUIComboboxClassNames.root,
    styles.root,
    stretch ? styles.stretch : undefined,
    className
  );
};
