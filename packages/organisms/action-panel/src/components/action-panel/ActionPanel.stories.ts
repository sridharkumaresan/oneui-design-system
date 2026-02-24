// @ts-nocheck
import React from "react";

import { ActionPanel } from "./ActionPanel.js";

const meta = {
  title: "Organisms/ActionPanel",
  component: ActionPanel,
  args: {
    title: "Review Request",
    description: "Approve or request changes for this item.",
    layout: "inline",
    primaryAction: {
      label: "Approve",
      onClick: () => undefined
    }
  },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["inline", "stacked"]
    }
  }
};

export default meta;

export const Default = {
  render: (args) => React.createElement(ActionPanel, args)
};

export const WithSecondaryAction = {
  args: {
    secondaryAction: {
      label: "Request Changes",
      onClick: () => undefined
    }
  },
  render: (args) => React.createElement(ActionPanel, args)
};

export const StackedLayout = {
  args: {
    layout: "stacked",
    secondaryAction: {
      label: "Request Changes",
      onClick: () => undefined
    }
  },
  render: (args) =>
    React.createElement(
      "div",
      { style: { width: "340px" } },
      React.createElement(ActionPanel, args)
    )
};

export const DisabledActions = {
  args: {
    primaryAction: {
      label: "Approve",
      onClick: () => undefined,
      disabled: true
    },
    secondaryAction: {
      label: "Request Changes",
      onClick: () => undefined,
      disabled: true
    }
  },
  render: (args) => React.createElement(ActionPanel, args)
};

export const LongTextWrap = {
  args: {
    title:
      "Quarterly governance and compliance review for platform onboarding and cross-tenant security approvals",
    description:
      "This request contains multiple policy exceptions and supporting documentation that need explicit acknowledgement before progressing to production rollout.",
    secondaryAction: {
      label: "Open Details",
      onClick: () => undefined
    }
  },
  render: (args) =>
    React.createElement(
      "div",
      { style: { width: "360px" } },
      React.createElement(ActionPanel, args)
    )
};
