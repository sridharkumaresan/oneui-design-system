import type { Meta, StoryObj } from "@storybook/react";

import { HeroBanner } from "./HeroBanner.js";

const heroBannerDefaultCode = `
import { HeroBanner } from "@functions-oneui/organism-hero-banner";

export function PortalHero(): JSX.Element {
  return (
    <HeroBanner
      title="Good morning, Sridhar"
      description="Welcome to Connections, how can we help you today?"
      backgroundColor="#14006d"
      contentTone="inverse"
      imageSrc="/assets/portal-hero-banner.png"
      imageAlt="Employee using a laptop"
    />
  );
}
`.trim();

const heroBannerConfigDrivenCode = `
import { HeroBanner } from "@functions-oneui/organism-hero-banner";

type HeroBannerWebPartConfig = {
  title: string;
  description?: string;
  backgroundColor?: string;
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: "start" | "end";
};

const heroBannerConfig: HeroBannerWebPartConfig = {
  title: "Good morning, Sridhar",
  description: "Welcome to Connections, how can we help you today?",
  backgroundColor: "#14006d",
  imageSrc: "/assets/portal-hero-banner.png",
  imageAlt: "Employee using a laptop",
  imagePosition: "end"
};

export function PortalHeroWebPart(): JSX.Element {
  return <HeroBanner {...heroBannerConfig} contentTone="inverse" />;
}
`.trim();

const demoImageSrc = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="heroGradient" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#15006f" />
      <stop offset="100%" stop-color="#2a0fa4" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#heroGradient)" />
  <path d="M980 0 L1180 0 L940 900 L760 900 Z" fill="#6ad7ff" opacity="0.65" />
  <path d="M1150 0 L1260 0 L1040 900 L950 900 Z" fill="#ffffff" opacity="0.2" />
  <circle cx="1320" cy="250" r="150" fill="#ff56ba" opacity="0.35" />
  <circle cx="1240" cy="610" r="210" fill="#00d2ff" opacity="0.3" />
  <rect x="1160" y="220" width="230" height="520" rx="24" fill="#2d2d2d" opacity="0.35" />
</svg>
`)}`;

const meta = {
  title: "Organisms/HeroBanner",
  component: HeroBanner,
  args: {
    title: "Good morning, Sridhar",
    description: "Welcome to Connections, how can we help you today?",
    backgroundColor: "#14006d",
    contentTone: "inverse",
    imageAlt: "Abstract hero artwork",
    imagePosition: "end",
    imageSrc: demoImageSrc,
    height: "immersive"
  },
  argTypes: {
    contentTone: {
      control: "inline-radio",
      options: ["default", "inverse"]
    },
    imagePosition: {
      control: "inline-radio",
      options: ["start", "end"]
    },
    height: {
      control: "inline-radio",
      options: ["comfortable", "immersive"]
    }
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "HeroBanner is a full-width organism for prominent page messaging and is designed to map cleanly into future SPFx full-width web part configuration."
      },
      source: {
        code: heroBannerDefaultCode,
        language: "tsx"
      }
    }
  }
} satisfies Meta<typeof HeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ConfigDrivenUsage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use a constrained configuration object when this organism is consumed from SPFx or another CMS-style integration layer."
      },
      source: {
        code: heroBannerConfigDrivenCode,
        language: "tsx"
      }
    }
  }
};

export const CustomBackground: Story = {
  args: {
    backgroundColor: "#0a5c53",
    title: "Explore curated resources",
    description: "Discover learning, communities, and quick links tailored to your role."
  }
};

export const ImageStart: Story = {
  args: {
    imagePosition: "start"
  }
};

export const DecorativeImage: Story = {
  args: {
    imageAlt: ""
  }
};

export const LongContent: Story = {
  args: {
    title:
      "Prepare your workspace, review the latest knowledge base updates, and get started with the highest-priority actions for today.",
    description:
      "This variant demonstrates long-form messaging for enterprise portals where communications teams need to balance tone, accessibility, and responsive stability without sacrificing layout quality."
  }
};

export const AccessibilityNotes: Story = {
  args: {
    title: "Accessible hero banner",
    description:
      "Use the title to label the region and provide image alt text only when the visual carries information not already present in the copy."
  },
  parameters: {
    docs: {
      description: {
        story:
          "For SPFx and other CMS-driven hosts, prefer a constrained field set: title, description, background color, image source, optional image alt, and image position."
      }
    }
  }
};
