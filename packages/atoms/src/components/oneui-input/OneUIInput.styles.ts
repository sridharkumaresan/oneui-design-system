import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

export const oneUIInputClassNames = {
  root: "oneui-Input"
} as const;

const useStyles = makeStyles({
  root: {
    borderRadius: tokens.borderRadiusMedium,
    minWidth: 0
  },
  underline: {
    borderRadius: tokens.borderRadiusNone
  },
  stretch: {
    width: "100%"
  }
});

export const useOneUIInputClassName = (
  options: {
    appearance?: string;
    stretch: boolean;
  },
  className?: string
): string => {
  const styles = useStyles();

  return mergeClasses(
    oneUIInputClassNames.root,
    styles.root,
    options.appearance === "underline" ? styles.underline : undefined,
    options.stretch ? styles.stretch : undefined,
    className
  );
};
