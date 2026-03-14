import type { Meta, StoryObj } from "@storybook/react";

import { OneUIButton } from "../oneui-button/OneUIButton.js";
import { OneUIHeading } from "../oneui-heading/OneUIHeading.js";
import { OneUIStack } from "../oneui-stack/OneUIStack.js";
import { OneUIText } from "../oneui-text/OneUIText.js";
import { OneUICard } from "./OneUICard.js";

const meta = {
  title: "Atoms/OneUICard",
  component: OneUICard,
  args: {
    padding: "md",
    elevation: "flat",
    accent: "none"
  },
  argTypes: {
    padding: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    elevation: {
      control: "inline-radio",
      options: ["flat", "raised"]
    },
    accent: {
      control: "inline-radio",
      options: ["none", "brand", "success", "danger"]
    }
  },
  parameters: {
    layout: "padded"
  }
} satisfies Meta<typeof OneUICard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = (accentLabel: string) => (
  <OneUIStack gap="sm">
    <OneUIHeading level={4}>{accentLabel}</OneUIHeading>
    <OneUIText tone="secondary" block>
      Cards provide a neutral, theme-driven surface for dense content, summaries, and grouped
      actions.
    </OneUIText>
    <OneUIStack direction="row" gap="sm">
      <OneUIButton size="small">Open</OneUIButton>
      <OneUIButton appearance="secondary" size="small">
        Dismiss
      </OneUIButton>
    </OneUIStack>
  </OneUIStack>
);

export const Default: Story = {
  render: (args) => <OneUICard {...args}>{sampleContent("Project summary")}</OneUICard>
};

export const Raised: Story = {
  args: {
    elevation: "raised"
  },
  render: Default.render
};

export const Accents: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "16px", width: "360px" }}>
      <OneUICard {...args} accent="brand">
        {sampleContent("Brand accent")}
      </OneUICard>
      <OneUICard {...args} accent="success">
        {sampleContent("Success accent")}
      </OneUICard>
      <OneUICard {...args} accent="danger">
        {sampleContent("Danger accent")}
      </OneUICard>
    </div>
  )
};
