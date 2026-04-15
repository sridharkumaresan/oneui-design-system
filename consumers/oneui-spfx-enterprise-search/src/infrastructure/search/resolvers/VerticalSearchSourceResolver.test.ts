import { VerticalSearchSourceResolver } from "./VerticalSearchSourceResolver";
import { dummyVerticalConfigs } from "../../config/dummy/verticalConfigs";

describe("VerticalSearchSourceResolver", () => {
  it("uses explicit source overrides when provided", () => {
    const resolver = new VerticalSearchSourceResolver({ files: "graph" });
    const filesVertical = dummyVerticalConfigs.find((vertical) => vertical.key === "files");

    expect(filesVertical).toBeDefined();
    expect(resolver.resolve(filesVertical!)).toBe("graph");
  });

  it("falls back to dummy for verticals without overrides", () => {
    const resolver = new VerticalSearchSourceResolver({ files: "graph" });
    const newsVertical = dummyVerticalConfigs.find((vertical) => vertical.key === "news");

    expect(newsVertical).toBeDefined();
    expect(resolver.resolve(newsVertical!)).toBe("dummy");
  });
});
