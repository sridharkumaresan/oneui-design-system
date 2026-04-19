import React from "react";

const rows = [
  {
    area: "Lint",
    proof: "Static quality and script audit",
    command: "pnpm lint",
    output: "No warnings allowed"
  },
  {
    area: "Typecheck",
    proof: "Strict TypeScript contracts",
    command: "pnpm typecheck",
    output: "No type drift across packages"
  },
  {
    area: "Unit and contract tests",
    proof: "Behavioral assertions",
    command: "pnpm test",
    output: "Package-level test suites"
  },
  {
    area: "Coverage HTML",
    proof: "Visual source coverage report",
    command: "pnpm --filter <package> test:coverage",
    output: "<package>/coverage/index.html"
  },
  {
    area: "Build",
    proof: "Package and app compilation",
    command: "pnpm build",
    output: "dist and Storybook assets"
  },
  {
    area: "Release readiness",
    proof: "Changed package publish gate",
    command: "pnpm run release:verify",
    output: "lint + typecheck + test + build"
  }
];

const coveragePackages = [
  "@functions-oneui/atoms",
  "@functions-oneui/cache",
  "@functions-oneui/cache-react",
  "@functions-oneui/react-utils",
  "@functions-oneui/onboarding-core",
  "@functions-oneui/onboarding-react",
  "@functions-oneui/organism-action-card",
  "@functions-oneui/organism-action-panel",
  "@functions-oneui/organism-action-section",
  "@functions-oneui/organism-hero-banner",
  "@functions-oneui/organism-illustrated-state",
  "@functions-oneui/organism-search-autocomplete",
  "@functions-oneui/organism-smart-breadcrumb",
  "@functions-oneui/organism-smart-loading-container",
  "@functions-oneui/organism-smart-progress-bar",
  "@functions-oneui/utils"
];

const styles = {
  page: {
    color: "#1f1f1f",
    fontFamily:
      "'Barclays Effra', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    lineHeight: 1.5,
    maxWidth: 1120,
    padding: 32
  },
  eyebrow: {
    color: "#0050b5",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0,
    marginBottom: 8,
    textTransform: "uppercase"
  },
  title: {
    fontSize: 36,
    lineHeight: 1.12,
    margin: "0 0 12px"
  },
  intro: {
    color: "#4a4a4a",
    fontSize: 17,
    maxWidth: 780,
    margin: "0 0 28px"
  },
  grid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    marginBottom: 28
  },
  card: {
    background: "#ffffff",
    border: "1px solid #d8d8d8",
    padding: 20
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    margin: "0 0 8px"
  },
  cardText: {
    color: "#555555",
    fontSize: 14,
    margin: 0
  },
  table: {
    borderCollapse: "collapse",
    marginTop: 12,
    width: "100%"
  },
  th: {
    background: "#f5f7fa",
    border: "1px solid #d8d8d8",
    fontSize: 13,
    padding: "10px 12px",
    textAlign: "left"
  },
  td: {
    border: "1px solid #d8d8d8",
    fontSize: 13,
    padding: "10px 12px",
    verticalAlign: "top"
  },
  code: {
    background: "#f5f7fa",
    border: "1px solid #d8d8d8",
    display: "block",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 13,
    marginTop: 8,
    overflowX: "auto",
    padding: 12
  },
  packageList: {
    columns: "2 280px",
    margin: "12px 0 0",
    paddingLeft: 20
  },
  packageItem: {
    breakInside: "avoid",
    fontSize: 13,
    marginBottom: 6
  }
};

function QualityEvidence() {
  return (
    <main style={styles.page}>
      <div style={styles.eyebrow}>Foundation quality</div>
      <h1 style={styles.title}>Test and coverage evidence</h1>
      <p style={styles.intro}>
        OneUI uses coverage as an engineering artifact, not the only quality signal. The
        design-system gate combines linting, type checks, tests, package builds, Storybook
        builds, release verification, accessibility checks inside component tests, and
        package-level HTML coverage reports.
      </p>

      <section style={styles.grid} aria-label="Quality evidence summary">
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Coverage is visual</h2>
          <p style={styles.cardText}>
            Vitest packages can generate an HTML report at each package&apos;s
            coverage/index.html file so engineers can inspect covered and uncovered source
            paths.
          </p>
        </article>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Storybook is behavioral</h2>
          <p style={styles.cardText}>
            Stories show the component, token, and CSS contract behavior that line coverage
            cannot prove, including responsive and theme states.
          </p>
        </article>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Release verify is publish-focused</h2>
          <p style={styles.cardText}>
            release:verify validates the changed publishable packages through lint,
            typecheck, test, and build before a registry publish.
          </p>
        </article>
      </section>

      <section aria-labelledby="validation-matrix">
        <h2 id="validation-matrix">Validation matrix</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Area</th>
              <th style={styles.th}>What it proves</th>
              <th style={styles.th}>Command</th>
              <th style={styles.th}>Output</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.area}>
                <td style={styles.td}>{row.area}</td>
                <td style={styles.td}>{row.proof}</td>
                <td style={styles.td}>
                  <code>{row.command}</code>
                </td>
                <td style={styles.td}>{row.output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="coverage-command">
        <h2 id="coverage-command">How to generate HTML coverage</h2>
        <p>
          Use package-level coverage when reviewing a component or utility package in depth.
        </p>
        <code style={styles.code}>pnpm --filter @functions-oneui/atoms test:coverage</code>
        <p>
          Then open the generated report:
        </p>
        <code style={styles.code}>packages/atoms/coverage/index.html</code>
      </section>

      <section aria-labelledby="coverage-packages">
        <h2 id="coverage-packages">Packages with coverage scripts</h2>
        <ul style={styles.packageList}>
          {coveragePackages.map((name) => (
            <li key={name} style={styles.packageItem}>
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="coverage-boundary">
        <h2 id="coverage-boundary">Coverage boundary</h2>
        <p>
          Some data-heavy packages still use Node contract tests. For those packages, exact
          contract assertions are more useful than percentage targets. Coverage should guide
          engineering review, while Storybook and accessibility tests remain required for UI
          confidence.
        </p>
      </section>
    </main>
  );
}

export default {
  title: "Foundation/Quality Evidence",
  parameters: {
    docs: {
      disable: true
    },
    layout: "fullscreen"
  }
};

export const Overview = {
  render: () => <QualityEvidence />
};

