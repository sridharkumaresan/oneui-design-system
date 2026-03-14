# Storybook App

Aggregate Storybook for the phase-1 OneUI workspace.

## Run Locally

- `pnpm dev:storybook`
- `pnpm --filter @functions-oneui/storybook run build`

Both commands are supported from native Windows `cmd` or PowerShell without helper scripts.

## Theme Toggle

- Storybook exposes a global `Theme` toolbar with `light` and `dark` modes.
- `.storybook/preview.mjs` wraps all stories in `OneUIProvider` so package stories inherit the same theme contract as apps.

## Logging Demo

- Storybook includes a `Foundation/Logging` page for the structured logging subsystem.
- The demo shows root provider setup, component-scoped logging, abort handling, and memory transport capture.
- Use this page as documentation and verification, not as a pattern for logging every render.

## Story Contribution

- Add colocated `*.stories.*` files under `packages/*/src/**`.
- Keep stories component-focused and token/theme-driven.
- Do not rely on deep imports or app-specific mock infrastructure in package stories.
