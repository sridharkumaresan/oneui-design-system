import React from "react";

import { useFluent } from "@fluentui/react-components";
import {
  createOneUISurfacePropertyPaneOptions,
  defineOneUISurfacePolicyMap,
  resolveOneUISurfaceStyle
} from "@functions-oneui/theme";
import { HeroBanner as OneUIHeroBanner } from "@functions-oneui/organism-hero-banner";

const surfacePolicies = defineOneUISurfacePolicyMap({
  connectionsHome: {
    label: "Connections home banner",
    allowedVariantKeys: [
      "heroPrimary",
      "heroSecondary",
      "heroSoft",
      "heroFresh",
      "heroDeep",
      "heroBlue",
      "heroLight",
      "heroPastel"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "heroPrimary"
  },
  connectionsInner: {
    label: "Connections inner banner",
    allowedVariantKeys: [
      "heroSecondary",
      "heroSoft",
      "heroDeep",
      "heroBlue",
      "heroLight",
      "heroPastel"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "heroSecondary"
  },
  searchBanner: {
    label: "Search banner",
    allowedVariantKeys: [
      "heroSoft",
      "heroFresh",
      "heroDeep",
      "heroBlue",
      "heroLight",
      "heroPastel"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "heroSoft"
  },
  hubSiteBanner: {
    label: "Hub site banner",
    allowedVariantKeys: [
      "heroPrimary",
      "heroSecondary",
      "heroDeep",
      "heroBlue",
      "heroLight",
      "heroPastel"
    ],
    allowedTypes: ["gradient", "solid"],
    defaultVariantKey: "heroSecondary"
  }
});

const propertyPaneCode = `import {
  createOneUISurfacePropertyPaneOptions,
  defineOneUISurfacePolicy,
  getOneUIDefaultSurfaceVariantKey,
  resolveOneUISurfaceStyle
} from "@functions-oneui/theme";

const bannerSurfacePolicy = defineOneUISurfacePolicy({
  label: "Connections home banner",
  allowedVariantKeys: [
    "heroPrimary",
    "heroSecondary",
    "heroSoft",
    "heroFresh",
    "heroDeep",
    "heroBlue",
    "heroLight",
    "heroPastel"
  ],
  allowedTypes: ["gradient", "solid"],
  defaultVariantKey: "heroPrimary"
});

const options = createOneUISurfacePropertyPaneOptions(bannerSurfacePolicy, {
  selectedKey: properties.bannerSurfaceKey
});

const selectedSurfaceKey =
  properties.bannerSurfaceKey ?? getOneUIDefaultSurfaceVariantKey(bannerSurfacePolicy);

const bannerStyle = resolveOneUISurfaceStyle(selectedSurfaceKey, {
  policy: bannerSurfacePolicy
});

// Persist only the semantic key, never raw CSS strings.
properties.bannerSurfaceKey = selectedSurfaceKey;`;

const meta = {
  title: "Foundation/Surface System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Shared semantic banner and surface registry for HeroBanner, legacy webparts, and other branded components. This story shows the page-specific banner options, the property-pane adapter output, and cross-component reuse beyond banners."
      },
      source: {
        code: propertyPaneCode,
        language: "tsx"
      }
    }
  }
};

export default meta;

const sectionHeadingStyle = (theme) => ({
  display: "grid",
  gap: theme?.spacingVerticalXS ?? "0.25rem"
});

const leadStyle = (theme) => ({
  color: theme?.colorNeutralForeground2,
  lineHeight: 1.5,
  margin: 0,
  maxWidth: "76ch"
});

const swatchStyle = (preview, theme) => ({
  backgroundColor: preview.backgroundColor,
  backgroundImage: preview.backgroundImage,
  border: `1px solid ${preview.borderColor ?? theme?.colorNeutralStroke2 ?? "transparent"}`,
  borderRadius: theme?.borderRadiusLarge ?? "0.75rem",
  minHeight: "4.5rem"
});

const cardStyle = (theme) => ({
  background: theme?.colorNeutralBackground2,
  border: `1px solid ${theme?.colorNeutralStroke2}`,
  borderRadius: theme?.borderRadiusXLarge ?? "1rem",
  display: "grid",
  gap: theme?.spacingVerticalM ?? "0.75rem",
  padding: theme?.spacingHorizontalL ?? "1rem"
});

const PagePolicyCard = ({ policy, policyName, theme }) => {
  const options = createOneUISurfacePropertyPaneOptions(policy, {
    selectedKey: "deepSpectrum"
  });

  return (
    <article style={cardStyle(theme)}>
      <div style={{ display: "grid", gap: theme?.spacingVerticalXS ?? "0.25rem" }}>
        <strong>{policy.label}</strong>
        <span style={{ color: theme?.colorNeutralForeground3 }}>
          Default: <code>{policy.defaultVariantKey}</code>
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gap: theme?.spacingHorizontalM ?? "0.75rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))"
        }}
      >
        {options.map((option) => (
          <div
            key={option.key}
            style={{
              display: "grid",
              gap: theme?.spacingVerticalXS ?? "0.25rem",
              opacity: option.hiddenFromSelections ? 0.62 : 1
            }}
          >
            <div style={swatchStyle(option.preview, theme)} />
            <strong>{option.text}</strong>
            <span style={{ color: theme?.colorNeutralForeground3 }}>
              <code>{policyName}</code> · <code>{option.key}</code>
            </span>
            <span style={{ color: theme?.colorNeutralForeground2 }}>{option.description}</span>
            {option.hiddenFromSelections ? (
              <span style={{ color: theme?.colorNeutralForeground3 }}>
                Hidden from new selections but still resolvable for legacy instances.
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
};

const surfaceCardStyle = (surface, theme) => ({
  backgroundColor: surface.backgroundColor,
  backgroundImage: surface.backgroundImage,
  border: `1px solid ${surface.borderColor ?? "transparent"}`,
  borderRadius: theme?.borderRadiusXLarge ?? "1rem",
  color: surface.color,
  display: "grid",
  gap: theme?.spacingVerticalM ?? "0.75rem",
  minHeight: "12rem",
  padding: theme?.spacingHorizontalL ?? "1rem"
});

const SurfaceSystemShowcase = () => {
  const { theme } = useFluent();
  const iconSurface = resolveOneUISurfaceStyle("iconPrimary");
  const featuredCardSurface = resolveOneUISurfaceStyle("featuredCard");
  const chipSurface = resolveOneUISurfaceStyle("accentSoft");
  const ctaSurface = resolveOneUISurfaceStyle("ctaPrimary");
  const spotlightSurface = resolveOneUISurfaceStyle("panelSpotlight");

  return (
    <div
      style={{
        background: theme?.colorNeutralBackground1,
        color: theme?.colorNeutralForeground1,
        display: "grid",
        gap: theme?.spacingVerticalXXL ?? "2rem",
        minHeight: "100vh",
        padding: theme?.spacingHorizontalXXL ?? "2rem"
      }}
    >
      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div style={sectionHeadingStyle(theme)}>
          <p
            style={{
              color: theme?.colorNeutralForeground3,
              fontSize: theme?.fontSizeBase200,
              letterSpacing: "0.04em",
              margin: 0,
              textTransform: "uppercase"
            }}
          >
            Shared semantic backgrounds
          </p>
          <h1
            style={{
              fontFamily: theme?.fontFamilyBase,
              fontSize: theme?.fontSizeHero800 ?? "2.5rem",
              lineHeight: theme?.lineHeightHero800 ?? "1.1",
              margin: 0
            }}
          >
            Banner surfaces live in a reusable system, not inside one organism.
          </h1>
          <p style={leadStyle(theme)}>
            Existing SPFx banners can swap their current solid-color dropdown for semantic
            surface keys immediately, while HeroBanner and future reusable components all
            consume the same centralized surface recipes.
          </p>
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div style={sectionHeadingStyle(theme)}>
          <h2 style={{ margin: 0 }}>Banner background variant showcase</h2>
          <p style={leadStyle(theme)}>
            Each consuming app or webpart can define its own local policy map and default
            while persisting only the semantic selected key.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: theme?.spacingHorizontalL ?? "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))"
          }}
        >
          {Object.entries(surfacePolicies).map(([policyName, policy]) => (
            <PagePolicyCard key={policyName} policy={policy} policyName={policyName} theme={theme} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div style={sectionHeadingStyle(theme)}>
          <h2 style={{ margin: 0 }}>HeroBanner showcase</h2>
          <p style={leadStyle(theme)}>
            HeroBanner now resolves semantic surface keys from the shared registry rather than
            owning a separate gradient list.
          </p>
        </div>
        <div style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
          <OneUIHeroBanner
            description="Primary landing banner using the shared heroPrimary surface role."
            height="comfortable"
            surfaceKey="heroPrimary"
            title="heroPrimary"
          />
          <OneUIHeroBanner
            description="Supportive banner treatment for quieter or information-dense pages."
            height="comfortable"
            surfaceKey="heroSoft"
            title="heroSoft"
          />
          <OneUIHeroBanner
            description="Solid fallback hero for lower-motion or simpler legacy banner shells."
            height="comfortable"
            surfaceKey="heroDeep"
            title="heroDeep"
          />
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div style={sectionHeadingStyle(theme)}>
          <h2 style={{ margin: 0 }}>Cross-component surface reuse</h2>
          <p style={leadStyle(theme)}>
            The same gradient families can be reused through different semantic roles for icon
            plates, featured cards, chips, spotlight panels, and selective CTA affordances.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: theme?.spacingHorizontalL ?? "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))"
          }}
        >
          <article style={cardStyle(theme)}>
            <div
              style={{
                ...iconSurface,
                alignItems: "center",
                border: `1px solid ${iconSurface.borderColor ?? "transparent"}`,
                borderRadius: theme?.borderRadiusCircular ?? "9999px",
                color: iconSurface.color,
                display: "inline-flex",
                fontSize: theme?.fontSizeBase500,
                fontWeight: theme?.fontWeightBold,
                height: "3.5rem",
                justifyContent: "center",
                width: "3.5rem"
              }}
            >
              DS
            </div>
            <strong>Icon container</strong>
            <p style={{ ...leadStyle(theme), maxWidth: "unset" }}>
              `iconPrimary` reuses a branded family in a compact role without exposing a freeform gradient prop.
            </p>
          </article>

          <article style={surfaceCardStyle(featuredCardSurface, theme)}>
            <strong>Featured card</strong>
            <p style={{ margin: 0 }}>
              `featuredCard` keeps a card-like content shape while borrowing a controlled branded surface treatment.
            </p>
            <span
              style={{
                ...chipSurface,
                border: `1px solid ${chipSurface.borderColor ?? "transparent"}`,
                borderRadius: theme?.borderRadiusCircular ?? "9999px",
                color: chipSurface.color,
                display: "inline-flex",
                padding: "0.375rem 0.75rem",
                width: "fit-content"
              }}
            >
              accentSoft chip
            </span>
          </article>

          <article style={surfaceCardStyle(spotlightSurface, theme)}>
            <strong>Spotlight panel</strong>
            <p style={{ margin: 0 }}>Use `panelSpotlight` for compact KPI or featured side panels.</p>
            <button
              style={{
                ...ctaSurface,
                border: `1px solid ${ctaSurface.borderColor ?? "transparent"}`,
                borderRadius: theme?.borderRadiusLarge ?? "0.75rem",
                color: ctaSurface.color,
                cursor: "pointer",
                font: "inherit",
                padding: "0.75rem 1rem",
                width: "fit-content"
              }}
              type="button"
            >
              CTA Primary
            </button>
          </article>
        </div>
      </section>
    </div>
  );
};

export const Showcase = {
  render: () => <SurfaceSystemShowcase />
};
