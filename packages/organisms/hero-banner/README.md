# @functions-oneui/organism-hero-banner

Full-width hero banner organism for landing surfaces, portal headers, and future SPFx full-width web parts.

## Purpose

`HeroBanner` is a publishable organism for high-visibility page messaging with:

- configurable background color
- primary image slot
- title and optional description
- left or right image placement
- default or inverse content tone for contrast

## Usage

```tsx
import { HeroBanner } from "@functions-oneui/organism-hero-banner";

<HeroBanner
  title="Good morning, Sridhar"
  description="Welcome to Connections, how can we help you today?"
  backgroundColor="#14006d"
  contentTone="inverse"
  imageSrc="/assets/hero-banner.png"
  imageAlt="Employee using a laptop"
/>;
```

## Recommended Standards

- Keep the component `width: 100%` and place it inside a true full-width host region instead of forcing `100vw` from the component.
- In SPFx, map `backgroundColor` to a tenant-approved palette or site theme setting instead of arbitrary author-entered colors when governance matters.
- Provide `imageAlt` only when the image conveys information. Leave it empty for decorative imagery.
- Keep titles short and descriptions to one or two lines for responsive stability.
- Prefer `contentTone="inverse"` for dark or saturated backgrounds.

## Accessibility Notes

- The banner renders as a labeled region using the title.
- Decorative images are hidden from assistive technologies when `imageAlt` is omitted.
- No motion is required for comprehension, which keeps the organism SPFx-safe and reduced-motion friendly.

## Development Commands

- `pnpm --filter @functions-oneui/organism-hero-banner build`
- `pnpm --filter @functions-oneui/organism-hero-banner test`
- `pnpm --filter @functions-oneui/organism-hero-banner typecheck`
