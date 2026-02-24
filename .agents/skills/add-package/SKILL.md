---
name: add-package
description: Create a new publishable package following OneUI standards
---

## Objective

Add a new package to the monorepo that conforms to all architectural rules.

## Package Requirements

Each package must:

- Live under packages/ (or packages/organisms/<name>)
- Use TypeScript
- Provide independent build capability
- Export a public API from src/index
- Be tree-shakeable
- Include README

## Configuration

Add:

- package metadata
- build script
- lint script
- typecheck script
- test script

Ensure compatibility with:

- pnpm workspaces
- Turborepo pipeline
- Changesets publishing

## Dependency Rules

- React must be a peer dependency for UI packages
- Internal packages should be referenced via workspace protocol
- Avoid circular dependencies

## Documentation

Add a README explaining:

- Purpose of the package
- Public API overview
- Usage examples (high-level)

## Success Criteria

- Package builds successfully
- Package integrates into workspace pipelines
- No architectural rule violations