# Releasing

## Versioning Model

- OneUI uses independent versioning with Changesets.
- Each publishable package under `@functions-oneui/*` gets its own version bump.
- Organisms are published individually (for example `@functions-oneui/organism-action-panel`) and are not bundled into a single organisms release.

## Organism Release Rules

1. Add a changeset for any runtime change in an organism package.
2. Choose semver bump per package impact:
   - `patch` for fixes
   - `minor` for backward-compatible features
   - `major` for breaking API/behavior changes
3. Keep dependency direction valid: `tokens -> theme -> atoms -> organisms -> apps/webparts`.
4. Ensure the organism package passes `lint`, `typecheck`, `test`, and `build` before merging.

## Publish Flow (CI)

1. Merge changes with changeset files.
2. Run `pnpm version-packages` in release workflow to apply version/changelog updates.
3. Publish with `pnpm release` from CI.

Do not publish manually from local machines unless explicitly required.

## Local Registry Validation

Before cutting production releases, run local consumer validation against Verdaccio:

1. `pnpm run local-publish:all`
2. Review consumer smoke output for React 18 and React 19.
3. `pnpm run local-publish:cleanup` when finished.

Detailed workflow and troubleshooting: `docs/local-publishing.md`.
