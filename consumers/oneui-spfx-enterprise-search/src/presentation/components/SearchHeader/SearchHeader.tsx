import * as React from "react";

import { HeroBanner } from "@functions-oneui/organism-hero-banner";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";

import styles from "../SearchPage/SearchPage.module.scss";

type SearchHeaderProps = {
  onQueryChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  queryText: string;
  userDisplayName: string;
};

const scopeOptions = [
  {
    label: "All sources",
    value: "all"
  }
];

export const SearchHeader = (props: SearchHeaderProps): React.ReactElement => {
  const { onQueryChange, onSubmit, queryText, userDisplayName } = props;

  return (
    <HeroBanner
      className={styles.heroBanner}
      contentTone="inverse"
      data-search-onboarding="search"
      eyebrow={
        <div className={styles.heroEyebrow}>
          <span className={styles.backLink}>Back</span>
          <span className={styles.breadcrumb}>Organisation</span>
          <span className={styles.breadcrumb}>Connections</span>
        </div>
      }
      height="comfortable"
      supportingContent={
        <div className={styles.searchSurface}>
          <SearchAutocomplete
            emptyStateText={null}
            formAriaLabel="Enterprise search"
            inputAriaLabel="Search"
            onQueryChange={onQueryChange}
            onSubmit={() => onSubmit().then(() => undefined)}
            placeholder="Search enterprise content"
            query={queryText}
            scopeAriaLabel="Search scope"
            scopeOptions={scopeOptions}
            scopeValue="all"
            submitLabel="Search"
          />
        </div>
      }
      surfaceKey="gradientNavyCyan"
      title={`Good afternoon, ${userDisplayName}`}
    />
  );
};
