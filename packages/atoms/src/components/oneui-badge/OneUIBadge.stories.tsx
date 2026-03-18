import type { Meta, StoryObj } from "@storybook/react";

import { OneUIBadge } from "./OneUIBadge.js";

const WarningIcon = () => (
  <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
    <path d="M6 1.5 11 10.5H1L6 1.5Z" fill="currentColor" />
  </svg>
);

const meta = {
  title: "Atoms/OneUIBadge",
  component: OneUIBadge,
  args: {
    children: "Due 16 Apr 2025",
    appearance: "filled",
    tone: "warning",
    size: "md",
    shape: "pill"
  },
  argTypes: {
    appearance: {
      control: "inline-radio",
      options: ["filled", "soft", "outlined"]
    },
    tone: {
      control: "inline-radio",
      options: ["neutral", "brand", "success", "warning", "danger", "info"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"]
    },
    shape: {
      control: "inline-radio",
      options: ["rounded", "pill"]
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Generic status and metadata badge atom for short labels, pill status indicators, and compact semantic markers."
      }
    }
  }
} satisfies Meta<typeof OneUIBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "12px" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <OneUIBadge {...args} tone="neutral">
          Neutral
        </OneUIBadge>
        <OneUIBadge {...args} tone="brand">
          Brand
        </OneUIBadge>
        <OneUIBadge {...args} tone="success">
          Success
        </OneUIBadge>
        <OneUIBadge {...args} tone="warning">
          Warning
        </OneUIBadge>
        <OneUIBadge {...args} tone="danger">
          Danger
        </OneUIBadge>
        <OneUIBadge {...args} tone="info">
          Info
        </OneUIBadge>
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <OneUIBadge {...args} appearance="filled" tone="brand">
          Filled
        </OneUIBadge>
        <OneUIBadge {...args} appearance="soft" tone="warning">
          Soft
        </OneUIBadge>
        <OneUIBadge {...args} appearance="outlined" tone="info">
          Outlined
        </OneUIBadge>
      </div>
    </div>
  )
};

export const WithIcon: Story = {
  args: {
    children: "Overdue",
    icon: <WarningIcon />,
    tone: "danger"
  }
};

export const AccessibilityNotes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use badges for short semantic metadata and status markers. Do not rely on color alone to convey meaning; include clear text or an icon plus text."
      }
    }
  },
  render: (args) => <OneUIBadge {...args}>Due 16 Apr 2025</OneUIBadge>
};
