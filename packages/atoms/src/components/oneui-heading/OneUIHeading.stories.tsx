import type { Meta, StoryObj } from "@storybook/react";

import { OneUIHeading } from "./OneUIHeading.js";

const meta = {
  title: "Atoms/OneUIHeading",
  component: OneUIHeading,
  args: {
    children: "OneUI heading",
    level: 2,
    tone: "default",
    align: "start"
  },
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6]
    },
    tone: {
      control: "inline-radio",
      options: ["default", "secondary", "brand", "inverse"]
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"]
    }
  },
  parameters: {
    layout: "padded"
  }
} satisfies Meta<typeof OneUIHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "12px" }}>
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <OneUIHeading key={level} {...args} level={level as 1 | 2 | 3 | 4 | 5 | 6}>
          Heading level {level}
        </OneUIHeading>
      ))}
    </div>
  )
};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "12px" }}>
      <OneUIHeading {...args} tone="default">
        Default heading
      </OneUIHeading>
      <OneUIHeading {...args} tone="secondary">
        Secondary heading
      </OneUIHeading>
      <OneUIHeading {...args} tone="brand">
        Brand heading
      </OneUIHeading>
      <div style={{ background: "#1f1f1f", padding: "12px" }}>
        <OneUIHeading {...args} tone="inverse">
          Inverse heading
        </OneUIHeading>
      </div>
    </div>
  )
};

export const Alignment: Story = {
  parameters: {
    layout: "fullscreen"
  },
  render: (args) => (
    <div style={{ width: "100%", padding: "24px", display: "grid", gap: "12px" }}>
      <OneUIHeading {...args} align="start">
        Start aligned heading
      </OneUIHeading>
      <OneUIHeading {...args} align="center">
        Center aligned heading
      </OneUIHeading>
      <OneUIHeading {...args} align="end">
        End aligned heading
      </OneUIHeading>
    </div>
  )
};
