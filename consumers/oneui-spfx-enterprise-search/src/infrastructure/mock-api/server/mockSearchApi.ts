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

export const createMockSearchApiPlugin = (): Plugin => ({
  configureServer(server) {
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
