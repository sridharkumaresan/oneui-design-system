import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";

export interface IVerticalConfigRepository {
  getVerticalConfigs(): Promise<VerticalConfig[]>;
}

