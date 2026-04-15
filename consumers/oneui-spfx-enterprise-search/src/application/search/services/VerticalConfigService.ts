import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { IVerticalConfigRepository } from "../../../infrastructure/config/contracts/IVerticalConfigRepository";
import { VerticalRegistry } from "./VerticalRegistry";

export class VerticalConfigService {
  public constructor(private readonly repository: IVerticalConfigRepository) {}

  public async getEnabledVerticals(): Promise<VerticalConfig[]> {
    const verticals = await this.repository.getVerticalConfigs();

    return verticals
      .filter((vertical) => vertical.enabled)
      .sort((left, right) => left.order - right.order);
  }

  public createRegistry(verticals: VerticalConfig[]): VerticalRegistry {
    return new VerticalRegistry(verticals);
  }

  public resolveVertical(
    requestedKey: string | undefined,
    verticals: VerticalConfig[]
  ): VerticalConfig {
    return this.createRegistry(verticals).resolve(requestedKey);
  }

  public groupByLayout(verticals: VerticalConfig[]): {
    main: VerticalConfig[];
    side: VerticalConfig[];
  } {
    return this.createRegistry(verticals).getLayoutGroups();
  }
}
