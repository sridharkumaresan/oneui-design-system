import type { Meta, StoryObj } from "@storybook/react";

import { OneUILink } from "./OneUILink.js";

const ExternalIcon = () => (
  <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
    <path d="M3 9 9 3M5 3h4v4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const meta = {
  title: "Atoms/OneUILink",
  component: OneUILink,
  args: {
    children: "Full details",
    href: "#details",
    tone: "brand",
    underline: "hover"
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["brand", "neutral", "inverse"]
    },
    underline: {
      control: "inline-radio",
      options: ["always", "hover", "none"]
    },
    disabled: {
      control: "boolean"
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Inline link and text-action atom for tertiary actions, metadata links, and compact navigational affordances."
      }
    }
  }
} satisfies Meta<typeof OneUILink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    children: "Open request",
    icon: <ExternalIcon />
  }
};

export const AsButtonAction: Story = {
  args: {
    href: undefined,
    onClick: () => undefined,
    children: "Show details"
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const AccessibilityNotes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `href` for navigation and `onClick` for inline UI actions. Disabled links render as non-interactive text and should not be the only path to critical actions."
      }
    }
  },
  render: (args) => <OneUILink {...args}>Full details</OneUILink>
};
