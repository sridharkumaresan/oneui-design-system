# Setup

## Supported Baseline

- Native macOS and native Windows `cmd` / PowerShell
- Node.js `22.x` with corporate target `22.22.0`
- pnpm `10.0.0`

This workspace does not require admin-only setup scripts. Install dependencies natively on each OS and do not transfer `node_modules`, `.pnpm-store`, or built artifacts between machines.

## Install

```bash
pnpm install
```

## Validate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @functions-oneui/storybook run build
```

## Storybook

```bash
pnpm dev:storybook
```

## Dependency Audit

Before changing direct dependency versions or refreshing the lockfile against the corporate mirror:

```bash
pnpm audit:registry
```
