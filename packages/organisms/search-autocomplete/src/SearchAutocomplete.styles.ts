import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { createOneUIMediaQueryDown } from "@functions-oneui/theme";

const compactSearchFormQuery = createOneUIMediaQueryDown("md");

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  form: {
    alignItems: "stretch",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
    display: "grid",
    gap: tokens.spacingHorizontalS,
    gridTemplateColumns: "minmax(8rem, 12rem) minmax(0, 1fr) auto",
    padding: tokens.spacingHorizontalS,
    width: "100%"
  },
  formWithoutScope: {
    gridTemplateColumns: "minmax(0, 1fr) auto"
  },
  scope: {
    minWidth: 0
  },
  queryField: {
    minWidth: 0
  },
  submitButton: {
    alignSelf: "stretch",
    minWidth: "8rem"
  },
  suggestions: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    display: "grid",
    gap: tokens.spacingVerticalXS,
    listStyleType: "none",
    marginTop: tokens.spacingVerticalS,
    marginBlock: 0,
    marginInline: 0,
    maxWidth: "48rem",
    padding: tokens.spacingHorizontalS,
    paddingInlineStart: 0,
    width: "100%"
  },
  suggestionItem: {
    width: "100%"
  },
  suggestionButton: {
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("0"),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    cursor: "pointer",
    display: "grid",
    gap: tokens.spacingVerticalXXS,
    textAlign: "left",
    width: "100%",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover
    },
    ":focus-visible": {
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: "2px",
      outlineStyle: "solid",
      outlineWidth: "2px"
    }
  },
  suggestionMeta: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  emptyState: {
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalS
  },
  visuallyHidden: {
    ...shorthands.border("0"),
    clipPath: "inset(50%)",
    height: "1px",
    margin: "-1px",
    overflowX: "hidden",
    overflowY: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px"
  },
  compactForm: {
    [compactSearchFormQuery]: {
      gridTemplateColumns: "1fr"
    }
  }
});

export const useSearchAutocompleteClassNames = (options: {
  className?: string;
  hasScope: boolean;
}) => {
  const styles = useStyles();

  return {
    emptyState: styles.emptyState,
    form: mergeClasses(
      styles.form,
      styles.compactForm,
      !options.hasScope ? styles.formWithoutScope : undefined
    ),
    queryField: styles.queryField,
    root: mergeClasses(styles.root, options.className),
    scope: styles.scope,
    submitButton: styles.submitButton,
    suggestionButton: styles.suggestionButton,
    suggestionItem: styles.suggestionItem,
    suggestionMeta: styles.suggestionMeta,
    suggestions: styles.suggestions,
    visuallyHidden: styles.visuallyHidden
  };
};
