import { createSearchCompositionRoot } from "./createSearchCompositionRoot";

describe("createSearchCompositionRoot", () => {
  it("hydrates hybrid mode from SharePoint-backed config and validates deep links against loaded config", async () => {
    window.history.replaceState({}, "", "/search.aspx?q=benefits&v=people");

    const root = createSearchCompositionRoot({
      mode: "hybrid",
      sharePointListClient: {
        async getItems<TItem extends Record<string, unknown>>() {
          return [
            {
              DefaultVertical: true,
              Enabled: true,
              Key: "all",
              Kind: "synthetic-aggregate",
              SortOrder: 0,
              Title: "All"
            },
            {
              Enabled: true,
              Key: "news",
              ResultType: "news",
              SortOrder: 1,
              TemplateKey: "news",
              Title: "News"
            }
          ] as unknown as TItem[];
        }
      }
    });

    const initialized = await root.orchestrator.initialize(window.location.href);

    expect(initialized.verticals.map((vertical) => vertical.key)).toEqual(["all", "news"]);
    expect(initialized.selectedVerticalKey).toBe("all");
  });

  it("falls back to dummy config only when explicitly configured", async () => {
    const root = createSearchCompositionRoot({
      configFailureStrategy: "fallback-dummy",
      mode: "hybrid",
      sharePointListClient: {
        async getItems() {
          throw new Error("SharePoint unavailable");
        }
      }
    });

    const initialized = await root.orchestrator.initialize("https://contoso.sharepoint.com/search.aspx");

    expect(initialized.verticals.length).toBeGreaterThan(0);
    expect(root.diagnosticsStore.getSnapshot()?.usedFallback).toBe(true);
    expect(root.diagnosticsStore.getSnapshot()?.source).toBe("fallback-dummy");
  });

  it("routes only configured verticals through graph in real mode", async () => {
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
                    name: "Roadmap.xlsx",
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
    const root = createSearchCompositionRoot({
      graphSearchClient: {
        executeSearch
      },
      mode: "real",
      searchSourceOverrides: {
        files: "graph"
      },
      sharePointListClient: {
        async getItems<TItem extends Record<string, unknown>>() {
          return [
            {
              DefaultVertical: true,
              Enabled: true,
              Key: "all",
              Kind: "synthetic-aggregate",
              SortOrder: 0,
              Title: "All"
            },
            {
              Enabled: true,
              EntityTypes: "driveItem",
              FieldSelection: "name,webUrl,lastModifiedDateTime",
              Key: "files",
              Kind: "standard",
              ResultType: "file",
              SortOrder: 1,
              SupportsViewMore: true,
              TemplateKey: "files",
              Title: "Files"
            },
            {
              Enabled: true,
              EntityTypes: "person",
              FieldSelection: "displayName",
              Key: "people",
              Kind: "standard",
              ResultType: "person",
              SortOrder: 2,
              SupportsViewMore: true,
              TemplateKey: "people",
              Title: "People"
            }
          ] as unknown as TItem[];
        }
      }
    });

    const initialized = await root.orchestrator.initialize("https://contoso.sharepoint.com/search.aspx?q=roadmap&v=files");
    await root.orchestrator.execute("roadmap", "files", initialized.verticals);

    expect(executeSearch).toHaveBeenCalledTimes(1);
    expect(root.diagnosticsStore.getSearchSnapshot()?.entries.find((entry) => entry.verticalKey === "files")?.source).toBe("graph");
  });

  it("uses the mock HTTP path for dummy mode when a mock API client is provided", async () => {
    const root = createSearchCompositionRoot({
      mockApiClient: {
        async getConfig() {
          return {
            source: "mock-http",
            verticals: [
              {
                DefaultVertical: true,
                Enabled: true,
                Key: "all",
                Kind: "synthetic-aggregate",
                SortOrder: 0,
                Title: "All"
              },
              {
                Enabled: true,
                Key: "news",
                ResultType: "news",
                SectionAccentTone: "danger",
                SortOrder: 1,
                TemplateKey: "news",
                Title: "News"
              }
            ]
          };
        },
        async search() {
          return {
            items: [],
            requestDurationMs: 340,
            status: "success",
            total: 0,
            transport: "mock-http"
          };
        }
      },
      mode: "dummy"
    });

    const initialized = await root.orchestrator.initialize("https://contoso.sharepoint.com/search.aspx");

    expect(initialized.verticals.map((vertical) => vertical.key)).toEqual(["all", "news"]);
    expect(root.diagnosticsStore.getSnapshot()?.source).toBe("mock-http");
  });
});
