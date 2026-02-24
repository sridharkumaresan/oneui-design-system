import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, "..", "data");

const DEFAULT_PORT = 7001;
const DEFAULT_DELAY_MS = 120;
const DEFAULT_SLOW_DELAY_MS = 1800;
const MAX_DELAY_MS = 30000;
const endpointNames = [
  "people",
  "files",
  "news",
  "videos",
  "it-hr",
  "sites-events",
  "kb-faq",
  "servicenow",
  "recommendations"
];

const parseJsonFile = (filename) => {
  const raw = readFileSync(join(dataDir, `${filename}.json`), "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array in ${filename}.json`);
  }

  return parsed;
};

const datasets = Object.fromEntries(endpointNames.map((name) => [name, parseJsonFile(name)]));

const allowedOrigins = (process.env.MOCK_API_CORS_ORIGINS ??
  "http://localhost:6006,http://127.0.0.1:6006")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const getCorsOrigin = (requestOrigin) => {
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] ?? "*";
};

const setCorsHeaders = (res, requestOrigin) => {
  const origin = getCorsOrigin(requestOrigin);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
};

const sendJson = (res, statusCode, payload, requestOrigin) => {
  setCorsHeaders(res, requestOrigin);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const toMode = (modeParam) => {
  if (modeParam === "slow" || modeParam === "empty" || modeParam === "error") {
    return modeParam;
  }

  return "success";
};

const toDelayMs = (mode, delayMsParam) => {
  if (delayMsParam == null) {
    return mode === "slow" ? DEFAULT_SLOW_DELAY_MS : DEFAULT_DELAY_MS;
  }

  const parsed = Number(delayMsParam);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return mode === "slow" ? DEFAULT_SLOW_DELAY_MS : DEFAULT_DELAY_MS;
  }

  return Math.min(MAX_DELAY_MS, Math.floor(parsed));
};

const filterItems = (items, q) => {
  if (!q) {
    return items;
  }

  const normalized = q.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) => JSON.stringify(item).toLowerCase().includes(normalized));
};

const server = createServer(async (req, res) => {
  const requestOrigin = req.headers.origin;

  if (req.method === "OPTIONS") {
    setCorsHeaders(res, requestOrigin);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    sendJson(
      res,
      405,
      {
        error: "Method Not Allowed"
      },
      requestOrigin
    );
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const path = url.pathname.replace(/\/+$/, "");

  if (path === "" || path === "/") {
    sendJson(
      res,
      200,
      {
        service: "@functions-oneui/mock-api",
        endpoints: endpointNames.map((name) => `/api/${name}`),
        modes: ["success", "slow", "empty", "error"]
      },
      requestOrigin
    );
    return;
  }

  if (path === "/health") {
    sendJson(res, 200, { ok: true }, requestOrigin);
    return;
  }

  const endpoint = path.startsWith("/api/") ? path.slice("/api/".length) : path.slice(1);

  if (!endpointNames.includes(endpoint)) {
    sendJson(
      res,
      404,
      {
        error: "Not Found",
        message: `Unknown endpoint '${endpoint}'.`
      },
      requestOrigin
    );
    return;
  }

  const mode = toMode(url.searchParams.get("mode"));
  const delayMs = toDelayMs(mode, url.searchParams.get("delayMs"));
  const q = url.searchParams.get("q");
  const sourceItems = datasets[endpoint];
  const filteredItems = filterItems(sourceItems, q);

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (mode === "error") {
    sendJson(
      res,
      500,
      {
        error: "Demo error mode requested",
        endpoint,
        mode
      },
      requestOrigin
    );
    return;
  }

  const items = mode === "empty" ? [] : filteredItems;

  sendJson(
    res,
    200,
    {
      endpoint,
      mode,
      q: q ?? "",
      delayMs,
      totalCount: items.length,
      items
    },
    requestOrigin
  );
});

const port = Number.parseInt(process.env.MOCK_API_PORT ?? "", 10) || DEFAULT_PORT;

server.listen(port, () => {
  console.warn(`[mock-api] listening on http://localhost:${port}`);
  console.warn(`[mock-api] allowed origins: ${allowedOrigins.join(", ")}`);
});
