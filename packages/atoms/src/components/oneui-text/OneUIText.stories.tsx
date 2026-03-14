import type { Meta, StoryObj } from "@storybook/react";

import { OneUIText } from "./OneUIText.js";

const meta = {
  title: "Atoms/OneUIText",
  component: OneUIText,
  args: {
    children: "OneUI body copy keeps components token-first and theme-aware.",
    tone: "primary",
    size: "body",
    weight: "regular",
    block: false,
    truncate: false
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["primary", "secondary", "brand", "success", "danger", "inverse"]
    },
    size: {
      control: "inline-radio",
      options: ["caption", "body", "bodyLarge"]
    },
    weight: {
      control: "inline-radio",
      options: ["regular", "medium", "semibold", "bold"]
    },
    block: {
      control: "boolean"
    },
    truncate: {
      control: "boolean"
    }
  },
  parameters: {
    layout: "padded"
  }
} satisfies Meta<typeof OneUIText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "8px" }}>
      <OneUIText {...args} tone="primary">
        Primary tone text
      </OneUIText>
      <OneUIText {...args} tone="secondary">
        Secondary tone text
      </OneUIText>
      <OneUIText {...args} tone="brand">
        Brand tone text
      </OneUIText>
      <OneUIText {...args} tone="success">
        Success tone text
      </OneUIText>
      <OneUIText {...args} tone="danger">
        Danger tone text
      </OneUIText>
      <div style={{ background: "#1f1f1f", padding: "12px" }}>
        <OneUIText {...args} tone="inverse">
          Inverse tone text
        </OneUIText>
      </div>
    </div>
  )
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "8px" }}>
      <OneUIText {...args} size="caption">
        Caption size
      </OneUIText>
      <OneUIText {...args} size="body">
        Body size
      </OneUIText>
      <OneUIText {...args} size="bodyLarge">
        Body large size
      </OneUIText>
    </div>
  )
};

export const Truncated: Story = {
  args: {
    block: true,
    truncate: true,
    children:
      "This is a long line of text to demonstrate truncation inside a constrained width container for cards, panels, and other dense layouts."
  },
  render: (args) => (
    <div style={{ width: "240px" }}>
      <OneUIText {...args}>{args.children}</OneUIText>
    </div>
  )
};
