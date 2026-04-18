import * as React from "react";

import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";

import type { SearchProgressSummary } from "../../../domain/search/contracts/SearchExecutionResult";
import styles from "../SearchPage/SearchPage.module.scss";

type SearchResultsProgressProps = {
  progress: SearchProgressSummary;
};

const classNames = styles as unknown as Record<string, string>;

export const SearchResultsProgress = ({
  progress
}: SearchResultsProgressProps): React.ReactElement => (
  <SmartProgressBar
    ariaLabel="Search source loading progress"
    className={classNames.searchProgressBar}
    data-search-onboarding="progress"
    completed={progress.completed}
    delayed={progress.delayed}
    empty={progress.empty}
    error={progress.error}
    items={progress.items.map((item) => ({
      accentTone: item.accentTone,
      id: item.id,
      label: item.label,
      status: item.status
    }))}
    loading={progress.loading}
    mode="full"
    percent={progress.percent}
    refreshing={progress.refreshing}
    showChips
    showSummary={false}
    success={progress.success}
    summaryText={progress.completed === progress.total ? "All sources loaded" : "Loading sources"}
    title="Sources"
    total={progress.total}
  />
);
