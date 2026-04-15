import { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { ISharePointListClient } from "../contracts/ISharePointListClient";
import { SharePointVerticalConfigRepository } from "./SharePointVerticalConfigRepository";

const createListClient = (items: Array<Record<string, unknown>>): ISharePointListClient => ({
  async getItems<TItem extends Record<string, unknown>>(_query: { listTitle: string; select: string[] }) {
    return items as unknown as TItem[];
  }
});

describe("SharePointVerticalConfigRepository", () => {
  it("loads and sanitizes SharePoint config rows", async () => {
    const diagnosticsStore = new SearchConfigDiagnosticsStore();
    const repository = new SharePointVerticalConfigRepository(
      createListClient([
        { DefaultVertical: true, Enabled: true, Key: "all", Kind: "synthetic-aggregate", Title: "All" },
        { Enabled: true, Key: "news", ResultType: "news", SortOrder: 2, Title: "News" },
        { Enabled: true, Key: "news", ResultType: "news", SortOrder: 3, Title: "Duplicate" },
        { Enabled: true, Key: "bad-key", Title: "Invalid" }
      ]),
      diagnosticsStore,
      "hybrid"
    );

    const verticals = await repository.getVerticalConfigs();

    expect(verticals.map((item) => item.key)).toEqual(["all", "news"]);
    expect(diagnosticsStore.getSnapshot()?.duplicateKeys).toEqual(["news"]);
    expect(diagnosticsStore.getSnapshot()?.invalidKeys).toEqual(["bad-key"]);
  });

  it("throws when no valid config rows remain", async () => {
    const repository = new SharePointVerticalConfigRepository(
      createListClient([{ Enabled: true, Key: "bad-key", Title: "Invalid" }]),
      new SearchConfigDiagnosticsStore(),
      "hybrid"
    );

    await expect(repository.getVerticalConfigs()).rejects.toThrow(
      "No valid vertical configuration rows were found in SP_Search_Config."
    );
  });
});
