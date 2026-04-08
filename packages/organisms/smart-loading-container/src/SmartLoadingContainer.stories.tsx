import type { Meta, StoryObj } from "@storybook/react";

import React from "react";

import { OneUIButton, OneUIText } from "@functions-oneui/atoms";

import { SmartLoadingContainer } from "./SmartLoadingContainer.js";
import { SmartLoadingSection } from "./SmartLoadingSection.js";

const storyShellStyle = {
  margin: "0 auto",
  maxWidth: "1100px",
  padding: "24px"
} satisfies React.CSSProperties;

const railShellStyle = {
  margin: "0 auto",
  maxWidth: "420px",
  padding: "24px"
} satisfies React.CSSProperties;

const meta = {
  title: "Organisms/SmartLoadingContainer",
  component: SmartLoadingContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "SmartLoadingContainer and SmartLoadingSection provide reusable shells for consumer-owned async sections."
      }
    }
  },
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Generic shell for progressive loading sections."
          title="Async section states"
        >
          <SmartLoadingSection count={3} status="success" title="Success">
            <OneUIText>Success content stays entirely consumer-rendered.</OneUIText>
          </SmartLoadingSection>
          <SmartLoadingSection loadingLabel="Fetching section results..." status="loading" title="Loading" />
          <SmartLoadingSection delayedMessage="This source is taking longer than expected." status="delayed" title="Delayed" />
          <SmartLoadingSection emptyMessage="No matching records." status="empty" title="Empty" />
          <SmartLoadingSection
            errorMessage="Unable to load this section."
            onRetry={() => undefined}
            retryLabel="Try again"
            status="error"
            title="Error"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
} satisfies Meta<typeof SmartLoadingContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MainColumnSections: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Sections remain consumer-owned while loading states stay consistent."
          title="Enterprise search sections"
        >
          <SmartLoadingSection count={24} status="success" title="News">
            <OneUIText>Loaded content remains entirely consumer-rendered.</OneUIText>
          </SmartLoadingSection>
          <SmartLoadingSection loadingLabel="Searching sites and events..." status="loading" title="Sites" />
          <SmartLoadingSection delayedMessage="This source is taking longer than usual." status="delayed" title="ServiceNow" />
          <SmartLoadingSection emptyMessage="No matching files were found." status="empty" title="Files" />
          <SmartLoadingSection
            errorMessage="We could not load resources right now."
            onRetry={() => undefined}
            retryLabel="Retry"
            status="error"
            title="Resources"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const Refreshing: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer title="Refreshing section">
          <SmartLoadingSection count={6} status="refreshing" title="Approvals">
            <OneUIText>Existing approval rows remain visible while fresh data is loading.</OneUIText>
          </SmartLoadingSection>
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const Collapsible: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer title="Collapsible section">
          <SmartLoadingSection collapsible defaultCollapsed status="loading" title="People" />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const CollapsedError: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer title="Collapsed error state">
          <SmartLoadingSection
            autoCollapseOnError
            collapsible
            errorMessage="Unable to load this section."
            onRetry={() => undefined}
            status="error"
            title="Resources"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const DelayedAutoCollapse: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer title="Delayed auto-collapse">
          <SmartLoadingSection
            autoCollapseOnDelayed
            collapsible
            delayedThresholdMs={1200}
            loadingLabel="Checking source availability..."
            status="loading"
            title="ServiceNow"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const DelayedExpanded: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer title="Delayed but expanded">
          <SmartLoadingSection
            collapsible
            delayedMessage="Taking longer than expected."
            status="delayed"
            title="Compliance"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const ArbitraryChildren: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer title="Arbitrary child rendering">
          <SmartLoadingSection count={2} status="success" title="Custom body">
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ border: "1px solid #d5ddeb", borderRadius: "12px", padding: "12px" }}>
                Consumer-defined card layout
              </div>
              <div style={{ border: "1px solid #d5ddeb", borderRadius: "12px", padding: "12px" }}>
                Another consumer-defined child block
              </div>
            </div>
          </SmartLoadingSection>
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const RightRailFit: Story = {
  render: () => {
    return (
      <div style={railShellStyle}>
        <SmartLoadingContainer title="Right rail sections">
          <SmartLoadingSection count={5} status="success" statusDisplayMode="minimal" title="Approvals">
            <OneUIText>Compact sections still work cleanly in narrower layouts.</OneUIText>
          </SmartLoadingSection>
          <SmartLoadingSection
            delayedMessage="Still waiting for this source."
            status="delayed"
            statusDisplayMode="minimal"
            title="Alerts"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const ResponsiveNarrow: Story = {
  render: () => {
    return (
      <div style={{ ...railShellStyle, maxWidth: "360px" }}>
        <SmartLoadingContainer title="Responsive accordion">
          <SmartLoadingSection
            collapsible
            count={12}
            status="success"
            statusDisplayMode="minimal"
            title="IT, HR & Colleague Direct"
          >
            <OneUIText>Header hierarchy remains readable in narrower layouts.</OneUIText>
          </SmartLoadingSection>
          <SmartLoadingSection
            autoCollapseOnDelayed
            collapsible
            delayedThresholdMs={1200}
            loadingLabel="Fetching source data..."
            status="loading"
            statusDisplayMode="minimal"
            title="ServiceNow"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const HookManagedExample: Story = {
  render: () => {
    const [status, setStatus] = React.useState<"loading" | "success">("loading");

    React.useEffect(() => {
      const timer = window.setTimeout(() => {
        setStatus("success");
      }, 800);

      return () => {
        window.clearTimeout(timer);
      };
    }, []);

    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer title="Hook-managed section example">
          <SmartLoadingSection count={2} loadingLabel="Loading external records..." status={status} title="Records">
            <OneUIText>Records remain fully consumer-rendered once the hook settles successfully.</OneUIText>
          </SmartLoadingSection>
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const ExternallyManagedState: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Consumers can manage async state themselves and pass only the resolved props."
          title="Externally managed state"
        >
          <SmartLoadingSection
            count={8}
            status="success"
            title="People"
            actions={
              <OneUIButton appearance="transparent" size="small">
                View more
              </OneUIButton>
            }
          >
            <OneUIText>Results remain consumer-rendered while the shell stays reusable.</OneUIText>
          </SmartLoadingSection>
          <SmartLoadingSection
            delayedMessage="Still waiting for this dependency."
            onRetry={() => undefined}
            status="delayed"
            title="Approvals"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};
