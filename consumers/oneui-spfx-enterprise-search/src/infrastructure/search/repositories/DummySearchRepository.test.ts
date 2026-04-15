import { dummyVerticalConfigs } from "../../config/dummy/verticalConfigs";
import type { SearchRequestDescriptor } from "../../../application/search/contracts/SearchRequestDescriptor";
import { DummySearchRepository } from "./DummySearchRepository";

const createDescriptor = (queryText: string): SearchRequestDescriptor => ({
  entityTypes: ["listItem"],
  fields: ["title"],
  filters: [],
  pageSize: 10,
  queryText,
  scope: {
    scopeType: "tenant",
    siteIds: []
  },
  sortKeys: [],
  supportsRefiners: false,
  templateKey: "news",
  verticalKey: "news"
});

describe("DummySearchRepository", () => {
  it("returns mock results for any non-empty query", async () => {
    const repository = new DummySearchRepository(0);
    const vertical = dummyVerticalConfigs.find((item) => item.key === "news") ?? dummyVerticalConfigs[0];
    const result = await repository.search(createDescriptor("benefits"), vertical);

    expect(result.status).toBe("success");
    expect(result.total).toBeGreaterThan(0);
    expect(result.items[0]?.sourceKey).toBe("news");
  });

  it("returns an empty result for an empty query", async () => {
    const repository = new DummySearchRepository(0);
    const vertical = dummyVerticalConfigs.find((item) => item.key === "news") ?? dummyVerticalConfigs[0];
    const result = await repository.search(createDescriptor(""), vertical);

    expect(result.status).toBe("empty");
    expect(result.total).toBe(0);
    expect(result.items).toEqual([]);
  });
});
