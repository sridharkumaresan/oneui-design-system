import React from "react";
import { Avatar } from "@fluentui/react-components";

import { OneUIBadge, OneUIText } from "@functions-oneui/atoms";
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";
import barclaysWordmark from "../assets/barclays-wordmark.svg";

type DemoRoute = "search" | "tasks";

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

const heroCards = [
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
] as const;

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
        </div>
      </nav>

      <div className="connections-shell-banner">
        {isTaskRoute ? (
          <BrandedHeroBanner
            className="connections-task-banner"
            height="tiny"
            surfaceKey="gradientCyanLightBlue"
            title="Task Inbox"
          />
        ) : (
          <BrandedHeroBanner
            className="connections-hero"
            description="Welcome to Connections, how can we help you today?"
            footer={
              <div className="connections-hero-card-row">
                {heroCards.map((card) => (
                  <button
                    className={`connections-hero-action-card connections-hero-action-card-${card.emphasis}`}
                    key={card.title}
                    onClick={() => {
                      if (card.title === "Tasks" || card.title === "Approvals") {
                        onRouteChange("tasks");
                      }
                    }}
                    type="button"
                  >
                    <div className="connections-hero-action-card-header">
                      <span className="connections-hero-action-card-title">{card.title}</span>
                      {card.badge ? (
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
                  </button>
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
            surfaceKey="gradientNavyCyan"
            title="Good afternoon, Sabina"
            topStart={
              <div className="connections-hero-widget-row">
                <div className="connections-hero-widget">
                  <WeatherIcon />
                  <div className="connections-hero-widget-copy">
                    <strong>22°C</strong>
                    <span>Mostly cloudy</span>
                  </div>
                </div>
                <div className="connections-hero-widget">
                  <StockIcon />
                  <div className="connections-hero-widget-copy">
                    <strong>222.22</strong>
                    <span>BARC.L</span>
                  </div>
                </div>
              </div>
            }
            topEnd={
              <OneUIText className="connections-hero-meta" tone="inverse">
                Enterprise landing
              </OneUIText>
            }
          />
        )}
      </div>
    </div>
  );
};
