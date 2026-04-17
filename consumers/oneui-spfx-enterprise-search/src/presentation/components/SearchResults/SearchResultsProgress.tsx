import * as React from "react";

import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";

import type { SearchProgressSummary } from "../../../domain/search/contracts/SearchExecutionResult";

type SearchResultsProgressProps = {
  progress: SearchProgressSummary;
};

export const SearchResultsProgress = ({
  progress
}: SearchResultsProgressProps): React.ReactElement => (
  <SmartProgressBar
    data-search-onboarding="progress"
    completed={progress.completed}
    delayed={progress.delayed}
    description={progress.description}
    empty={progress.empty}
    error={progress.error}
    items={progress.items.map((item) => ({
      accentTone: item.accentTone,
      id: item.id,
      label: item.label,
      status: item.status
    }))}
    loading={progress.loading}
    percent={progress.percent}
    refreshing={progress.refreshing}
    success={progress.success}
    summaryText={`${progress.completed} of ${progress.total} sources completed`}
    title={progress.title}
    total={progress.total}
  />
);
