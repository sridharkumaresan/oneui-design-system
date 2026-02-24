# Storybook App

Aggregate Storybook for OneUI packages.

## Theme Toggle

A global toolbar control (`Theme`) is available in Storybook to switch between `light` and `dark` modes.

- The toolbar value updates `globals.themeMode`
- All stories are wrapped by `OneUIProvider` in `.storybook/preview.mjs`
- Theme mode is applied consistently across every story without per-story setup

## Story Contribution

Packages should contribute stories by adding `*.stories.*` files next to source components under `packages/**/src/**`.

Story discovery includes:

- `apps/storybook/src/**/*.stories.*` (aggregate app placeholders)
- `packages/**/src/**/*.stories.*` (package source stories)
- atom `_template` files use `*.story-template.ts` and are intentionally not indexed

Keep stories focused on component behavior and accessibility; avoid embedding app-specific business logic.

## Search Layout Showcase

The showcase story demonstrates a parent-page pattern where multiple `SmartSection` instances are coordinated by shared submit state:

- parent updates one shared `requestKey` on submit to trigger parallel refetches
- parent passes shared `requestParams` (for example `{ q: submittedQuery }`)
- sections keep local request lifecycle logic; page owns layout and query flow

Run showcase locally with mock API:

- `pnpm dev:showcase` (starts Storybook + mock API)

For mock endpoint details and demo query modes, see `apps/mock-api/README.md`.
