import type { SearchExecutionResult } from "./SearchExecutionResult";
import type { VerticalConfig } from "./VerticalConfig";
import type { VerticalKey } from "../models/verticalKey";

export type SearchPageStatus =
  | "config-loading"
  | "initialized"
  | "ready"
  | "searching"
  | "success"
  | "empty"
  | "error"
  | "partial-success"
  | "delayed";

export type SearchPageState = {
  errorMessage?: string;
  execution?: SearchExecutionResult;
  hasSearched: boolean;
  queryText: string;
  selectedVerticalKey: VerticalKey;
  status: SearchPageStatus;
  verticals: VerticalConfig[];
};

