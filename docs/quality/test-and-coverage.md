# Test And Coverage Evidence

OneUI uses two complementary evidence layers:

1. Automated test coverage for engineers.
2. Storybook quality evidence for consumers and stakeholders.

Coverage is useful, but it does not prove visual quality, accessibility, or design-token correctness by itself. For design-system packages, coverage should be read together with axe checks, Storybook examples, package builds, and release verification.

## Coverage Commands

Run coverage for one Vitest package:

```bash
pnpm --filter @functions-oneui/atoms test:coverage
```

Run coverage for every package that exposes `test:coverage`:

```bash
pnpm test:coverage
```

Each package writes a browser-readable report to:

```text
<package>/coverage/index.html
```

For example:

```text
packages/atoms/coverage/index.html
packages/cache/coverage/index.html
packages/organisms/hero-banner/coverage/index.html
```

## What The HTML Report Shows

The Vitest V8 coverage report shows:

- statement coverage
- branch coverage
- function coverage
- line coverage
- highlighted source files showing covered and uncovered paths

The report is intentionally not committed. It is generated locally or in CI as an artifact.

## What Coverage Does Not Prove

Coverage does not prove:

- visual polish
- keyboard accessibility
- correct ARIA semantics
- design-token quality
- Storybook render health
- package publish readiness

Those are validated through additional commands and stories.

## Recommended Quality Gate

Before publishing a runtime change, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm run release:verify
```

For UI-heavy or hook-heavy packages, also run:

```bash
pnpm --filter <package-name> test:coverage
```

## Current Coverage Scope

Coverage is enabled for Vitest-based packages. Packages that still use Node's built-in test runner, such as some token/theme contract tests, continue to rely on deterministic contract assertions rather than an HTML coverage report.

That is intentional for now. Contract tests often prove more than line coverage for data-heavy packages because they validate exact public behavior and required token paths.

## Visual Showcase

Storybook includes a `Foundation / Quality Evidence` page that explains:

- which validation layers exist
- how to run coverage
- where the HTML report is generated
- which commands prove publish readiness
- how coverage complements Storybook and accessibility checks

