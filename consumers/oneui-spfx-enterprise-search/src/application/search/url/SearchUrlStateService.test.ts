import { SearchUrlStateService } from "./SearchUrlStateService";

describe("SearchUrlStateService", () => {
  it("parses q and v from the URL", () => {
    const service = new SearchUrlStateService();
    const state = service.parse("https://contoso.sharepoint.com/search.aspx?q=people&v=news");

    expect(state).toEqual({
      queryText: "people",
      verticalKey: "news"
    });
  });

  it("serializes query text and vertical key", () => {
    const service = new SearchUrlStateService();

    expect(
      service.serialize(
        {
          queryText: "benefits",
          verticalKey: "news"
        },
        "https://contoso.sharepoint.com/search.aspx"
      )
    ).toBe("/search.aspx?q=benefits&v=news");
  });

  it("omits empty query parameters", () => {
    const service = new SearchUrlStateService();

    expect(
      service.serialize(
        {
          queryText: "",
          verticalKey: "people"
        },
        "https://contoso.sharepoint.com/search.aspx?q=abc&v=all"
      )
    ).toBe("/search.aspx?v=people");
  });
});

