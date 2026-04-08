import React from "react";

import { OneUIButton, OneUIHeading, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import {
  SmartLoadingContainer,
  SmartLoadingSection
} from "@functions-oneui/organism-smart-loading-container";
import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";
import { useProgressiveLoading } from "@functions-oneui/react-utils/progressive-loading";

import { createDemoSectionConfigs, type DemoCardItem, type DemoSectionSpec } from "../mocks/progressiveLoading.js";

const sectionSpecs: DemoSectionSpec[] = [
  {
    delayMs: 500,
    id: "hr",
    items: [
      {
        meta: "Due today",
        summary: "Complete employee onboarding reviews and manager approvals.",
        title: "Employee onboarding pack"
      },
      {
        meta: "Due tomorrow",
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
        meta: "Infrastructure",
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
        meta: "Compliance",
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
    <article className="dashboard-task-card" key={`${item.title}-${item.meta ?? ""}`}>
      <OneUIStack gap="xs">
        <OneUIHeading level={3}>{item.title}</OneUIHeading>
        <OneUIText tone="secondary">{item.summary}</OneUIText>
        {item.meta ? <OneUIText tone="secondary">{item.meta}</OneUIText> : null}
      </OneUIStack>
    </article>
  );
};

export const TaskDashboardDemoPage = (): React.JSX.Element => {
  const sections = React.useMemo(() => createDemoSectionConfigs(sectionSpecs), []);
  const progressiveLoading = useProgressiveLoading({
    delayedThresholdMs: 1500,
    sections
  });

  return (
    <OneUIStack gap="lg">
      <section className="demo-page-header">
        <OneUIStack gap="sm">
          <OneUIHeading level={2}>Task dashboard</OneUIHeading>
          <OneUIText tone="secondary">
            Stable section ordering with progressive hydration, mixed outcomes, and reusable status framing.
          </OneUIText>
        </OneUIStack>
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
            title="Task dashboard status"
            total={progressiveLoading.progress.total}
          />
        }
        title="Today's work"
      >
        <div className="dashboard-grid">
          {progressiveLoading.sections.map((section) => {
            const items = (section.data as DemoCardItem[] | undefined) ?? [];

            return (
              <SmartLoadingSection
                actions={section.status === "success" || section.status === "refreshing" ? (
                  <OneUIButton appearance="transparent" size="small">
                    View details
                  </OneUIButton>
                ) : undefined}
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
                title={section.title}
              >
                <div className="dashboard-items-list">{items.map(renderDashboardItem)}</div>
              </SmartLoadingSection>
            );
          })}
        </div>
      </SmartLoadingContainer>
    </OneUIStack>
  );
};
