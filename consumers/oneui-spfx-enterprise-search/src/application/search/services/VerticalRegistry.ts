import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";

export class VerticalRegistry {
  private readonly verticalMap: Record<string, VerticalConfig>;

  public constructor(private readonly verticals: VerticalConfig[]) {
    this.verticalMap = verticals.reduce<Record<string, VerticalConfig>>((accumulator, vertical) => {
      accumulator[vertical.key] = vertical;
      return accumulator;
    }, {});
  }

  public getAll(): VerticalConfig[] {
    return this.verticals.slice();
  }

  public getByKey(key: string): VerticalConfig | undefined {
    return this.verticalMap[key];
  }

  public getDefault(): VerticalConfig {
    return this.verticals.find((vertical) => vertical.isDefault) ?? this.verticals[0];
  }

  public resolve(key: string | undefined): VerticalConfig {
    return (key ? this.getByKey(key) : undefined) ?? this.getDefault();
  }

  public getAggregateVertical(): VerticalConfig | undefined {
    return this.verticals.find((vertical) => vertical.kind === "synthetic-aggregate");
  }

  public getAggregateChildren(): VerticalConfig[] {
    return this.verticals.filter(
      (vertical) => vertical.kind === "standard" && vertical.rendering.aggregateParticipation
    );
  }

  public getLayoutGroups(): { main: VerticalConfig[]; side: VerticalConfig[] } {
    return {
      main: this.verticals.filter((vertical) => vertical.layoutRegion === "main"),
      side: this.verticals.filter((vertical) => vertical.layoutRegion === "side")
    };
  }
}

