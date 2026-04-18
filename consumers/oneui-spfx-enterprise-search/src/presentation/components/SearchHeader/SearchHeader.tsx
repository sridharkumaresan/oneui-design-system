import * as React from "react";

import { HeroBanner } from "@functions-oneui/organism-hero-banner";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";

import { BannerStockWidget, BannerTaskCards, BannerWeatherWidget } from "./SearchBannerResources";
import styles from "../SearchPage/SearchPage.module.scss";

type SearchHeaderProps = {
  onQueryChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  queryText: string;
  userDisplayName: string;
};

const scopeOptions = [
  {
    label: "All",
    value: "all"
  }
];

const classNames = styles as unknown as Record<string, string>;
const HeroBannerWithReactNodeTitle = HeroBanner as React.ComponentType<
  Omit<React.ComponentProps<typeof HeroBanner>, "title"> & { title: React.ReactNode }
>;

type TimeOfDay = "afternoon" | "evening" | "morning" | "night";

const getTimeOfDay = (date: Date): TimeOfDay => {
  const hour = date.getHours();

  if (hour < 12) {
    return "morning";
  }

  if (hour < 17) {
    return "afternoon";
  }

  if (hour < 21) {
    return "evening";
  }

  return "night";
};

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);

const useBannerTime = (): { period: TimeOfDay; timeLabel: string } => {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  return {
    period: getTimeOfDay(now),
    timeLabel: formatTime(now)
  };
};

const TimeOfDayIllustration = ({ period }: { period: TimeOfDay }): React.ReactElement => (
  <span
    aria-hidden="true"
    className={`${classNames.timeOfDayScene} ${classNames[`timeOfDayScene${period}`] ?? ""}`}
  >
    <svg className={classNames.timeOfDaySvg} focusable="false" viewBox="0 0 96 96">
      <circle className={classNames.timeOfDayHalo} cx="48" cy="48" r="34" />
      <g className={classNames.timeOfDaySun}>
        <circle cx="48" cy="48" r="13" />
        <path d="M48 14v14M48 68v14M14 48h14M68 48h14M24 24l10 10M62 62l10 10M72 24 62 34M34 62 24 72" />
      </g>
      <g className={classNames.timeOfDayCloud}>
        <path d="M18 58h26a9 9 0 0 0 .5-18 14 14 0 0 0-26.7 3.6A7.7 7.7 0 0 0 18 58Z" />
      </g>
      <g className={classNames.timeOfDayMoon}>
        <path d="M57 25c-10.4 4-15.4 15.6-11.3 26 3.8 9.7 14.1 14.8 23.9 12.3A25 25 0 1 1 57 25Z" />
      </g>
      <circle className={classNames.timeOfDayDotOne} cx="75" cy="30" r="3" />
      <circle className={classNames.timeOfDayDotTwo} cx="25" cy="28" r="2.5" />
    </svg>
  </span>
);

const WelcomeTitle = ({
  period,
  timeLabel,
  userDisplayName
}: {
  period: TimeOfDay;
  timeLabel: string;
  userDisplayName: string;
}): React.ReactElement => (
  <span className={classNames.welcomeTitle}>
    <TimeOfDayIllustration period={period} />
    <span className={classNames.welcomeCopy}>
      <span className={classNames.welcomeHeading}>
        Good {period}, <span>{userDisplayName}</span>
      </span>
      <span className={classNames.welcomeMeta}>
        <span>Welcome to Connections</span>
        <span aria-hidden="true">•</span>
        <time>{timeLabel}</time>
      </span>
    </span>
  </span>
);

export const SearchHeader = (props: SearchHeaderProps): React.ReactElement => {
  const { onQueryChange, onSubmit, queryText, userDisplayName } = props;
  const bannerTime = useBannerTime();

  return (
    <HeroBannerWithReactNodeTitle
      className={styles.heroBanner}
      contentTone="inverse"
      data-search-onboarding="search"
      description={null}
      height="comfortable"
      supportingContent={
        <div className={styles.bannerContentRail}>
          <div className={styles.searchSurface}>
            <SearchAutocomplete
              emptyStateText={null}
              formAriaLabel="Enterprise search"
              inputAriaLabel="Search"
              onQueryChange={onQueryChange}
              onSubmit={() => onSubmit().then(() => undefined)}
              placeholder="Search intranet"
              query={queryText}
              scopeAriaLabel="Search scope"
              scopeOptions={scopeOptions}
              scopeValue="all"
              submitLabel="Search"
            />
          </div>
          <BannerTaskCards />
        </div>
      }
      surfaceKey="gradientNavyCyan"
      title={
        <WelcomeTitle
          period={bannerTime.period}
          timeLabel={bannerTime.timeLabel}
          userDisplayName={userDisplayName}
        />
      }
      topEnd={<BannerStockWidget />}
      topStart={<BannerWeatherWidget />}
    />
  );
};
