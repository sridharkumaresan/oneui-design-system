import { HttpMockSearchApiClient } from "./HttpMockSearchApiClient";

describe("HttpMockSearchApiClient", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("loads config from the mock HTTP endpoint", async () => {
    global.fetch = jest.fn(async () =>
      ({
        json: async () => ({
          source: "mock-http",
          verticals: [{ Enabled: true, Key: "all", Kind: "synthetic-aggregate", Title: "All" }]
        }),
        ok: true
      }) as Response
    );

    const client = new HttpMockSearchApiClient("/api/search");
    const response = await client.getConfig();

    expect(global.fetch).toHaveBeenCalledWith("/api/search/config", {
      headers: {
        Accept: "application/json"
      }
    });
    expect(response.source).toBe("mock-http");
    expect(response.verticals.length).toBe(1);
  });

  it("posts search requests to the mock HTTP endpoint", async () => {
    global.fetch = jest.fn(async () =>
      ({
        json: async () => ({
          items: [],
          requestDurationMs: 380,
          status: "success",
          total: 0,
          transport: "mock-http"
        }),
        ok: true
      }) as Response
    );

    const client = new HttpMockSearchApiClient("/api/search", () => ({
      delayMs: 900,
      status: "empty",
      targetVerticalKey: "news"
    }));

    await client.search({
      pageSize: 3,
      queryText: "benefits",
      verticalKey: "news"
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/search/query?mockDelayMs=900&mockStatus=empty&mockTarget=news", {
      body: JSON.stringify({
        pageSize: 3,
        queryText: "benefits",
        verticalKey: "news"
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      method: "POST"
    });
  });
});
