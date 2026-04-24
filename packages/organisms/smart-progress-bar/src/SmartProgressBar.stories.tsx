import type { Meta, StoryObj } from "@storybook/react";

import React from "react";

import { SmartProgressBar } from "./SmartProgressBar.js";

const storyShellStyle = {
  margin: "0 auto",
  maxWidth: "1080px",
  padding: "24px"
} satisfies React.CSSProperties;

const meta = {
  title: "Organisms/SmartProgressBar",
  component: SmartProgressBar,
  args: {
    completed: 4,
    delayed: 1,
    description:
      "Results appear progressively as each source responds. You can start browsing loaded content below.",
    empty: 1,
    error: 1,
    items: [
      { accentTone: "danger", count: 12, id: "news", label: "News", status: "success" },
      { accentTone: "success", count: 8, id: "people", label: "People", status: "refreshing" },
      { accentTone: "info", id: "resources", label: "Resources", status: "error" },
      { accentTone: "neutral", id: "files", label: "Files", status: "empty" },
      { accentTone: "warning", id: "sites", label: "Sites", status: "delayed" },
      { accentTone: "brand", id: "policies", label: "Policies", status: "success", count: 4 },
      { accentTone: "info", id: "tickets", label: "Tickets", status: "loading" }
    ],
    loading: 1,
    mode: "slim",
    percent: 57,
    refreshing: 1,
    success: 3,
    title: "Searching across 7 enterprise systems...",
    total: 7
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "SmartProgressBar is a generic progress header that renders only from props and can be reused across search, dashboard, approvals, or alert pages."
      }
    }
  }
} satisfies Meta<typeof SmartProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullMode: Story = {
  args: {
    mode: "full"
  }
};

export const SearchHeader: Story = {
  render: (args) => {
    return (
      <div style={storyShellStyle}>
        <SmartProgressBar {...args} summaryText="4 of 7 systems completed" />
      </div>
    );
  }
};

export const LoadingHeavy: Story = {
  args: {
    completed: 1,
    delayed: 0,
    description: "Sections settle independently while the page remains usable.",
    empty: 0,
    error: 0,
    items: [
      { accentTone: "brand", id: "approvals", label: "Approvals", status: "loading" },
      { accentTone: "warning", id: "tasks", label: "Tasks", status: "loading" },
      { accentTone: "success", count: 5, id: "alerts", label: "Alerts", status: "success" }
    ],
    loading: 2,
    percent: 33,
    refreshing: 0,
    success: 1,
    title: "Dashboard loading",
    total: 3
  }
};

export const QuietSummary: Story = {
  render: (args) => {
    return (
      <div style={storyShellStyle}>
        <SmartProgressBar
          {...args}
          description="Progress updates without drawing attention away from the page content."
          items={[]}
          showChips={false}
          title="Compact progress header"
        />
      </div>
    );
  }
};

export const MixedStates: Story = {
  args: {
    completed: 3,
    delayed: 1,
    empty: 1,
    error: 1,
    items: [
      { accentTone: "warning", count: 18, id: "sites", label: "Sites", status: "success" },
      { accentTone: "success", count: 6, id: "people", label: "People", status: "success" },
      { accentTone: "info", id: "resources", label: "Resources", status: "error" },
      { accentTone: "neutral", id: "files", label: "Files", status: "empty" },
      { accentTone: "brand", id: "servicenow", label: "ServiceNow", status: "delayed" }
    ],
    loading: 0,
    percent: 60,
    refreshing: 0,
    success: 2,
    title: "Section progress",
    total: 5
  }
};

export const EmbeddedPageExample: Story = {
  render: (args) => {
    return (
      <div style={storyShellStyle}>
        <div style={{ display: "grid", gap: "20px" }}>
          <SmartProgressBar
            {...args}
            description="Results appear progressively as each source responds."
            summaryText="4 of 7 systems completed"
            title="Searching across 7 enterprise systems..."
          />
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ borderBottom: "1px solid #d7dee8", paddingBottom: "12px" }}>
              Loaded page content would continue below the header.
            </div>
            <div style={{ borderBottom: "1px solid #d7dee8", paddingBottom: "12px" }}>
              This story shows the component in a realistic embedded page position.
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export const HookManagedExample: Story = {
  render: () => {
    const [completed, setCompleted] = React.useState(1);

    React.useEffect(() => {
      const timer = window.setTimeout(() => {
        setCompleted(3);
      }, 800);

      return () => {
        window.clearTimeout(timer);
      };
    }, []);

    return (
      <SmartProgressBar
        completed={completed}
        delayed={completed < 3 ? 1 : 0}
        empty={0}
        error={0}
        items={[
          { accentTone: "success", count: 2, id: "hr", label: "HR", status: "success" },
          {
            accentTone: "brand",
            count: 4,
            id: "it",
            label: "IT",
            status: completed < 3 ? "delayed" : "success"
          },
          {
            accentTone: "info",
            id: "finance",
            label: "Finance",
            status: completed < 2 ? "loading" : "success",
            count: completed < 2 ? undefined : 3
          }
        ]}
        loading={completed < 2 ? 1 : 0}
        percent={Math.round((completed / 3) * 100)}
        success={completed}
        title="Hook-managed status example"
        total={3}
      />
    );
  }
};

export const AccessibilityNotes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The component exposes a named progressbar, optional source-status chip list, and generic wording so it stays reusable across domains."
      }
    }
  }
};
