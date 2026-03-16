import type { Meta, StoryObj } from "@storybook/react";

import { OneUIInput } from "./OneUIInput.js";

const meta = {
  title: "Atoms/OneUIInput",
  component: OneUIInput,
  args: {
    placeholder: "Search intranet",
    stretch: false,
    disabled: false,
    appearance: "outline"
  },
  argTypes: {
    appearance: {
      control: "inline-radio",
      options: ["outline", "underline", "filled-darker", "filled-lighter"]
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
          "Text input atom built on Fluent UI v9 Input with OneUI defaults and optional full-width layout."
      }
    }
  }
} satisfies Meta<typeof OneUIInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Search input"
  }
};

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "12px", width: "320px" }}>
      <OneUIInput {...args} aria-label="Outline input" appearance="outline" />
      <OneUIInput {...args} aria-label="Underline input" appearance="underline" />
      <OneUIInput {...args} aria-label="Filled darker input" appearance="filled-darker" />
    </div>
  )
};

export const Disabled: Story = {
  args: {
    "aria-label": "Disabled input",
    disabled: true,
    value: "Read only state"
  }
};

export const Stretch: Story = {
  args: {
    "aria-label": "Stretch input",
    stretch: true
  },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <OneUIInput {...args} />
    </div>
  )
};

export const AccessibilityNotes: Story = {
  args: {
    "aria-label": "Accessible search input"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Always provide a visible label or an explicit accessible name when the surrounding UI does not already label the input."
      }
    }
  }
};
