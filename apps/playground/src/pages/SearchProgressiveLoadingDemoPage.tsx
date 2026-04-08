import React from "react";

import {
  OneUIBadge,
  OneUIButton,
  OneUIHeading,
  OneUIInput,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";
import {
  SmartLoadingSection
} from "@functions-oneui/organism-smart-loading-container";
import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";
import {
  useLoadingCoordinator
} from "@functions-oneui/react-utils/progressive-loading";

import {
  searchDemoPresetStates,
  searchDemoPresetTimelines,
  searchDemoPresets,
  searchDemoResultStats,
  searchDemoSections,
  type SearchDemoItem,
  type SearchDemoPresetId,
  type SearchDemoSectionId,
  type SearchDemoVisualState
} from "../mocks/searchDemo.js";

const fixtureMap = new Map(searchDemoSections.map((section) => [section.id, section]));
const sectionDefinitions = searchDemoSections.map((section) => ({
  id: section.id,
  order: section.order,
  title: section.title
}));
const loadingStateMap = Object.fromEntries(
  searchDemoSections.map((section) => [section.id, "loading"])
) as Record<SearchDemoSectionId, SearchDemoVisualState>;

const resolveTargetVisualState = (
  state: SearchDemoVisualState,
  globalEmpty: boolean
): SearchDemoVisualState => {
  return globalEmpty && state === "loaded" ? "empty" : state;
};

const getSectionAvatarLabel = (id: SearchDemoSectionId): string => {
  switch (id) {
    case "service-now":
      return "SN";
    case "it-hr":
      return "IT";
    default:
      return id.slice(0, 1).toUpperCase();
  }
};

const getAccentTone = (
  accent: "blue" | "green" | "orange" | "purple" | "red"
): "brand" | "info" | "success" | "warning" | "danger" => {
  switch (accent) {
    case "green":
      return "success";
    case "orange":
      return "warning";
    case "red":
      return "danger";
    case "blue":
      return "info";
    case "purple":
    default:
      return "brand";
  }
};

const renderSectionItems = (items: SearchDemoItem[]): React.ReactNode => {
  if (!items.length) {
    return null;
  }

  switch (items[0]?.kind) {
    case "article":
      return (
        <div className="search-results-list">
          {items.map((item) => {
            if (item.kind !== "article") {
              return null;
            }

            return (
              <article className="search-article-card" key={item.id}>
                <div className="search-article-copy">
                  <OneUIStack gap="xs">
                    <div className="search-article-title-row">
                      <OneUIHeading level={3}>{item.title}</OneUIHeading>
                      {item.tag ? (
                        <OneUIBadge appearance="outlined" size="sm" tone="brand">
                          {item.tag}
                        </OneUIBadge>
                      ) : null}
                    </div>
                    <OneUIText tone="secondary">{item.summary}</OneUIText>
                    <OneUIText tone="secondary">{item.meta}</OneUIText>
                  </OneUIStack>
                </div>
                {item.thumbnailLabel ? (
                  <div className="search-article-thumbnail" aria-hidden="true">
                    <span>{item.thumbnailLabel}</span>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      );
    case "person":
      return (
        <div className="people-results-list">
          {items.map((item) => {
            if (item.kind !== "person") {
              return null;
            }

            return (
              <article className="person-result-card" key={item.id}>
                <div className="person-avatar" aria-hidden="true">
                  {item.initials}
                </div>
                <OneUIStack gap="xs">
                  <OneUIText>{item.name}</OneUIText>
                  <OneUIText tone="secondary">{item.role}</OneUIText>
                  <OneUIText tone="secondary">{item.location}</OneUIText>
                </OneUIStack>
              </article>
            );
          })}
        </div>
      );
    case "resource":
      return (
        <div className="resource-grid">
          {items.map((item) => {
            if (item.kind !== "resource") {
              return null;
            }

            return (
              <article className="resource-tile" key={item.id}>
                <div
                  aria-hidden="true"
                  className="resource-icon"
                  style={{ backgroundColor: item.color }}
                >
                  {item.shortLabel}
                </div>
                <OneUIText tone="secondary">{item.label}</OneUIText>
              </article>
            );
          })}
        </div>
      );
    case "file":
      return (
        <div className="file-results-list">
          {items.map((item) => {
            if (item.kind !== "file") {
              return null;
            }

            return (
              <article className="file-result-card" key={item.id}>
                <div aria-hidden="true" className="file-type-pill">
                  {item.fileType}
                </div>
                <OneUIStack gap="xs">
                  <OneUIHeading level={3}>{item.title}</OneUIHeading>
                  <OneUIText tone="secondary">{item.meta}</OneUIText>
                  <OneUIText tone="secondary">{item.summary}</OneUIText>
                </OneUIStack>
              </article>
            );
          })}
        </div>
      );
    default:
      return null;
  }
};

export const SearchProgressiveLoadingDemoPage = (): React.JSX.Element => {
  const [query, setQuery] = React.useState("sa");
  const [selectedPreset, setSelectedPreset] = React.useState<SearchDemoPresetId>("mixed");
  const [globalEmpty, setGlobalEmpty] = React.useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = React.useState(false);
  const [visualStates, setVisualStates] = React.useState<Record<SearchDemoSectionId, SearchDemoVisualState>>(
    searchDemoPresetStates.mixed
  );
  const coordinator = useLoadingCoordinator({
    sections: sectionDefinitions
  });
  const timersRef = React.useRef<number[]>([]);
  const sectionMap = React.useMemo(() => {
    return new Map(coordinator.sections.map((section) => [section.id as SearchDemoSectionId, section]));
  }, [coordinator.sections]);

  const clearSimulation = React.useCallback(() => {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });
    timersRef.current = [];
  }, []);

  React.useEffect(() => {
    return () => {
      clearSimulation();
    };
  }, [clearSimulation]);

  const applySectionVisualState = React.useCallback(
    (id: SearchDemoSectionId, visualState: SearchDemoVisualState) => {
      const fixture = fixtureMap.get(id);

      if (!fixture) {
        return;
      }

      switch (visualState) {
        case "loaded":
          coordinator.setSectionState({
            count: fixture.items.length,
            data: fixture.items,
            id,
            status: fixture.items.length > 0 ? "success" : "empty"
          });
          return;
        case "empty":
          coordinator.setSectionState({
            data: [],
            id,
            status: "empty"
          });
          return;
        case "error":
          coordinator.setSectionState({
            data: undefined,
            errorMessage: fixture.errorMessage ?? `We couldn't load ${fixture.title}.`,
            id,
            status: "error"
          });
          return;
        case "slow":
          coordinator.setSectionState({
            data: undefined,
            id,
            status: "delayed"
          });
          return;
        case "loading":
        default:
          coordinator.setSectionState({
            data: undefined,
            id,
            status: "loading"
          });
      }
    },
    [coordinator.setSectionState]
  );

  React.useEffect(() => {
    searchDemoSections.forEach((section) => {
      applySectionVisualState(section.id, resolveTargetVisualState(visualStates[section.id], globalEmpty));
    });
  }, [applySectionVisualState, globalEmpty, visualStates]);

  const applyPresetInstant = React.useCallback(
    (preset: SearchDemoPresetId) => {
      clearSimulation();
      setSelectedPreset(preset);
      setVisualStates(searchDemoPresetStates[preset]);
    },
    [clearSimulation]
  );

  const runSimulation = React.useCallback(
    (preset: SearchDemoPresetId) => {
      clearSimulation();
      setSelectedPreset(preset);
      setVisualStates(loadingStateMap);

      searchDemoPresetTimelines[preset].forEach((event) => {
        const timer = window.setTimeout(() => {
          setVisualStates((currentState) => ({
            ...currentState,
            [event.id]: event.state
          }));
        }, event.delayMs);
        timersRef.current.push(timer);
      });
    },
    [clearSimulation]
  );

  const handleRetrySection = React.useCallback(
    (id: SearchDemoSectionId) => {
      clearSimulation();
      setVisualStates((currentState) => ({
        ...currentState,
        [id]: "loading"
      }));
      const timer = window.setTimeout(() => {
        setVisualStates((currentState) => ({
          ...currentState,
          [id]: "loaded"
        }));
      }, 900);
      timersRef.current.push(timer);
    },
    [clearSimulation]
  );

  const mainSections = searchDemoSections.filter((section) => section.column === "main");
  const railSections = searchDemoSections.filter((section) => section.column === "rail");

  return (
    <OneUIStack gap="lg">
      <BrandedHeroBanner
        description="Welcome to Connections. Explore a refined progressive search experience below."
        eyebrow={<OneUIText>Internal enterprise search concept</OneUIText>}
        footer={
          <div className="search-demo-support-links">
            <span>Suggested:</span>
            <button type="button">IT Policies</button>
            <button type="button">Leave Policy</button>
            <button type="button">Laptop Request</button>
            <button type="button">Benefits</button>
          </div>
        }
        headingLevel={1}
        height="comfortable"
        supportingContent={
          <div className="search-demo-hero-search">
            <OneUIInput
              aria-label="Search query"
              onChange={(_, data) => {
                setQuery(data.value);
              }}
              placeholder="Search across enterprise systems"
              value={query}
            />
            <OneUIButton>Search</OneUIButton>
            <OneUIButton appearance="secondary">AI Mode</OneUIButton>
          </div>
        }
        title="Good morning, Hemal"
      />

      <section className="search-demo-controls">
        <div className="search-demo-controls-toolbar">
          <div className="search-demo-controls-toggle">
            <OneUIStack gap="xs">
              <OneUIHeading level={2}>State Preview</OneUIHeading>
              <OneUIText tone="secondary">
                Replay realistic outcomes and test the section states without touching the reusable packages.
              </OneUIText>
              <OneUIText className="search-demo-controls-meta" tone="secondary">
                Preset: {searchDemoPresets.find((preset) => preset.id === selectedPreset)?.label} •{" "}
                {coordinator.progress.completed}/{coordinator.progress.total} sources settled
              </OneUIText>
            </OneUIStack>
          </div>
          <div className="search-demo-controls-actions">
            <button
              aria-pressed={globalEmpty}
              className={`search-toggle ${globalEmpty ? "search-toggle-active" : ""}`}
              onClick={() => {
                setGlobalEmpty((current) => !current);
              }}
              type="button"
            >
              Global Empty
            </button>
            <OneUIButton
              onClick={() => {
                runSimulation(selectedPreset);
              }}
            >
              Simulate
            </OneUIButton>
            <OneUIButton
              appearance="secondary"
              aria-controls="state-preview-panel"
              aria-expanded={isPreviewExpanded}
              onClick={() => {
                setIsPreviewExpanded((current) => !current);
              }}
            >
              {isPreviewExpanded ? "Hide details" : "Customize states"}
            </OneUIButton>
          </div>
        </div>

        <div className="search-demo-preset-row">
          <OneUIText tone="secondary">Presets:</OneUIText>
          <div className="search-demo-preset-list">
            {searchDemoPresets.map((preset) => (
              <button
                className={`search-chip-button ${preset.id === selectedPreset ? "search-chip-button-active" : ""}`}
                key={preset.id}
                onClick={() => {
                  applyPresetInstant(preset.id);
                }}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {isPreviewExpanded ? (
          <div className="search-demo-controls-panel" id="state-preview-panel">
            <div className="search-demo-state-grid">
              {searchDemoSections.map((section) => {
                const currentSection = sectionMap.get(section.id);

                return (
                  <div className="search-demo-state-row" key={section.id}>
                    <OneUIText>{section.title}</OneUIText>
                    <div className="search-demo-state-options">
                      {(["loaded", "loading", "slow", "error", "empty"] as const).map((state) => {
                        const resolvedState = resolveTargetVisualState(state, globalEmpty);
                        const targetStatus =
                          resolvedState === "loaded"
                            ? "success"
                            : resolvedState === "slow"
                              ? "delayed"
                              : resolvedState;
                        const isActive = currentSection?.status === targetStatus;

                        return (
                          <button
                            className={`search-state-pill search-state-${state} ${isActive ? "search-state-pill-active" : ""}`}
                            key={state}
                            onClick={() => {
                              clearSimulation();
                              setVisualStates((currentState) => ({
                                ...currentState,
                                [section.id]: state
                              }));
                            }}
                            type="button"
                          >
                            {state}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>

      <section className="search-results-shell">
        <div className="search-results-topbar">
          <OneUIText tone="secondary">
            Showing {searchDemoResultStats.start}–{searchDemoResultStats.end} of {searchDemoResultStats.total} results
            for "{query}"
          </OneUIText>
          <div className="search-results-topbar-actions">
            <OneUIButton appearance="secondary" size="small">
              Relevance
            </OneUIButton>
            <OneUIButton appearance="secondary" size="small">
              Filters
            </OneUIButton>
          </div>
        </div>

        <div className="search-results-board">
          <SmartProgressBar
            completed={coordinator.progress.completed}
            delayed={coordinator.progress.delayed}
            description="Results appear progressively as each system responds. You can start browsing loaded results below."
            empty={coordinator.progress.empty}
            error={coordinator.progress.error}
            items={coordinator.sections.map((section) => ({
              count: section.count,
              id: section.id,
              label: section.title,
              status: section.status
            }))}
            loading={coordinator.progress.loading}
            percent={coordinator.progress.percent}
            refreshing={coordinator.progress.refreshing}
            success={coordinator.progress.success}
            summaryText={`${coordinator.progress.completed} of ${coordinator.progress.total} sources completed`}
            title={`Searching across ${coordinator.progress.total} enterprise systems...`}
            total={coordinator.progress.total}
          />
          <div className="search-page-layout">
            <div className="search-page-main">
              {mainSections.map((fixture) => {
                const section = sectionMap.get(fixture.id);

                if (!section) {
                  return null;
                }

                return (
                  <SmartLoadingSection
                    actions={
                      fixture.actionsLabel && (section.status === "success" || section.status === "refreshing") ? (
                        <OneUIButton appearance="transparent" size="small">
                          {fixture.actionsLabel}
                        </OneUIButton>
                      ) : undefined
                    }
                    autoCollapseOnDelayed
                    accentTone={getAccentTone(fixture.accent)}
                    collapsible
                    count={section.count}
                    delayedMessage={fixture.delayedMessage ?? "This source is taking longer than expected."}
                    errorMessage={section.errorMessage}
                    avatar={getSectionAvatarLabel(fixture.id)}
                    key={fixture.id}
                    loadingLabel={fixture.loadingLabel}
                    onRetry={() => {
                      handleRetrySection(fixture.id);
                    }}
                    status={section.status}
                    statusDisplayMode="inline"
                    title={fixture.title}
                  >
                    {renderSectionItems((section.data as SearchDemoItem[] | undefined) ?? [])}
                  </SmartLoadingSection>
                );
              })}
            </div>

            <aside className="search-page-rail">
              {railSections.map((fixture) => {
                const section = sectionMap.get(fixture.id);

                if (!section) {
                  return null;
                }

                return (
                  <SmartLoadingSection
                    actions={
                      fixture.actionsLabel && (section.status === "success" || section.status === "refreshing") ? (
                        <OneUIButton appearance="transparent" size="small">
                          {fixture.actionsLabel}
                        </OneUIButton>
                      ) : undefined
                    }
                    autoCollapseOnError={false}
                    accentTone={getAccentTone(fixture.accent)}
                    collapseOnEmpty
                    collapsible
                    count={section.count}
                    delayedMessage={fixture.delayedMessage ?? "This source is taking longer than expected."}
                    emptyMessage={fixture.emptyMessage ?? "No results found from this source."}
                    errorMessage={section.errorMessage}
                    avatar={getSectionAvatarLabel(fixture.id)}
                    key={fixture.id}
                    loadingLabel={fixture.loadingLabel}
                    onRetry={() => {
                      handleRetrySection(fixture.id);
                    }}
                    status={section.status}
                    statusDisplayMode="inline"
                    title={fixture.title}
                  >
                    {renderSectionItems((section.data as SearchDemoItem[] | undefined) ?? [])}
                  </SmartLoadingSection>
                );
              })}

              <section className="search-help-card">
                <OneUIStack gap="sm">
                  <OneUIHeading level={3}>Need Help?</OneUIHeading>
                  <OneUIText tone="secondary">
                    Can&apos;t find what you&apos;re looking for? Our support team can help locate resources across the
                    organisation.
                  </OneUIText>
                  <OneUIButton>Contact Support</OneUIButton>
                </OneUIStack>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </OneUIStack>
  );
};
