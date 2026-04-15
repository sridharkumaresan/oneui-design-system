import type { SearchConfigDiagnostics } from "../../../common/types/configDiagnostics";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import { resultTypes, type RenderingHint } from "../../../domain/search/models/resultType";
import { isVerticalKey, verticalKeys } from "../../../domain/search/models/verticalKey";
import type { SharePointVerticalConfigItemDto } from "../contracts/SharePointVerticalConfigItemDto";

const parseBoolean = (value: boolean | string | undefined, fallback = false): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true" || value.trim() === "1";
  }

  return fallback;
};

const parseNumber = (value: number | string | undefined, fallback: number): number => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
};

const parseList = (value: string | undefined): string[] =>
  value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];

const parseSectionAccentTone = (
  value: string | undefined
): VerticalConfig["rendering"]["sectionAccentTone"] => {
  switch (value?.trim().toLowerCase()) {
    case "brand":
    case "success":
    case "warning":
    case "danger":
    case "info":
    case "neutral":
      return value.trim().toLowerCase() as VerticalConfig["rendering"]["sectionAccentTone"];
    default:
      return undefined;
  }
};

const parseRenderingHint = (value: string | undefined, resultType: VerticalConfig["resultType"]): RenderingHint => {
  if (value) {
    return value as RenderingHint;
  }

  switch (resultType) {
    case "person":
      return "people-list";
    case "resource":
      return "resource-grid";
    case "event":
      return "event-list";
    case "news":
      return "news-list";
    case "file":
      return "file-list";
    default:
      return "document-list";
  }
};

const normalizeKey = (value: string | undefined): string =>
  value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") ?? "";

const ensureSingleDefault = (items: VerticalConfig[]): VerticalConfig[] => {
  if (items.length === 0) {
    return items;
  }

  let didAssignDefault = false;

  return items.map((item, index) => {
    const shouldBeDefault = !didAssignDefault && (item.isDefault || index === 0);
    didAssignDefault = didAssignDefault || shouldBeDefault;

    return {
      ...item,
      isDefault: shouldBeDefault
    };
  });
};

export const mapSharePointVerticalConfigItem = (
  item: SharePointVerticalConfigItemDto
): VerticalConfig | undefined => {
  const key = normalizeKey(item.Key);

  if (!isVerticalKey(key)) {
    return undefined;
  }

  const resultTypeCandidate = String(item.ResultType ?? "document") as VerticalConfig["resultType"];
  const resultType = resultTypes.indexOf(resultTypeCandidate) >= 0 ? resultTypeCandidate : "document";
  const kindCandidate = String(item.Kind ?? "standard");
  const kind = kindCandidate === "synthetic-aggregate" ? "synthetic-aggregate" : "standard";
  const layoutRegion = item.LayoutRegion === "side" ? "side" : "main";

  return {
    enabled: parseBoolean(item.Enabled, true),
    iconName: item.IconName?.trim() || undefined,
    isDefault: parseBoolean(item.DefaultVertical, false),
    key,
    kind,
    layoutRegion,
    order: parseNumber(item.SortOrder, verticalKeys.indexOf(key)),
    query: {
      entityTypes: parseList(item.EntityTypes),
      extraFilters: parseList(item.ExtraFilters),
      requestedFields: parseList(item.FieldSelection),
      sortKeys: parseList(item.SortKeys),
      supportsRefiners: parseBoolean(item.SupportsRefiners, false),
      templateKey: item.TemplateKey?.trim() || "default"
    },
    resultType,
    rendering: {
      aggregateParticipation: parseBoolean(item.AggregateParticipation, kind === "standard"),
      emptyMessage: `No ${String(item.Title ?? key)} results matched this query.`,
      renderingHint: parseRenderingHint(item.RenderingHint, resultType),
      sectionAccentTone: parseSectionAccentTone(item.SectionAccentTone),
      summarySize: parseNumber(item.SummarySize, 4),
      dedicatedSize: parseNumber(item.DedicatedSize, 10),
      supportsInfiniteScroll: parseBoolean(item.SupportsInfiniteScroll, false),
      supportsViewMore: parseBoolean(item.SupportsViewMore, true),
      viewMoreTargetKey: normalizeKey(item.ViewMoreTargetKey) || undefined
    },
    source: {
      dataSourceKey: item.DataSourceKey?.trim() || undefined,
      futureListKey: "SP_Search_Config",
      scopeType:
        item.ScopeType === "sites" || item.ScopeType === "custom" ? item.ScopeType : "tenant",
      siteIds: parseList(item.SiteIds),
      sourceHint: "sharepoint-config"
    },
    title: item.Title?.trim() || key
  };
};

export const mapSharePointVerticalConfigItems = (
  items: SharePointVerticalConfigItemDto[]
): VerticalConfig[] =>
  items
    .map(mapSharePointVerticalConfigItem)
    .filter((item): item is VerticalConfig => Boolean(item));

export type SharePointConfigMappingResult = {
  diagnostics: Pick<
    SearchConfigDiagnostics,
    "defaultVerticalKey" | "duplicateKeys" | "errors" | "invalidKeys" | "rejectedRows" | "sourceRowCount" | "validRowCount"
  >;
  verticals: VerticalConfig[];
};

export const mapAndSanitizeSharePointVerticalConfigItems = (
  items: SharePointVerticalConfigItemDto[]
): SharePointConfigMappingResult => {
  const invalidKeys: string[] = [];
  const duplicateKeys: string[] = [];
  const keyedRows: Record<string, VerticalConfig> = {};

  const mappedRows = items
    .map((item) => {
      const mapped = mapSharePointVerticalConfigItem(item);

      if (!mapped) {
        invalidKeys.push(normalizeKey(item.Key) || "(missing)");
      }

      return mapped;
    })
    .filter((item): item is VerticalConfig => Boolean(item))
    .sort((left, right) => left.order - right.order || left.key.localeCompare(right.key));

  mappedRows.forEach((row) => {
    if (keyedRows[row.key]) {
      duplicateKeys.push(row.key);
      return;
    }

    keyedRows[row.key] = row;
  });

  const dedupedRows = Object.keys(keyedRows)
    .map((key) => keyedRows[key])
    .filter((row) => row.enabled);

  const verticals = ensureSingleDefault(dedupedRows);

  return {
    diagnostics: {
      defaultVerticalKey: verticals.find((row) => row.isDefault)?.key,
      duplicateKeys,
      errors: [],
      invalidKeys,
      rejectedRows: invalidKeys.length + duplicateKeys.length + (mappedRows.length - dedupedRows.length),
      sourceRowCount: items.length,
      validRowCount: verticals.length
    },
    verticals
  };
};
