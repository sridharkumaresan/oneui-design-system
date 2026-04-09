import React from "react";
import { Avatar } from "@fluentui/react-components";

import {
  OneUIBadge,
  OneUIButton,
  OneUIHeading,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";
import { IllustratedState } from "@functions-oneui/organism-illustrated-state";
import { SmartLoadingSection } from "@functions-oneui/organism-smart-loading-container";
import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";
import { useLoadingCoordinator } from "@functions-oneui/react-utils/progressive-loading";
import { type OneUIFluidTypographyScale } from "@functions-oneui/theme";

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

const renderSectionState = ({
  emptyMessage,
  errorMessage,
  onRetry,
  title
}: {
  emptyMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
  onRetry: () => void;
  title: React.ReactNode;
}) => {
  return {
    emptyContent: (
      <IllustratedState
        description={emptyMessage ?? "No results found from this source."}
        surfaceAppearance="borderless"
        title={`No ${String(title)} results`}
        variant="no-results"
      />
    ),
    errorContent: (
      <IllustratedState
        description={errorMessage ?? `We couldn't load ${String(title)} right now.`}
        primaryAction={{ label: "Retry", onClick: onRetry }}
        surfaceAppearance="borderless"
        title={`We couldn't load ${String(title)}.`}
        variant="error"
      />
    )
  };
};

const renderArticleThumbnail = (
  tone: NonNullable<Extract<SearchDemoItem, { kind: "article" }>["thumbnailTone"]>
): React.ReactNode => {
  return (
    <div aria-hidden="true" className={`search-article-thumbnail search-article-thumbnail-${tone}`}>
      <span className="search-article-thumbnail-glow" />
      <span className="search-article-thumbnail-horizon" />
      <span className="search-article-thumbnail-card" />
      <span className="search-article-thumbnail-accent" />
    </div>
  );
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
                {item.thumbnailTone ? (
                  renderArticleThumbnail(item.thumbnailTone)
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
                <Avatar
                  badge={{ status: "available" }}
                  color="colorful"
                  initials={item.initials}
                  name={item.name}
                  size={40}
                />
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

type SearchProgressiveLoadingDemoPageProps = {
  fluidEnabled: boolean;
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  onFluidEnabledChange: (value: boolean) => void;
  onScaleChange: (scale: OneUIFluidTypographyScale) => void;
  scale: OneUIFluidTypographyScale;
};

export const SearchProgressiveLoadingDemoPage = ({
  fluidEnabled,
  isSettingsOpen,
  onCloseSettings,
  onFluidEnabledChange,
  onScaleChange,
  scale
}: SearchProgressiveLoadingDemoPageProps): React.JSX.Element => {
  const [query, setQuery] = React.useState("sa");
  const [selectedPreset, setSelectedPreset] = React.useState<SearchDemoPresetId>("mixed");
  const [globalEmpty, setGlobalEmpty] = React.useState(false);
  const [visualStates, setVisualStates] = React.useState<
    Record<SearchDemoSectionId, SearchDemoVisualState>
  >(searchDemoPresetStates.mixed);
  const coordinator = useLoadingCoordinator({
    sections: sectionDefinitions
  });
  const timersRef = React.useRef<number[]>([]);
  const sectionMap = React.useMemo(() => {
    return new Map(
      coordinator.sections.map((section) => [section.id as SearchDemoSectionId, section])
    );
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
      applySectionVisualState(section.id, visualStates[section.id]);
    });
  }, [applySectionVisualState, visualStates]);

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
  const visibleResultStats = globalEmpty ? { end: 0, start: 0, total: 0 } : searchDemoResultStats;

  return (
    <OneUIStack gap="lg">
      {isSettingsOpen ? (
        <div
          className="playground-settings-overlay"
          onClick={() => {
            onCloseSettings();
          }}
        >
          <section
            aria-labelledby="playground-settings-title"
            aria-modal="true"
            className="playground-settings-modal"
            onClick={(event) => {
              event.stopPropagation();
            }}
            role="dialog"
          >
            <div className="playground-settings-modal-header">
              <OneUIStack gap="xs">
                <OneUIBadge appearance="soft" size="sm" tone="brand">
                  Showcase settings
                </OneUIBadge>
                <OneUIHeading level={2}>Demo controls</OneUIHeading>
                <OneUIText id="playground-settings-title" tone="secondary">
                  Manage route, typography, and search preview states in one polished overlay.
                </OneUIText>
              </OneUIStack>
              <button
                aria-label="Close settings"
                className="playground-settings-close"
                onClick={() => {
                  onCloseSettings();
                }}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="playground-settings-modal-body">
              <div className="playground-settings-group">
                <div className="playground-settings-group-header">
                  <OneUIHeading level={3}>Showcase</OneUIHeading>
                  <OneUIText tone="secondary">
                    Adjust the fluid typography system and preview behavior for the entire page.
                  </OneUIText>
                </div>
                <div className="playground-settings-grid">
                  <label className="playground-settings-field">
                    <span className="playground-settings-label">Fluid typography</span>
                    <span className="playground-settings-toggle">
                      <input
                        checked={fluidEnabled}
                        onChange={(event) => {
                          onFluidEnabledChange(event.target.checked);
                        }}
                        type="checkbox"
                      />
                      <span>{fluidEnabled ? "Enabled" : "Disabled"}</span>
                    </span>
                  </label>

                  <label className="playground-settings-field">
                    <span className="playground-settings-label">Typography scale</span>
                    <select
                      className="playground-control-select"
                      onChange={(event) => {
                        onScaleChange(event.target.value as OneUIFluidTypographyScale);
                      }}
                      value={scale}
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="expressive">Expressive</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="playground-settings-group">
                <div className="playground-settings-group-header">
                  <OneUIHeading level={3}>Search preview</OneUIHeading>
                  <OneUIText tone="secondary">
                    Preset: {searchDemoPresets.find((preset) => preset.id === selectedPreset)?.label} •{" "}
                    {coordinator.progress.completed}/{coordinator.progress.total} sources settled
                  </OneUIText>
                </div>

                <div className="playground-settings-grid">
                  <div className="playground-settings-field">
                    <span className="playground-settings-label">Scenario presets</span>
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

                  <div className="playground-settings-field">
                    <span className="playground-settings-label">Quick actions</span>
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
                    </div>
                  </div>
                </div>

                <div className="playground-settings-field">
                  <span className="playground-settings-label">Section overrides</span>
                  <div className="search-demo-state-grid">
                    {searchDemoSections.map((section) => {
                      const currentSection = sectionMap.get(section.id);

                      return (
                        <div className="search-demo-state-row" key={section.id}>
                          <OneUIText>{section.title}</OneUIText>
                          <div className="search-demo-state-options">
                            {(["loaded", "loading", "slow", "error", "empty"] as const).map((state) => {
                              const targetStatus =
                                state === "loaded"
                                  ? "success"
                                  : state === "slow"
                                    ? "delayed"
                                    : state;
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
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <BrandedHeroBanner
        description="Welcome to Connections. Explore a refined progressive search experience below."
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
          <div className="search-demo-hero-search-panel">
            <div className="search-demo-hero-search">
              <label className="search-demo-hero-search-field">
                <span aria-hidden="true" className="search-demo-search-leading-icon">
                  ⌕
                </span>
                <input
                  aria-label="Search query"
                  className="search-demo-hero-search-native-input"
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  placeholder="Search across enterprise systems"
                  type="text"
                  value={query}
                />
              </label>
              <div className="search-demo-hero-search-actions" role="group" aria-label="Search actions">
                <button className="search-demo-hero-search-primary" type="button">
                  <span aria-hidden="true">⌕</span>
                  <span>Search</span>
                </button>
                <button className="search-demo-hero-search-secondary" type="button">
                  <span aria-hidden="true">✦</span>
                  <span>AI Mode</span>
                </button>
              </div>
            </div>
          </div>
        }
        title="Good morning, Hemal"
      />

      <section className="search-results-shell">
        <div className="search-results-topbar">
          <OneUIText tone="secondary">
            Showing {visibleResultStats.start}–{visibleResultStats.end} of{" "}
            {visibleResultStats.total} results for "{query}"
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
          {globalEmpty ? (
            <IllustratedState
              description={`No results were found across your connected systems for "${query}". Try a broader search, preview another preset, or switch off Global Empty to inspect section-level states.`}
              primaryAction={{
                label: "Turn off Global Empty",
                onClick: () => {
                  setGlobalEmpty(false);
                }
              }}
              secondaryAction={{
                appearance: "secondary",
                label: "Reset preview",
                onClick: () => {
                  applyPresetInstant("mixed");
                }
              }}
              title={`No results found for "${query}"`}
              variant="no-results"
            />
          ) : (
            <div className="search-page-layout">
              <div className="search-page-main">
                {mainSections.map((fixture) => {
                  const section = sectionMap.get(fixture.id);

                  if (!section) {
                    return null;
                  }

                  return (
                    <SmartLoadingSection
                      {...renderSectionState({
                        errorMessage: section.errorMessage,
                        onRetry: () => {
                          handleRetrySection(fixture.id);
                        },
                        title: fixture.title
                      })}
                      actions={
                        fixture.actionsLabel &&
                        (section.status === "success" || section.status === "refreshing") ? (
                          <OneUIButton appearance="transparent" size="small">
                            {fixture.actionsLabel}
                          </OneUIButton>
                        ) : undefined
                      }
                      autoCollapseOnDelayed
                      accentTone={getAccentTone(fixture.accent)}
                      collapsible
                      count={section.count}
                      delayedMessage={
                        fixture.delayedMessage ?? "This source is taking longer than expected."
                      }
                      avatar={getSectionAvatarLabel(fixture.id)}
                      key={fixture.id}
                      loadingLabel={fixture.loadingLabel}
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
                      {...renderSectionState({
                        emptyMessage: fixture.emptyMessage,
                        errorMessage: section.errorMessage,
                        onRetry: () => {
                          handleRetrySection(fixture.id);
                        },
                        title: fixture.title
                      })}
                      actions={
                        fixture.actionsLabel &&
                        (section.status === "success" || section.status === "refreshing") ? (
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
                      delayedMessage={
                        fixture.delayedMessage ?? "This source is taking longer than expected."
                      }
                      avatar={getSectionAvatarLabel(fixture.id)}
                      key={fixture.id}
                      loadingLabel={fixture.loadingLabel}
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
                      Can&apos;t find what you&apos;re looking for? Our support team can help locate
                      resources across the organisation.
                    </OneUIText>
                    <OneUIButton>Contact Support</OneUIButton>
                  </OneUIStack>
                </section>
              </aside>
            </div>
          )}
        </div>
      </section>
    </OneUIStack>
  );
};
