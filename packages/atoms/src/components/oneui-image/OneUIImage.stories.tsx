import type { Meta, StoryObj } from "@storybook/react";

import { OneUIImage } from "./OneUIImage.js";

const meta = {
  title: "Atoms/OneUIImage",
  component: OneUIImage,
  args: {
    alt: "Sample cover image",
    aspectRatio: "16 / 9",
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  argTypes: {
    borderRadius: {
      control: "text"
    },
    fit: {
      control: "inline-radio",
      options: ["cover", "contain", "fill", "none", "scale-down"]
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Resilient image atom with built-in loading, empty, and error states. Uses lazy loading by default and supports a fallback source."
      }
    }
  }
} satisfies Meta<typeof OneUIImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <OneUIImage {...args} />
    </div>
  )
};

export const WithFallback: Story = {
  args: {
    fallbackSrc:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    src: "https://example.invalid/does-not-exist.jpg"
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <OneUIImage {...args} />
    </div>
  )
};

export const Empty: Story = {
  args: {
    src: undefined
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <OneUIImage {...args} />
    </div>
  )
};

export const AccessibilityNotes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Always provide meaningful alt text when the image conveys content. Decorative usage should provide alt=\"\"."
      }
    }
  }
};
