# Consumer Smoke Harness

This directory documents the generated consumer harness used by the local publishing workflow.

Generated projects are created at runtime under:

- `.local/local-publish/consumers/react18`
- `.local/local-publish/consumers/react19`

These projects are intentionally outside pnpm workspace globs and are installed with `pnpm --ignore-workspace` to avoid workspace linking.

See `docs/local-publishing.md` for workflow details.
