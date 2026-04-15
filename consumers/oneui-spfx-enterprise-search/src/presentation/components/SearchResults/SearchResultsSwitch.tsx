import * as React from "react";

import type { SearchExecutionResult } from "../../../domain/search/contracts/SearchExecutionResult";
import type { SearchPageState } from "../../../domain/search/contracts/SearchPageState";
import { ErrorState } from "../states/ErrorState";
import { LoadingState } from "../states/LoadingState";
import { NoResultsState } from "../states/NoResultsState";
import { PreSearchEmptyState } from "../states/PreSearchEmptyState";
import { AllVerticalResults } from "./AllVerticalResults";
import { VerticalResultList } from "./VerticalResultList";

type SearchResultsSwitchProps = {
  errorMessage?: string;
  execution?: SearchExecutionResult;
  hasSearched: boolean;
  queryText: string;
  status: SearchPageState["status"];
};

export const SearchResultsSwitch = (props: SearchResultsSwitchProps): React.ReactElement => {
  const { errorMessage, execution, hasSearched, queryText, status } = props;

  if (!hasSearched) {
    return <PreSearchEmptyState />;
  }

  if (status === "config-loading" && !execution) {
    return <LoadingState />;
  }

  if (status === "error" && !execution) {
    return <ErrorState message={errorMessage} />;
  }

  if (!execution) {
    return <NoResultsState queryText={queryText} />;
  }

  if (execution.kind === "all") {
    const hasRenderableSections = execution.sections.some(
      (section) =>
        section.total > 0 ||
        section.status === "loading" ||
        section.status === "delayed" ||
        section.status === "error" ||
        section.status === "refreshing"
    );
    return hasRenderableSections ? <AllVerticalResults result={execution} /> : <NoResultsState queryText={queryText} />;
  }

  return execution.result.total > 0 ||
    execution.result.status === "loading" ||
    execution.result.status === "delayed" ||
    execution.result.status === "refreshing" ||
    execution.result.status === "error" ? (
    <VerticalResultList result={execution} />
  ) : (
    <NoResultsState queryText={queryText} />
  );
};
