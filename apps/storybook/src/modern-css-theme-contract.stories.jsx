import React from "react";
import "@functions-oneui/tokens/styles.css";
import { OneUIBadge, OneUIButton, OneUIHeading, OneUIText } from "@functions-oneui/atoms";

const demoCss = `
@layer oneui.components {
  .modernThemeDemo {
    background: var(--oneui-color-background-canvas);
    color: var(--oneui-color-text-primary);
    display: grid;
    gap: var(--oneui-fluid-section-gap);
    min-block-size: 100vh;
    min-block-size: 100dvh;
    padding: clamp(1rem, 2vw, 2rem);
  }

  .modernThemeDemo__panel {
    background: var(--oneui-color-background-surface);
    border: 1px solid var(--oneui-color-border-default);
    box-shadow: var(--oneui-shadow-sm);
    display: grid;
    gap: var(--oneui-spacing-md);
    padding: var(--oneui-spacing-lg);
  }

  .modernThemeDemo__responsive {
    container-name: modern-card;
    container-type: inline-size;
  }

  .modernThemeDemo__responsiveCard {
    display: grid;
    gap: var(--oneui-spacing-md);
  }

  .modernThemeDemo__responsivePreview {
    border: 1px solid var(--oneui-color-border-default);
    display: grid;
    gap: var(--oneui-spacing-sm);
    padding: var(--oneui-spacing-md);
  }

  @container modern-card (min-width: 520px) {
    .modernThemeDemo__responsiveCard {
      grid-template-columns: 1fr 1fr;
    }
  }

  .modernThemeDemo__layeredButton {
    background: var(--oneui-color-background-brand);
    border: 1px solid var(--oneui-color-border-brand);
    color: var(--oneui-color-text-inverse);
    font: inherit;
    padding: var(--oneui-spacing-sm) var(--oneui-spacing-lg);
  }
}

@layer oneui.overrides {
  .modernThemeDemo [data-override-demo="true"] {
    background: var(--oneui-color-background-warning-subtle);
    border-color: var(--oneui-color-border-warning);
    color: var(--oneui-color-text-primary);
  }
}
`;

const meta = {
  title: "Foundation/Modern CSS Theme Contract",
  parameters: {
    docs: {
      disable: true
    },
    layout: "fullscreen",
    options: {
      showPanel: false
    }
  }
};

export default meta;

const Section = ({ children, eyebrow, title }) => (
  <section className="modernThemeDemo__panel">
    <div>
      <OneUIBadge appearance="outlined" tone="brand">
        {eyebrow}
      </OneUIBadge>
      <OneUIHeading level={2}>{title}</OneUIHeading>
    </div>
    {children}
  </section>
);

const TokenSwatch = ({ label, variable }) => (
  <div
    style={{
      alignItems: "center",
      display: "grid",
      gap: "var(--oneui-spacing-sm)",
      gridTemplateColumns: "2rem 1fr"
    }}
  >
    <span
      aria-hidden="true"
      style={{
        background: `var(${variable})`,
        border: "1px solid var(--oneui-color-border-default)",
        blockSize: "2rem",
        inlineSize: "2rem"
      }}
    />
    <div>
      <OneUIText weight="semibold">{label}</OneUIText>
      <OneUIText as="div" tone="secondary">
        {variable}
      </OneUIText>
    </div>
  </div>
);

export const Overview = () => {
  const [mode, setMode] = React.useState("light");

  return (
    <main className="modernThemeDemo" data-oneui-theme={mode}>
      <style>{demoCss}</style>

      <header className="modernThemeDemo__panel">
        <OneUIBadge appearance="filled" tone="brand">
          CSS-only contract
        </OneUIBadge>
        <OneUIHeading className="oneui-fluid-display" level={1}>
          Modern CSS theme contract
        </OneUIHeading>
        <OneUIText size="lg" tone="secondary">
          CSS variables, cascade layers, fluid sizing, dynamic viewport units, and container-query
          helpers are available from @functions-oneui/tokens without requiring React or Fluent.
        </OneUIText>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--oneui-spacing-sm)" }}>
          <OneUIButton appearance={mode === "light" ? "primary" : "secondary"} onClick={() => setMode("light")}>
            Light scope
          </OneUIButton>
          <OneUIButton appearance={mode === "dark" ? "primary" : "secondary"} onClick={() => setMode("dark")}>
            Dark scope
          </OneUIButton>
        </div>
      </header>

      <Section eyebrow="Theme scopes" title="CSS variables work without React">
        <div
          style={{
            display: "grid",
            gap: "var(--oneui-spacing-md)",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
          }}
        >
          <TokenSwatch label="Surface" variable="--oneui-color-background-surface" />
          <TokenSwatch label="Brand" variable="--oneui-color-background-brand" />
          <TokenSwatch label="Warning surface" variable="--oneui-color-background-warning-subtle" />
          <TokenSwatch label="Focus ring" variable="--oneui-shadow-focus-ring" />
        </div>
        <OneUIText tone="secondary">
          Consumers can set data-oneui-theme on any subtree. React components can still use
          OneUIProvider and Fluent tokens; CSS-only shells can use these variables directly.
        </OneUIText>
      </Section>

      <Section eyebrow="Container queries" title="Components respond to parent width">
        <div className="modernThemeDemo__responsive">
          <div className="modernThemeDemo__responsiveCard">
            <div className="modernThemeDemo__responsivePreview">
              <OneUIHeading level={3}>Reusable card</OneUIHeading>
              <OneUIText>
                Resize the Storybook canvas. The inner layout changes when this parent container is
                wide enough, not when the viewport reaches a global breakpoint.
              </OneUIText>
            </div>
            <div className="modernThemeDemo__responsivePreview">
              <OneUIHeading level={3}>Container-owned fit</OneUIHeading>
              <OneUIText>
                Use this pattern for organisms that can be embedded in narrow SPFx columns, panels,
                dashboards, or full-width pages.
              </OneUIText>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Fluid utilities" title="Opt-in clamp sizing">
        <OneUIHeading className="oneui-fluid-title" level={3}>
          Fluid type is available, but not forced
        </OneUIHeading>
        <OneUIText>
          The utility variables use clamp() for display text and section rhythm. Dense enterprise
          screens can stay static, while hero surfaces and dashboards can opt in deliberately.
        </OneUIText>
      </Section>

      <Section eyebrow="Cascade layers" title="Override order without specificity fights">
        <div style={{ display: "grid", gap: "var(--oneui-spacing-sm)" }}>
          <button className="modernThemeDemo__layeredButton" type="button">
            Component layer style
          </button>
          <button className="modernThemeDemo__layeredButton" data-override-demo="true" type="button">
            App override layer wins cleanly
          </button>
        </div>
        <OneUIText tone="secondary">
          OneUI ships a stable layer order: reset, tokens, base, components, utilities, overrides.
          Consumers can place app overrides in the final layer instead of adding brittle selectors.
        </OneUIText>
      </Section>

      <Section eyebrow="Guidance" title="What not to force">
        <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
          <li>
            <OneUIText>Use media queries for app shells and page chrome.</OneUIText>
          </li>
          <li>
            <OneUIText>Use container queries for reusable embedded components.</OneUIText>
          </li>
          <li>
            <OneUIText>Keep @scope, anchor positioning, scroll animation, and subgrid progressive.</OneUIText>
          </li>
          <li>
            <OneUIText>Do not import CSS assets in React packages unless they need CSS-only utilities.</OneUIText>
          </li>
        </ul>
      </Section>
    </main>
  );
};

