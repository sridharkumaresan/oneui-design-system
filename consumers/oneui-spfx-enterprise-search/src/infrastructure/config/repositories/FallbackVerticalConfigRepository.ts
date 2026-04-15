import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { IVerticalConfigRepository } from "../contracts/IVerticalConfigRepository";

export type ConfigFailureStrategy = "error" | "fallback-dummy";

export class FallbackVerticalConfigRepository implements IVerticalConfigRepository {
  public constructor(
    private readonly primaryRepository: IVerticalConfigRepository,
    private readonly fallbackRepository: IVerticalConfigRepository,
    private readonly failureStrategy: ConfigFailureStrategy,
    private readonly diagnosticsStore?: SearchConfigDiagnosticsStore
  ) {}

  public async getVerticalConfigs(): Promise<VerticalConfig[]> {
    try {
      return await this.primaryRepository.getVerticalConfigs();
    } catch (error) {
      if (this.failureStrategy !== "fallback-dummy") {
        throw error;
      }

      const fallbackConfigs = await this.fallbackRepository.getVerticalConfigs();
      const snapshot = this.diagnosticsStore?.getSnapshot();

      if (snapshot) {
        this.diagnosticsStore?.setSnapshot({
          ...snapshot,
          errors: [
            ...snapshot.errors,
            error instanceof Error ? error.message : "SharePoint config load failed."
          ],
          loadedVerticalKeys: fallbackConfigs.map((vertical) => vertical.key),
          source: "fallback-dummy",
          usedFallback: true,
          validRowCount: fallbackConfigs.length
        });
      }

      return fallbackConfigs;
    }
  }
}
