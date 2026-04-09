import React from "react";

import {
  OneUIBadge,
  OneUIButton,
  OneUIHeading,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";
import { ActionCard } from "@functions-oneui/organism-action-card";
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";
import {
  SmartLoadingContainer,
  SmartLoadingSection
} from "@functions-oneui/organism-smart-loading-container";
import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";
import { useProgressiveLoading } from "@functions-oneui/react-utils/progressive-loading";
import { type OneUIFluidTypographyScale } from "@functions-oneui/theme";

import { createDemoSectionConfigs, type DemoCardItem, type DemoSectionSpec } from "../mocks/progressiveLoading.js";

const taskSectionPresentation = {
  approvals: { accentTone: "danger", avatar: "A" },
  compliance: { accentTone: "warning", avatar: "C" },
  hr: { accentTone: "brand", avatar: "H" },
  it: { accentTone: "info", avatar: "IT" },
  learning: { accentTone: "success", avatar: "L" }
} as const;

const sectionSpecs: DemoSectionSpec[] = [
  {
    delayMs: 500,
    id: "hr",
    items: [
      {
        badgeText: "Due today",
        badgeTone: "warning",
        eyebrow: "People operations",
        footerNote: "Last updated 20 minutes ago",
        helperLinkLabel: "View onboarding plan",
        meta: "Due today",
        primaryActionLabel: "Review packet",
        secondaryActionLabel: "Assign owner",
        summary: "Complete employee onboarding reviews and manager approvals.",
        title: "Employee onboarding pack"
      },
      {
        badgeText: "New starter",
        badgeTone: "brand",
        eyebrow: "People operations",
        footerNote: "Needs manager input",
        helperLinkLabel: "Open policy summary",
        meta: "Due tomorrow",
        primaryActionLabel: "Acknowledge",
        secondaryActionLabel: "Remind team",
        summary: "Review updated annual leave policy acknowledgement.",
        title: "Policy acknowledgement"
      }
    ],
    order: 1,
    outcome: "success",
    title: "HR Tasks"
  },
  {
    delayMs: 720,
    id: "it",
    items: [
      {
        badgeText: "Provisioning",
        badgeTone: "info",
        eyebrow: "Digital workplace",
        footerNote: "Prepared for the next sync",
        helperLinkLabel: "Inspect rollout checklist",
        meta: "Infrastructure",
        primaryActionLabel: "Open checklist",
        secondaryActionLabel: "Share update",
        summary: "Validate device rollout and software provisioning requests for new joiners.",
        title: "Provisioning checks"
      }
    ],
    order: 2,
    outcome: "success",
    title: "IT Tasks"
  },
  {
    delayMs: 1950,
    id: "compliance",
    items: [
      {
        badgeText: "Executive review",
        badgeTone: "danger",
        eyebrow: "Risk and compliance",
        footerNote: "Escalation path ready",
        helperLinkLabel: "See audit notes",
        meta: "Compliance",
        primaryActionLabel: "Review attestation",
        secondaryActionLabel: "Notify approver",
        summary: "Audit checks complete after the delayed threshold without changing the surrounding layout.",
        title: "Quarterly attestation review"
      }
    ],
    order: 3,
    outcome: "success",
    title: "Compliance Tasks"
  },
  {
    delayMs: 920,
    id: "learning",
    items: [],
    order: 4,
    outcome: "empty",
    title: "Learning Tasks"
  },
  {
    delayMs: 1180,
    id: "approvals",
    items: [],
    order: 5,
    outcome: "error",
    title: "Approvals"
  }
];

const renderDashboardItem = (item: DemoCardItem): React.ReactNode => {
  return (
    <ActionCard
      actions={
        <>
          <OneUIButton size="small">{item.primaryActionLabel ?? "Open task"}</OneUIButton>
          {item.secondaryActionLabel ? (
            <OneUIButton appearance="secondary" size="small">
              {item.secondaryActionLabel}
            </OneUIButton>
          ) : null}
        </>
      }
      density="compact"
      eyebrow={item.eyebrow}
      footer={
        <div className="task-inbox-card-footer">
          {item.helperLinkLabel ? (
            <button className="task-inbox-inline-link" type="button">
              {item.helperLinkLabel}
            </button>
          ) : (
            <span />
          )}
          {item.footerNote ? <OneUIText tone="secondary">{item.footerNote}</OneUIText> : null}
        </div>
      }
      key={`${item.title}-${item.meta ?? ""}`}
      layout="auto"
      meta={
        <OneUIStack gap="xs">
          <OneUIText tone="secondary">{item.summary}</OneUIText>
          {item.meta ? <OneUIText tone="secondary">{item.meta}</OneUIText> : null}
        </OneUIStack>
      }
      status={
        item.badgeText ? (
          <OneUIBadge appearance="soft" size="sm" tone={item.badgeTone ?? "brand"}>
            {item.badgeText}
          </OneUIBadge>
        ) : undefined
      }
      title={item.title}
    />
  );
};

type TaskDashboardDemoPageProps = {
  fluidEnabled: boolean;
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  onFluidEnabledChange: (value: boolean) => void;
  onScaleChange: (scale: OneUIFluidTypographyScale) => void;
  scale: OneUIFluidTypographyScale;
};

export const TaskDashboardDemoPage = ({
  fluidEnabled,
  isSettingsOpen,
  onCloseSettings,
  onFluidEnabledChange,
  onScaleChange,
  scale
}: TaskDashboardDemoPageProps): React.JSX.Element => {
  const sections = React.useMemo(() => createDemoSectionConfigs(sectionSpecs), []);
  const progressiveLoading = useProgressiveLoading({
    delayedThresholdMs: 1500,
    sections
  });
  const orderedSections = React.useMemo(
    () =>
      [...progressiveLoading.sections].sort(
        (left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER)
      ),
    [progressiveLoading.sections]
  );
  const dashboardColumns = React.useMemo(
    () => [
      orderedSections.filter((_, index) => index % 2 === 0),
      orderedSections.filter((_, index) => index % 2 === 1)
    ],
    [orderedSections]
  );

  const renderTaskSection = React.useCallback(
    (section: (typeof progressiveLoading.sections)[number]) => {
      const items = (section.data as DemoCardItem[] | undefined) ?? [];
      const presentation = taskSectionPresentation[section.id as keyof typeof taskSectionPresentation];

      return (
        <SmartLoadingSection
          actions={section.status === "success" || section.status === "refreshing" ? (
            <OneUIButton appearance="transparent" size="small">
              View details
            </OneUIButton>
          ) : undefined}
          accentTone={presentation?.accentTone}
          avatar={presentation?.avatar}
          collapsible
          count={section.count}
          delayedMessage="This work queue is taking longer than usual to load."
          emptyMessage="No tasks are waiting in this queue."
          errorMessage={section.errorMessage}
          key={section.id}
          loadingLabel={`Loading ${section.title.toLowerCase()}...`}
          onRetry={() => {
            void progressiveLoading.retrySection(section.id);
          }}
          status={section.status}
          statusDisplayMode="inline"
          title={section.title}
        >
          <div className="dashboard-items-list">{items.map(renderDashboardItem)}</div>
        </SmartLoadingSection>
      );
    },
    [progressiveLoading]
  );

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
                  Manage route and typography from one frosted control surface.
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
                    Switch demos and adjust the fluid typography system for the whole playground.
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
            </div>
          </section>
        </div>
      ) : null}

      <BrandedHeroBanner
        height="tiny"
        title="Task Inbox"
      />

      <section className="demo-page-header">
        <div className="playground-toolbar">
          <OneUIText tone="secondary">
            Your dashboard stays readable while each section settles independently.
          </OneUIText>
          <div className="playground-toolbar-actions">
            <OneUIButton appearance="secondary" size="small">
              Export
            </OneUIButton>
            <OneUIButton
              size="small"
              onClick={() => {
                void progressiveLoading.retryAll();
              }}
            >
              Refresh dashboard
            </OneUIButton>
          </div>
        </div>
      </section>

      <SmartLoadingContainer
        description="A dashboard-style use of the same progressive loading primitives with restrained section framing."
        layout="single"
        progressSlot={
          <SmartProgressBar
            completed={progressiveLoading.progress.completed}
            delayed={progressiveLoading.progress.delayed}
            description="Tasks, approvals, and supporting work queues hydrate in place without reordering the page."
            empty={progressiveLoading.progress.empty}
            error={progressiveLoading.progress.error}
            items={progressiveLoading.sections.map((section) => ({
              count: section.count,
              id: section.id,
              label: section.title,
              status: section.status
            }))}
            loading={progressiveLoading.progress.loading}
            percent={progressiveLoading.progress.percent}
            refreshing={progressiveLoading.progress.refreshing}
            success={progressiveLoading.progress.success}
            summaryText={`${progressiveLoading.progress.completed} of ${progressiveLoading.progress.total} sections ready`}
            title="Task inbox status"
            total={progressiveLoading.progress.total}
          />
        }
        title="Today's inbox"
      >
        <div className="dashboard-grid">
          {dashboardColumns.map((columnSections, columnIndex) => (
            <div className="dashboard-column" key={`dashboard-column-${columnIndex}`}>
              {columnSections.map(renderTaskSection)}
            </div>
          ))}
        </div>
      </SmartLoadingContainer>
    </OneUIStack>
  );
};
