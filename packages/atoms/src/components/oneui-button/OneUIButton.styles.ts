import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";

import type { OneUIButtonProps } from "./OneUIButton.types.js";

export const oneUIButtonClassNames = {
  root: "oneui-Button"
} as const;

const useStyles = makeStyles({
  root: {
    ...shorthands.border("1px", "solid", "var(--oneui-button-border)"),
    backgroundColor: "var(--oneui-button-background)",
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: "var(--oneui-button-shadow, none)",
    color: "var(--oneui-button-foreground)",
    fontWeight: tokens.fontWeightSemibold,
    minWidth: "fit-content",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "background-color, border-color, color, box-shadow",
    transitionTimingFunction: tokens.curveEasyEase,
    ":hover": {
      ...shorthands.borderColor("var(--oneui-button-border-hover)"),
      backgroundColor: "var(--oneui-button-background-hover)",
      boxShadow: "var(--oneui-button-shadow-hover, var(--oneui-button-shadow, none))",
      color: "var(--oneui-button-foreground)"
    },
    ":active": {
      ...shorthands.borderColor("var(--oneui-button-border-pressed)"),
      backgroundColor: "var(--oneui-button-background-pressed)",
      boxShadow: "var(--oneui-button-shadow-pressed, var(--oneui-button-shadow, none))",
      color: "var(--oneui-button-foreground)"
    },
    ":disabled": {
      ...shorthands.borderColor("var(--oneui-button-border)"),
      backgroundColor: "var(--oneui-button-background)",
      boxShadow: "var(--oneui-button-shadow, none)",
      color: "var(--oneui-button-foreground)"
    }
  },
  sizeSmall: {
    minHeight: "2rem"
  },
  sizeMedium: {
    minHeight: "2.75rem"
  },
  sizeLarge: {
    minHeight: "3rem"
  },
  stretch: {
    width: "100%"
  }
});

const sizeClassMap: Record<
  NonNullable<OneUIButtonProps["size"]>,
  keyof ReturnType<typeof useStyles>
> = {
  large: "sizeLarge",
  medium: "sizeMedium",
  small: "sizeSmall"
};

export const useOneUIButtonClassName = (options: {
  appearance: OneUIButtonProps["appearance"];
  className?: string;
  disabled: boolean;
  size: NonNullable<OneUIButtonProps["size"]>;
  stretch: boolean;
}): string => {
  const styles = useStyles();

  return mergeClasses(
    oneUIButtonClassNames.root,
    styles.root,
    styles[sizeClassMap[options.size]],
    options.stretch ? styles.stretch : undefined,
    options.className
  );
};
