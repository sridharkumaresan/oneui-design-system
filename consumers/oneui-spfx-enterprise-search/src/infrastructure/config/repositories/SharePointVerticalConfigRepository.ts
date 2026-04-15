import type { SearchRuntimeMode } from "../../../common/types/runtime";
import type { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { ISharePointListClient } from "../contracts/ISharePointListClient";
import type { IVerticalConfigRepository } from "../contracts/IVerticalConfigRepository";
import type { SharePointVerticalConfigItemDto } from "../contracts/SharePointVerticalConfigItemDto";
import { mapAndSanitizeSharePointVerticalConfigItems } from "../mappers/SharePointVerticalConfigMapper";

const sharePointConfigSelectFields: string[] = [
  "Id",
  "Title",
  "Key",
  "Enabled",
  "DefaultVertical",
  "SortOrder",
  "IconName",
  "Kind",
  "LayoutRegion",
  "ResultType",
  "RenderingHint",
  "AggregateParticipation",
  "EntityTypes",
  "FieldSelection",
  "TemplateKey",
  "ExtraFilters",
  "SortKeys",
  "ScopeType",
  "SiteIds",
  "DataSourceKey",
  "SummarySize",
  "DedicatedSize",
  "SupportsInfiniteScroll",
  "SupportsRefiners",
  "SupportsViewMore",
  "ViewMoreTargetKey"
];

export class SharePointVerticalConfigRepository implements IVerticalConfigRepository {
  public constructor(
    private readonly listClient: ISharePointListClient,
    private readonly diagnosticsStore?: SearchConfigDiagnosticsStore,
    private readonly runtimeMode: SearchRuntimeMode = "hybrid",
    private readonly listTitle = "SP_Search_Config"
  ) {}

  public async getVerticalConfigs(): Promise<VerticalConfig[]> {
    const sourceItems = await this.listClient.getItems<SharePointVerticalConfigItemDto>({
      listTitle: this.listTitle,
      orderBy: ["SortOrder asc", "Id asc"],
      select: sharePointConfigSelectFields,
      top: 500
    });

    const result = mapAndSanitizeSharePointVerticalConfigItems(sourceItems);

    this.diagnosticsStore?.setSnapshot({
      ...result.diagnostics,
      loadedVerticalKeys: result.verticals.map((vertical) => vertical.key),
      mode: this.runtimeMode,
      source: "sharepoint",
      usedFallback: false
    });

    if (result.verticals.length === 0) {
      throw new Error("No valid vertical configuration rows were found in SP_Search_Config.");
    }

    return result.verticals;
  }
}
