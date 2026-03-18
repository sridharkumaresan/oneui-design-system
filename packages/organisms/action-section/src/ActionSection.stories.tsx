import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { OneUIBadge, OneUIButton, OneUILink, OneUIText } from "@functions-oneui/atoms";
import { ActionCard } from "@functions-oneui/organism-action-card";

import { ActionSection } from "./ActionSection.js";

const WarningIcon = () => (
  <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
    <path
      d="M7 1.5 12.5 12.5H1.5L7 1.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.4"
    />
    <path d="M7 5v3.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    <circle cx="7" cy="10.1" fill="currentColor" r="0.85" />
  </svg>
);

const actionRow = (
  <>
    <OneUIButton size="large">Approve</OneUIButton>
    <OneUIButton appearance="secondary" size="large">
      Reject
    </OneUIButton>
    <OneUILink href="/details/10024" underline="always">
      Full details
    </OneUILink>
  </>
);

const exampleCard = (title: string, owner: string, statusTone: "danger" | "warning" | "info") => (
  <ActionCard
    actions={actionRow}
    eyebrow="IT REQUEST | REQ90578368-1"
    meta={
      <>
        <OneUIText block tone="secondary">
          Recipient <OneUILink href="/people/person-name">Person name</OneUILink>
        </OneUIText>
        <OneUIText block tone="secondary">
          Raised by <OneUILink href={`/people/${owner.toLowerCase().replace(/\s+/g, "-")}`}>{owner}</OneUILink>{" "}
          on 03 Mar 2024, 10:13 GMT
        </OneUIText>
      </>
    }
    status={
      <OneUIBadge appearance={statusTone === "danger" ? "filled" : statusTone === "warning" ? "soft" : "outlined"} icon={<WarningIcon />} tone={statusTone}>
        {statusTone === "danger" ? "OVERDUE" : statusTone === "warning" ? "DUE 16 APR 2025" : "DUE 04 MAY 2025"}
      </OneUIBadge>
    }
    title={title}
  />
);

const meta = {
  title: "Organisms/ActionSection",
  component: ActionSection,
  args: {
    title: "IT Request",
    count: "3",
    headerAction: (
      <OneUILink href="/queues/it-request" underline="always">
        View all
      </OneUILink>
    ),
    children: exampleCard("New Jabra headset", "Beverley Sommer", "danger")
  },
  argTypes: {
    children: { control: false },
    count: { control: false },
    headerAction: { control: false },
    title: { control: false }
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ActionSection groups related ActionCards beneath a titled section header with an optional count and optional header action."
      }
    }
  },
  render: (args) => (
    <div style={{ marginInline: "auto", maxWidth: "80rem", width: "100%" }}>
      <ActionSection {...args} />
    </div>
  )
} satisfies Meta<typeof ActionSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSection: Story = {};

export const MultipleCards: Story = {
  args: {
    children: (
      <>
        {exampleCard("New Jabra headset", "Beverley Sommer", "danger")}
        {exampleCard("Request for a MacBook Pro", "Yamini Puri", "warning")}
        {exampleCard("Figma Access (CLIENT\\GLO-CLI-SEC-AZAD-Figma-Users)", "Anil Lakhagoudar", "info")}
      </>
    )
  }
};

export const WithHeaderAction: Story = {};

export const MobileSection: Story = {
  render: (args) => (
    <div style={{ marginInline: "auto", maxWidth: "26rem", width: "100%" }}>
      <ActionSection {...args} />
    </div>
  )
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", marginInline: "auto", maxWidth: "80rem", width: "100%" }}>
      <ActionSection
        count="3"
        headerAction={
          <OneUILink href="/queues/it-request" underline="always">
            IT Request
          </OneUILink>
        }
        title="IT Request"
      >
        {exampleCard("New Jabra headset", "Beverley Sommer", "danger")}
        {exampleCard("Request for a MacBook Pro", "Yamini Puri", "warning")}
        {exampleCard("Figma Access (CLIENT\\GLO-CLI-SEC-AZAD-Figma-Users)", "Anil Lakhagoudar", "info")}
      </ActionSection>
      <ActionSection
        count="1"
        headerAction={
          <OneUILink href="/queues/service-first" underline="always">
            ServiceFirst
          </OneUILink>
        }
        title="ServiceFirst"
      >
        {exampleCard("Network entitlement review", "Harriet Long", "warning")}
      </ActionSection>
    </div>
  )
};
