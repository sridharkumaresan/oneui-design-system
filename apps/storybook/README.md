# Storybook App

Aggregate Storybook for the phase-1 OneUI workspace.

## Run Locally

- `pnpm dev:storybook`
- `pnpm --filter @functions-oneui/storybook run build`

Both commands are supported from native Windows `cmd` or PowerShell without helper scripts.

## Theme Toggle

- Storybook exposes a global `Theme` toolbar with `light` and `dark` modes.
- `.storybook/preview.mjs` wraps all stories in `OneUIProvider` so package stories inherit the same theme contract as apps.

## Foundation Pages

- `Foundation/Theme Provider` verifies global theme wiring.
- `Foundation/Color System` documents the semantic color contract used by components and shows live role values for the active theme mode.
- `Foundation/Gradient System` catalogs raw gradient primitives and demonstrates how semantic surfaces use them for hero surfaces, compact panels, icon backplates, and section/header accents.
- `Foundation/Responsive Breakpoints` documents the shared breakpoint scale, the media/container query guidance, and includes live width-preset component canvases plus a resizable lab.
- `Foundation/Logging` documents the structured logging subsystem.

## Story Contribution

- Add colocated `*.stories.*` files under `packages/*/src/**` or `packages/organisms/*/src/**`.
- Keep stories component-focused and token/theme-driven.
- Use semantic surface keys from `@functions-oneui/theme` for component APIs; use raw gradients only in foundation-level documentation.
- Do not rely on deep imports or app-specific mock infrastructure in package stories.
