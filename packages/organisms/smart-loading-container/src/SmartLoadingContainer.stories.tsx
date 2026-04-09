import type { Meta, StoryObj } from "@storybook/react";

import React from "react";

import { OneUIButton, OneUIText } from "@functions-oneui/atoms";
import { IllustratedState } from "@functions-oneui/organism-illustrated-state";

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
  args: {
    surfaceAppearance: "raised"
  },
  argTypes: {
    surfaceAppearance: {
      control: "inline-radio",
      options: ["raised", "flat"]
    }
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Use SmartLoadingContainer to group related async sections. Use SmartLoadingSection for each source so header layout, counts, status messaging, and optional collapse stay consistent while the loaded body remains consumer-rendered."
      }
    }
  },
  render: (args) => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Generic shell for progressive loading sections."
          layout="single"
          surfaceAppearance={args.surfaceAppearance}
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
          <SmartLoadingSection
            emptyContent={
              <IllustratedState
                description="Try another keyword, adjust the filters, or search a broader scope."
                surfaceAppearance="borderless"
                title="No matching records"
                variant="no-results"
              />
            }
            status="empty"
            title="Empty"
          />
          <SmartLoadingSection
            errorContent={
              <IllustratedState
                description="The source did not respond. You can retry this section or keep browsing other results."
                primaryAction={{ label: "Try again", onClick: () => undefined }}
                surfaceAppearance="borderless"
                title="Unable to load this section"
                variant="error"
              />
            }
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
  render: (args) => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Loaded content stays fully consumer-owned while the shell keeps status and layout consistent."
          layout="single"
          surfaceAppearance={args.surfaceAppearance}
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
          <SmartLoadingSection
            emptyContent={
              <IllustratedState
                description="Profiles will appear here after colleagues start matching the search."
                surfaceAppearance="borderless"
                title="No people found"
                variant="no-results"
              />
            }
            status="empty"
            title="People"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const Refreshing: Story = {
  render: (args) => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Refreshing keeps existing content visible while background loading continues."
          layout="single"
          surfaceAppearance={args.surfaceAppearance}
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
  render: (args) => {
    return (
      <div style={storyShellStyle}>
        <SmartLoadingContainer
          description="Use collapsible sections when a source should optionally start closed or collapse after a state change."
          layout="single"
          surfaceAppearance={args.surfaceAppearance}
          title="Collapsible section"
        >
          <SmartLoadingSection
            collapseOnEmpty
            collapsible
            emptyContent={
              <IllustratedState
                description="This section is empty right now, but you can still expand it to inspect the state body."
                surfaceAppearance="borderless"
                title="No records available"
                variant="no-data"
              />
            }
            status="empty"
            title="People"
          />
        </SmartLoadingContainer>
      </div>
    );
  }
};

export const FlatSections: Story = {
  args: {
    surfaceAppearance: "flat"
  }
};
