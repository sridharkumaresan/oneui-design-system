---
name: repo-bootstrap
description: Initialize the OneUI Design System monorepo with workspace tooling, structure, and baseline configuration
---

## Objective

Create the foundational structure and tooling for the OneUI Design System repository.

## Requirements

Initialize a pnpm workspace monorepo that uses:

- pnpm workspaces
- Turborepo for task orchestration
- Changesets for versioning
- Shared configuration via configs/
- Documentation scaffolding
- No UI components yet

## Expected Structure

Create top-level directories:

- apps/
- packages/
- configs/
- docs/
- .changeset/

Inside packages/ create empty package folders:

- tokens
- theme
- standards
- utils
- react-utils
- testing
- atoms
- organisms (container only)

Inside apps/ create:

- storybook/
- playground/ (optional)

## Tooling Setup

Configure:

- pnpm workspace configuration
- turbo pipeline tasks (lint, typecheck, test, build)
- TypeScript base configuration
- ESLint configuration
- Prettier configuration
- Commitlint and lint-staged hooks
- Changesets initialization

## Constraints

- Do NOT add any UI component implementations
- Do NOT install unnecessary dependencies
- Ensure scripts run successfully even if packages are empty

## Success Criteria

- Workspace installs successfully
- Lint/typecheck/test/build scripts run without errors
- Repository structure matches architecture guidelines