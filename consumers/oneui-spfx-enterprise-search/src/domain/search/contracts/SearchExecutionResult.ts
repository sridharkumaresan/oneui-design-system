import type { VerticalConfig } from "./VerticalConfig";
import type { AllVerticalSectionResult, VerticalSearchResult } from "./SearchResult";

export type SearchProgressItem = {
  accentTone?: VerticalConfig["rendering"]["sectionAccentTone"];
  count: number;
  id: string;
  label: string;
  status: VerticalSearchResult["status"];
};

export type SearchProgressSummary = {
  completed: number;
  delayed: number;
  description: string;
  empty: number;
  error: number;
  items: SearchProgressItem[];
  loading: number;
  percent: number;
  refreshing: number;
  success: number;
  title: string;
  total: number;
};

export type AllSearchExecutionResult = {
  kind: "all";
  layout: {
    main: string[];
    side: string[];
  };
  progress: SearchProgressSummary;
  sections: AllVerticalSectionResult[];
  selectedVertical: VerticalConfig;
};

export type DedicatedSearchExecutionResult = {
  kind: "vertical";
  progress: SearchProgressSummary;
  result: VerticalSearchResult;
  selectedVertical: VerticalConfig;
};

export type SearchExecutionResult =
  | AllSearchExecutionResult
  | DedicatedSearchExecutionResult;
