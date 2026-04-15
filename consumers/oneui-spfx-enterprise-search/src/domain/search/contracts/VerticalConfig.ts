import type { VerticalKey } from "../models/verticalKey";
import type { RenderingHint, ResultType } from "../models/resultType";

export type VerticalKind = "synthetic-aggregate" | "standard";
export type VerticalLayoutRegion = "main" | "side";
export type VerticalDataScopeType = "tenant" | "sites" | "custom";

export type VerticalRenderingConfig = {
  aggregateParticipation: boolean;
  emptyMessage: string;
  renderingHint: RenderingHint;
  sectionAccentTone?: "neutral" | "brand" | "success" | "warning" | "danger" | "info";
  summarySize: number;
  dedicatedSize: number;
  supportsInfiniteScroll: boolean;
  supportsViewMore: boolean;
  viewMoreTargetKey?: string;
};

export type VerticalQueryConfig = {
  entityTypes: string[];
  filterKeys?: string[];
  extraFilters?: string[];
  promotedState?: "any" | "promoted" | "not-promoted";
  requestedFields?: string[];
  sortKeys?: string[];
  supportsRefiners?: boolean;
  templateKey: string;
};

export type VerticalSourceConfig = {
  dataSourceKey?: string;
  futureListKey?: string;
  scopeType: VerticalDataScopeType;
  siteIds?: string[];
  sourceHint?: string;
};

export type VerticalConfig = {
  enabled: boolean;
  iconName?: string;
  isDefault: boolean;
  key: VerticalKey;
  kind: VerticalKind;
  layoutRegion: VerticalLayoutRegion;
  order: number;
  query: VerticalQueryConfig;
  resultType: ResultType;
  rendering: VerticalRenderingConfig;
  source: VerticalSourceConfig;
  title: string;
};
