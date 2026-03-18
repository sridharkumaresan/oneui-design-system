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
  "Background, text, border, interaction, and feedback roles are separate on purpose. Do not repurpose status fills for layout surfaces or button states.",
  "Inverse text roles belong on dark or saturated surfaces only.",
  "Interactive controls should consume the semantic interaction roles so hover and pressed states stay consistent across atoms and organisms.",
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
    usage: "Brand-owned cyan accents and low-ceremony brand surfaces.",
    kind: "fill"
  },
  {
    key: "brandStrong",
    label: "Brand strong",
    usage: "Solid high-contrast brand surfaces such as fallback hero shells.",
    kind: "fill"
  },
  {
    key: "dangerSubtle",
    label: "Danger subtle",
    usage: "Subtle critical-state backgrounds where full danger surfaces would be too strong.",
    kind: "fill"
  },
  {
    key: "warningSubtle",
    label: "Warning subtle",
    usage: "Low-emphasis warning backgrounds, due-date chips, and caution summaries.",
    kind: "fill"
  },
  {
    key: "infoSubtle",
    label: "Info subtle",
    usage: "Low-emphasis informational backgrounds and branded summary panels.",
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
    usage: "Branded emphasis where standard primary text hierarchy is not enough.",
    kind: "text"
  },
  {
    key: "link",
    label: "Link text",
    usage: "Default interactive link and tertiary text action color.",
    kind: "text"
  },
  {
    key: "linkHover",
    label: "Link hover",
    usage: "Interactive hover state for links and text actions.",
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
  },
  {
    key: "warning",
    label: "Warning text",
    usage: "Readable warning emphasis on pale caution surfaces.",
    kind: "text"
  },
  {
    key: "onBrand",
    label: "On-brand text",
    usage: "Text placed on strong brand interaction or banner surfaces.",
    kind: "textInverse"
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
  },
  {
    key: "warning",
    label: "Warning border",
    usage: "Warning chip outlines and caution-state separators.",
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
  },
  {
    key: "neutral",
    label: "Neutral status",
    usage: "Filled neutral metadata chips and low-priority state markers.",
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
  },
  {
    key: "danger",
    label: "Danger icon",
    usage: "Critical-state iconography and warning triangles.",
    kind: "icon"
  },
  {
    key: "info",
    label: "Info icon",
    usage: "Informational iconography and branded directional cues.",
    kind: "icon"
  }
];

const interactionPrimaryRoles = [
  {
    key: "background",
    label: "Primary background",
    usage: "Default filled primary action state.",
    kind: "fill"
  },
  {
    key: "backgroundHover",
    label: "Primary hover",
    usage: "Hovered primary action surface.",
    kind: "fill"
  },
  {
    key: "backgroundPressed",
    label: "Primary pressed",
    usage: "Pressed primary action surface.",
    kind: "fill"
  },
  {
    key: "foreground",
    label: "Primary foreground",
    usage: "Text and icon color placed on primary actions.",
    kind: "textInverse"
  }
];

const interactionSecondaryRoles = [
  {
    key: "background",
    label: "Secondary background",
    usage: "Default secondary action surface.",
    kind: "fill"
  },
  {
    key: "backgroundHover",
    label: "Secondary hover",
    usage: "Hovered secondary action surface.",
    kind: "fill"
  },
  {
    key: "border",
    label: "Secondary border",
    usage: "Default outlined secondary action border.",
    kind: "border"
  },
  {
    key: "foreground",
    label: "Secondary foreground",
    usage: "Text and icon color placed on secondary actions.",
    kind: "text"
  }
];

const interactionSubtleRoles = [
  {
    key: "background",
    label: "Subtle background",
    usage: "Default low-emphasis action surface used for quiet but still discoverable actions.",
    kind: "fill"
  },
  {
    key: "backgroundHover",
    label: "Subtle hover",
    usage: "Hovered subtle action surface.",
    kind: "fill"
  },
  {
    key: "foreground",
    label: "Subtle foreground",
    usage: "Text and icon color for subtle actions.",
    kind: "text"
  }
];

const interactionTransparentRoles = [
  {
    key: "background",
    label: "Transparent background",
    usage: "Default tertiary action background. Usually transparent at rest.",
    kind: "fill"
  },
  {
    key: "backgroundHover",
    label: "Transparent hover",
    usage: "Hovered transparent action surface for discoverability without a full button shell.",
    kind: "fill"
  },
  {
    key: "foreground",
    label: "Transparent foreground",
    usage: "Text and icon color for transparent and text-like actions.",
    kind: "text"
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
  const fluent = useFluent();
  const theme = fluent.theme;
  const colorTokens = semanticTokens[mode].color;

  const pageStyle = {
    background: theme?.oneuiColorBackgroundCanvas ?? theme?.colorNeutralBackground2,
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
    background: theme?.colorNeutralBackground1,
    border: `1px solid ${theme?.colorNeutralStroke1}`,
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
                ? colorTokens.text.onBrand
                : colorTokens.text.primary
              : item.kind === "status"
                ? item.key === "warning"
                  ? colorTokens.text.onWarning
                  : item.key === "neutral"
                    ? colorTokens.text.onNeutral
                    : colorTokens.text.inverse
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
        "Interaction roles · Primary",
        "Primary interactive colors are a solid blue system. They are not gradient-driven and should back all default high-emphasis actions.",
        interactionPrimaryRoles,
        colorTokens.interaction.primary
      )}

      {renderSection(
        "Interaction roles · Secondary",
        "Secondary interaction roles keep outline and neutral action surfaces consistent across responsive patterns such as ActionCard and search flows.",
        interactionSecondaryRoles,
        colorTokens.interaction.secondary
      )}

      {renderSection(
        "Interaction roles · Subtle",
        "Subtle actions use a light informational tint with branded text. They should feel quieter than secondary actions without disappearing into plain white surfaces.",
        interactionSubtleRoles,
        colorTokens.interaction.subtle
      )}

      {renderSection(
        "Interaction roles · Transparent",
        "Transparent actions are text-like by default and only pick up a light surface on hover or press.",
        interactionTransparentRoles,
        colorTokens.interaction.transparent
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
