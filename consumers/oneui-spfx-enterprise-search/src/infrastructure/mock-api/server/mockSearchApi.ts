import type { ServerResponse } from "node:http";
import type { Plugin } from "vite";

import type { VerticalKey } from "../../../domain/search/models/verticalKey";
import { sampleSharePointConfigItems } from "../../config/dummy/sharePointConfigItems";
import { dummySearchData } from "../../search/dummy/dummySearchData";
import type {
  MockSearchConfigResponse,
  MockSearchDebugOptions,
  MockSearchQueryRequest,
  MockSearchQueryResponse
} from "../contracts/MockSearchApiTypes";

const DEFAULT_DELAY_MS = 360;
const DEFAULT_BANNER_DELAY_MS = 280;
const aggregateDelayByVertical: Record<Exclude<VerticalKey, "all">, number> = {
  files: 980,
  "it-hr-colleague-direct": 260,
  news: 540,
  people: 430,
  resources: 760,
  "sites-events": 690
};

const wait = async (delayMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

const parseDebugOptions = (url: URL): MockSearchDebugOptions => {
  const delayMs = Number(url.searchParams.get("mockDelayMs") ?? DEFAULT_DELAY_MS);
  const target = (url.searchParams.get("mockTarget") ?? undefined) as VerticalKey | "*" | undefined;
  const status = (url.searchParams.get("mockStatus") ?? undefined) as
    | "empty"
    | "error"
    | "request-error"
    | "success"
    | undefined;

  return {
    delayMs: Number.isNaN(delayMs) ? DEFAULT_DELAY_MS : delayMs,
    status,
    targetVerticalKey: target
  };
};

const resolveDelayMs = (
  requestedDelayMs: number | undefined,
  verticalKey?: Exclude<VerticalKey, "all">
): number => {
  if (typeof requestedDelayMs === "number" && requestedDelayMs !== DEFAULT_DELAY_MS) {
    return requestedDelayMs;
  }

  if (verticalKey) {
    return aggregateDelayByVertical[verticalKey] ?? DEFAULT_DELAY_MS;
  }

  return requestedDelayMs ?? DEFAULT_DELAY_MS;
};

const matchesTarget = (verticalKey: VerticalKey, targetVerticalKey?: VerticalKey | "*"): boolean =>
  !targetVerticalKey || targetVerticalKey === "*" || targetVerticalKey === verticalKey;

const sendJson = (response: ServerResponse, statusCode: number, payload: unknown): void => {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
};

const getBannerDebug = (url: URL, target: string): {
  delayMs: number;
  status?: "empty" | "error" | "success";
} => {
  const delayMs = Number(url.searchParams.get("bannerDelayMs") ?? DEFAULT_BANNER_DELAY_MS);
  const requestedTarget = url.searchParams.get("bannerTarget");
  const status = (url.searchParams.get("bannerStatus") ?? undefined) as
    | "empty"
    | "error"
    | "success"
    | undefined;

  return {
    delayMs: Number.isNaN(delayMs) ? DEFAULT_BANNER_DELAY_MS : delayMs,
    status: !requestedTarget || requestedTarget === target || requestedTarget === "*" ? status : undefined
  };
};

const getCycle = (): number => Math.floor(Date.now() / 1_000) % 8;

export const createMockSearchApiPlugin = (): Plugin => ({
  configureServer(server) {
    const useBannerEndpoint = (
      path: string,
      buildPayload: (cycle: number) => unknown,
      buildEmptyPayload: () => unknown
    ): void => {
      server.middlewares.use(path, async (request, response, next) => {
        if (request.method !== "GET" || !request.url) {
          next();
          return;
        }

        const url = new URL(request.url, "http://localhost");
        const target = path.replace("/api/banner/", "").replace(/\//g, ".");
        const debug = getBannerDebug(url, target);

        await wait(debug.delayMs);

        if (debug.status === "error") {
          sendJson(response, 500, {
            message: `Mock banner API request failed for ${path}.`
          });
          return;
        }

        sendJson(response, 200, debug.status === "empty" ? buildEmptyPayload() : buildPayload(getCycle()));
      });
    };

    useBannerEndpoint(
      "/api/banner/stock",
      (cycle) => ({
        changePercent: cycle % 2 === 0 ? "+0.42%" : "-0.18%",
        marketState: "LSE delayed",
        price: (222.22 + cycle / 10).toFixed(2),
        symbol: "BARC.L",
        updatedAt: new Date().toISOString()
      }),
      () => ({
        changePercent: "",
        marketState: "No market signal",
        price: "",
        symbol: "BARC.L",
        updatedAt: new Date().toISOString()
      })
    );

    useBannerEndpoint(
      "/api/banner/weather",
      (cycle) => ({
        condition: cycle % 2 === 0 ? "Mostly cloudy" : "Light rain",
        location: "London",
        temperature: 18 + (cycle % 5),
        updatedAt: new Date().toISOString()
      }),
      () => ({
        condition: "",
        location: "London",
        updatedAt: new Date().toISOString()
      })
    );

    useBannerEndpoint(
      "/api/banner/tasks/approvals",
      () => ({
        count: 0,
        description: "You have no approvals to review",
        headline: "Good news!",
        label: "Approvals",
        statusLabel: "No pending approvals",
        tone: "success",
        updatedAt: new Date().toISOString()
      }),
      () => ({
        count: 0,
        description: "No approval data available",
        headline: "No data",
        label: "Approvals",
        statusLabel: "No pending approvals",
        tone: "success",
        updatedAt: new Date().toISOString()
      })
    );

    useBannerEndpoint(
      "/api/banner/tasks/inbox",
      (cycle) => ({
        count: 23 + (cycle % 3),
        description: `${32 + (cycle % 4)} in total`,
        headline: `${23 + (cycle % 3)} overdue!`,
        label: "Tasks",
        statusLabel: "Overdue",
        tone: "danger",
        updatedAt: new Date().toISOString()
      }),
      () => ({
        count: 0,
        description: "No open tasks",
        headline: "All clear",
        label: "Tasks",
        statusLabel: "No open tasks",
        tone: "success",
        updatedAt: new Date().toISOString()
      })
    );

    useBannerEndpoint(
      "/api/banner/tasks/training",
      (cycle) => ({
        count: 8 + (cycle % 2),
        description: "Complete before the due date",
        headline: `${8 + (cycle % 2)} due soon`,
        label: "Mandatory training",
        statusLabel: "Approaching overdue",
        tone: "warning",
        updatedAt: new Date().toISOString()
      }),
      () => ({
        count: 0,
        description: "No mandatory training due",
        headline: "All clear",
        label: "Mandatory training",
        statusLabel: "No mandatory training due",
        tone: "success",
        updatedAt: new Date().toISOString()
      })
    );

    server.middlewares.use("/api/search/config", async (request, response, next) => {
      if (request.method !== "GET" || !request.url) {
        next();
        return;
      }

      const url = new URL(request.url, "http://localhost");
      const debug = parseDebugOptions(url);

      await wait(debug.delayMs ?? DEFAULT_DELAY_MS);

      const payload: MockSearchConfigResponse = {
        source: "mock-http",
        verticals: sampleSharePointConfigItems
      };

      sendJson(response, 200, payload);
    });

    server.middlewares.use("/api/search/query", async (request, response, next) => {
      if (request.method !== "POST" || !request.url) {
        next();
        return;
      }

      const url = new URL(request.url, "http://localhost");
      const debug = parseDebugOptions(url);
      const startedAt = Date.now();

      let body = "";
      request.on("data", (chunk) => {
        body += String(chunk);
      });

      request.on("end", async () => {
        const parsed = JSON.parse(body || "{}") as MockSearchQueryRequest;
        const verticalKey = parsed.verticalKey as Exclude<VerticalKey, "all">;

        await wait(resolveDelayMs(debug.delayMs, verticalKey));

        if (
          debug.status === "request-error" &&
          matchesTarget(parsed.verticalKey, debug.targetVerticalKey)
        ) {
          sendJson(response, 500, {
            message: `Mock API request failed for ${parsed.verticalKey}.`
          });
          return;
        }

        const isForcedEmpty =
          debug.status === "empty" && matchesTarget(parsed.verticalKey, debug.targetVerticalKey);
        const isForcedError =
          debug.status === "error" && matchesTarget(parsed.verticalKey, debug.targetVerticalKey);
        const isEmptyQuery = !parsed.queryText?.trim();
        const items = isEmptyQuery || isForcedEmpty ? [] : dummySearchData[verticalKey].slice(0, parsed.pageSize);

        const payload: MockSearchQueryResponse = {
          errorMessage: isForcedError ? `Mock API simulated an error for ${parsed.verticalKey}.` : undefined,
          items: isForcedError ? [] : items,
          requestDurationMs: Date.now() - startedAt,
          status: isForcedError ? "error" : items.length > 0 ? "success" : "empty",
          total: isForcedError ? 0 : items.length,
          transport: "mock-http"
        };

        sendJson(response, 200, payload);
      });
    });
  },
  name: "oneui-mock-search-api"
});
