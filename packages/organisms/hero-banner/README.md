# @functions-oneui/organism-hero-banner

Full-width hero banner organism for landing surfaces, portal headers, and future SPFx full-width web parts.

## Purpose

`HeroBanner` is a publishable organism for high-visibility page messaging with:

- solid or semantic gradient surface variants
- title and optional description
- named composition slots for breadcrumb, widgets, search, aside content, and footer content
- a layout that spans the host width without relying on embedded hero artwork

## Usage

```tsx
import { OneUICard, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { HeroBanner } from "@functions-oneui/organism-hero-banner";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

<HeroBanner
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
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
      <OneUICard elevation="raised" padding="md">
        <OneUIStack gap="xs">
          <OneUIText size="bodySmall" tone="secondary" weight="semibold">
            Priorities
          </OneUIText>
          <OneUIText block size="bodyLarge" tone="inverse" weight="semibold">
            3 items need attention
          </OneUIText>
        </OneUIStack>
      </OneUICard>
    </div>
  }
  gradientRole="heroPrimary"
  supportingContent={<SearchAutocomplete scopeOptions={[{ label: "All", value: "all" }]} />}
  title="Good morning, Sridhar"
  topStart={
    <OneUICard elevation="raised" padding="sm">
      <OneUIText size="bodySmall" tone="inverse" weight="semibold">
        22°C · Mostly cloudy
      </OneUIText>
    </OneUICard>
  }
/>;
```

## Slot Model

Use the named slots to compose content without coupling features into the banner itself:

- `eyebrow`
- `topStart`
- `topEnd`
- `supportingContent`
- `aside`
- `footer`

## Recommended Standards

- Keep the component `width: 100%` and place it inside a true full-width host region instead of forcing `100vw` from the component.
- In SPFx, expose structured property-pane fields and let the web part map those fields into slot content.
- Prefer semantic gradient roles for branded hero moments and use solid surfaces when the page needs a simpler banner treatment.
- Keep titles short and descriptions to one or two lines for responsive stability.
- Prefer `contentTone="inverse"` for dark or saturated surfaces.
- Do not add feature-specific banner props for search, widgets, or cards. Those belong in slot content.

## Accessibility Notes

- The banner renders as a labeled region using the title.
- Decorative gradients should not communicate status on their own.
- Slot content remains responsible for its own keyboard and ARIA behavior.
