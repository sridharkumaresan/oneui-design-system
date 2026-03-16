import React from "react";

import { useFluent } from "@fluentui/react-components";
import { semanticTokens } from "@functions-oneui/tokens";

const colorConsumptionCode = `import { semanticTokens } from "@functions-oneui/tokens";
import { createOneuiTheme } from "@functions-oneui/theme";

const lightColors = semanticTokens.light.color;
const darkColors = semanticTokens.dark.color;

const theme = createOneuiTheme({ mode: "light" });

const panelStyle = {
  backgroundColor: lightColors.background.surface,
  color: lightColors.text.primary,
  borderColor: lightColors.border.default
};`;

const colorUsageRules = [
  "Use semantic color roles from @functions-oneui/tokens or @functions-oneui/theme instead of raw hex values inside components.",
  "Background, text, border, icon, and status roles are separate on purpose. Do not repurpose status colors for layout surfaces.",
  "Inverse text roles belong on dark or saturated surfaces only.",
  "Gradient usage is documented separately under Foundation/Gradient System and should not replace the solid semantic contract by default."
];

const backgroundRoles = [
  {
    key: "canvas",
    label: "Canvas",
    usage: "Application/page canvas and the broadest background layer.",
    kind: "fill"
  },
  {
    key: "surface",
    label: "Surface",
    usage: "Default card, panel, and neutral content surfaces.",
    kind: "fill"
  },
  {
    key: "elevated",
    label: "Elevated",
    usage: "Raised layers such as popovers, elevated cards, and overlays.",
    kind: "fill"
  },
  {
    key: "brand",
    label: "Brand",
    usage: "High-emphasis branded surfaces and primary accents.",
    kind: "fill"
  },
  {
    key: "dangerSubtle",
    label: "Danger subtle",
    usage: "Subtle critical-state backgrounds where full danger surfaces would be too strong.",
    kind: "fill"
  },
  {
    key: "successSubtle",
    label: "Success subtle",
    usage: "Subtle positive-state backgrounds and low-emphasis confirmations.",
    kind: "fill"
  }
];

const textRoles = [
  {
    key: "primary",
    label: "Primary text",
    usage: "Main body copy and primary information hierarchy.",
    kind: "text"
  },
  {
    key: "secondary",
    label: "Secondary text",
    usage: "Supporting copy, descriptions, and metadata.",
    kind: "text"
  },
  {
    key: "inverse",
    label: "Inverse text",
    usage: "Text on dark or saturated surfaces, including hero treatments.",
    kind: "textInverse"
  },
  {
    key: "brand",
    label: "Brand text",
    usage: "Brand-linked emphasis such as selected states or emphasized links.",
    kind: "text"
  },
  {
    key: "danger",
    label: "Danger text",
    usage: "Critical messaging or destructive state emphasis.",
    kind: "text"
  },
  {
    key: "success",
    label: "Success text",
    usage: "Positive confirmation and success emphasis.",
    kind: "text"
  }
];

const borderRoles = [
  {
    key: "subtle",
    label: "Subtle border",
    usage: "Light separation between nearby neutral surfaces.",
    kind: "border"
  },
  {
    key: "default",
    label: "Default border",
    usage: "Standard control and card outlines.",
    kind: "border"
  },
  {
    key: "strong",
    label: "Strong border",
    usage: "Higher-contrast dividers and emphasis boundaries.",
    kind: "border"
  },
  {
    key: "focus",
    label: "Focus border",
    usage: "Visible focus treatment and focus ring alignment.",
    kind: "border"
  },
  {
    key: "brand",
    label: "Brand border",
    usage: "Branded outlines and selected-state framing.",
    kind: "border"
  },
  {
    key: "danger",
    label: "Danger border",
    usage: "Critical state outlines and validation emphasis.",
    kind: "border"
  }
];

const statusRoles = [
  {
    key: "success",
    label: "Success status",
    usage: "Positive state chips, badges, and compact indicators.",
    kind: "status"
  },
  {
    key: "warning",
    label: "Warning status",
    usage: "Due soon, caution, or attention-needed indicators.",
    kind: "status"
  },
  {
    key: "danger",
    label: "Danger status",
    usage: "Overdue, error, or critical attention-needed indicators.",
    kind: "status"
  },
  {
    key: "info",
    label: "Info status",
    usage: "Informational notices and non-blocking highlights.",
    kind: "status"
  }
];

const iconRoles = [
  {
    key: "primary",
    label: "Primary icon",
    usage: "Default iconography on neutral surfaces.",
    kind: "icon"
  },
  {
    key: "secondary",
    label: "Secondary icon",
    usage: "Supporting iconography with reduced emphasis.",
    kind: "icon"
  },
  {
    key: "brand",
    label: "Brand icon",
    usage: "Brand-accented iconography and highlighted affordances.",
    kind: "icon"
  },
  {
    key: "inverse",
    label: "Inverse icon",
    usage: "Iconography on dark or saturated surfaces.",
    kind: "iconInverse"
  }
];

const meta = {
  title: "Foundation/Color System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "OneUI color roles are semantic and mode-aware. This page documents the contract that components should consume instead of hardcoded values or ad hoc palette names."
      },
      source: {
        code: colorConsumptionCode,
        language: "ts"
      }
    }
  }
};

export default meta;

const ColorPage = ({ mode }) => {
  const { theme } = useFluent();
  const colorTokens = semanticTokens[mode].color;

  const pageStyle = {
    background: theme?.colorNeutralBackground1,
    color: theme?.colorNeutralForeground1,
    display: "grid",
    gap: theme?.spacingVerticalXXL ?? "2rem",
    minHeight: "100vh",
    padding: theme?.spacingHorizontalXXL ?? "2rem"
  };

  const sectionStyle = {
    display: "grid",
    gap: theme?.spacingVerticalL ?? "1rem"
  };

  const cardGridStyle = {
    display: "grid",
    gap: theme?.spacingHorizontalL ?? "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))"
  };

  const panelStyle = {
    background: theme?.colorNeutralBackground2,
    border: `1px solid ${theme?.colorNeutralStroke2}`,
    borderRadius: theme?.borderRadiusXLarge ?? "1rem",
    padding: theme?.spacingHorizontalXL ?? "1.5rem"
  };

  const titleStyle = {
    fontFamily: theme?.fontFamilyBase,
    fontSize: theme?.fontSizeHero800 ?? "2.5rem",
    lineHeight: theme?.lineHeightHero800 ?? "1.1",
    margin: 0
  };

  const leadStyle = {
    color: theme?.colorNeutralForeground2,
    lineHeight: theme?.lineHeightBase400 ?? "1.5",
    margin: 0,
    maxWidth: "70ch"
  };

  const ruleListStyle = {
    display: "grid",
    gap: theme?.spacingVerticalS ?? "0.5rem",
    margin: 0,
    paddingInlineStart: theme?.spacingHorizontalL ?? "1rem"
  };

  const ColorCard = ({ item, value }) => {
    const sampleStyle = {
      alignItems: "center",
      background:
        item.kind === "fill" || item.kind === "status"
          ? value
          : item.kind === "textInverse" || item.kind === "iconInverse"
            ? colorTokens.background.brand
            : theme?.colorNeutralBackground1,
      border:
        item.kind === "border"
          ? `2px solid ${value}`
          : `1px solid ${theme?.colorNeutralStroke2}`,
      borderRadius: theme?.borderRadiusLarge ?? "0.75rem",
      color:
        item.kind === "text" || item.kind === "textInverse"
          ? value
          : item.kind === "icon" || item.kind === "iconInverse"
            ? value
            : item.kind === "fill"
              ? item.key === "brand"
                ? colorTokens.text.inverse
                : colorTokens.text.primary
              : item.kind === "status"
                ? colorTokens.text.inverse
              : colorTokens.text.primary,
      display: "flex",
      fontSize: theme?.fontSizeBase400,
      fontWeight: theme?.fontWeightSemibold,
      gap: theme?.spacingHorizontalS ?? "0.5rem",
      justifyContent: item.kind === "border" ? "flex-start" : "center",
      minHeight: item.kind === "border" ? "4rem" : "5rem",
      paddingInline: theme?.spacingHorizontalM ?? "0.75rem"
    };

    return (
      <article style={panelStyle}>
        <div style={{ ...sampleStyle, marginBottom: theme?.spacingVerticalM ?? "0.75rem" }}>
          {item.kind === "icon" || item.kind === "iconInverse" ? <span aria-hidden="true">●</span> : null}
          {item.kind === "border" ? <span>Border sample</span> : <span>{value}</span>}
        </div>
        <div style={{ display: "grid", gap: theme?.spacingVerticalXS ?? "0.25rem" }}>
          <strong>{item.label}</strong>
          <code
            style={{
              color: theme?.colorNeutralForeground3,
              fontFamily: theme?.fontFamilyMonospace,
              fontSize: theme?.fontSizeBase200
            }}
          >
            {value}
          </code>
          <p style={{ ...leadStyle, fontSize: theme?.fontSizeBase300, margin: 0 }}>{item.usage}</p>
        </div>
      </article>
    );
  };

  const renderSection = (title, description, items, bucket) => {
    return (
      <section style={sectionStyle}>
        <div>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <p style={leadStyle}>{description}</p>
        </div>
        <div style={cardGridStyle}>
          {items.map((item) => (
            <ColorCard item={item} key={`${bucket}-${item.key}`} value={bucket[item.key]} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div style={pageStyle}>
      <section style={sectionStyle}>
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
            Semantic color specification · {mode} mode
          </p>
          <h1 style={titleStyle}>Color roles are the contract, not the palette.</h1>
          <p style={leadStyle}>
            Designers can evolve brand values over time, but component code should stay stable by consuming semantic roles. These roles are shared across the design system and resolved per theme mode.
          </p>
        </div>
        <div style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Usage rules</h2>
          <ul style={ruleListStyle}>
            {colorUsageRules.map((rule) => (
              <li key={rule} style={leadStyle}>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {renderSection(
        "Background roles",
        "Use these roles for layout and surface hierarchy. They define where content sits, not what workflow state it represents.",
        backgroundRoles,
        colorTokens.background
      )}

      {renderSection(
        "Text roles",
        "Text roles define information hierarchy and contrast behavior. Inverse roles are reserved for dark or saturated surfaces.",
        textRoles,
        colorTokens.text
      )}

      {renderSection(
        "Border roles",
        "Border roles control separation, emphasis, and focus treatment. Focus is a dedicated role and should not be approximated with another color.",
        borderRoles,
        colorTokens.border
      )}

      {renderSection(
        "Status roles",
        "Status colors communicate state. Keep them scoped to badges, indicators, and clear state messaging rather than broad layout surfaces.",
        statusRoles,
        colorTokens.status
      )}

      {renderSection(
        "Icon roles",
        "Icon roles mirror the semantic hierarchy of text and surface treatment without requiring raw palette usage in components.",
        iconRoles,
        colorTokens.icon
      )}
    </div>
  );
};

export const SemanticRoles = {
  render: (_, context) => {
    const mode = context.globals.themeMode === "dark" ? "dark" : "light";
    return <ColorPage mode={mode} />;
  }
};
