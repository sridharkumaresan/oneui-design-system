import type { SearchRuntimeMode } from "../../../common/types/runtime";
import type { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { IVerticalConfigRepository } from "../contracts/IVerticalConfigRepository";
import { dummyVerticalConfigs } from "../dummy/verticalConfigs";

export class DummyVerticalConfigRepository implements IVerticalConfigRepository {
  public constructor(
    private readonly diagnosticsStore?: SearchConfigDiagnosticsStore,
    private readonly runtimeMode: SearchRuntimeMode = "dummy"
  ) {}

  public async getVerticalConfigs(): Promise<VerticalConfig[]> {
    const verticals = dummyVerticalConfigs.map((config) => ({ ...config }));

    this.diagnosticsStore?.setSnapshot({
      defaultVerticalKey: verticals.find((vertical) => vertical.isDefault)?.key,
      duplicateKeys: [],
      errors: [],
      invalidKeys: [],
      loadedVerticalKeys: verticals.map((vertical) => vertical.key),
      mode: this.runtimeMode,
      rejectedRows: 0,
      source: "dummy",
      sourceRowCount: verticals.length,
      usedFallback: false,
      validRowCount: verticals.length
    });

    return verticals;
  }
}
