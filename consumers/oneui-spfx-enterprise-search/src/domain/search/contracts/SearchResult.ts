import type { LoadingStatus } from "../../../common/types/loading";
import type { SearchSourceKey } from "../../../common/types/searchSource";
import type { VerticalConfig } from "./VerticalConfig";
import type { RenderingHint, ResultType } from "../models/resultType";

export type ResultMetadata = Record<string, string | number | boolean | undefined>;

export type NormalizedSearchResult = {
  createdBy?: string;
  id: string;
  metadata: ResultMetadata;
  modifiedTime?: string;
  sourceKey: VerticalConfig["key"];
  summary?: string;
  thumbnailUrl?: string;
  title: string;
  type: ResultType;
  url: string;
};

export type VerticalSearchResult = {
  cursor?: string;
  diagnostics?: {
    rejectedHits?: number;
    requestDurationMs?: number;
    transport?: "in-memory" | "mock-http" | "graph";
  };
  errorMessage?: string;
  items: NormalizedSearchResult[];
  source?: SearchSourceKey;
  status: LoadingStatus;
  total: number;
  vertical: VerticalConfig;
};

export type AllVerticalSectionResult = {
  errorMessage?: string;
  items: NormalizedSearchResult[];
  previewCount: number;
  renderingHint: RenderingHint;
  status: LoadingStatus;
  supportsViewMore: boolean;
  total: number;
  vertical: VerticalConfig;
  viewMoreUrl?: string;
};
