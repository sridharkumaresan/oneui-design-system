import type { SearchRuntimeMode } from "../../../common/types/runtime";
import type { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { IMockSearchApiClient } from "../../mock-api/contracts/IMockSearchApiClient";
import { mapAndSanitizeSharePointVerticalConfigItems } from "../mappers/SharePointVerticalConfigMapper";
import type { IVerticalConfigRepository } from "../contracts/IVerticalConfigRepository";

export class MockApiVerticalConfigRepository implements IVerticalConfigRepository {
  public constructor(
    private readonly client: IMockSearchApiClient,
    private readonly diagnosticsStore?: SearchConfigDiagnosticsStore,
    private readonly runtimeMode: SearchRuntimeMode = "dummy"
  ) {}

  public async getVerticalConfigs(): Promise<VerticalConfig[]> {
    const response = await this.client.getConfig();
    const mapped = mapAndSanitizeSharePointVerticalConfigItems(response.verticals);

    this.diagnosticsStore?.setSnapshot({
      ...mapped.diagnostics,
      loadedVerticalKeys: mapped.verticals.map((vertical) => vertical.key),
      mode: this.runtimeMode,
      source: "mock-http",
      usedFallback: false
    });

    return mapped.verticals;
  }
}
