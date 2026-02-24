// @ts-nocheck
import React from "react";

import {
  Badge,
  Button,
  Input,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens
} from "@fluentui/react-components";

import { SmartSection } from "./SmartSection.js";

const SECTION_IDS = {
  itHr: "it-hr",
  sitesEvents: "sites-events",
  kbFaq: "kb-faq",
  serviceNow: "servicenow",
  recommendations: "recommendations",
  people: "people",
  files: "files",
  news: "news",
  videos: "videos"
};

const DEFAULT_QUERY = "annual leave";
const SHOWCASE_EMPTY_KEYWORD = "all-empty";
const DEFAULT_API_BASE_URL = "http://localhost:7001";

const useStyles = makeStyles({
  page: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "min(1320px, 100%)",
    display: "grid",
    gap: tokens.spacingVerticalL,
    paddingTop: tokens.spacingVerticalL,
    paddingRight: tokens.spacingHorizontalL,
    paddingBottom: tokens.spacingVerticalXXL,
    paddingLeft: tokens.spacingHorizontalL
  },
  queryForm: {
    display: "grid",
    gap: tokens.spacingVerticalS
  },
  queryRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: tokens.spacingHorizontalM,
    alignItems: "center"
  },
  helperText: {
    color: tokens.colorNeutralForeground3
  },
  summaryBanner: {
    display: "grid",
    gap: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForeground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", tokens.colorBrandStroke2),
    paddingTop: tokens.spacingVerticalM,
    paddingRight: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM
  },
  summaryMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalXS
  },
  emptyState: {
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    paddingTop: tokens.spacingVerticalL,
    paddingRight: tokens.spacingHorizontalL,
    paddingBottom: tokens.spacingVerticalL,
    paddingLeft: tokens.spacingHorizontalL
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: tokens.spacingHorizontalL,
    alignItems: "start",
    "@media (min-width: 1040px)": {
      gridTemplateColumns: "minmax(0, 1.857fr) minmax(0, 1fr)"
    }
  },
  columnStack: {
    display: "grid",
    gap: tokens.spacingVerticalL,
    minWidth: 0
  },
  rowBase: {
    display: "grid",
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box"
  },
  rowPrimary: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box"
  },
  rowTitle: {
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    minWidth: 0,
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  rowSecondary: {
    color: tokens.colorNeutralForeground3,
    minWidth: 0,
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  circle: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    flexShrink: 0
  },
  fileBadge: {
    minWidth: "42px",
    textAlign: "center",
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase100,
    paddingTop: "2px",
    paddingRight: tokens.spacingHorizontalXS,
    paddingBottom: "2px",
    paddingLeft: tokens.spacingHorizontalXS
  }
});

const getApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return DEFAULT_API_BASE_URL;
  }

  const override = window.__ONEUI_MOCK_API_BASE_URL__;

  if (typeof override === "string" && override.trim().length > 0) {
    return override.trim();
  }

  return DEFAULT_API_BASE_URL;
};

const getInitials = (text) => {
  const parts = String(text ?? "")
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "??";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const toMode = ({ sectionId, query, isRetry, requestKey }) => {
  const normalized = String(query ?? "")
    .trim()
    .toLowerCase();
  const requestIndex = Number(requestKey ?? 0);

  if (normalized.includes(SHOWCASE_EMPTY_KEYWORD)) {
    return "empty";
  }

  if (sectionId === SECTION_IDS.serviceNow) {
    return isRetry ? "success" : "error";
  }

  if (sectionId === SECTION_IDS.recommendations) {
    return "empty";
  }

  if (sectionId === SECTION_IDS.videos) {
    return "slow";
  }

  if (sectionId === SECTION_IDS.files && normalized.length > 0 && requestIndex > 1) {
    return "slow";
  }

  return "success";
};

const toDelayMs = ({ sectionId, mode }) => {
  if (mode === "slow") {
    return sectionId === SECTION_IDS.videos ? 2600 : 1800;
  }

  if (mode === "error") {
    return 300;
  }

  return 850;
};

const createSectionFetcher = ({ apiBaseUrl, sectionId, endpoint }) => {
  return async ({ requestKey, requestParams, signal, isRetry }) => {
    const query = String(requestParams?.q ?? "");
    const mode = toMode({ sectionId, query, isRetry, requestKey });
    const delayMs = toDelayMs({ sectionId, mode });
    const url = new URL(`/api/${endpoint}`, apiBaseUrl);

    if (query.trim().length > 0) {
      url.searchParams.set("q", query.trim());
    }

    url.searchParams.set("mode", mode);
    url.searchParams.set("delayMs", String(delayMs));

    const response = await fetch(url.toString(), { signal });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (sectionId === SECTION_IDS.serviceNow) {
        throw new Error("Could not reach ServiceNow. Try again in a moment.");
      }

      throw new Error(String(payload?.error || `Could not load ${endpoint}`));
    }

    const items = Array.isArray(payload?.items) ? payload.items : [];
    const totalCount = typeof payload?.totalCount === "number" ? payload.totalCount : items.length;

    return {
      items,
      totalCount
    };
  };
};

const SearchLayoutShowcasePage = () => {
  const styles = useStyles();
  const apiBaseUrl = React.useMemo(() => getApiBaseUrl(), []);
  const [draftQuery, setDraftQuery] = React.useState(DEFAULT_QUERY);
  const [submittedQuery, setSubmittedQuery] = React.useState(DEFAULT_QUERY);
  const [requestKey, setRequestKey] = React.useState(1);
  const [settledState, setSettledState] = React.useState({});

  const sectionSpecs = React.useMemo(() => {
    const renderItHrItem = (item) => {
      return (
        <div className={styles.rowBase}>
          <div className={styles.rowPrimary}>
            <span className={styles.circle}>{getInitials(item?.ownerTeam)}</span>
            <Text className={styles.rowTitle}>{item?.title}</Text>
          </div>
          <Text size={200} className={styles.rowSecondary}>
            {item?.ownerTeam} · Updated {item?.updatedAt}
          </Text>
        </div>
      );
    };

    const renderSitesEventsItem = (item) => {
      return (
        <div className={styles.rowBase}>
          <div className={styles.rowPrimary}>
            <span className={styles.circle}>{getInitials(item?.site)}</span>
            <Text className={styles.rowTitle}>{item?.title}</Text>
          </div>
          <Text size={200} className={styles.rowSecondary}>
            {item?.site} · {item?.type} · {item?.startAt}
          </Text>
        </div>
      );
    };

    const renderKbFaqItem = (item) => {
      return (
        <div className={styles.rowBase}>
          <Text className={styles.rowTitle}>Q: {item?.question}</Text>
          <Text size={200} className={styles.rowSecondary}>
            {item?.topic} · Reviewed {item?.lastReviewed}
          </Text>
        </div>
      );
    };

    const renderServiceNowItem = (item) => {
      return (
        <div className={styles.rowBase}>
          <Text className={styles.rowTitle}>
            {item?.ticket} · {item?.summary}
          </Text>
          <Text size={200} className={styles.rowSecondary}>
            Priority {item?.priority} · {item?.state}
          </Text>
        </div>
      );
    };

    const renderRecommendationsItem = (item) => {
      return (
        <div className={styles.rowBase}>
          <Text className={styles.rowTitle}>{item?.title}</Text>
          <Text size={200} className={styles.rowSecondary}>
            {item?.reason}
          </Text>
        </div>
      );
    };

    const renderPeopleItem = (item) => {
      return (
        <div className={styles.rowPrimary}>
          <span className={styles.circle}>{getInitials(item?.name)}</span>
          <div className={styles.rowBase}>
            <Text className={styles.rowTitle}>{item?.name}</Text>
            <Text size={200} className={styles.rowSecondary}>
              {item?.title} · {item?.department}
            </Text>
          </div>
        </div>
      );
    };

    const renderFilesItem = (item) => {
      return (
        <div className={styles.rowPrimary}>
          <span className={styles.fileBadge}>
            {String(item?.kind ?? "file")
              .slice(0, 3)
              .toUpperCase()}
          </span>
          <div className={styles.rowBase}>
            <Text className={styles.rowTitle}>{item?.name}</Text>
            <Text size={200} className={styles.rowSecondary}>
              Modified {item?.lastModified} by {item?.owner}
            </Text>
          </div>
        </div>
      );
    };

    const renderNewsItem = (item) => {
      return (
        <div className={styles.rowBase}>
          <Text className={styles.rowTitle}>{item?.headline}</Text>
          <Text size={200} className={styles.rowSecondary}>
            {item?.category} · {item?.author} · {item?.publishedAt}
          </Text>
        </div>
      );
    };

    const renderVideosItem = (item) => {
      return (
        <div className={styles.rowBase}>
          <Text className={styles.rowTitle}>{item?.title}</Text>
          <Text size={200} className={styles.rowSecondary}>
            {item?.channel} · {item?.duration} · {item?.publishedAt}
          </Text>
        </div>
      );
    };

    return [
      {
        id: SECTION_IDS.itHr,
        endpoint: "it-hr",
        title: "IT, HR and Colleague Direct",
        column: "left",
        initialVisibleCount: 1,
        rowHeightPx: 82,
        renderItem: renderItHrItem
      },
      {
        id: SECTION_IDS.sitesEvents,
        endpoint: "sites-events",
        title: "Sites and Events",
        column: "left",
        initialVisibleCount: 3,
        rowHeightPx: 88,
        renderItem: renderSitesEventsItem
      },
      {
        id: SECTION_IDS.kbFaq,
        endpoint: "kb-faq",
        title: "Knowledge Base / FAQ",
        column: "left",
        initialVisibleCount: 2,
        rowHeightPx: 82,
        renderItem: renderKbFaqItem
      },
      {
        id: SECTION_IDS.serviceNow,
        endpoint: "servicenow",
        title: "ServiceNow",
        column: "left",
        initialVisibleCount: 2,
        rowHeightPx: 78,
        renderItem: renderServiceNowItem
      },
      {
        id: SECTION_IDS.recommendations,
        endpoint: "recommendations",
        title: "Recommendations",
        column: "left",
        initialVisibleCount: 2,
        rowHeightPx: 74,
        renderItem: renderRecommendationsItem,
        renderEmpty: () => (
          <Text className={styles.rowSecondary}>
            No personalised recommendations found for this query.
          </Text>
        )
      },
      {
        id: SECTION_IDS.people,
        endpoint: "people",
        title: "People",
        column: "right",
        initialVisibleCount: 5,
        rowHeightPx: 86,
        renderItem: renderPeopleItem
      },
      {
        id: SECTION_IDS.files,
        endpoint: "files",
        title: "Files",
        column: "right",
        initialVisibleCount: 4,
        rowHeightPx: 86,
        renderItem: renderFilesItem
      },
      {
        id: SECTION_IDS.news,
        endpoint: "news",
        title: "News",
        column: "right",
        initialVisibleCount: 3,
        rowHeightPx: 86,
        renderItem: renderNewsItem
      },
      {
        id: SECTION_IDS.videos,
        endpoint: "videos",
        title: "Videos",
        column: "right",
        initialVisibleCount: 2,
        rowHeightPx: 84,
        slowThresholdMs: 700,
        renderItem: renderVideosItem
      }
    ];
  }, [styles]);

  const sectionsByColumn = React.useMemo(() => {
    return {
      left: sectionSpecs.filter((section) => section.column === "left"),
      right: sectionSpecs.filter((section) => section.column === "right")
    };
  }, [sectionSpecs]);

  const requestParams = React.useMemo(
    () => ({
      q: submittedQuery
    }),
    [submittedQuery]
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSubmittedQuery(draftQuery.trim());
    setRequestKey((currentKey) => currentKey + 1);
    setSettledState({});
  };

  const attachSectionEvent = React.useCallback((sectionId) => {
    return (event) => {
      if (event.type !== "settled") {
        return;
      }

      setSettledState((currentState) => {
        return {
          ...currentState,
          [sectionId]: {
            requestKey: event.requestKey,
            status: event.status,
            itemCount: event.itemCount
          }
        };
      });
    };
  }, []);

  const settledEntries = React.useMemo(() => {
    return sectionSpecs
      .map((section) => settledState[section.id])
      .filter((entry) => entry && Object.is(entry.requestKey, requestKey));
  }, [requestKey, sectionSpecs, settledState]);

  const settledCount = settledEntries.length;
  const successCount = settledEntries.filter((entry) => entry.status === "success").length;
  const errorCount = settledEntries.filter((entry) => entry.status === "error").length;
  const emptyCount = settledEntries.filter((entry) => entry.status === "empty").length;
  const pendingCount = sectionSpecs.length - settledCount;
  const loadedItems = settledEntries.reduce((total, entry) => {
    return entry.status === "success" ? total + entry.itemCount : total;
  }, 0);

  const showParentEmptyState =
    settledCount === sectionSpecs.length &&
    settledEntries.length > 0 &&
    settledEntries.every((entry) => entry.status === "empty");

  const summaryText = `Query: "${submittedQuery || "(blank)"}" • ${loadedItems} loaded items across ${sectionSpecs.length} sections`;

  return (
    <div className={styles.page}>
      <form className={styles.queryForm} onSubmit={handleSearchSubmit}>
        <div className={styles.queryRow}>
          <Input
            value={draftQuery}
            onChange={(_, data) => setDraftQuery(data.value)}
            placeholder="Search across people, files, news, knowledge..."
            aria-label="Showcase query"
          />
          <Button appearance="primary" type="submit">
            Search
          </Button>
        </div>
        <Text size={200} className={styles.helperText}>
          Submit a new query to trigger one shared requestKey refresh across all sections. Use "
          {SHOWCASE_EMPTY_KEYWORD}" to force a showcase-level empty state.
        </Text>
      </form>

      <section className={styles.summaryBanner} aria-live="polite">
        <Text weight="semibold">Search Layout Summary</Text>
        <Text size={200}>{summaryText}</Text>
        <div className={styles.summaryMeta}>
          <Badge appearance="tint">Success {successCount}</Badge>
          <Badge appearance="filled">Empty {emptyCount}</Badge>
          <Badge appearance="outline">Error {errorCount}</Badge>
          {pendingCount > 0 ? <Badge appearance="ghost">Pending {pendingCount}</Badge> : null}
          {pendingCount > 0 ? <Spinner size="tiny" /> : null}
        </div>
      </section>

      {showParentEmptyState ? (
        <section className={styles.emptyState}>
          <Text weight="semibold">No cross-source results for this query.</Text>
          <Text size={200}>
            Refine the search phrase or remove "{SHOWCASE_EMPTY_KEYWORD}" to repopulate source
            sections.
          </Text>
        </section>
      ) : null}

      <div className={styles.columns}>
        <div className={styles.columnStack}>
          {sectionsByColumn.left.map((section) => (
            <SmartSection
              key={section.id}
              sectionId={section.id}
              title={section.title}
              requestKey={requestKey}
              requestParams={requestParams}
              enabled={true}
              keepPreviousData={true}
              skeletonizeHeaderOnInitialLoad={true}
              slowThresholdMs={section.slowThresholdMs ?? 1200}
              rowHeightPx={section.rowHeightPx}
              initialVisibleCount={section.initialVisibleCount}
              viewMoreLabel="View more"
              viewMoreHref={`/showcase/${section.id}?q=${encodeURIComponent(submittedQuery || "")}`}
              fetcher={createSectionFetcher({
                apiBaseUrl,
                sectionId: section.id,
                endpoint: section.endpoint
              })}
              renderItem={section.renderItem}
              renderEmpty={section.renderEmpty}
              onEvent={attachSectionEvent(section.id)}
            />
          ))}
        </div>
        <div className={styles.columnStack}>
          {sectionsByColumn.right.map((section) => (
            <SmartSection
              key={section.id}
              sectionId={section.id}
              title={section.title}
              requestKey={requestKey}
              requestParams={requestParams}
              enabled={true}
              keepPreviousData={true}
              skeletonizeHeaderOnInitialLoad={true}
              slowThresholdMs={section.slowThresholdMs ?? 1200}
              rowHeightPx={section.rowHeightPx}
              initialVisibleCount={section.initialVisibleCount}
              viewMoreLabel="View more"
              viewMoreHref={`/showcase/${section.id}?q=${encodeURIComponent(submittedQuery || "")}`}
              fetcher={createSectionFetcher({
                apiBaseUrl,
                sectionId: section.id,
                endpoint: section.endpoint
              })}
              renderItem={section.renderItem}
              renderEmpty={section.renderEmpty}
              onEvent={attachSectionEvent(section.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Showcases/Search Layout Showcase",
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

export const SearchLayout = {
  render: () => <SearchLayoutShowcasePage />
};
