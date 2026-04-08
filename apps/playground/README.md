# Playground App

Internal Vite playground for validating composed OneUI patterns outside Storybook.

## Included Demos

- enterprise search with multiple async sections
- task dashboard with multiple async sections

## What The Demo Proves

- reusable organisms remain props-only and do not own fetching
- `useProgressiveLoading` can coordinate multiple async loaders with delayed, empty, success, and error outcomes
- consumers can render arbitrary section bodies while reusing the same progress and section shells
- the same loading primitives support a search-style content page and a dashboard-style work surface without coupling the reusable packages to either domain

## Demo Scenarios

- `Enterprise search`
  Shows a content-first search experience with a top progress header, a stronger main column, a slimmer right rail, mixed async outcomes, and per-section retry.
- `Task dashboard`
  Shows stable section ordering, progressive hydration in place, and a more sectional productivity layout using the same hook and organisms.

## Run Locally

- `pnpm dev:playground`
- `pnpm --filter @functions-oneui/playground run build`
