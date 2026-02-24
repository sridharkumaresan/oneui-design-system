---
name: release
description: Prepare packages for versioning and publishing using Changesets
---

## Objective

Ensure packages are ready for release following semantic versioning principles.

## Versioning Rules

- Independent versioning per package
- Changesets required for runtime changes
- Patch for fixes
- Minor for backward-compatible features
- Major for breaking changes

## Validation Tasks

Check that:

- Packages build successfully
- Tests pass
- Public API changes are documented
- Changelog entries are generated
- Peer dependency requirements are correct

## Publishing Target

Packages will be published under:

@functions-oneui/*

Assume publishing will occur via CI.

## Safety Constraints

- Do not publish automatically unless explicitly instructed
- Avoid accidental version bumps across unrelated packages

## Success Criteria

- Release plan accurately reflects changes
- Version increments follow semver rules
- Repository is ready for CI-based publishing