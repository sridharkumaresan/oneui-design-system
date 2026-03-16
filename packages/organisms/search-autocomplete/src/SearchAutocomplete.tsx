import React from "react";
import type { ChangeEvent } from "react";
import type { OptionOnSelectData } from "@fluentui/react-components";

import {
  OneUIButton,
  OneUICombobox,
  OneUIInput,
  OneUIText,
  type OneUIComboboxOption
} from "@functions-oneui/atoms";

import { useSearchAutocompleteClassNames } from "./SearchAutocomplete.styles.js";
import type {
  SearchAutocompleteProps,
  SearchAutocompleteSubmitDetails,
  SearchAutocompleteSuggestion
} from "./SearchAutocomplete.types.js";

const resolveOptionSelection = (
  selectedValue: string | undefined,
  options: OneUIComboboxOption[] | undefined
): string | undefined => {
  if (!selectedValue || !options) {
    return selectedValue;
  }

  return options.some((option) => option.value === selectedValue) ? selectedValue : undefined;
};

export const SearchAutocomplete = (props: SearchAutocompleteProps): React.JSX.Element => {
  const {
    className,
    defaultQuery = "",
    defaultScope,
    emptyStateText = "No suggestions yet. Keep typing or submit your search.",
    formAriaLabel = "Portal search",
    hideSuggestionsUntilQuery = true,
    inputAriaLabel = "Search query",
    onQueryChange,
    onScopeChange,
    onSubmit,
    onSuggestionSelect,
    placeholder = "Search intranet",
    query,
    scopeAriaLabel = "Search scope",
    scopeOptions,
    scopePlaceholder = "All",
    scopeValue,
    submitLabel = "Search",
    suggestions,
    ...restProps
  } = props;
  const [internalQuery, setInternalQuery] = React.useState(defaultQuery);
  const [internalScope, setInternalScope] = React.useState<string | undefined>(defaultScope);
  const resolvedQuery = query ?? internalQuery;
  const resolvedScope = scopeValue ?? internalScope;
  const classNames = useSearchAutocompleteClassNames({
    className,
    hasScope: Boolean(scopeOptions?.length)
  });
  const showSuggestions = Boolean(
    suggestions?.length && (!hideSuggestionsUntilQuery || resolvedQuery.trim().length > 0)
  );

  const updateQuery = React.useCallback(
    (nextValue: string) => {
      if (query === undefined) {
        setInternalQuery(nextValue);
      }
      onQueryChange?.(nextValue);
    },
    [onQueryChange, query]
  );

  const updateScope = React.useCallback(
    (nextValue: string | undefined) => {
      if (scopeValue === undefined) {
        setInternalScope(nextValue);
      }
      onScopeChange?.(nextValue);
    },
    [onScopeChange, scopeValue]
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const details: SearchAutocompleteSubmitDetails = {
        query: resolvedQuery,
        scope: resolvedScope
      };

      onSubmit?.(details);
    },
    [onSubmit, resolvedQuery, resolvedScope]
  );

  const handleSuggestionSelect = React.useCallback(
    (suggestion: SearchAutocompleteSuggestion) => {
      updateQuery(suggestion.value);
      onSuggestionSelect?.(suggestion);
    },
    [onSuggestionSelect, updateQuery]
  );

  return (
    <section {...restProps} className={classNames.root} data-oneui-search-autocomplete="">
      <form aria-label={formAriaLabel} className={classNames.form} onSubmit={handleSubmit} role="search">
        {scopeOptions?.length ? (
          <OneUICombobox
            appearance="filled-lighter"
            aria-label={scopeAriaLabel}
            className={classNames.scope}
            clearable={false}
            onOptionSelect={(_event: React.SyntheticEvent<HTMLElement>, data: OptionOnSelectData) => {
              updateScope(resolveOptionSelection(data.optionValue, scopeOptions));
            }}
            options={scopeOptions}
            placeholder={scopePlaceholder}
            selectedOptions={resolvedScope ? [resolvedScope] : []}
            stretch
            value={
              resolvedScope
                ? scopeOptions.find((option) => option.value === resolvedScope)?.label?.toString() ?? resolvedScope
                : undefined
            }
          />
        ) : null}
        <OneUIInput
          aria-label={inputAriaLabel}
          className={classNames.queryField}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateQuery(event.currentTarget.value);
          }}
          placeholder={placeholder}
          stretch
          value={resolvedQuery}
        />
        <OneUIButton className={classNames.submitButton} type="submit">
          {submitLabel}
        </OneUIButton>
      </form>
      {showSuggestions ? (
        <ul className={classNames.suggestions} data-oneui-search-autocomplete-suggestions="">
          {suggestions?.map((suggestion) => {
            return (
              <li className={classNames.suggestionItem} key={suggestion.id}>
                <button
                  className={classNames.suggestionButton}
                  onClick={() => {
                    handleSuggestionSelect(suggestion);
                  }}
                  type="button"
                >
                  <span>{suggestion.label}</span>
                  {suggestion.description ? (
                    <OneUIText as="span" className={classNames.suggestionMeta} tone="secondary">
                      {suggestion.description}
                    </OneUIText>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : resolvedQuery.trim().length > 0 ? (
        <OneUIText block className={classNames.emptyState} tone="secondary">
          {emptyStateText}
        </OneUIText>
      ) : null}
    </section>
  );
};
