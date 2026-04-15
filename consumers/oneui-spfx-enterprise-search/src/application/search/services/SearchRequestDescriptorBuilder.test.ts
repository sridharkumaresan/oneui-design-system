import { SearchFieldSelectionResolver } from "./SearchFieldSelectionResolver";
import { SearchFilterComposer } from "./SearchFilterComposer";
import { SearchQueryTemplateRegistry } from "./SearchQueryTemplateRegistry";
import { SearchRequestDescriptorBuilder } from "./SearchRequestDescriptorBuilder";
import { dummyVerticalConfigs } from "../../../infrastructure/config/dummy/verticalConfigs";

describe("SearchRequestDescriptorBuilder", () => {
  it("propagates template, fields, filters, and entity types into the descriptor", () => {
    const builder = new SearchRequestDescriptorBuilder(
      new SearchQueryTemplateRegistry({
        news: (intent) => `${intent.queryText} news`
      }),
      new SearchFieldSelectionResolver(),
      new SearchFilterComposer()
    );

    const newsVertical = dummyVerticalConfigs.find((vertical) => vertical.key === "news");

    if (!newsVertical) {
      throw new Error("News vertical not found.");
    }

    const descriptor = builder.build({
      pageSize: 3,
      queryText: "benefits",
      vertical: newsVertical
    });

    expect(descriptor.templateKey).toBe("news");
    expect(descriptor.queryText).toBe("benefits news");
    expect(descriptor.entityTypes).toEqual(["listItem"]);
    expect(descriptor.fields).toEqual(["title", "summary", "date", "path", "thumbnailUrl"]);
    expect(descriptor.pageSize).toBe(3);
  });
});

