import type { NormalizedSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { GraphSearchHitDto, GraphSearchResponseDto } from "../contracts/GraphSearchDtos";

type ResultNormalizer = (hit: GraphSearchHitDto, vertical: VerticalConfig) => NormalizedSearchResult;
type GraphNormalizationResult = {
  items: NormalizedSearchResult[];
  rejectedHits: number;
  total: number;
};

const readString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

const readNestedString = (record: Record<string, unknown>, path: string[]): string | undefined => {
  let current: unknown = record;

  for (const segment of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return readString(current);
};

const buildFallbackId = (vertical: VerticalConfig, resource: Record<string, unknown>): string =>
  `${vertical.key}-${readString(resource.id) ?? readString(resource.title) ?? readString(resource.name) ?? "result"}`;

const normalizeDefault = (hit: GraphSearchHitDto, vertical: VerticalConfig): NormalizedSearchResult => {
  const resource = (hit.resource ?? {}) as Record<string, unknown>;
  const title =
    readString(resource.title) ??
    readString(resource.name) ??
    readString(resource.displayName) ??
    vertical.title;
  const url =
    readString(resource.webUrl) ??
    readString(resource.path) ??
    readString(resource.sharepointIds?.toString?.()) ??
    "#";
  const summary =
    readString(hit.summary) ??
    readString(resource.summary) ??
    readString(resource.description);

  return {
    createdBy:
      readNestedString(resource, ["createdBy", "user", "displayName"]) ??
      readString(resource.createdByDisplayName),
    id: String(hit.hitId ?? readString(resource.id) ?? buildFallbackId(vertical, resource)),
    metadata: {},
    modifiedTime:
      readString(resource.modifiedTime) ??
      readString(resource.lastModifiedDateTime),
    sourceKey: vertical.key,
    summary,
    thumbnailUrl:
      readString(resource.thumbnailUrl) ??
      readString(resource.thumbnailWebUrl),
    title,
    type: vertical.resultType,
    url
  };
};

const normalizeFile = (hit: GraphSearchHitDto, vertical: VerticalConfig): NormalizedSearchResult => {
  const resource = (hit.resource ?? {}) as Record<string, unknown>;
  const extension =
    readString(resource.fileExtension) ??
    readNestedString(resource, ["file", "mimeType"]);

  return {
    ...normalizeDefault(hit, vertical),
    metadata: {
      extension,
      owner:
        readNestedString(resource, ["createdBy", "user", "displayName"]) ??
        readString(resource.createdByDisplayName)
    }
  };
};

export class GraphSearchResultNormalizer {
  public constructor(
    private readonly registry: Record<string, ResultNormalizer> = {
      file: normalizeFile
    }
  ) {}

  public normalize(response: GraphSearchResponseDto, vertical: VerticalConfig): GraphNormalizationResult {
    const normalizer = this.registry[vertical.resultType] ?? normalizeDefault;
    const container = response.value?.[0]?.hitsContainers?.[0];
    const hits = container?.hits ?? [];
    const items: NormalizedSearchResult[] = [];
    let rejectedHits = 0;

    hits.forEach((hit) => {
      try {
        items.push(normalizer(hit, vertical));
      } catch {
        rejectedHits += 1;
      }
    });

    return {
      items,
      rejectedHits,
      total: container?.total ?? items.length
    };
  }
}
