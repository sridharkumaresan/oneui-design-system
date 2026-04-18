import { createCacheEngine, createIndexedDbCacheAdapter, type CachePolicy, type CacheScope } from "@functions-oneui/cache";

export type BannerStockResource = {
  changePercent: string;
  marketState: string;
  price: string;
  symbol: string;
  updatedAt: string;
};

export type BannerWeatherResource = {
  condition: string;
  location: string;
  temperature?: number;
  updatedAt: string;
};

export type BannerTaskResource = {
  count: number;
  description: string;
  headline: string;
  label: string;
  statusLabel: string;
  tone: "brand" | "danger" | "success" | "warning";
  updatedAt: string;
};

export const bannerCacheEngine = createCacheEngine({
  storage: createIndexedDbCacheAdapter({
    databaseName: "oneui-spfx-banner-resource-cache",
    storeName: "banner-resources"
  })
});

export const bannerScopes = {
  approvals: {
    key: "approvals",
    namespace: "banner-tasks",
    segments: {
      site: "enterprise-search",
      tenant: "barclays"
    }
  },
  stock: {
    key: "barc-l",
    namespace: "banner-stock",
    segments: {
      site: "enterprise-search",
      tenant: "barclays"
    }
  },
  tasks: {
    key: "inbox",
    namespace: "banner-tasks",
    segments: {
      site: "enterprise-search",
      tenant: "barclays"
    }
  },
  training: {
    key: "mandatory-training",
    namespace: "banner-tasks",
    segments: {
      site: "enterprise-search",
      tenant: "barclays"
    }
  },
  weather: {
    key: "london",
    namespace: "banner-weather",
    segments: {
      site: "enterprise-search",
      tenant: "barclays"
    }
  }
} satisfies Record<string, CacheScope>;

export const bannerPolicies = {
  stock: {
    expireTimeMs: 2 * 60_000,
    staleTimeMs: 5_000,
    version: "consumer-banner-v3"
  },
  task: {
    expireTimeMs: 5 * 60_000,
    staleTimeMs: 5_000,
    version: "consumer-banner-v3"
  },
  weather: {
    expireTimeMs: 10 * 60_000,
    staleTimeMs: 5_000,
    version: "consumer-banner-v3"
  }
} satisfies Record<string, CachePolicy>;

export const bannerRefreshIntervals = {
  stock: 10_000,
  task: 10_000,
  weather: 10_000
} as const;

const withBannerDebugParams = (path: string): string => {
  const browserSearch = typeof window === "undefined" ? "" : window.location.search;
  const sourceParams = new URLSearchParams(browserSearch);
  const targetParams = new URLSearchParams();

  ["bannerDelayMs", "bannerStatus", "bannerTarget"].forEach((key) => {
    const value = sourceParams.get(key);
    if (value) {
      targetParams.set(key, value);
    }
  });

  const queryString = targetParams.toString();

  return queryString ? `${path}?${queryString}` : path;
};

const readJson = async <TResponse>(path: string): Promise<TResponse> => {
  const response = await fetch(withBannerDebugParams(path), {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Banner resource request failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
};

export const fetchBannerStock = (): Promise<BannerStockResource> =>
  readJson<BannerStockResource>("/api/banner/stock");

export const fetchBannerWeather = (): Promise<BannerWeatherResource> =>
  readJson<BannerWeatherResource>("/api/banner/weather");

export const fetchBannerApprovals = (): Promise<BannerTaskResource> =>
  readJson<BannerTaskResource>("/api/banner/tasks/approvals");

export const fetchBannerTasks = (): Promise<BannerTaskResource> =>
  readJson<BannerTaskResource>("/api/banner/tasks/inbox");

export const fetchBannerTraining = (): Promise<BannerTaskResource> =>
  readJson<BannerTaskResource>("/api/banner/tasks/training");
