# Contributing

## Requirements

- Use `pnpm` workspace commands only.
- Follow Conventional Commits.
- Add a Changeset for runtime-affecting package changes.
- Keep direct dependency versions exact and registry-audited.

## Local Validation

Run before opening a merge request:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm --filter @functions-oneui/storybook run build`
- `pnpm verify`

Before updating direct dependency versions or refreshing `pnpm-lock.yaml`:

- `pnpm audit:registry`

## Test Dashboards

- Run Vitest UI locally with `pnpm test:ui`.
- Target a specific package with `ONEUI_TEST_UI_FILTER`, for example:
  `ONEUI_TEST_UI_FILTER=@functions-oneui/atoms pnpm test:ui`

## Merge Request Gate

- Merge requests should require passing CI (`lint`, `typecheck`, `test`, `build`).
- In GitLab project settings, keep "Pipelines must succeed" enabled.
