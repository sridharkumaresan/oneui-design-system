import { GraphSearchRequestBodyBuilder } from "../mappers/GraphSearchRequestBodyBuilder";
import { GraphSearchResultNormalizer } from "../mappers/GraphSearchResultNormalizer";
import { GraphSearchRepository } from "./GraphSearchRepository";
import { dummyVerticalConfigs } from "../../config/dummy/verticalConfigs";

describe("GraphSearchRepository", () => {
  it("executes a prepared graph request body and returns normalized results", async () => {
    const executeSearch = jest.fn(async () => ({
      value: [
        {
          hitsContainers: [
            {
              hits: [
                {
                  hitId: "file-1",
                  resource: {
                    id: "file-1",
                    lastModifiedDateTime: "2026-04-11T10:00:00Z",
                    name: "Quarterly roadmap.pptx",
                    webUrl: "https://contoso.sharepoint.com/files/roadmap"
                  }
                }
              ],
              total: 1
            }
          ]
        }
      ]
    }));

    const repository = new GraphSearchRepository(
      new GraphSearchRequestBodyBuilder(),
      new GraphSearchResultNormalizer(),
      { executeSearch }
    );
    const vertical = dummyVerticalConfigs.find((candidate) => candidate.key === "files")!;
    const result = await repository.search(
      {
        entityTypes: ["driveItem"],
        fields: ["name", "lastModifiedDateTime", "webUrl"],
        filters: [],
        pageSize: 10,
        queryText: "roadmap file",
        scope: {
          scopeType: "tenant",
          siteIds: []
        },
        sortKeys: [],
        supportsRefiners: false,
        templateKey: "files",
        verticalKey: vertical.key
      },
      vertical
    );

    expect(executeSearch).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("success");
    expect(result.items[0].title).toBe("Quarterly roadmap.pptx");
    expect(result.total).toBe(1);
  });

  it("handles empty graph responses safely", async () => {
    const repository = new GraphSearchRepository(
      new GraphSearchRequestBodyBuilder(),
      new GraphSearchResultNormalizer(),
      {
        executeSearch: async () => ({ value: [] })
      }
    );
    const vertical = dummyVerticalConfigs.find((candidate) => candidate.key === "files")!;
    const result = await repository.search(
      {
        entityTypes: ["driveItem"],
        fields: [],
        filters: [],
        pageSize: 10,
        queryText: "roadmap file",
        scope: {
          scopeType: "tenant",
          siteIds: []
        },
        sortKeys: [],
        supportsRefiners: false,
        templateKey: "files",
        verticalKey: vertical.key
      },
      vertical
    );

    expect(result.status).toBe("empty");
    expect(result.items).toEqual([]);
  });
});
