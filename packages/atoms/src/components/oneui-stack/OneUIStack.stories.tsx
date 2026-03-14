import type { Meta, StoryObj } from "@storybook/react";

import { OneUIButton } from "../oneui-button/OneUIButton.js";
import { OneUIStack } from "./OneUIStack.js";

const meta = {
  title: "Atoms/OneUIStack",
  component: OneUIStack,
  args: {
    direction: "column",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: false,
    stretch: false
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["row", "column"]
    },
    gap: {
      control: "inline-radio",
      options: ["none", "xxs", "xs", "sm", "md", "lg", "xl", "xxl"]
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end", "stretch"]
    },
    justify: {
      control: "inline-radio",
      options: ["start", "center", "end", "between"]
    },
    wrap: {
      control: "boolean"
    },
    stretch: {
      control: "boolean"
    }
  },
  parameters: {
    layout: "padded"
  }
} satisfies Meta<typeof OneUIStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoButtons = ["First", "Second", "Third", "Fourth"];

export const Default: Story = {
  render: (args) => (
    <OneUIStack {...args}>
      <OneUIButton>Primary action</OneUIButton>
      <OneUIButton appearance="secondary">Secondary action</OneUIButton>
      <OneUIButton appearance="subtle">Tertiary action</OneUIButton>
    </OneUIStack>
  )
};

export const RowLayout: Story = {
  args: {
    direction: "row",
    align: "center"
  },
  render: Default.render
};

export const Wrapped: Story = {
  args: {
    direction: "row",
    gap: "sm",
    wrap: true
  },
  render: (args) => (
    <div style={{ width: "260px" }}>
      <OneUIStack {...args}>
        {demoButtons.map((label) => (
          <OneUIButton key={label} appearance="secondary">
            {label}
          </OneUIButton>
        ))}
      </OneUIStack>
    </div>
  )
};

export const SpaceBetween: Story = {
  args: {
    direction: "row",
    justify: "between",
    stretch: true
  },
  render: (args) => (
    <div style={{ width: "420px" }}>
      <OneUIStack {...args}>
        <OneUIButton appearance="subtle">Back</OneUIButton>
        <OneUIButton>Continue</OneUIButton>
      </OneUIStack>
    </div>
  )
};
