---
name: gradient-system
description: Add a maintainable branded gradient design system across tokens and theme, with semantic roles, fallback colors, and controlled component usage guidance
---

## Objective

Implement branded gradients in the design system in a scalable, reusable, and maintainable way.

This must work with the existing architecture:
- raw design tokens live in @functions-oneui/tokens
- semantic usage roles live in @functions-oneui/theme
- atoms/organisms consume semantic roles, not raw gradient values

## Requirements

### Raw gradients in tokens
Add a dedicated gradient token model in the tokens package.

Each raw gradient must be represented as structured data, not just a CSS string.

Each gradient token should support:
- id/name
- type (linear)
- direction/angle
- ordered color stops
- generated CSS string
- fallback solid color

### Semantic roles in theme
Add semantic gradient roles in the theme package so components use names like:
- heroPrimary
- heroSecondary
- featureSurface
- softPromotionalSurface
- iconAccent
- decorativePastelSurface

Do not expose components to raw gradient names as the primary API.

### Fallbacks
Each semantic role must include a fallback solid color.

### Theme support
Prepare both light and dark mappings, even if initially they share the same gradient values.

### Usage guidance
Document where gradients should be used:
- hero/banner backgrounds
- icon backgrounds
- selective feature surfaces
- section/header accents

Document where gradients should not be overused:
- dense result row surfaces
- input backgrounds
- data-heavy repeated item backgrounds

### Storybook
Add a Storybook showcase that demonstrates approved gradient usage for:
- hero banner surface
- icon background
- section or panel accent

Do not over-apply gradients to all components.

## Success Criteria

- Gradients are modeled in tokens as structured data
- Semantic usage roles are available from theme
- Fallback colors exist
- Storybook showcases approved usage
- Docs explain do/don’t guidance
- The system is easy to evolve without changing component APIs