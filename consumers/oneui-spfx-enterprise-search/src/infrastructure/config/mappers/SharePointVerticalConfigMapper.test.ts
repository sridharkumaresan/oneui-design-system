import {
  mapAndSanitizeSharePointVerticalConfigItems,
  mapSharePointVerticalConfigItem,
  mapSharePointVerticalConfigItems
} from "./SharePointVerticalConfigMapper";

describe("SharePointVerticalConfigMapper", () => {
  it("maps a valid SharePoint config row into a vertical config", () => {
    const vertical = mapSharePointVerticalConfigItem({
      DefaultVertical: true,
      Enabled: true,
      EntityTypes: "listItem,sitePage",
      FieldSelection: "title,summary",
      Key: "news",
      Kind: "standard",
      ResultType: "news",
      SortOrder: 4,
      SummarySize: 3,
      TemplateKey: "news",
      Title: "News"
    });

    expect(vertical).toBeDefined();
    expect(vertical?.key).toBe("news");
    expect(vertical?.isDefault).toBe(true);
    expect(vertical?.query.entityTypes).toEqual(["listItem", "sitePage"]);
    expect(vertical?.query.requestedFields).toEqual(["title", "summary"]);
  });

  it("handles missing optional fields gracefully", () => {
    const vertical = mapSharePointVerticalConfigItem({
      Enabled: true,
      Key: "people",
      Title: "People"
    });

    expect(vertical).toBeDefined();
    expect(vertical?.query.templateKey).toBe("default");
    expect(vertical?.rendering.summarySize).toBe(4);
    expect(vertical?.source.scopeType).toBe("tenant");
  });

  it("rejects invalid vertical keys", () => {
    expect(
      mapSharePointVerticalConfigItem({
        Enabled: true,
        Key: "totally-new-key",
        Title: "Invalid"
      })
    ).toBeUndefined();
  });

  it("keeps only valid mapped items", () => {
    const mapped = mapSharePointVerticalConfigItems([
      { Enabled: true, Key: "news", Title: "News" },
      { Enabled: true, Key: "bad-key", Title: "Bad" }
    ]);

    expect(mapped).toHaveLength(1);
    expect(mapped[0].key).toBe("news");
  });

  it("drops duplicate keys deterministically and keeps a single default", () => {
    const result = mapAndSanitizeSharePointVerticalConfigItems([
      { DefaultVertical: true, Enabled: true, Key: "news", SortOrder: 1, Title: "News A" },
      { DefaultVertical: true, Enabled: true, Key: "news", SortOrder: 2, Title: "News B" },
      { Enabled: true, Key: "people", SortOrder: 3, Title: "People" }
    ]);

    expect(result.verticals).toHaveLength(2);
    expect(result.verticals.filter((item) => item.isDefault)).toHaveLength(1);
    expect(result.diagnostics.duplicateKeys).toEqual(["news"]);
  });
});
