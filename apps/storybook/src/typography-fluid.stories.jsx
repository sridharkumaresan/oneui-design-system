import React from "react";

import { tokens as fluentTokens } from "@fluentui/react-components";
import { OneUIProvider, createOneuiTheme } from "@functions-oneui/theme";
import {
  oneuiFluentTypographyAliases,
  oneuiFluentTypographySlotAliases
} from "@functions-oneui/tokens";
import {
  OneUIBadge,
  OneUIButton,
  OneUIHeading,
  OneUILink,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";

const slotCoverageRows = [
  {
    slot: "fontSizeBase100",
    usage: "Badge sm and compact caption semantics"
  },
  {
    slot: "fontSizeBase200",
    usage: "Text caption, badge md, links"
  },
  {
    slot: "fontSizeBase300",
    usage: "Body copy and small headings"
  },
  {
    slot: "fontSizeBase400",
    usage: "Large body copy and heading level 5"
  },
  {
    slot: "fontSizeBase500",
    usage: "Heading level 4 and title semantics"
  },
  {
    slot: "fontSizeBase600",
    usage: "Heading level 3 and large title semantics"
  },
  {
    slot: "fontSizeHero700",
    usage: "Heading level 2 and title1 semantics"
  },
  {
    slot: "fontSizeHero800",
    usage: "Heading level 1 and hero display semantics"
  }
];

const variantRows = ["caption2", "body1", "body1Strong", "title1", "title2", "title3", "hero"];

const fluidModeRows = [
  {
    bodyExample:
      "A 16px body size gently moves to about 15.5px on smaller screens and 16.8px on larger ones.",
    headingExample:
      "A 24px section title moves to about 22.8px on smaller screens and 26.4px on larger ones.",
    label: "compact",
    plainEnglish:
      "Use this when you want the page to feel mostly stable. Text changes are subtle, so layouts stay familiar while still gaining a bit of flexibility.",
    whenToUse:
      "Good for dense enterprise screens where too much movement in text size would feel distracting."
  },
  {
    bodyExample:
      "A 16px body size moves to about 15.2px on smaller screens and 17.3px on larger ones.",
    headingExample:
      "A 24px section title moves to about 22.3px on smaller screens and 27.4px on larger ones.",
    label: "comfortable",
    plainEnglish:
      "This is the balanced middle ground. Text becomes meaningfully smaller on tight screens and more open on wide screens without feeling dramatic.",
    whenToUse:
      "Good default for most product experiences because it improves readability without making the UI feel jumpy."
  },
  {
    bodyExample:
      "A 16px body size moves to about 15.0px on smaller screens and 17.6px on larger ones.",
    headingExample:
      "A 24px section title moves to about 21.6px on smaller screens and 28.8px on larger ones.",
    label: "expressive",
    plainEnglish:
      "Use this when you want the strongest visible response to screen size. Headlines shrink more on small screens and grow more on large screens.",
    whenToUse:
      "Good for marketing-style surfaces, dashboards with room to breathe, or layouts where headline hierarchy needs to flex clearly."
  }
];

const meta = {
  title: "Foundation/Typography",
  parameters: {
    layout: "fullscreen",
    controls: {
      include: ["fluidEnabled", "scale", "minViewport", "maxViewport"]
    },
    docs: {
      description: {
        story:
          "Fluent-first fluid typography demo. Fluid enablement and range come from Storybook args; use browser or Storybook responsive viewport tools to verify the live scale."
      }
    }
  },
  argTypes: {
    fluidEnabled: {
      control: { type: "boolean" },
      description: "Enable fluid typography theme transforms"
    },
    scale: {
      control: { type: "inline-radio" },
      options: ["compact", "comfortable", "expressive"]
    },
    minViewport: {
      control: { type: "number", min: 240, max: 1024, step: 10 }
    },
    maxViewport: {
      control: { type: "number", min: 768, max: 2560, step: 10 }
    }
  },
  args: {
    fluidEnabled: true,
    maxViewport: 1440,
    minViewport: 320,
    scale: "expressive"
  }
};

export default meta;

const cardStyle = {
  background: fluentTokens.colorNeutralBackground2,
  border: `1px solid ${fluentTokens.colorNeutralStroke2}`,
  borderRadius: "16px",
  display: "grid",
  gap: "12px",
  padding: "16px"
};

const tableCellStyle = {
  borderBottom: `1px solid ${fluentTokens.colorNeutralStroke2}`,
  padding: "10px 12px",
  textAlign: "left"
};

const StorySection = ({ children, subtitle, title }) => {
  return (
    <section style={cardStyle}>
      <div>
        <OneUIHeading level={4}>{title}</OneUIHeading>
        <OneUIText tone="secondary">{subtitle}</OneUIText>
      </div>
      {children}
    </section>
  );
};

const TokenCoverageTable = ({ activeTheme, staticTheme }) => {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", minWidth: "880px", width: "100%" }}>
        <thead>
          <tr>
            <th style={tableCellStyle}>Slot</th>
            <th style={tableCellStyle}>Static</th>
            <th style={tableCellStyle}>Active</th>
            <th style={tableCellStyle}>Usage</th>
          </tr>
        </thead>
        <tbody>
          {slotCoverageRows.map((row) => {
            return (
              <tr key={row.slot}>
                <td style={{ ...tableCellStyle, fontWeight: 600 }}>{row.slot}</td>
                <td style={{ ...tableCellStyle, fontFamily: "monospace" }}>
                  {String(staticTheme[row.slot])}
                </td>
                <td style={{ ...tableCellStyle, fontFamily: "monospace" }}>
                  {String(activeTheme[row.slot])}
                </td>
                <td style={tableCellStyle}>{row.usage}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const VariantMappingTable = () => {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", minWidth: "880px", width: "100%" }}>
        <thead>
          <tr>
            <th style={tableCellStyle}>Variant</th>
            <th style={tableCellStyle}>Font size slot</th>
            <th style={tableCellStyle}>Weight slot</th>
            <th style={tableCellStyle}>Line height slot</th>
            <th style={tableCellStyle}>Static alias preview</th>
          </tr>
        </thead>
        <tbody>
          {variantRows.map((variant) => {
            const slotMapping = oneuiFluentTypographySlotAliases[variant];
            const aliasPreview = oneuiFluentTypographyAliases[variant];

            return (
              <tr key={variant}>
                <td style={{ ...tableCellStyle, fontWeight: 600 }}>{variant}</td>
                <td style={tableCellStyle}>{slotMapping.fontSize}</td>
                <td style={tableCellStyle}>{slotMapping.fontWeight}</td>
                <td style={tableCellStyle}>{slotMapping.lineHeight}</td>
                <td style={{ ...tableCellStyle, fontFamily: "monospace" }}>
                  {aliasPreview.fontSize} / {aliasPreview.lineHeight}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const FluidModeGuide = ({ activeScale }) => {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
      }}
    >
      {fluidModeRows.map((modeRow) => {
        const isActive = activeScale === modeRow.label;

        return (
          <article
            key={modeRow.label}
            style={{
              background: isActive
                ? fluentTokens.colorBrandBackground2
                : fluentTokens.colorNeutralBackground1,
              border: `1px solid ${
                isActive ? fluentTokens.colorBrandStroke1 : fluentTokens.colorNeutralStroke2
              }`,
              borderRadius: "16px",
              display: "grid",
              gap: "10px",
              padding: "16px"
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: "8px",
                justifyContent: "space-between"
              }}
            >
              <OneUIHeading level={5}>{modeRow.label}</OneUIHeading>
              {isActive ? (
                <OneUIBadge appearance="soft" tone="brand">
                  Current mode
                </OneUIBadge>
              ) : null}
            </div>
            <OneUIText size="body">{modeRow.plainEnglish}</OneUIText>
            <OneUIText size="caption" tone="secondary">
              {modeRow.whenToUse}
            </OneUIText>
            <div
              style={{
                background: fluentTokens.colorNeutralBackground2,
                borderRadius: "12px",
                display: "grid",
                gap: "8px",
                padding: "12px"
              }}
            >
              <OneUIText size="caption" weight="semibold">
                Example
              </OneUIText>
              <OneUIText size="caption">{modeRow.headingExample}</OneUIText>
              <OneUIText size="caption">{modeRow.bodyExample}</OneUIText>
            </div>
          </article>
        );
      })}
    </div>
  );
};

const TypographyPreview = () => {
  return (
    <OneUIStack direction="column" gap="md">
      <OneUIHeading level={1}>Fluid-ready Fluent typography</OneUIHeading>
      <OneUIHeading level={2}>Heading level 2 uses `fontSizeHero700`</OneUIHeading>
      <OneUIHeading level={3}>Heading level 3 uses `fontSizeBase600`</OneUIHeading>
      <OneUIText size="body" weight="semibold">
        Body text continues to use the existing atom implementation and now picks up theme-level
        fluid transforms when enabled.
      </OneUIText>
      <OneUIText size="bodyLarge">
        Larger body text tracks `fontSizeBase400`, which is now part of the fluid slot coverage.
      </OneUIText>
      <OneUIText size="caption" tone="secondary">
        Caption text and compact labels still work unchanged because the transform happens only in
        the theme tokens.
      </OneUIText>
      <OneUIStack align="center" direction="row" gap="sm" wrap>
        <OneUIButton appearance="primary">Primary action</OneUIButton>
        <OneUIButton appearance="secondary">Secondary action</OneUIButton>
        <OneUILink href="#fluid-typography-demo">Inline link</OneUILink>
        <OneUIBadge appearance="soft" tone="brand">
          Status badge
        </OneUIBadge>
      </OneUIStack>
    </OneUIStack>
  );
};

const FluidTypographyStory = ({ args, mode }) => {
  const fluidTypography = {
    enabled: args.fluidEnabled,
    maxViewport: args.maxViewport,
    minViewport: args.minViewport,
    scale: args.scale
  };
  const staticTheme = React.useMemo(() => createOneuiTheme({ mode }), [mode]);
  const activeTheme = React.useMemo(() => {
    return createOneuiTheme({
      fluidTypography,
      mode
    });
  }, [
    fluidTypography.enabled,
    fluidTypography.maxViewport,
    fluidTypography.minViewport,
    fluidTypography.scale,
    mode
  ]);

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        maxWidth: "1280px"
      }}
    >
      <div style={{ display: "grid", gap: "8px" }}>
        <OneUIHeading level={2}>Fluent UI v9 Fluid Typography</OneUIHeading>
        <OneUIText size="body">
          When `fluidEnabled` is `false`, the active token column should match the static token
          column. When it is `true`, all covered Fluent font-size slots should switch to
          `clamp(...)`. Use browser or Storybook responsive viewport tools to verify the live
          preview.
        </OneUIText>
      </div>

      <StorySection
        title="Understanding The 3 Modes"
        subtitle="Plain-language guidance for compact, comfortable, and expressive fluid typography. These modes only change font size. They do not change font weight."
      >
        <FluidModeGuide activeScale={args.scale} />
      </StorySection>

      <StorySection
        title="Viewport Resize Test"
        subtitle="Use the Storybook controls for fluid settings, then use browser or Storybook responsive viewport tools to verify the live typography scale."
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <OneUIText size="caption" tone="secondary">
            Fluid: {args.fluidEnabled ? "enabled" : "disabled"}
          </OneUIText>
          <OneUIText size="caption" tone="secondary">
            Scale: {args.scale}
          </OneUIText>
          <OneUIText size="caption" tone="secondary">
            Viewport range: {args.minViewport}px to {args.maxViewport}px
          </OneUIText>
        </div>

        <div
          style={{
            border: `1px dashed ${fluentTokens.colorNeutralStroke2}`,
            borderRadius: "20px",
            maxWidth: "100%",
            overflow: "auto",
            padding: "12px"
          }}
        >
          <div style={{ margin: "0 auto", maxWidth: "100%" }}>
            <OneUIProvider fluidTypography={fluidTypography} mode={mode}>
              <div
                id="fluid-typography-demo"
                style={{
                  background: fluentTokens.colorNeutralBackground1,
                  border: `1px solid ${fluentTokens.colorNeutralStroke1}`,
                  borderRadius: "16px",
                  padding: "20px"
                }}
              >
                <TypographyPreview />
              </div>
            </OneUIProvider>
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Token Coverage"
        subtitle="Static versus active theme slots. All covered slots should become clamp expressions when fluid typography is enabled."
      >
        <TokenCoverageTable activeTheme={activeTheme} staticTheme={staticTheme} />
      </StorySection>

      <StorySection
        title="Variant Mapping"
        subtitle="Fluent semantic variants continue to map to Fluent slot names. Components stay unchanged and read the transformed theme tokens."
      >
        <VariantMappingTable />
      </StorySection>
    </div>
  );
};

export const FluidTypography = {
  render: (args, context) => {
    const mode = context.globals.themeMode === "dark" ? "dark" : "light";

    return <FluidTypographyStory args={args} mode={mode} />;
  }
};
