# @functions-oneui/organism-hero-banner

Full-width hero banner organism package for landing surfaces, portal headers, and future SPFx full-width web parts.

## Purpose

This package exposes two public components:

- `HeroBanner`: the generic, long-term organism
- `BrandedHeroBanner`: the constrained phase-1 adoption wrapper for teams that need the approved OneUI gradient hero without exposing arbitrary surface controls

`HeroBanner` is the generic publishable organism for high-visibility page messaging with:

- solid or semantic gradient surface variants
- title and optional description
- named composition slots for breadcrumb, widgets, search, aside content, and footer content
- a layout that spans the host width without relying on embedded hero artwork

`BrandedHeroBanner` is the recommended phase-1 migration surface for existing SPFx or React experiences that need to adopt the new gradient banner design quickly while keeping their own search, breadcrumb, and widget logic.

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
  gradientName="deepSpectrum"
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

## Phase-1 Branded Wrapper

Use `BrandedHeroBanner` when the consuming team should adopt the approved brand shell instead of choosing arbitrary background colors or images.

```tsx
import { BrandedHeroBanner } from "@functions-oneui/organism-hero-banner";

<BrandedHeroBanner
  description="Welcome to Connections, how can we help you today?"
  title="Good morning, Sridhar"
  variant="primary"
/>;
```

The wrapper intentionally limits the surface API to:

- `variant="primary" | "secondary"`
- title, description, and the same named slots as `HeroBanner`

It does not expose:

- raw `gradientName`
- `surfaceVariant`
- arbitrary `backgroundColor`
- banner background image inputs

## Slot Model

Use the named slots to compose content without coupling features into the banner itself:

- `eyebrow`
- `topStart`
- `topEnd`
- `supportingContent`
- `aside`
- `footer`

Both `HeroBanner` and `BrandedHeroBanner` use the same slot model. The wrapper only locks the visual surface; it does not change composition.

## SPFx Adoption Guidance

For phase-1 SPFx migration:

- keep the property pane simple
- map a small enum like `primary | secondary` to the wrapper `variant`
- map boolean toggles like `showSearch` or `showBreadcrumb` to slot content in the web-part React layer
- keep existing feature logic outside the design-system package and pass that content into slots

Recommended property-pane inputs:

- `title`
- `description`
- `variant`
- `showSearch`
- `showBreadcrumb`
- `showTopStartPanel`
- `showTopEndPanel`

Avoid reintroducing these controls in the consuming web part if the goal is brand enforcement:

- arbitrary banner color pickers
- background image selection
- raw gradient strings

## Recommended Standards

- Keep the component `width: 100%` and place it inside a true full-width host region instead of forcing `100vw` from the component.
- In SPFx, expose structured property-pane fields and let the web part map those fields into slot content.
- For phase-1 adoption, prefer `BrandedHeroBanner` over `HeroBanner` so the approved gradient shell is enforced consistently.
- Prefer the canonical gradients for branded hero moments and use solid surfaces when the page needs a simpler banner treatment.
- Keep titles short and descriptions to one or two lines for responsive stability.
- Prefer `contentTone="inverse"` for dark or saturated surfaces.
- Do not add feature-specific banner props for search, widgets, or cards. Those belong in slot content.

## Accessibility Notes

- The banner renders as a labeled region using the title.
- Decorative gradients should not communicate status on their own.
- Slot content remains responsible for its own keyboard and ARIA behavior.
