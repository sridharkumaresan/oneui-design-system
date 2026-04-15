import { GraphSearchResultNormalizer } from "./GraphSearchResultNormalizer";
import { dummyVerticalConfigs } from "../../config/dummy/verticalConfigs";

describe("GraphSearchResultNormalizer", () => {
  it("maps sparse hits safely and rejects malformed ones", () => {
    const normalizer = new GraphSearchResultNormalizer();
    const vertical = dummyVerticalConfigs.find((candidate) => candidate.key === "files")!;

    const result = normalizer.normalize(
      {
        value: [
          {
            hitsContainers: [
              {
                hits: [
                  {
                    hitId: "file-1",
                    resource: {
                      id: "file-1",
                      name: "Policy guide.docx",
                      webUrl: "https://contoso.sharepoint.com/files/policy"
                    }
                  },
                  {
                    hitId: "file-2",
                    resource: null as unknown as Record<string, unknown>
                  }
                ],
                total: 2
              }
            ]
          }
        ]
      },
      vertical
    );

    expect(result.items[0].title).toBe("Policy guide.docx");
    expect(result.rejectedHits).toBe(0);
    expect(result.total).toBe(2);
  });

  it("returns an empty normalized result for irregular graph payloads", () => {
    const normalizer = new GraphSearchResultNormalizer();
    const vertical = dummyVerticalConfigs.find((candidate) => candidate.key === "files")!;

    const result = normalizer.normalize({ value: [{}] }, vertical);

    expect(result.items).toEqual([]);
    expect(result.rejectedHits).toBe(0);
    expect(result.total).toBe(0);
  });
});
