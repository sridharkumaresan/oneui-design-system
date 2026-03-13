# Releasing

## Versioning Model

- OneUI uses independent versioning with Changesets.
- Each publishable package under `@functions-oneui/*` gets its own version bump.
- Phase-1 publishable packages are `@functions-oneui/tokens`, `@functions-oneui/theme`, `@functions-oneui/testing`, and `@functions-oneui/atoms`.

## Release Rules

1. Add a changeset for any runtime change in a package.
2. Use semantic versioning per package impact.
3. Keep dependency direction valid: `tokens -> theme -> atoms -> organisms -> apps/webparts`.
4. Ensure the affected package passes `lint`, `typecheck`, `test`, and `build` before merging.

## Publish Flow

1. Merge changes with changeset files.
2. Run `pnpm version-packages` in the release workflow.
3. Publish with `pnpm release` from CI.

Do not publish manually from local machines unless explicitly required.
