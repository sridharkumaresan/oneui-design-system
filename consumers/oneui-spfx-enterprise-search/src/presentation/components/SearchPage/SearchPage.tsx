import * as React from "react";

import { SearchOrchestrator } from "../../../application/search/orchestrators/SearchOrchestrator";
import { useSearchPageController } from "../../hooks/useSearchPageController";
import { SearchHeader } from "../SearchHeader/SearchHeader";
import { SearchResultsSwitch } from "../SearchResults/SearchResultsSwitch";
import { VerticalTabs } from "../VerticalTabs/VerticalTabs";
import styles from "./SearchPage.module.scss";

type SearchPageProps = {
  orchestrator: SearchOrchestrator;
  userDisplayName: string;
};

export const SearchPage = ({ orchestrator, userDisplayName }: SearchPageProps): React.ReactElement => {
  const controller = useSearchPageController(orchestrator);

  return (
    <div className={styles.root}>
      <SearchHeader
        onQueryChange={controller.onQueryChange}
        onSubmit={controller.onSearchSubmit}
        queryText={controller.queryText}
        userDisplayName={userDisplayName}
      />

      <VerticalTabs
        onSelect={controller.onVerticalChange}
        selectedVerticalKey={controller.selectedVerticalKey}
        verticals={controller.verticals}
      />

      <SearchResultsSwitch
        errorMessage={controller.errorMessage}
        execution={controller.execution}
        hasSearched={controller.hasSearched}
        queryText={controller.queryText}
        status={controller.status}
      />
    </div>
  );
};
