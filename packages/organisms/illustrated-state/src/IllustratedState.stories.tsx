import type { Meta, StoryObj } from "@storybook/react";

import React from "react";
import { tokens as fluentTokens } from "@fluentui/react-components";

import { OneUIBadge, OneUIText } from "@functions-oneui/atoms";

import { IllustratedState } from "./IllustratedState.js";

const stateStoryCode = `
import { IllustratedState } from "@functions-oneui/organism-illustrated-state";

export function EmptySearchState(): JSX.Element {
  return (
    <IllustratedState
      variant="no-results"
      title="No results found"
      description="Try a broader search or clear some filters."
      primaryAction={{
        label: "Try again",
        onClick: () => {
          // retry search
        }
      }}
    />
  );
}
`.trim();

const frameStyle = {
  margin: "0 auto",
  maxWidth: "720px",
  width: "100%"
} satisfies React.CSSProperties;

const stateCardStyle = {
  display: "grid",
  minWidth: 0,
  minHeight: "100%"
} satisfies React.CSSProperties;

const meta = {
  title: "Organisms/IllustratedState",
  component: IllustratedState,
  args: {
    variant: "no-results",
    title: "No results found",
    description: "Try a broader search, clear some filters, or search with different keywords.",
    primaryAction: {
      label: "Try again"
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "custom",
        "error",
        "info",
        "loading",
        "no-access",
        "no-data",
        "no-recent",
        "no-results"
      ]
    }
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "IllustratedState is the shared surface for page-level or panel-level empty, loading, access, and explanatory states. Use it when one clear message is better than repeating feedback across multiple sections."
      }
    }
  },
  render: (args) => {
    const primaryAction = args.primaryAction
      ? {
          ...args.primaryAction,
          onClick: args.primaryAction.onClick ?? (() => undefined)
        }
      : undefined;
    const secondaryAction = args.secondaryAction
      ? {
          ...args.secondaryAction,
          onClick: args.secondaryAction.onClick ?? (() => undefined)
        }
      : undefined;

    return (
      <div style={frameStyle}>
        <IllustratedState
          {...args}
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
        />
      </div>
    );
  }
} satisfies Meta<typeof IllustratedState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: stateStoryCode,
        language: "tsx"
      }
    }
  }
};

export const States: Story = {
  name: "Built-in States",
  render: () => {
    return (
      <div
        style={{
          alignItems: "stretch",
          display: "grid",
          gap: "1rem",
          gridAutoRows: "1fr",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
        }}
      >
        {(["no-results", "no-data", "no-recent", "no-access", "loading", "error"] as const).map(
          (variant) => (
            <div key={variant} style={stateCardStyle}>
              <IllustratedState style={{ height: "100%" }} variant={variant} />
            </div>
          )
        )}
      </div>
    );
  }
};

export const CustomComposition: Story = {
  args: {
    actions: (
      <>
        <OneUIBadge appearance="soft" tone="brand">
          Preview mode
        </OneUIBadge>
      </>
    ),
    children: (
      <OneUIText tone="secondary">
        You can inject product-specific guidance, links, filters, or other supporting elements below
        the main message.
      </OneUIText>
    ),
    description: "This example replaces the default actions with custom content from the caller.",
    illustration: (
      <div
        aria-hidden="true"
        style={{
          alignItems: "center",
          background: `linear-gradient(180deg, ${fluentTokens.colorNeutralBackground2} 0%, ${fluentTokens.colorNeutralBackground1} 100%)`,
          border: `1px solid ${fluentTokens.colorNeutralStroke2}`,
          borderRadius: "28px",
          display: "grid",
          gridTemplateRows: "1fr auto",
          height: "152px",
          overflow: "hidden",
          placeItems: "center",
          width: "196px"
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            paddingInline: "18px",
            paddingTop: "18px",
            width: "100%"
          }}
        >
          <span
            style={{
              backgroundColor: fluentTokens.colorBrandBackground2,
              borderRadius: "9999px",
              display: "inline-flex",
              height: "14px",
              width: "56px"
            }}
          />
          <span
            style={{
              backgroundColor: fluentTokens.colorBrandBackground,
              borderRadius: "12px",
              display: "inline-flex",
              height: "14px",
              width: "38px"
            }}
          />
        </div>
        <div
          style={{
            alignItems: "center",
            backgroundColor: fluentTokens.colorBrandBackground,
            borderRadius: "24px 24px 0 0",
            color: fluentTokens.colorNeutralForegroundOnBrand,
            display: "inline-flex",
            fontWeight: 600,
            height: "92px",
            justifyContent: "center",
            width: "92px"
          }}
        >
          i
        </div>
      </div>
    ),
    title: "Custom information state",
    variant: "custom"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `children`, `actions`, or a custom `illustration` when the built-in variants are not enough. This is the recommended path for product-specific guidance without rebuilding the layout."
      }
    }
  }
};

export const EmbeddedInContainer: Story = {
  args: {
    description: "This version removes its own outer chrome so it can sit inside another surface.",
    surfaceAppearance: "borderless",
    title: "No results in this section",
    variant: "no-results"
  }
};
