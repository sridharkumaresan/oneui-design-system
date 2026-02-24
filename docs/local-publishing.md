# Local Publishing (Verdaccio)

This runbook validates OneUI packages from a consumer perspective using a local npm registry.

## What It Covers

- Start a local Verdaccio registry (Docker first, local-process fallback).
- Authenticate and publish snapshot versions of runtime packages.
- Validate install/typecheck/build/render in isolated consumer apps for React 18 and React 19.

Runtime seed packages:

- `@functions-oneui/tokens`
- `@functions-oneui/theme`
- `@functions-oneui/atoms`
- `@functions-oneui/organism-action-panel`
- `@functions-oneui/organism-smart-section`

The publish workflow automatically includes required internal runtime dependencies (for example `@functions-oneui/react-utils`, `@functions-oneui/utils`) in topological order.

## Commands

- Start registry: `pnpm run local-publish:start-registry`
- Login/create token: `pnpm run local-publish:login`
- Create disposable snapshot workspace: `pnpm run local-publish:snapshot-version`
- Publish snapshot packages: `pnpm run local-publish:publish-local`
- Run consumer smoke matrix (React 18 + 19): `pnpm run local-publish:consumer-smoke`
- Full flow: `pnpm run local-publish:all`
- Stop registry: `pnpm run local-publish:stop-registry`
- Cleanup temp workspaces/consumers: `pnpm run local-publish:cleanup`
- Cleanup + wipe registry storage: `pnpm run local-publish:cleanup:hard`

## Where Artifacts Go

All local-publish artifacts are under `.local/local-publish/`:

- `verdaccio/`: config, storage, and log files
- `workspaces/`: disposable snapshot workspaces
- `consumers/`: generated React 18/19 consumer projects
- `auth.npmrc`: scoped registry auth used by publish/install commands
- `state.json`: workflow state

## Environment Variables

- `ONEUI_LOCAL_REGISTRY_URL` (default: `http://127.0.0.1:4873`)
- `ONEUI_LOCAL_DIST_TAG` (default: `snapshot`)
- `ONEUI_LOCAL_SNAPSHOT_TAG` (default: `local`)
- `ONEUI_LOCAL_UPSTREAM_REGISTRY_URL` (default: `https://registry.npmjs.org/`)
- `ONEUI_DEFAULT_REGISTRY_URL` (optional fallback for upstream registry)
- `ONEUI_LOCAL_REGISTRY_USER` (default: `oneui-local`)
- `ONEUI_LOCAL_REGISTRY_PASSWORD` (default: `oneui-local-pass`)
- `ONEUI_LOCAL_REGISTRY_EMAIL` (default: `oneui-local@example.com`)
- `ONEUI_VERDACCIO_CONTAINER_NAME` (default: `oneui-verdaccio`)

## Consumer Validation Checks

Each generated consumer validates:

1. Install from Verdaccio (`@functions-oneui/*`) and npmjs (other dependencies).
2. Typecheck with strict settings.
3. Bundle build with `esbuild`.
4. Runtime render smoke using root imports only:
   - tokens semantic export usage
   - theme provider usage
   - atoms button render
   - action-panel render
   - smart-section render

## Troubleshooting

- Auth failures (`E401`, adduser/login errors):
  - Re-run `pnpm run local-publish:login`
  - Check `.local/local-publish/auth.npmrc`
- Version collision (`EPUBLISHCONFLICT`):
  - Re-run `pnpm run local-publish:publish-local` (creates fresh snapshot workspace)
- Peer dependency issues in consumer:
  - Inspect generated consumer `.npmrc` and installed React/ReactDOM versions
- Wrong registry routing:
  - Verify consumer `.npmrc` has `@functions-oneui:registry=<verdaccio-url>`
- Workspace leakage into consumer install:
  - Consumer installs run with `pnpm --ignore-workspace`
- Docker unavailable:
  - Workflow falls back to local `pnpm dlx verdaccio@6`
- `changeset version` warning on paths with spaces (`/bin/sh: ... No such file or directory`):
  - snapshot publish can still complete, but prefer running the repo from a path without spaces for clean output

## Optional CI Extension

Recommended first step is a non-blocking job (`allow_failure: true`) that:

1. starts Verdaccio (service container),
2. runs `local-publish:publish-local`,
3. runs `local-publish:consumer-smoke`.

After reliability is proven, move this check to a required gate for release-focused branches.
