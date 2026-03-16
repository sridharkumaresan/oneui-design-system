import type { Meta, StoryObj } from "@storybook/react";

import { SmartBreadcrumb } from "./SmartBreadcrumb.js";

const meta = {
  title: "Organisms/SmartBreadcrumb",
  component: SmartBreadcrumb,
  args: {
    items: [
      { href: "#home", id: "home", label: "Connections" },
      { href: "#hub", id: "hub", label: "Hub sites" },
      { href: "#collab", id: "collab", label: "Collaboration" },
      { href: "#directory", id: "directory", label: "People directory" },
      { id: "current", label: "Leadership" }
    ],
    maxVisibleItems: 4
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "SmartBreadcrumb provides a reusable breadcrumb trail with predictable overflow behavior. It stays data-driven and leaves routing decisions to the consuming app or web part."
      }
    }
  }
} satisfies Meta<typeof SmartBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Expanded: Story = {
  args: {
    maxVisibleItems: 6
  }
};
