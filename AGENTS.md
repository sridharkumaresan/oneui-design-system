# OneUI Design System — Agent Instructions

You are working inside the OneUI Design System monorepo.

## Primary Goals

Build and maintain a production-grade, enterprise React component ecosystem under the npm scope:

@functions-oneui/*

The system includes:

- Design tokens
- Fluent UI v9 theming
- Atoms (published as a single package)
- Individually published organism packages
- Shared utilities and testing infrastructure
- Storybook documentation
- Strong accessibility guarantees
- GitLab-friendly CI/CD
- Future SPFx integration

---

## Non-Negotiable Technical Constraints

### Package Management
- Use pnpm workspaces ONLY
- Do NOT use npm or yarn
- Do NOT introduce Nx or Lerna

### Build & Orchestration
- Use Turborepo for task orchestration
- Use Changesets for versioning and publishing
- Each package must build independently

### React & UI Stack
- React 18+
- Fluent UI v9 only (@fluentui/react-components)
- Styling via Griffel only
- No legacy Fabric UI or Fluent v8 components

### Theming
- Token-driven theming
- Support light and dark themes
- No hardcoded colors inside components
- All visual styles must derive from tokens or Fluent theme values

### Accessibility
All interactive components MUST:

- Be keyboard accessible
- Provide visible focus styles
- Follow ARIA best practices
- Pass automated axe checks
- Respect prefers-reduced-motion

Accessibility regressions are considered blocking issues.

---

## Repository Architecture Rules

### Package Layout

packages/
  tokens/
  theme/
  standards/
  utils/
  react-utils/
  testing/
  atoms/
  organisms/<name>/
  data-access/ (optional)
  telemetry/ (optional)
  spfx-webparts/ (future)

apps/
  storybook/
  playground/ (optional)

configs/
  shared configuration files

docs/
  architecture and contribution docs

---

## Package Dependency Direction

Allowed dependency flow:

tokens → theme → atoms → organisms → apps/webparts

Lower layers MUST NOT depend on higher layers.

Utilities may be depended on by any layer.

---

## Coding Standards

- TypeScript strict mode required
- No default exports for components
- Public API must be exported from package root index
- Internal helpers must remain private
- Prefer composition over inheritance
- Avoid unnecessary runtime dependencies
- Keep packages tree-shakeable

---

## Testing Requirements

Each UI package must include:

- Unit tests (Vitest + React Testing Library)
- Accessibility checks using axe
- Storybook stories for all public components

Critical interaction components should later include Playwright tests.

---

## Storybook Rules

- Stories must be colocated with components
- Controls should be provided for key props
- Include at least one accessibility example
- Do not embed application logic inside stories

---

## Versioning & Releases

- Independent versioning per package
- Changesets required for any runtime change
- Docs-only changes may skip version bumps
- Follow semantic versioning principles

---

## Dependency Policy

- React and ReactDOM must be peerDependencies
- Avoid heavy or unnecessary dependencies
- Prefer internal utilities over external packages when feasible

---

## Git & Commit Standards

- Follow Conventional Commits
- Keep commits focused and descriptive
- Do not include unrelated changes

---

## CI Expectations

Merge requests should pass:

- Lint
- Typecheck
- Tests
- Build
- Storybook build
- Changeset validation (when applicable)

---

## When Uncertain

Prefer:

- Simplicity over cleverness
- Maintainability over novelty
- Accessibility over visual flair
- Explicit configuration over hidden magic

Do NOT introduce new tools or frameworks without strong justification.