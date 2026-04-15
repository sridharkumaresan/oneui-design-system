import type { LoadingStatus } from "../../../common/types/loading";
import type { NormalizedSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalKey } from "../../../domain/search/models/verticalKey";
import type { SharePointVerticalConfigItemDto } from "../../config/contracts/SharePointVerticalConfigItemDto";

export type MockSearchDebugOptions = {
  delayMs?: number;
  status?: "empty" | "error" | "request-error" | "success";
  targetVerticalKey?: VerticalKey | "*";
};

export type MockSearchConfigResponse = {
  source: "mock-http";
  verticals: SharePointVerticalConfigItemDto[];
};

export type MockSearchQueryRequest = {
  pageSize: number;
  queryText: string;
  verticalKey: VerticalKey;
};

export type MockSearchQueryResponse = {
  errorMessage?: string;
  items: NormalizedSearchResult[];
  requestDurationMs: number;
  status: Extract<LoadingStatus, "empty" | "error" | "success">;
  total: number;
  transport: "mock-http";
};
