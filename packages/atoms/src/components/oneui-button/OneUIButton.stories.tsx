import type { Meta, StoryObj } from "@storybook/react";

import { OneUIButton } from "./OneUIButton.js";

const meta = {
  title: "Atoms/OneUIButton",
  component: OneUIButton,
  args: {
    children: "Continue",
    appearance: "primary",
    size: "medium",
    stretch: false,
    disabled: false
  },
  argTypes: {
    appearance: {
      control: "inline-radio",
      options: ["primary", "secondary", "subtle", "transparent"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"]
    },
    stretch: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Primary action atom built on Fluent UI v9 Button with OneUI defaults and optional full-width layout."
      }
    }
  }
} satisfies Meta<typeof OneUIButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <OneUIButton {...args} appearance="primary">
        Primary
      </OneUIButton>
      <OneUIButton {...args} appearance="secondary">
        Secondary
      </OneUIButton>
      <OneUIButton {...args} appearance="subtle">
        Subtle
      </OneUIButton>
      <OneUIButton {...args} appearance="transparent">
        Transparent
      </OneUIButton>
    </div>
  )
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
      <OneUIButton {...args} size="small">
        Small
      </OneUIButton>
      <OneUIButton {...args} size="medium">
        Medium
      </OneUIButton>
      <OneUIButton {...args} size="large">
        Large
      </OneUIButton>
    </div>
  )
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Stretch: Story = {
  args: {
    stretch: true,
    children: "Full Width Action"
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <OneUIButton {...args}>{args.children}</OneUIButton>
    </div>
  )
};
