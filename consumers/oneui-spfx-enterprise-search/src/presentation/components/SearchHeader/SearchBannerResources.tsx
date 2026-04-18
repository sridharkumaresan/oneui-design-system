import * as React from "react";

import { useCachedResource } from "@functions-oneui/cache-react";
import { oneuiLightTheme } from "@functions-oneui/theme";

import { BannerResourceShell } from "./BannerResourceShell";
import {
  bannerCacheEngine,
  bannerPolicies,
  bannerRefreshIntervals,
  bannerScopes,
  fetchBannerApprovals,
  fetchBannerStock,
  fetchBannerTasks,
  fetchBannerTraining,
  fetchBannerWeather,
  type BannerStockResource,
  type BannerTaskResource,
  type BannerWeatherResource
} from "./bannerResources";
import styles from "../SearchPage/SearchPage.module.scss";

const classNames = styles as unknown as Record<string, string>;

type BannerThemeStyle = React.CSSProperties & Record<`--oneui-banner-${string}`, string>;

const themeValue = (key: string): string => {
  const value = oneuiLightTheme[key];

  return typeof value === "string" ? value : "";
};

const bannerThemeStyle: BannerThemeStyle = {
  "--oneui-banner-brand-bg": themeValue("colorBrandBackground"),
  "--oneui-banner-brand-border": themeValue("colorBrandStroke1"),
  "--oneui-banner-brand-fg": themeValue("colorNeutralForegroundOnBrand"),
  "--oneui-banner-danger-on-bg": themeValue("oneuiColorTextOnDanger"),
  "--oneui-banner-danger-border": themeValue("oneuiColorBorderDanger"),
  "--oneui-banner-danger-solid": themeValue("oneuiColorStatusDanger"),
  "--oneui-banner-neutral-bg": themeValue("oneuiColorBackgroundNeutralSubtle"),
  "--oneui-banner-neutral-border": themeValue("oneuiColorBorderNeutral"),
  "--oneui-banner-neutral-fg": themeValue("colorNeutralForeground1"),
  "--oneui-banner-success-on-bg": themeValue("oneuiColorTextOnSuccess"),
  "--oneui-banner-success-border": themeValue("oneuiColorBorderSuccess"),
  "--oneui-banner-success-solid": themeValue("oneuiColorStatusSuccess"),
  "--oneui-banner-warning-on-bg": themeValue("oneuiColorTextOnWarning"),
  "--oneui-banner-warning-border": themeValue("oneuiColorBorderWarning"),
  "--oneui-banner-warning-solid": themeValue("oneuiColorStatusWarning")
};

const StockIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
    <path d="M2.2 13.8h13.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    <path d="m4 11 3-3 2.4 2.3L14 5.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    <path d="M11.6 5.8H14v2.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const ApprovalsIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
    <circle cx="8" cy="8" r="6.1" stroke="currentColor" strokeWidth="1.35" />
    <path d="m5.3 8.1 1.8 1.8 3.8-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
  </svg>
);

const TasksIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
    <rect height="11" rx="1.8" stroke="currentColor" strokeWidth="1.35" width="9.8" x="3.1" y="2.6" />
    <path d="M5.4 6.1h5.2M5.4 8.5h5.2M5.4 10.9h3.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
  </svg>
);

const TrainingIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
    <path d="M2.1 5.8 8 3.1l5.9 2.7L8 8.5 2.1 5.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.35" />
    <path d="M4.3 7.1v3.1c0 1 1.7 2 3.7 2s3.7-1 3.7-2V7.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
  </svg>
);

const WeatherIcon = (): React.ReactElement => (
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

const UtilitySkeleton = (): React.ReactElement => (
  <div className={classNames.bannerUtilitySkeleton} aria-hidden="true">
    <span />
    <div>
      <span />
      <span />
    </div>
  </div>
);

const CardSkeleton = (): React.ReactElement => (
  <div className={classNames.bannerTaskSkeleton} aria-hidden="true">
    <span />
    <span />
    <span />
  </div>
);

const scheduledOptions = {
  keepStaleDataOnError: true,
  refreshWhenVisibleOnly: true,
  revalidateIfStale: true,
  revalidateOnVisible: true
} as const;

export const BannerStockWidget = (): React.ReactElement => {
  const stock = useCachedResource<BannerStockResource>({
    ...scheduledOptions,
    engine: bannerCacheEngine,
    fetcher: fetchBannerStock,
    isEmptyData: (data) => !data.price,
    policy: bannerPolicies.stock,
    refreshIntervalMs: bannerRefreshIntervals.stock,
    scope: bannerScopes.stock
  });

  return (
    <div style={bannerThemeStyle}>
      <BannerResourceShell
        ariaLabel="Stock market summary"
        emptyMessage="No market data"
        isEmptyData={(data) => !data.price}
        resource={stock}
        shell="utility"
        skeleton={<UtilitySkeleton />}
      >
        {(data) => (
          <>
            <span className={`${classNames.bannerUtilityIcon} ${classNames.bannerUtilityIconStock}`}>
              <StockIcon />
            </span>
            <div className={classNames.bannerUtilityCopy}>
              <strong>
                {data.price}
                <span className={classNames.bannerUtilityDelta}>{data.changePercent}</span>
              </strong>
              <span>{data.symbol}</span>
            </div>
          </>
        )}
      </BannerResourceShell>
    </div>
  );
};

export const BannerWeatherWidget = (): React.ReactElement => {
  const weather = useCachedResource<BannerWeatherResource>({
    ...scheduledOptions,
    engine: bannerCacheEngine,
    fetcher: fetchBannerWeather,
    isEmptyData: (data) => data.temperature === undefined,
    policy: bannerPolicies.weather,
    refreshIntervalMs: bannerRefreshIntervals.weather,
    scope: bannerScopes.weather
  });

  return (
    <div style={bannerThemeStyle}>
      <BannerResourceShell
        ariaLabel="Weather summary"
        emptyMessage="No weather data"
        isEmptyData={(data) => data.temperature === undefined}
        resource={weather}
        shell="utility"
        skeleton={<UtilitySkeleton />}
      >
        {(data) => (
          <>
            <span className={`${classNames.bannerUtilityIcon} ${classNames.bannerUtilityIconWeather}`}>
              <WeatherIcon />
            </span>
            <div className={classNames.bannerUtilityCopy}>
              <strong>{data.temperature}°C</strong>
              <span>{data.condition}</span>
            </div>
          </>
        )}
      </BannerResourceShell>
    </div>
  );
};

export const BannerUtilityStrip = (): React.ReactElement => (
  <div className={classNames.bannerUtilityStrip}>
    <BannerWeatherWidget />
    <BannerStockWidget />
  </div>
);

const BannerTaskCard = ({
  fetcher,
  icon,
  scope,
  title
}: {
  fetcher: () => Promise<BannerTaskResource>;
  icon: React.ReactNode;
  scope: (typeof bannerScopes)[keyof typeof bannerScopes];
  title: string;
}): React.ReactElement => {
  const resource = useCachedResource<BannerTaskResource>({
    ...scheduledOptions,
    engine: bannerCacheEngine,
    fetcher,
    isEmptyData: (data) => data.count === 0,
    policy: bannerPolicies.task,
    refreshIntervalMs: bannerRefreshIntervals.task,
    scope
  });

  return (
    <BannerResourceShell
      ariaLabel={`${title} summary`}
      emptyMessage="Nothing due"
      isEmptyData={() => false}
      resource={resource}
      shell="card"
      skeleton={<CardSkeleton />}
      tone={(data) => data?.tone ?? "brand"}
    >
      {(data) => (
        <div className={classNames.bannerTaskCardBody}>
          <div className={classNames.bannerTaskCardHeader}>
            <span className={classNames.bannerTaskCardIcon}>{icon}</span>
            <span className={classNames.bannerTaskCardTitle}>{data.label}</span>
          </div>
          <strong>{data.headline}</strong>
          <span className={classNames.bannerTaskCardSubtext}>{data.description}</span>
        </div>
      )}
    </BannerResourceShell>
  );
};

export const BannerTaskCards = (): React.ReactElement => (
  <div className={classNames.bannerTaskGrid} style={bannerThemeStyle}>
    <BannerTaskCard
      fetcher={fetchBannerApprovals}
      icon={<ApprovalsIcon />}
      scope={bannerScopes.approvals}
      title="Approvals"
    />
    <BannerTaskCard
      fetcher={fetchBannerTasks}
      icon={<TasksIcon />}
      scope={bannerScopes.tasks}
      title="Tasks"
    />
    <BannerTaskCard
      fetcher={fetchBannerTraining}
      icon={<TrainingIcon />}
      scope={bannerScopes.training}
      title="Mandatory training"
    />
  </div>
);
