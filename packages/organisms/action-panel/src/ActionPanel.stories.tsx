import type { Meta, StoryObj } from "@storybook/react";

import { ActionPanel } from "./ActionPanel.js";

const actionPanelDefaultCode = `
import { ActionPanel } from "@functions-oneui/organism-action-panel";

export function ReleaseReviewPanel(): JSX.Element {
  return (
    <ActionPanel
      title="Release review"
      description="Review the current rollout status before publishing the next change set."
      primaryAction={{
        label: "Approve",
        onClick: () => {
          // handle approve
        }
      }}
      secondaryAction={{
        label: "View details",
        onClick: () => {
          // handle details
        }
      }}
    />
  );
}
`.trim();

const actionPanelStackedCode = `
import { ActionPanel } from "@functions-oneui/organism-action-panel";

export function TenantNoticePanel(): JSX.Element {
  return (
    <ActionPanel
      title="New tenant onboarding"
      description="Complete the remaining checks before requesting production access."
      layout="stacked"
      primaryAction={{
        label: "Continue",
        onClick: () => {
          // proceed to the next step
        }
      }}
      secondaryAction={{
        label: "Save draft",
        onClick: () => {
          // save progress
        }
      }}
    />
  );
}
`.trim();

const meta = {
  title: "Organisms/ActionPanel",
  component: ActionPanel,
  args: {
    title: "Release review",
    description: "Review the current rollout status before publishing the next change set.",
    layout: "inline",
    primaryAction: {
      label: "Approve"
    },
    secondaryAction: {
      label: "View details"
    }
  },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["inline", "stacked"]
    }
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ActionPanel is a publishable organism for concise callouts that combine structured content with primary and secondary actions."
      }
    }
  },
  render: (args) => {
    const primaryAction = {
      ...args.primaryAction,
      onClick: args.primaryAction.onClick ?? (() => undefined)
    };
    const secondaryAction = args.secondaryAction
      ? {
          ...args.secondaryAction,
          onClick: args.secondaryAction.onClick ?? (() => undefined)
        }
      : undefined;

    return (
      <div style={{ maxWidth: "720px", width: "100%" }}>
        <ActionPanel {...args} primaryAction={primaryAction} secondaryAction={secondaryAction} />
      </div>
    );
  }
} satisfies Meta<typeof ActionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: actionPanelDefaultCode,
        language: "tsx"
      }
    }
  }
};

export const WithSecondaryAction: Story = {
  parameters: {
    docs: {
      source: {
        code: actionPanelDefaultCode,
        language: "tsx"
      }
    }
  }
};

export const StackedLayout: Story = {
  args: {
    layout: "stacked"
  },
  parameters: {
    docs: {
      source: {
        code: actionPanelStackedCode,
        language: "tsx"
      }
    }
  }
};

export const LongContent: Story = {
  args: {
    title: "Quarterly compliance review and tenant provisioning readiness assessment",
    description:
      "Validate the release checklist, audit dependencies, confirm the rollback plan, and route final sign-off to the operations team before the environment window closes."
  }
};

export const DisabledActions: Story = {
  args: {
    primaryAction: {
      label: "Approve",
      disabled: true
    },
    secondaryAction: {
      label: "View details",
      disabled: true
    }
  }
};

export const AccessibilityNotes: Story = {
  args: {
    title: "Accessible action panel",
    description:
      "This organism renders a labeled region and preserves visible focus styling through the OneUI button atom."
  },
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard users encounter the secondary action first, then the primary action. The title labels the region for assistive technologies."
      }
    }
  }
};
