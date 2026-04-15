import { dummyVerticalConfigs } from "../../../infrastructure/config/dummy/verticalConfigs";
import type { IVerticalConfigRepository } from "../../../infrastructure/config/contracts/IVerticalConfigRepository";
import { VerticalConfigService } from "./VerticalConfigService";

class FakeConfigRepository implements IVerticalConfigRepository {
  public async getVerticalConfigs(): Promise<typeof dummyVerticalConfigs> {
    return dummyVerticalConfigs.slice().reverse();
  }
}

describe("VerticalConfigService", () => {
  it("returns enabled verticals sorted by order", async () => {
    const service = new VerticalConfigService(new FakeConfigRepository());
    const verticals = await service.getEnabledVerticals();

    expect(verticals[0].key).toBe("all");
    expect(verticals[1].key).toBe("it-hr-colleague-direct");
  });

  it("falls back to the default vertical when lookup misses", async () => {
    const service = new VerticalConfigService(new FakeConfigRepository());
    const verticals = await service.getEnabledVerticals();
    const resolved = service.resolveVertical("unknown", verticals);

    expect(resolved.key).toBe("all");
  });

  it("groups verticals by layout region", async () => {
    const service = new VerticalConfigService(new FakeConfigRepository());
    const verticals = await service.getEnabledVerticals();
    const groups = service.groupByLayout(verticals);

    expect(groups.main.some((vertical) => vertical.key === "news")).toBe(true);
    expect(groups.side.some((vertical) => vertical.key === "people")).toBe(true);
  });
});
