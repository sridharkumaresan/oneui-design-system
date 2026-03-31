import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { OneUIBadge, OneUIButton, OneUILink, OneUIText } from "@functions-oneui/atoms";

import { ActionCard } from "./ActionCard.js";

import { makeStyles, Button } from "@fluentui/react-components";

const frame = (maxWidth: string) =>
  ({
    marginInline: "auto",
    maxWidth,
    width: "100%"
  }) as const;

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

const CalendarIcon = () => (
  <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
    <rect height="10" rx="2" stroke="currentColor" strokeWidth="1.3" width="10" x="2" y="2" />
    <path
      d="M4.5 1.5v2M9.5 1.5v2M2.5 5h9"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.3"
    />
  </svg>
);

const buildMeta = (owner: string, updatedAt: string) => (
  <>
    <OneUIText block tone="secondary">
      Owner <OneUILink href={`/people/${owner.toLowerCase().replace(/\s+/g, "-")}`}>{owner}</OneUILink>
    </OneUIText>
    <OneUIText block tone="secondary">Updated {updatedAt}</OneUIText>
  </>
);

const defaultActions = (
  <>
    <Button appearance="primary">Approve</Button>
    <OneUIButton appearance="secondary" size="large">
      Reject
    </OneUIButton>
    <OneUILink href="/details/10024" underline="always">
      Full details
    </OneUILink>
  </>
);

const meta = {
  title: "Organisms/ActionCard",
  component: ActionCard,
  args: {
    eyebrow: "ITEM | REF-10024",
    title: "Quarterly access review",
    meta: buildMeta("Maya Rivera", "03 Mar 2024, 10:13 GMT"),
    status: (
      <OneUIBadge appearance="filled" icon={<WarningIcon />} tone="danger">
        OVERDUE
      </OneUIBadge>
    ),
    actions: defaultActions,
    footer: "Review the environment checklist before final sign-off.",
    density: "default",
    layout: "auto",
    isDisabled: false
  },
  argTypes: {
    actions: { control: false },
    eyebrow: { control: false },
    footer: { control: false },
    meta: { control: false },
    status: { control: false },
    title: { control: false },
    density: {
      control: "inline-radio",
      options: ["default", "compact"]
    },
    layout: {
      control: "inline-radio",
      options: ["auto", "horizontal", "stacked"]
    },
    isDisabled: {
      control: "boolean"
    }
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ActionCard is a structured workflow surface with explicit content, status, divider, actions, and footer regions. Consumers provide content through named slots while the organism owns shell layout, action-rail behavior, and responsive transitions."
      }
    }
  },
  render: (args) => (
    <div style={frame("78rem")}>
      <ActionCard {...args} />
    </div>
  )
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopDefault: Story = {};

export const DesktopWithStatus: Story = {
  args: {
    footer: undefined
  }
};

export const DesktopWithActions: Story = {
  args: {
    status: undefined
  }
};

export const DesktopFull: Story = {
  args: {
    eyebrow: "IT REQUEST | REQ90578368-1",
    meta: (
      <>
        <OneUIText block tone="secondary">
          Recipient <OneUILink href="/people/person-name">Person name</OneUILink>
        </OneUIText>
        <OneUIText block tone="secondary">
          Raised by <OneUILink href="/people/beverley-sommer">Beverley Sommer</OneUILink> on 03 Mar
          2024, 10:13 GMT
        </OneUIText>
      </>
    ),
    title: "New Jabra headset"
  }
};

export const TabletCompressed: Story = {
  args: {
    eyebrow: "REVIEW | REF-20481"
  },
  render: (args) => (
    <div style={frame("48rem")}>
      <ActionCard {...args} />
    </div>
  )
};

export const MobileStacked: Story = {
  args: {
    layout: "stacked",
    title: "Request for a MacBook Pro",
    status: (
      <OneUIBadge appearance="soft" icon={<CalendarIcon />} tone="warning">
        DUE 16 APR 2025
      </OneUIBadge>
    )
  },
  render: (args) => (
    <div style={frame("26rem")}>
      <ActionCard {...args} />
    </div>
  )
};

export const LongTitle: Story = {
  args: {
    title:
      "Figma access and environment provisioning readiness review for extended partner onboarding across multiple teams"
  }
};

export const LongMeta: Story = {
  args: {
    meta: (
      <>
        <OneUIText block tone="secondary">
          Recipient <OneUILink href="/people/person-name">Person name</OneUILink>
        </OneUIText>
        <OneUIText block tone="secondary">
          Raised by <OneUILink href="/people/anil-lakhagoudar">Anil Lakhagoudar</OneUILink> on 03
          Mar 2024, 10:13 GMT with an extended supporting note to confirm that longer metadata wraps
          cleanly inside the content region without breaking the status rail or action rail.
        </OneUIText>
      </>
    )
  }
};

export const NoStatus: Story = {
  args: {
    status: undefined
  }
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    actions: (
      <>
        <OneUIButton disabled size="large">
          Approve
        </OneUIButton>
        <OneUIButton appearance="secondary" disabled size="large">
          Reject
        </OneUIButton>
        <OneUILink disabled underline="always">
          Full details
        </OneUILink>
      </>
    )
  }
};

export const Compact: Story = {
  args: {
    density: "compact",
    footer: undefined
  }
};

export const HorizontalDesktop: Story = {
  args: {
    layout: "horizontal"
  }
};

export const AutoResponsive: Story = {
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "1rem"
      }}
    >
      <div style={frame("78rem")}>
        <ActionCard {...args} />
      </div>
      <div style={frame("46rem")}>
        <ActionCard {...args} />
      </div>
      <div style={frame("26rem")}>
        <ActionCard {...args} />
      </div>
    </div>
  )
};

export const WorkflowShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A realistic approval/request-style composition built entirely from the generic ActionCard API."
      }
    }
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        marginInline: "auto",
        maxWidth: "80rem"
      }}
    >
      <ActionCard
        actions={defaultActions}
        eyebrow="IT REQUEST | REQ90578368-1"
        meta={
          <>
            <OneUIText block tone="secondary">
              Recipient <OneUILink href="/people/person-name">Person name</OneUILink>
            </OneUIText>
            <OneUIText block tone="secondary">
              Raised by <OneUILink href="/people/beverley-sommer">Beverley Sommer</OneUILink> on 03
              Mar 2024, 10:13 GMT
            </OneUIText>
          </>
        }
        status={
          <OneUIBadge appearance="filled" icon={<WarningIcon />} tone="danger">
            OVERDUE
          </OneUIBadge>
        }
        title="New Jabra headset"
      />
      <ActionCard
        actions={defaultActions}
        eyebrow="IT REQUEST | REQ90578368-1"
        meta={
          <>
            <OneUIText block tone="secondary">
              Recipient <OneUILink href="/people/person-name">Person name</OneUILink>
            </OneUIText>
            <OneUIText block tone="secondary">
              Raised by <OneUILink href="/people/yamini-puri">Yamini Puri</OneUILink> on 03 Mar
              2024, 10:13 GMT
            </OneUIText>
          </>
        }
        status={
          <OneUIBadge appearance="soft" icon={<CalendarIcon />} tone="warning">
            DUE 16 APR 2025
          </OneUIBadge>
        }
        title="Request for a MacBook Pro"
      />
      <ActionCard
        actions={defaultActions}
        eyebrow="IT REQUEST | REQ90578368-1"
        meta={
          <>
            <OneUIText block tone="secondary">
              Recipient <OneUILink href="/people/person-name">Person name</OneUILink>
            </OneUIText>
            <OneUIText block tone="secondary">
              Raised by <OneUILink href="/people/anil-lakhagoudar">Anil Lakhagoudar</OneUILink> on
              03 Mar 2024, 10:13 GMT
            </OneUIText>
          </>
        }
        status={
          <OneUIBadge appearance="outlined" icon={<CalendarIcon />} tone="info">
            DUE 04 MAY 2025
          </OneUIBadge>
        }
        title="Figma Access (CLIENT\\GLO-CLI-SEC-AZAD-Figma-Users)"
      />
    </div>
  )
};
