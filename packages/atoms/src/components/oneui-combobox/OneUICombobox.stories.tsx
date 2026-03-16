import type { Meta, StoryObj } from "@storybook/react";

import { OneUICombobox } from "./OneUICombobox.js";

const demoOptions = [
  { label: "All", value: "all" },
  { label: "People", value: "people" },
  { label: "Sites", value: "sites" },
  { label: "Documents", value: "documents" }
];

const meta = {
  title: "Atoms/OneUICombobox",
  component: OneUICombobox,
  args: {
    placeholder: "Select a scope",
    options: demoOptions,
    stretch: false,
    disabled: false
  },
  argTypes: {
    stretch: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    },
    freeform: {
      control: "boolean"
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Combobox atom built on Fluent UI v9 Combobox for controlled selection or freeform autocomplete inputs."
      }
    }
  }
} satisfies Meta<typeof OneUICombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Search scope"
  }
};

export const Freeform: Story = {
  args: {
    "aria-label": "Search suggestions",
    freeform: true,
    placeholder: "Search intranet"
  }
};

export const Disabled: Story = {
  args: {
    "aria-label": "Disabled scope",
    disabled: true
  }
};

export const Stretch: Story = {
  args: {
    "aria-label": "Stretch combobox",
    stretch: true
  },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <OneUICombobox {...args} />
    </div>
  )
};

export const AccessibilityNotes: Story = {
  args: {
    "aria-label": "Accessible scope combobox"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use an explicit accessible label and keep the option labels concise so keyboard and screen-reader navigation stay predictable."
      }
    }
  }
};
