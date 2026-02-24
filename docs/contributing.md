# Contributing

## Requirements

- Use `pnpm` workspace commands only
- Follow Conventional Commits
- Add a Changeset for runtime-affecting package changes

## Local Validation

Run before opening a merge request:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm verify` (pre-push equivalent; runs turbo-filtered typecheck + tests)

## Test Dashboards

- Run Vitest UI locally with `pnpm test:ui` (loads all workspace packages that expose `vitest.config.ts`).
- Optional: target a specific package by setting `ONEUI_TEST_UI_FILTER`, for example:
  `ONEUI_TEST_UI_FILTER=@functions-oneui/organism-action-panel pnpm test:ui`

## Merge Request Gate

- Merge requests should require passing CI (`lint`, `typecheck`, `test`, `build`).
- In GitLab project settings, keep "Pipelines must succeed" enabled to block merges when CI fails.
