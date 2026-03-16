import type { FormEventHandler, HTMLAttributes, ReactNode } from "react";

import type { OneUIComboboxOption } from "@functions-oneui/atoms";

export type SearchAutocompleteSuggestion = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  value: string;
};

export type SearchAutocompleteSubmitDetails = {
  query: string;
  scope?: string;
};

export type SearchAutocompleteProps = HTMLAttributes<HTMLElement> & {
  defaultQuery?: string;
  defaultScope?: string;
  emptyStateText?: ReactNode;
  formAriaLabel?: string;
  hideSuggestionsUntilQuery?: boolean;
  inputAriaLabel?: string;
  onQueryChange?: (value: string) => void;
  onScopeChange?: (value: string | undefined) => void;
  onSubmit?: (details: SearchAutocompleteSubmitDetails) => void;
  onSubmitCapture?: FormEventHandler<HTMLFormElement>;
  onSuggestionSelect?: (suggestion: SearchAutocompleteSuggestion) => void;
  placeholder?: string;
  query?: string;
  scopeAriaLabel?: string;
  scopeOptions?: OneUIComboboxOption[];
  scopePlaceholder?: string;
  scopeValue?: string;
  submitLabel?: string;
  suggestions?: SearchAutocompleteSuggestion[];
};
