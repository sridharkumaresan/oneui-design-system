import type { SearchSourceKey } from "../../../common/types/searchSource";
import { isSearchSourceKey } from "../../../common/types/searchSource";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { VerticalKey } from "../../../domain/search/models/verticalKey";

export type VerticalSearchSourceOverrides = Partial<Record<VerticalKey, SearchSourceKey>>;

export class VerticalSearchSourceResolver {
  public constructor(
    private readonly overrides: VerticalSearchSourceOverrides = {},
    private readonly fallbackSource: SearchSourceKey = "dummy"
  ) {}

  public resolve(vertical: VerticalConfig): SearchSourceKey {
    const override = this.overrides[vertical.key];

    if (override) {
      return override;
    }

    const configuredSource = vertical.source.dataSourceKey;

    if (isSearchSourceKey(configuredSource)) {
      return configuredSource;
    }

    return this.fallbackSource;
  }
}
