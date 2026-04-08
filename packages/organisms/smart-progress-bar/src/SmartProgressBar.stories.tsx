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
    description: "Results appear progressively as each source responds. You can start browsing loaded content below.",
    empty: 1,
    error: 1,
    items: [
      { id: "news", label: "News", status: "success", count: 12 },
      { id: "people", label: "People", status: "refreshing", count: 8 },
      { id: "resources", label: "Resources", status: "error" },
      { id: "files", label: "Files", status: "empty" },
      { id: "sites", label: "Sites", status: "delayed" }
    ],
    loading: 0,
    percent: 57,
    refreshing: 1,
    success: 2,
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
      { id: "approvals", label: "Approvals", status: "loading" },
      { id: "tasks", label: "Tasks", status: "loading" },
      { id: "alerts", label: "Alerts", status: "success", count: 5 }
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
      { id: "sites", label: "Sites", status: "success", count: 18 },
      { id: "people", label: "People", status: "success", count: 6 },
      { id: "resources", label: "Resources", status: "error" },
      { id: "files", label: "Files", status: "empty" },
      { id: "servicenow", label: "ServiceNow", status: "delayed" }
    ],
    loading: 0,
    percent: 50,
    refreshing: 0,
    success: 2,
    title: "Section progress"
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
          { id: "hr", label: "HR", status: "success", count: 2 },
          { id: "it", label: "IT", status: completed < 3 ? "delayed" : "success", count: 4 }
        ]}
        loading={0}
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
