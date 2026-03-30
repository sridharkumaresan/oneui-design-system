import type { Meta, StoryObj } from "@storybook/react";

import { OneUICard, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

import { BrandedHeroBanner } from "./BrandedHeroBanner.js";

const brandedHeroDefaultCode = `
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";

export function PhaseOneBanner(): JSX.Element {
  return (
    <BrandedHeroBanner
      description="Welcome to Connections, how can we help you today?"
      title="Good morning, Sridhar"
    />
  );
}
`.trim();

const brandedHeroSlotsCode = `
import { OneUICard, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

export function PortalBanner(): JSX.Element {
  return (
    <BrandedHeroBanner
      description="Welcome to Connections, how can we help you today?"
      eyebrow={
        <SmartBreadcrumb
          items={[
            { href: "/", id: "home", label: "Connections" },
            { id: "current", label: "Hub sites" }
          ]}
        />
      }
      footer={
        <OneUICard elevation="raised" padding="lg">
          <OneUIStack gap="xs">
            <OneUIText size="bodySmall" tone="secondary" weight="semibold">
              Spotlight
            </OneUIText>
            <OneUIText block>
              Existing web-part logic can keep its own content and place it into the footer slot.
            </OneUIText>
          </OneUIStack>
        </OneUICard>
      }
      supportingContent={
        <SearchAutocomplete
          scopeOptions={[
            { label: "All", value: "all" },
            { label: "People", value: "people" }
          ]}
        />
      }
      title="Good morning, Sridhar"
      topEnd={<div>BARC.L 222.22</div>}
      topStart={<div>22°C · Mostly cloudy</div>}
    />
  );
}
`.trim();

const spfxAdapterCode = `
import type { ReactNode } from "react";

import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

type HeroBannerPaneProps = {
  title: string;
  description?: string;
  variant: "primary" | "secondary";
  showBreadcrumb: boolean;
  showSearch: boolean;
};

export function HomeHeroWebPart(props: HeroBannerPaneProps): JSX.Element {
  const eyebrow: ReactNode = props.showBreadcrumb ? (
    <SmartBreadcrumb
      items={[
        { href: "/", id: "home", label: "Connections" },
        { id: "current", label: "Hub sites" }
      ]}
    />
  ) : undefined;

  const supportingContent: ReactNode = props.showSearch ? (
    <SearchAutocomplete scopeOptions={[{ label: "All", value: "all" }]} />
  ) : undefined;

  return (
    <BrandedHeroBanner
      description={props.description}
      eyebrow={eyebrow}
      supportingContent={supportingContent}
      title={props.title}
      variant={props.variant}
    />
  );
}
`.trim();

const footerGridStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))"
} as const;

const CompactPanel = (props: { label: string; value: string }) => {
  const { label, value } = props;

  return (
    <OneUICard elevation="raised" padding="md">
      <OneUIStack gap="xs">
        <OneUIText size="bodySmall" tone="secondary" weight="semibold">
          {label}
        </OneUIText>
        <OneUIText block size="bodyLarge" weight="semibold">
          {value}
        </OneUIText>
      </OneUIStack>
    </OneUICard>
  );
};

const meta = {
  title: "Organisms/BrandedHeroBanner",
  component: BrandedHeroBanner,
  args: {
    title: "Good morning, Sridhar",
    description: "Welcome to Connections, how can we help you today?",
    variant: "primary",
    height: "immersive"
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary"]
    },
    height: {
      control: "inline-radio",
      options: ["tiny", "comfortable", "immersive"]
    }
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "BrandedHeroBanner is the phase-1 adoption wrapper for existing experiences that need the approved OneUI gradient hero surface without exposing arbitrary background color or image choices. Consumers keep their own React logic and place it into the banner slots."
      }
    }
  }
} satisfies Meta<typeof BrandedHeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: brandedHeroDefaultCode,
        language: "tsx"
      }
    }
  }
};

export const SecondaryVariant: Story = {
  args: {
    variant: "secondary",
    description: "Use the secondary brand gradient where teams need the darker approved hero treatment."
  }
};

export const WithExistingSlotContent: Story = {
  parameters: {
    docs: {
      source: {
        code: brandedHeroSlotsCode,
        language: "tsx"
      }
    }
  },
  render: (args) => {
    return (
      <BrandedHeroBanner
        {...args}
        eyebrow={
          <SmartBreadcrumb
            items={[
              { href: "#home", id: "home", label: "Connections" },
              { id: "current", label: "Hub sites" }
            ]}
          />
        }
        footer={
          <div style={footerGridStyle}>
            <CompactPanel label="Approvals" value="2 overdue" />
            <CompactPanel label="Tasks" value="5 due today" />
            <CompactPanel label="Learning" value="4 to complete" />
          </div>
        }
        supportingContent={
          <SearchAutocomplete
            scopeOptions={[
              { label: "All", value: "all" },
              { label: "People", value: "people" }
            ]}
          />
        }
        topEnd={<OneUIText tone="inverse">BARC.L 222.22</OneUIText>}
        topStart={<OneUIText tone="inverse">22°C · Mostly cloudy</OneUIText>}
      />
    );
  }
};

export const SpfxPropertyPaneAdapter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This example shows the intended migration pattern: keep the web-part property pane simple, map those values into the wrapper, and keep existing React features in the named slots."
      },
      source: {
        code: spfxAdapterCode,
        language: "tsx"
      }
    }
  },
  render: (args) => {
    const propsFromPropertyPane = {
      title: args.title,
      description: args.description,
      variant: args.variant,
      showBreadcrumb: true,
      showSearch: true
    } as const;

    const eyebrow = propsFromPropertyPane.showBreadcrumb ? (
      <SmartBreadcrumb
        items={[
          { href: "#home", id: "home", label: "Connections" },
          { id: "current", label: "Hub sites" }
        ]}
      />
    ) : undefined;

    const supportingContent = propsFromPropertyPane.showSearch ? (
      <SearchAutocomplete scopeOptions={[{ label: "All", value: "all" }]} />
    ) : undefined;

    return (
      <BrandedHeroBanner
        description={propsFromPropertyPane.description}
        eyebrow={eyebrow}
        supportingContent={supportingContent}
        title={propsFromPropertyPane.title}
        variant={propsFromPropertyPane.variant}
      />
    );
  }
};
