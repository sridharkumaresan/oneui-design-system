import { tokens } from "@fluentui/react-components";
import type { Meta, StoryObj } from "@storybook/react";

import { OneUIButton, OneUICard, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { defineOneUISurfacePolicy } from "@functions-oneui/theme";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

import { HeroBanner } from "./HeroBanner.js";

const overlayPanelStyle = {
  backgroundColor: tokens.colorNeutralBackgroundAlpha2,
  border: `1px solid ${tokens.colorNeutralStrokeAlpha2}`,
  borderRadius: tokens.borderRadiusXLarge,
  color: tokens.colorNeutralForegroundInverted,
  minWidth: "11rem",
  paddingBlock: tokens.spacingVerticalS,
  paddingInline: tokens.spacingHorizontalM
} as const;

const footerGridStyle = {
  display: "grid",
  gap: tokens.spacingHorizontalL,
  gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))"
} as const;

const heroBannerStoryPolicy = defineOneUISurfacePolicy({
  label: "HeroBanner story policy",
  allowedVariantKeys: [
    "heroPrimary",
    "heroSecondary",
    "heroSoft",
    "heroFresh",
    "heroDeep",
    "heroBlue",
    "heroLight",
    "heroPastel"
  ],
  allowedTypes: ["gradient", "solid"],
  defaultVariantKey: "heroPrimary"
});

const heroBannerComposedCode = `
import { OneUICard, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { HeroBanner } from "@functions-oneui/organism-hero-banner";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

export function PortalHero(): JSX.Element {
  return (
    <HeroBanner
      contentTone="inverse"
      description="Welcome to Connections, how can we help you today?"
      eyebrow={
        <SmartBreadcrumb
          items={[
            { id: "home", label: "Connections", href: "/" },
            { id: "current", label: "Hub sites" }
          ]}
        />
      }
      footer={
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))" }}>
          <OneUICard accent="danger" elevation="raised" padding="lg">
            <OneUIStack gap="xs">
              <OneUIText size="bodySmall" tone="secondary" weight="semibold">
                Approvals
              </OneUIText>
              <OneUIText block size="bodyLarge" weight="semibold">
                2 overdue
              </OneUIText>
              <OneUIText block size="bodySmall" tone="secondary">
                Review pending items before end of day.
              </OneUIText>
            </OneUIStack>
          </OneUICard>
        </div>
      }
      surfaceKey="heroPrimary"
      supportingContent={
        <SearchAutocomplete
          scopeOptions={[
            { label: "All", value: "all" },
            { label: "People", value: "people" }
          ]}
        />
      }
      title="Good morning, Sridhar"
      topEnd={<div style={{ padding: "0.75rem 1rem" }}>BARC.L 222.22</div>}
      topStart={<div style={{ padding: "0.75rem 1rem" }}>22°C · Mostly cloudy</div>}
    />
  );
}
`.trim();

const gradientPrimaryCode = `
import { HeroBanner } from "@functions-oneui/organism-hero-banner";

export function LandingHero(): JSX.Element {
  return (
    <HeroBanner
      description="Welcome to Connections, how can we help you today?"
      height="immersive"
      surfaceKey="heroPrimary"
      title="Good morning, Sridhar"
    />
  );
}
`.trim();

const solidBrandCode = `
import { HeroBanner } from "@functions-oneui/organism-hero-banner";

export function BrandHero(): JSX.Element {
  return (
    <HeroBanner
      description="Use the solid variant when a page needs a simpler branded surface without the extra visual weight of a gradient."
      surfaceKey="heroDeep"
      title="Solid primary brand surfaces still handle the default banner use case"
    />
  );
}
`.trim();

const heroBannerAsideCode = `
import { OneUIButton, OneUICard, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { HeroBanner } from "@functions-oneui/organism-hero-banner";

export function HeroWithAside(): JSX.Element {
  return (
    <HeroBanner
      description="Composed hero surfaces can place supporting media or panels in the aside slot."
      eyebrow={<OneUIText size="bodySmall">Composed hero surface</OneUIText>}
      surfaceKey="heroPrimary"
      title="Keep the banner generic and place supporting content alongside it"
      aside={
        <OneUICard elevation="raised" padding="lg">
          <OneUIStack gap="sm">
            <OneUIText size="bodySmall" tone="secondary" weight="semibold">
              Spotlight
            </OneUIText>
            <OneUIText block>
              Consumers can place an image, card rail, promo panel, or device mockup here without changing the banner package.
            </OneUIText>
            <OneUIButton appearance="primary">Open spotlight</OneUIButton>
          </OneUIStack>
        </OneUICard>
      }
    />
  );
}
`.trim();

const SummaryCard = (props: {
  accent?: "brand" | "danger" | "none" | "success";
  description: string;
  eyebrow: string;
  title: string;
}) => {
  const { accent = "none", description, eyebrow, title } = props;

  return (
    <OneUICard accent={accent} elevation="raised" padding="lg">
      <OneUIStack gap="xs">
        <OneUIText size="bodySmall" tone="secondary" weight="semibold">
          {eyebrow}
        </OneUIText>
        <OneUIText block size="bodyLarge" weight="semibold">
          {title}
        </OneUIText>
        <OneUIText block size="bodySmall" tone="secondary">
          {description}
        </OneUIText>
      </OneUIStack>
    </OneUICard>
  );
};

const meta = {
  title: "Organisms/HeroBanner",
  component: HeroBanner,
  args: {
    title: "Good morning, Sridhar",
    description: "Welcome to Connections, how can we help you today?",
    surfaceKey: "heroPrimary",
    height: "immersive"
  },
  argTypes: {
    surfaceKey: {
      control: "select",
      options: heroBannerStoryPolicy.allowedVariantKeys
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
          "HeroBanner is a full-width organism for prominent page messaging that now consumes the shared semantic surface system from @functions-oneui/theme. Named slots keep the banner generic while allowing search, breadcrumb, summary panels, and other consumer-provided content to be composed around it."
      }
    }
  }
} satisfies Meta<typeof HeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GradientPrimary: Story = {
  parameters: {
    docs: {
      source: {
        code: gradientPrimaryCode,
        language: "tsx"
      }
    }
  }
};

export const SolidBrand: Story = {
  args: {
    surfaceKey: "heroDeep",
    title: "Solid primary brand surfaces still handle the default banner use case",
    description:
      "Use a semantic solid hero surface when a page needs a simpler branded treatment without the extra visual weight of a gradient."
  },
  parameters: {
    docs: {
      source: {
        code: solidBrandCode,
        language: "tsx"
      }
    }
  }
};

export const WithSearchAndHighlights: Story = {
  parameters: {
    docs: {
      source: {
        code: heroBannerComposedCode,
        language: "tsx"
      }
    }
  },
  render: (args) => {
    return (
      <HeroBanner
        {...args}
        eyebrow={
          <SmartBreadcrumb
            items={[
              { href: "#home", id: "home", label: "Connections" },
              { href: "#hub", id: "hub", label: "Hub sites" },
              { id: "current", label: "People hub" }
            ]}
          />
        }
        footer={
          <div style={footerGridStyle}>
            <SummaryCard accent="danger" description="Review pending items before end of day." eyebrow="Approvals" title="2 overdue" />
            <SummaryCard accent="brand" description="Prioritize items due today and tomorrow." eyebrow="Tasks" title="5 due today" />
            <SummaryCard description="Mandatory training closes this week." eyebrow="Learning" title="4 to complete" />
          </div>
        }
        supportingContent={
          <SearchAutocomplete
            scopeOptions={[
              { label: "All", value: "all" },
              { label: "People", value: "people" },
              { label: "Knowledge", value: "knowledge" }
            ]}
            suggestions={[
              {
                description: "Open the employee directory",
                id: "1",
                label: "People directory",
                value: "people directory"
              },
              {
                description: "Go to support resources",
                id: "2",
                label: "Support hub",
                value: "support hub"
              }
            ]}
          />
        }
        topEnd={
          <div style={overlayPanelStyle}>
            <OneUIStack gap="none">
              <OneUIText size="bodySmall" tone="inverse" weight="semibold">
                BARC.L
              </OneUIText>
              <OneUIText size="bodySmall" tone="inverse">
                222.22 · LSE
              </OneUIText>
            </OneUIStack>
          </div>
        }
        topStart={
          <div style={overlayPanelStyle}>
            <OneUIStack gap="none">
              <OneUIText size="bodySmall" tone="inverse" weight="semibold">
                22°C · Mostly cloudy
              </OneUIText>
              <OneUIText size="bodySmall" tone="inverse">
                Today
              </OneUIText>
            </OneUIStack>
          </div>
        }
      />
    );
  }
};

export const WithAsideContent: Story = {
  parameters: {
    docs: {
      source: {
        code: heroBannerAsideCode,
        language: "tsx"
      }
    }
  },
  render: (args) => {
    return (
      <HeroBanner
        {...args}
        aside={
          <OneUICard elevation="raised" padding="lg">
            <OneUIStack gap="sm">
              <OneUIText size="bodySmall" tone="secondary" weight="semibold">
                Spotlight
              </OneUIText>
              <OneUIText block>
                The aside slot stays generic. Consumers can place an image, card rail, promo panel, or device mockup here without changing the banner package.
              </OneUIText>
              <OneUIButton appearance="primary">Open spotlight</OneUIButton>
            </OneUIStack>
          </OneUICard>
        }
        eyebrow={<OneUIText size="bodySmall">Composed hero surface</OneUIText>}
      />
    );
  }
};

export const FeatureSurface: Story = {
  args: {
    surfaceKey: "heroFresh",
    title: "Approved semantic gradients can support feature spotlights",
    description:
      "This variant demonstrates a lighter gradient role for low-density promotional surfaces and campaign headers."
  }
};
