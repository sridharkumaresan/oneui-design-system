import type { Meta, StoryObj } from "@storybook/react";

import { SearchAutocomplete } from "./SearchAutocomplete.js";

const meta = {
  title: "Organisms/SearchAutocomplete",
  component: SearchAutocomplete,
  args: {
    defaultQuery: "",
    scopeOptions: [
      { label: "All", value: "all" },
      { label: "People", value: "people" },
      { label: "Knowledge", value: "knowledge" }
    ],
    suggestions: [
      {
        description: "Open the employee directory",
        id: "1",
        label: "People directory",
        value: "people directory"
      },
      {
        description: "Find workplace policy updates",
        id: "2",
        label: "Policies",
        value: "policies"
      },
      {
        description: "Go directly to help and support",
        id: "3",
        label: "Support hub",
        value: "support hub"
      }
    ]
  },
  argTypes: {
    hideSuggestionsUntilQuery: {
      control: "boolean"
    }
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "SearchAutocomplete is a composable hero-surface search organism with optional scope selection, controlled query submission, and lightweight suggestion affordances. It stays UI-only; consumers own search execution and result ranking."
      }
    }
  }
} satisfies Meta<typeof SearchAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPresetQuery: Story = {
  args: {
    defaultQuery: "people"
  }
};

export const WithoutScope: Story = {
  args: {
    scopeOptions: undefined,
    suggestions: [
      {
        description: "Find site navigation resources",
        id: "1",
        label: "Hub navigation",
        value: "hub navigation"
      }
    ]
  }
};
