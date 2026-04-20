import React from "react";
import { Avatar } from "@fluentui/react-components";
import { createCacheEngine, createIndexedDbCacheAdapter, type CachePolicy, type CacheScope } from "@functions-oneui/cache";
import { useCachedResource, type UseCachedResourceResult } from "@functions-oneui/cache-react";

import { OneUIBadge, OneUIText } from "@functions-oneui/atoms";
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";
import barclaysWordmark from "../assets/barclays-wordmark.svg";

type DemoRoute = "search" | "tasks" | "onboarding";

type IntranetTopShellProps = {
  onQueryChange: (value: string) => void;
  onRouteChange: (route: DemoRoute) => void;
  query: string;
  route: DemoRoute;
};

const utilityLinks = [
  "About Barclays",
  "Life at Barclays",
  "Common tasks",
  "DCW Programme",
  "Feedback"
] as const;

const navigationItems = [
  { count: undefined, id: "search" as const, label: "Home" },
  { count: undefined, id: null, label: "Barclays news" },
  { count: undefined, id: null, label: "My dashboard" },
  { count: 14, id: "tasks" as const, label: "Task 360" },
  { count: undefined, id: null, label: "My conversations" },
  { count: undefined, id: null, label: "My alerts" },
  { count: undefined, id: null, label: "My news" },
  { count: undefined, id: null, label: "Resources" },
  { count: undefined, id: null, label: "Phonebook" }
] as const;

type HeroTaskCard = {
  badge?: string;
  emphasis: "alert" | "default" | "outlined";
  summary: string;
  supportingAction: string;
  title: string;
};

type WeatherInsight = {
  condition: string;
  temperature: string;
};

type StockInsight = {
  price: string;
  symbol: string;
};

type HeroInsights = {
  cards: HeroTaskCard[];
  stock: StockInsight;
  weather: WeatherInsight;
};

const defaultHeroInsights: HeroInsights = {
  cards: [
    {
      badge: "Overdue",
      emphasis: "alert",
      summary: "9 items, 2 overdue",
      supportingAction: "View approvals",
      title: "Approvals"
    },
    {
      badge: undefined,
      emphasis: "default",
      summary: "3 to complete",
      supportingAction: "View tasks",
      title: "Tasks"
    },
    {
      badge: "Due this week",
      emphasis: "outlined",
      summary: "6 courses, 2 due this week",
      supportingAction: "View learning",
      title: "Learning"
    },
    {
      badge: undefined,
      emphasis: "default",
      summary: "2 requests in flight",
      supportingAction: "View requests",
      title: "My Request"
    }
  ],
  stock: {
    price: "222.22",
    symbol: "BARC.L"
  },
  weather: {
    condition: "Mostly cloudy",
    temperature: "22°C"
  }
};

const heroInsightsScope: CacheScope = {
  key: "search-home-banner",
  namespace: "hero-insights",
  segments: {
    app: "playground",
    product: "oneui"
  }
};

const heroInsightsPolicy: CachePolicy = {
  expireTimeMs: 5 * 60 * 1_000,
  staleTimeMs: 10_000,
  version: "phase-2-search-banner"
};

const heroCacheEngine = createCacheEngine({
  storage: createIndexedDbCacheAdapter({
    databaseName: "oneui-playground-search-banner-cache",
    storeName: "hero-insights"
  })
});

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const fetchHeroInsights = async (): Promise<HeroInsights> => {
  await wait(650);
  const cycle = Math.floor(Date.now() / 1_000) % 6;

  return {
    cards: [
      {
        badge: cycle % 2 === 0 ? "Overdue" : "Needs review",
        emphasis: "alert",
        summary: `${9 + (cycle % 2)} items, ${2 + (cycle % 2)} overdue`,
        supportingAction: "View approvals",
        title: "Approvals"
      },
      {
        badge: undefined,
        emphasis: "default",
        summary: `${3 + (cycle % 3)} to complete`,
        supportingAction: "View tasks",
        title: "Tasks"
      },
      {
        badge: "Due this week",
        emphasis: "outlined",
        summary: `${6 + (cycle % 2)} courses, 2 due this week`,
        supportingAction: "View learning",
        title: "Learning"
      },
      {
        badge: undefined,
        emphasis: "default",
        summary: `${2 + (cycle % 3)} requests in flight`,
        supportingAction: "View requests",
        title: "My Request"
      }
    ],
    stock: {
      price: (222.22 + cycle / 10).toFixed(2),
      symbol: "BARC.L"
    },
    weather: {
      condition: cycle % 2 === 0 ? "Mostly cloudy" : "Light rain",
      temperature: `${22 + (cycle % 3)}°C`
    }
  };
};

const getInsights = (resource: UseCachedResourceResult<HeroInsights>): HeroInsights =>
  resource.data ?? defaultHeroInsights;

const getCacheLabel = (resource: UseCachedResourceResult<HeroInsights>): string => {
  if (resource.isLoading) {
    return "Loading";
  }

  if (resource.isRefreshing) {
    return "Refreshing";
  }

  if (resource.lifecycleState === "stale") {
    return "Cached";
  }

  return resource.source === "cache" ? "Cached" : "Fresh";
};

const getCacheTone = (
  resource: UseCachedResourceResult<HeroInsights>
): "brand" | "neutral" | "success" | "warning" => {
  if (resource.isRefreshing) {
    return "brand";
  }

  if (resource.lifecycleState === "stale") {
    return "warning";
  }

  return resource.source === "network" ? "success" : "neutral";
};

const HeroWidgetSkeleton = (): React.JSX.Element => (
  <div className="connections-hero-widget-skeleton" aria-hidden="true">
    <span />
    <span />
  </div>
);

const HeroTaskCardSkeleton = (): React.JSX.Element => (
  <div className="connections-hero-action-card-skeleton" aria-hidden="true">
    <span />
    <span />
    <span />
  </div>
);

const HeroInsightBadge = ({
  resource
}: {
  resource: UseCachedResourceResult<HeroInsights>;
}): React.JSX.Element => (
  <OneUIBadge appearance="soft" size="sm" tone={getCacheTone(resource)}>
    {getCacheLabel(resource)}
  </OneUIBadge>
);

const HeroWeatherWidget = ({
  resource,
  weather
}: {
  resource: UseCachedResourceResult<HeroInsights>;
  weather: WeatherInsight;
}): React.JSX.Element => (
  <div className="connections-hero-widget" data-cache-state={resource.lifecycleState} data-cache-source={resource.source}>
    <WeatherIcon />
    <div className="connections-hero-widget-copy">
      {resource.isLoading ? (
        <HeroWidgetSkeleton />
      ) : (
        <>
          <strong>{weather.temperature}</strong>
          <span>{resource.isRefreshing ? "Refreshing weather" : weather.condition}</span>
        </>
      )}
    </div>
  </div>
);

const HeroStockWidget = ({
  resource,
  stock
}: {
  resource: UseCachedResourceResult<HeroInsights>;
  stock: StockInsight;
}): React.JSX.Element => (
  <div className="connections-hero-widget" data-cache-state={resource.lifecycleState} data-cache-source={resource.source}>
    <StockIcon />
    <div className="connections-hero-widget-copy">
      {resource.isLoading ? (
        <HeroWidgetSkeleton />
      ) : (
        <>
          <strong>{stock.price}</strong>
          <span>{resource.isRefreshing ? "Refreshing market" : stock.symbol}</span>
        </>
      )}
    </div>
  </div>
);

const HeroTaskActionCard = ({
  card,
  isLoading,
  isRefreshing,
  onRouteChange,
  resource
}: {
  card: HeroTaskCard;
  isLoading: boolean;
  isRefreshing: boolean;
  onRouteChange: (route: DemoRoute) => void;
  resource: UseCachedResourceResult<HeroInsights>;
}): React.JSX.Element => (
  <button
    className={`connections-hero-action-card connections-hero-action-card-${card.emphasis}`}
    data-cache-state={resource.lifecycleState}
    data-cache-source={resource.source}
    key={card.title}
    onClick={() => {
      if (card.title === "Tasks" || card.title === "Approvals") {
        onRouteChange("tasks");
      }
    }}
    type="button"
  >
    {isLoading ? (
      <HeroTaskCardSkeleton />
    ) : (
      <>
        <div className="connections-hero-action-card-header">
          <span className="connections-hero-action-card-title">{card.title}</span>
          {isRefreshing ? (
            <OneUIBadge appearance="soft" size="sm" tone="brand">
              Refreshing
            </OneUIBadge>
          ) : card.badge ? (
            <OneUIBadge
              appearance={card.emphasis === "alert" ? "filled" : "soft"}
              size="sm"
              tone={card.emphasis === "alert" ? "danger" : "warning"}
            >
              {card.badge}
            </OneUIBadge>
          ) : null}
        </div>
        <div className="connections-hero-action-card-summary">{card.summary}</div>
        <div className="connections-hero-action-card-link">
          <span>{card.supportingAction}</span>
          <span aria-hidden="true">›</span>
        </div>
      </>
    )}
  </button>
);

const useHeroInsights = (enabled: boolean): UseCachedResourceResult<HeroInsights> =>
  useCachedResource<HeroInsights>({
    enabled,
    engine: heroCacheEngine,
    fetcher: fetchHeroInsights,
    policy: heroInsightsPolicy,
    revalidateIfStale: true,
    scope: heroInsightsScope
  });

const WeatherIcon = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
    <path
      d="M5.4 13.4h7.1a2.7 2.7 0 0 0 .2-5.4 4 4 0 0 0-7.7-1.1A2.8 2.8 0 0 0 5.4 13.4Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path d="M5.2 2.3v1.5M2.2 5.2h1.5M14.3 5.2h1.5M12.8 2.9l-1 1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
  </svg>
);

const StockIcon = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
    <path d="M2.2 13.8h13.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    <path d="m4 11 3-3 2.4 2.3L14 5.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    <path d="M11.6 5.8H14v2.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

export const IntranetTopShell = ({
  onQueryChange,
  onRouteChange,
  query,
  route
}: IntranetTopShellProps): React.JSX.Element => {
  const isTaskRoute = route === "tasks";
  const isOnboardingRoute = route === "onboarding";
  const heroResource = useHeroInsights(!isTaskRoute && !isOnboardingRoute);
  const heroInsights = getInsights(heroResource);

  return (
    <div className="connections-shell-stack">
      <header className="connections-global-header">
        <div className="connections-global-brand">
          <img alt="Barclays" className="connections-global-brand-wordmark" src={barclaysWordmark} />
          <div className="connections-global-brand-copy">
            <span>Connections</span>
          </div>
        </div>

        <nav aria-label="Corporate links" className="connections-utility-nav">
          {utilityLinks.map((label) => (
            <button className="connections-utility-link" key={label} type="button">
              {label}
            </button>
          ))}
        </nav>

        <div className="connections-profile-area">
          <div className="connections-profile-summary">
            <Avatar
              badge={{ status: "available" }}
              color="colorful"
              initials="SI"
              name="Sabina"
              size={40}
            />
            <div className="connections-profile-copy">
              <span className="connections-profile-greeting">Hi Sabina</span>
              <button className="connections-profile-link" type="button">
                View profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Primary intranet navigation" className="connections-primary-nav">
        <div className="connections-primary-tab-row">
          {navigationItems.map((item) => {
            const isActive = item.id === route;

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={`connections-primary-tab ${isActive ? "connections-primary-tab-active" : ""}`}
                key={item.label}
                onClick={() => {
                  if (item.id) {
                    onRouteChange(item.id);
                  }
                }}
                type="button"
              >
                <span>{item.label}</span>
                {typeof item.count === "number" ? (
                  <span className="connections-primary-tab-badge">{item.count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="connections-route-switch" role="tablist" aria-label="Demo switch">
          <button
            aria-selected={route === "search"}
            className={`connections-route-switch-button ${route === "search" ? "connections-route-switch-button-active" : ""}`}
            onClick={() => {
              onRouteChange("search");
            }}
            role="tab"
            type="button"
          >
            Search
          </button>
          <button
            aria-selected={route === "tasks"}
            className={`connections-route-switch-button ${route === "tasks" ? "connections-route-switch-button-active" : ""}`}
            onClick={() => {
              onRouteChange("tasks");
            }}
            role="tab"
            type="button"
          >
            Task dashboard
          </button>
          <button
            aria-selected={route === "onboarding"}
            className={`connections-route-switch-button ${route === "onboarding" ? "connections-route-switch-button-active" : ""}`}
            onClick={() => {
              onRouteChange("onboarding");
            }}
            role="tab"
            type="button"
          >
            Onboarding
          </button>
        </div>
      </nav>

      <div className="connections-shell-banner">
        {isTaskRoute || isOnboardingRoute ? (
          <BrandedHeroBanner
            className="connections-task-banner"
            height="tiny"
            surfaceKey="heroSoft"
            title={isOnboardingRoute ? "Onboarding Demo" : "Task Inbox"}
          />
        ) : (
          <BrandedHeroBanner
            className="connections-hero"
            description="Welcome to Connections, how can we help you today?"
            footer={
              <div className="connections-hero-card-row">
                {heroInsights.cards.map((card) => (
                  <HeroTaskActionCard
                    card={card}
                    isLoading={heroResource.isLoading}
                    isRefreshing={heroResource.isRefreshing}
                    key={card.title}
                    onRouteChange={onRouteChange}
                    resource={heroResource}
                  />
                ))}
              </div>
            }
            headingLevel={1}
            height="comfortable"
            supportingContent={
              <div className="connections-hero-search-shell">
                <div className="connections-hero-search-bar">
                  <label className="connections-hero-search-category">
                    <span className="connections-hero-search-label">All</span>
                    <span aria-hidden="true" className="connections-hero-search-chevron">
                      ▾
                    </span>
                  </label>
                  <label className="connections-hero-search-input-wrap">
                    <input
                      aria-label="Search intranet"
                      className="connections-hero-search-input"
                      onChange={(event) => {
                        onQueryChange(event.target.value);
                      }}
                      placeholder="Search intranet"
                      type="text"
                      value={query}
                    />
                  </label>
                  <button
                    className="connections-hero-search-submit"
                    onClick={() => {
                      onRouteChange("search");
                    }}
                    type="button"
                  >
                    Search
                  </button>
                </div>
              </div>
            }
            surfaceKey="heroSecondary"
            title="Good afternoon, Sabina"
            topStart={
              <div className="connections-hero-widget-row">
                <HeroWeatherWidget resource={heroResource} weather={heroInsights.weather} />
                <HeroStockWidget resource={heroResource} stock={heroInsights.stock} />
              </div>
            }
            topEnd={
              <div className="connections-hero-meta-row">
                <OneUIText className="connections-hero-meta" tone="inverse">
                  Enterprise landing
                </OneUIText>
                <HeroInsightBadge resource={heroResource} />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};
