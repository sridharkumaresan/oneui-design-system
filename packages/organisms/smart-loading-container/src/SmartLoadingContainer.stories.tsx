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

const meta = {
  title: "Organisms/SmartLoadingContainer",
  component: SmartLoadingContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Use SmartLoadingContainer to group related async sections. Use SmartLoadingSection for each source so header layout, counts, status messaging, and optional collapse stay consistent while the loaded body remains consumer-rendered."
      }
    }
  },
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Generic shell for progressive loading sections."
          layout="single"
          title="Async section states"
        >
          <SmartLoadingSection count={3} status="success" title="Success">
            <OneUIText>Success content stays entirely consumer-rendered.</OneUIText>
          </SmartLoadingSection>
          <SmartLoadingSection
            loadingLabel="Fetching section results..."
            status="loading"
            title="Loading"
          />
          <SmartLoadingSection
            delayedMessage="This source is taking longer than expected."
            status="delayed"
            title="Delayed"
          />
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

export const ConsumerOwnedContent: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Loaded content stays fully consumer-owned while the shell keeps status and layout consistent."
          layout="single"
          title="Consumer-owned content"
        >
          <SmartLoadingSection count={24} status="success" title="News">
            <OneUIText>Loaded content remains entirely consumer-rendered.</OneUIText>
          </SmartLoadingSection>
          <SmartLoadingSection
            actions={
              <OneUIButton appearance="transparent" size="small">
                View more
              </OneUIButton>
            }
            count={8}
            status="success"
            title="People"
          >
            <OneUIText>Results remain consumer-rendered while the shell stays reusable.</OneUIText>
          </SmartLoadingSection>
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const Refreshing: Story = {
  render: () => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Refreshing keeps existing content visible while background loading continues."
          layout="single"
          title="Refreshing section"
        >
          <SmartLoadingSection count={6} status="refreshing" title="Approvals">
            <OneUIText>
              Existing approval rows remain visible while fresh data is loading.
            </OneUIText>
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
        <SmartLoadingContainer
          description="Use collapsible sections when a source should optionally start closed or collapse after a state change."
          layout="single"
          title="Collapsible section"
        >
          <SmartLoadingSection collapsible defaultCollapsed status="loading" title="People" />
        </SmartLoadingContainer>
      </div>
    );
  }
};
