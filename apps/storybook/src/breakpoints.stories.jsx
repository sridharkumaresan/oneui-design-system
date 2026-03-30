import React from "react";

import { useFluent } from "@fluentui/react-components";
import { ActionPanel } from "@functions-oneui/organism-action-panel";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";
import {
  createOneUIContainerQueryDown,
  createOneUIContainerQueryUp,
  createOneUIMediaQueryDown,
  createOneUIMediaQueryUp,
  oneuiBreakpoints
} from "@functions-oneui/theme";

const breakpointCode = `import {
  createOneUIContainerQueryDown,
  createOneUIMediaQueryUp,
  oneuiBreakpoints
} from "@functions-oneui/theme";

const stackedCardQuery = createOneUIContainerQueryDown("md", "actionCard");
const shellWideQuery = createOneUIMediaQueryUp("lg");
const tabletBreakpoint = oneuiBreakpoints.md; // "768px"`;

const breakpointSpecs = [
  {
    name: "xs",
    intent: "Smallest supported mobile viewport baseline.",
    usage: "Use sparingly for edge-case mobile compression, not as a default design target."
  },
  {
    name: "sm",
    intent: "Large phone and narrow embedded panel width.",
    usage: "Useful for compact search bars, pill stacks, and narrow card grids."
  },
  {
    name: "md",
    intent: "Tablet and narrow content-column breakpoint.",
    usage: "Default stack point for many organisms when horizontal layouts become cramped."
  },
  {
    name: "lg",
    intent: "Desktop content breakpoint.",
    usage: "Use for transitioning into roomier two-column or side-by-side layouts."
  },
  {
    name: "xl",
    intent: "Wide desktop breakpoint.",
    usage: "Use for expansive content surfaces and dashboard-style layouts."
  },
  {
    name: "xxl",
    intent: "Very wide workspace breakpoint.",
    usage: "Use for large enterprise canvases and high-density dashboard compositions."
  }
];

const responsiveRules = [
  {
    title: "Component layouts prefer container thinking",
    body: "Reusable organisms should be designed around the space their parent gives them. Container queries are the preferred long-term mechanism for that."
  },
  {
    title: "App shells still use media queries",
    body: "Viewport media queries remain valid for page-level navigation, shell chrome, and broader application layout shifts."
  },
  {
    title: "Breakpoints come from one source",
    body: "All breakpoint values come from @functions-oneui/tokens and are re-exported from @functions-oneui/theme helpers. Do not hardcode pixel literals in package styles."
  }
];

const meta = {
  title: "Foundation/Responsive Breakpoints",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "OneUI keeps breakpoint values in a single token source and uses shared helper APIs to build media and container queries. This page documents the scale and shows real component canvases sized to those breakpoint tokens."
      },
      source: {
        code: breakpointCode,
        language: "ts"
      }
    }
  }
};

export default meta;

const useObservedWidth = () => {
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (!ref.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect?.width;
      if (nextWidth) {
        setWidth(Math.round(nextWidth));
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, width];
};

const PreviewCanvas = ({ widthLabel, widthValue, theme }) => {
  return (
    <article
      style={{
        background: theme?.colorNeutralBackground2,
        border: `1px solid ${theme?.colorNeutralStroke2}`,
        borderRadius: theme?.borderRadiusXLarge ?? "1rem",
        display: "grid",
        gap: theme?.spacingVerticalM ?? "0.75rem",
        padding: theme?.spacingHorizontalL ?? "1rem"
      }}
    >
      <div>
        <strong>{widthLabel}</strong>
        <p style={{ color: theme?.colorNeutralForeground3, lineHeight: 1.5, margin: 0 }}>{widthValue} preset canvas</p>
      </div>
      <div
        style={{
          border: `1px dashed ${theme?.colorNeutralStroke2}`,
          borderRadius: theme?.borderRadiusLarge ?? "0.75rem",
          maxWidth: "100%",
          overflow: "hidden",
          width: widthValue
        }}
      >
        <div
          style={{
            display: "grid",
            gap: theme?.spacingVerticalL ?? "1rem",
            padding: theme?.spacingHorizontalL ?? "1rem"
          }}
        >
          <SmartBreadcrumb
            items={[
              { href: "#home", id: "home", label: "Connections" },
              { href: "#hub", id: "hub", label: "Hub sites" },
              { id: "current", label: `${widthLabel} canvas` }
            ]}
            maxVisibleItems={3}
          />
          <SearchAutocomplete
            scopeOptions={[
              { label: "All", value: "all" },
              { label: "People", value: "people" }
            ]}
            suggestions={[
              {
                description: "Open the employee directory",
                id: `${widthLabel}-1`,
                label: "People directory",
                value: "people directory"
              }
            ]}
          />
          <ActionPanel
            description="Same organism rendered inside a constrained canvas sized from the shared breakpoint scale."
            layout={widthLabel === "xs" || widthLabel === "sm" ? "stacked" : "inline"}
            primaryAction={{ label: "Approve" }}
            secondaryAction={{ label: "Details" }}
            title="Release review"
          />
        </div>
      </div>
    </article>
  );
};

const ResizableLab = ({ theme }) => {
  const [containerRef, width] = useObservedWidth();

  return (
    <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
      <div>
        <h2 style={{ margin: 0 }}>Interactive component lab</h2>
        <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0, maxWidth: "72ch" }}>
          Drag the lower-right edge of the preview frame to inspect real components inside widths derived from the shared scale. This is useful for component-fit review. Viewport-only media-query transitions should still be verified with browser resize or Storybook viewport testing.
        </p>
      </div>
      <div
        ref={containerRef}
        style={{
          background: theme?.colorNeutralBackground2,
          border: `1px solid ${theme?.colorNeutralStroke2}`,
          borderRadius: theme?.borderRadiusXLarge ?? "1rem",
          maxWidth: "100%",
          minWidth: "18rem",
          overflow: "auto",
          padding: theme?.spacingHorizontalL ?? "1rem",
          resize: "horizontal",
          width: oneuiBreakpoints.lg
        }}
      >
        <div style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
          <div>
            <strong>Observed width: {width || "-"}px</strong>
            <p style={{ color: theme?.colorNeutralForeground3, lineHeight: 1.5, margin: 0 }}>
              Shared token reference: sm {oneuiBreakpoints.sm}, md {oneuiBreakpoints.md}, lg {oneuiBreakpoints.lg}
            </p>
          </div>
          <SmartBreadcrumb
            items={[
              { href: "#home", id: "home", label: "Connections" },
              { href: "#docs", id: "docs", label: "Design system" },
              { id: "current", label: "Responsive lab" }
            ]}
            maxVisibleItems={4}
          />
          <SearchAutocomplete
            scopeOptions={[
              { label: "All", value: "all" },
              { label: "People", value: "people" },
              { label: "Knowledge", value: "knowledge" }
            ]}
            suggestions={[
              {
                description: "Go to the hub directory",
                id: "lab-1",
                label: "Hub directory",
                value: "hub directory"
              },
              {
                description: "Open support resources",
                id: "lab-2",
                label: "Support hub",
                value: "support hub"
              }
            ]}
          />
          <ActionPanel
            description="This panel uses the same shared spacing and breakpoint strategy as the rest of the system. Narrow canvases can switch to a stacked configuration where needed."
            layout={width > 0 && width < 560 ? "stacked" : "inline"}
            primaryAction={{ label: "Continue" }}
            secondaryAction={{ label: "Save draft" }}
            title="Tenant onboarding"
          />
        </div>
      </div>
    </section>
  );
};

const BreakpointPage = () => {
  const { theme } = useFluent();

  const pageStyle = {
    background: theme?.colorNeutralBackground1,
    color: theme?.colorNeutralForeground1,
    display: "grid",
    gap: theme?.spacingVerticalXXL ?? "2rem",
    minHeight: "100vh",
    padding: theme?.spacingHorizontalXXL ?? "2rem"
  };

  const panelStyle = {
    background: theme?.colorNeutralBackground2,
    border: `1px solid ${theme?.colorNeutralStroke2}`,
    borderRadius: theme?.borderRadiusXLarge ?? "1rem",
    padding: theme?.spacingHorizontalXL ?? "1.5rem"
  };

  const leadStyle = {
    color: theme?.colorNeutralForeground2,
    lineHeight: theme?.lineHeightBase400 ?? "1.5",
    margin: 0,
    maxWidth: "72ch"
  };

  const ruleGridStyle = {
    display: "grid",
    gap: theme?.spacingHorizontalL ?? "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))"
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%"
  };

  const headerCellStyle = {
    borderBottom: `1px solid ${theme?.colorNeutralStroke2}`,
    color: theme?.colorNeutralForeground3,
    fontSize: theme?.fontSizeBase200,
    fontWeight: theme?.fontWeightSemibold,
    letterSpacing: "0.04em",
    padding: `${theme?.spacingVerticalS ?? "0.5rem"} ${theme?.spacingHorizontalM ?? "0.75rem"}`,
    textAlign: "left",
    textTransform: "uppercase",
    verticalAlign: "top"
  };

  const bodyCellStyle = {
    borderBottom: `1px solid ${theme?.colorNeutralStroke2}`,
    padding: `${theme?.spacingVerticalM ?? "0.75rem"} ${theme?.spacingHorizontalM ?? "0.75rem"}`,
    verticalAlign: "top"
  };

  const codeStyle = {
    background: theme?.colorNeutralBackground1,
    border: `1px solid ${theme?.colorNeutralStroke2}`,
    borderRadius: theme?.borderRadiusMedium ?? "0.5rem",
    color: theme?.colorNeutralForeground2,
    display: "block",
    fontFamily: theme?.fontFamilyMonospace,
    fontSize: theme?.fontSizeBase200,
    lineHeight: 1.5,
    padding: theme?.spacingHorizontalM ?? "0.75rem",
    whiteSpace: "pre-wrap"
  };

  return (
    <div style={pageStyle}>
      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div>
          <p
            style={{
              color: theme?.colorNeutralForeground3,
              fontSize: theme?.fontSizeBase200,
              letterSpacing: "0.04em",
              margin: 0,
              textTransform: "uppercase"
            }}
          >
            Responsive specification
          </p>
          <h1
            style={{
              fontFamily: theme?.fontFamilyBase,
              fontSize: theme?.fontSizeHero800 ?? "2.5rem",
              lineHeight: theme?.lineHeightHero800 ?? "1.1",
              margin: 0
            }}
          >
            Breakpoints are shared tokens, not local magic numbers.
          </h1>
          <p style={leadStyle}>
            OneUI exposes a single breakpoint scale through the token and theme layers. Components should consume those values through helper APIs so responsive behavior stays consistent across packages.
          </p>
        </div>
        <div style={ruleGridStyle}>
          {responsiveRules.map((rule) => (
            <article key={rule.title} style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>{rule.title}</h2>
              <p style={leadStyle}>{rule.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Breakpoint contract</h2>
          <p style={leadStyle}>
            The values below are the shared source of truth exported from @functions-oneui/tokens and re-exported from @functions-oneui/theme.
          </p>
        </div>
        <div style={panelStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Token</th>
                <th style={headerCellStyle}>Value</th>
                <th style={headerCellStyle}>Intent</th>
                <th style={headerCellStyle}>Viewport query</th>
                <th style={headerCellStyle}>Container query</th>
              </tr>
            </thead>
            <tbody>
              {breakpointSpecs.map((spec) => (
                <tr key={spec.name}>
                  <td style={bodyCellStyle}>
                    <strong>{spec.name}</strong>
                    <div style={{ ...leadStyle, fontSize: theme?.fontSizeBase200 }}>{spec.usage}</div>
                  </td>
                  <td style={bodyCellStyle}>
                    <code style={{ fontFamily: theme?.fontFamilyMonospace }}>{oneuiBreakpoints[spec.name]}</code>
                  </td>
                  <td style={bodyCellStyle}>{spec.intent}</td>
                  <td style={bodyCellStyle}>
                    <code style={{ fontFamily: theme?.fontFamilyMonospace }}>{createOneUIMediaQueryUp(spec.name)}</code>
                    <br />
                    <code style={{ fontFamily: theme?.fontFamilyMonospace }}>{createOneUIMediaQueryDown(spec.name)}</code>
                  </td>
                  <td style={bodyCellStyle}>
                    <code style={{ fontFamily: theme?.fontFamilyMonospace }}>
                      {createOneUIContainerQueryUp(spec.name, "examplePanel")}
                    </code>
                    <br />
                    <code style={{ fontFamily: theme?.fontFamilyMonospace }}>
                      {createOneUIContainerQueryDown(spec.name, "examplePanel")}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ResizableLab theme={theme} />

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Preset component canvases</h2>
          <p style={leadStyle}>
            These canvases size real components using the shared breakpoint tokens so contributors can quickly inspect how content fits at each scale. They are useful for review, but they are not a substitute for validating viewport-only transitions with real browser resizing.
          </p>
        </div>
        <div style={{ display: "grid", gap: theme?.spacingHorizontalL ?? "1rem", gridTemplateColumns: "1fr" }}>
          {breakpointSpecs.slice(0, 4).map((spec) => (
            <PreviewCanvas key={spec.name} theme={theme} widthLabel={spec.name} widthValue={oneuiBreakpoints[spec.name]} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Recommended usage pattern</h2>
          <p style={leadStyle}>
            Use container queries inside reusable organisms and media queries only when the whole application shell or page chrome needs to respond to viewport width.
          </p>
        </div>
        <pre style={codeStyle}>{breakpointCode}</pre>
      </section>
    </div>
  );
};

export const SharedScale = {
  render: () => <BreakpointPage />
};
