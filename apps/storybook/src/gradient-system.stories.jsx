import React from "react";

import { useFluent } from "@fluentui/react-components";
import {
  useOneUIGradients,
  oneuiGradientNames
} from "@functions-oneui/theme";
import { HeroBanner as OneUIHeroBanner } from "@functions-oneui/organism-hero-banner";

const gradientNameNotes = {
  deepSpectrum: {
    title: "Hero primary",
    usage: "Primary branded hero surfaces and high-visibility landing moments.",
    approved: "Hero banner, marquee surfaces, large campaign headers."
  },
  midnightBlue: {
    title: "Hero secondary",
    usage: "Darker branded hero or compact branded panel surfaces.",
    approved: "Secondary hero moments, compact stock/weather overlays, dark branded promo panels."
  },
  limeSky: {
    title: "Feature surface",
    usage: "Lighter feature and campaign surfaces with lower visual weight.",
    approved: "Section accents, promotional strips, low-density highlight bands."
  },
  softAqua: {
    title: "Soft promotional surface",
    usage: "Soft branded surfaces for promotional or supportive content.",
    approved: "Promo cards, onboarding callouts, optional decorative panels."
  },
  tealShift: {
    title: "Icon accent",
    usage: "Compact decorative accents around icon or metric containers.",
    approved: "Icon backplates, compact indicator containers, branded mini-panels."
  },
  pastelHorizon: {
    title: "Decorative pastel surface",
    usage: "Art-directed decorative surfaces with a softer tone.",
    approved: "Decorative side panels, supporting feature surfaces, non-critical visual flourish."
  }
};

const gradientSourceCode = `import { oneuiGradientNames, useOneUIGradients } from "@functions-oneui/theme";

function GradientCatalog() {
  const gradients = useOneUIGradients();

  return oneuiGradientNames.map((name) => {
    const gradient = gradients[name];

    return {
      name,
      css: gradient.css,
      fallbackSolidColor: gradient.fallbackSolidColor
    };
  });
}`;

const meta = {
  title: "Foundation/Gradient System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Approved gradient usage patterns for OneUI. This page catalogs every canonical gradient name and shows where gradients are appropriate without implying that standard buttons should default to gradient styling."
      },
      source: {
        code: gradientSourceCode,
        language: "tsx"
      }
    }
  }
};

export default meta;

const applyGradientSurface = (gradient) => ({
  backgroundColor: gradient.fallbackSolidColor,
  backgroundImage: gradient.css
});

const GradientCard = ({ gradient, note, theme }) => {
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
      <div
        style={{
          ...applyGradientSurface(gradient),
          borderRadius: theme?.borderRadiusLarge ?? "0.75rem",
          minHeight: "6rem",
          padding: theme?.spacingHorizontalM ?? "0.75rem"
        }}
      />
      <div style={{ display: "grid", gap: theme?.spacingVerticalXS ?? "0.25rem" }}>
        <strong>{note.title}</strong>
        <code
          style={{
            color: theme?.colorNeutralForeground3,
            fontFamily: theme?.fontFamilyMonospace,
            fontSize: theme?.fontSizeBase200
          }}
        >
          {gradient.name}
        </code>
        <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>{note.usage}</p>
        <p style={{ color: theme?.colorNeutralForeground3, lineHeight: 1.5, margin: 0 }}>
          Approved: {note.approved}
        </p>
      </div>
    </article>
  );
};

const GradientShowcase = () => {
  const { theme } = useFluent();
  const gradients = useOneUIGradients();

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
            Semantic gradient specification
          </p>
          <h1
            style={{
              fontFamily: theme?.fontFamilyBase,
              fontSize: theme?.fontSizeHero800 ?? "2.5rem",
              lineHeight: theme?.lineHeightHero800 ?? "1.1",
              margin: 0
            }}
          >
            Gradients are named surfaces, not free-form decoration.
          </h1>
          <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0, maxWidth: "72ch" }}>
            Every available gradient name is cataloged here. Consumers should use these named gradients through the theme layer instead of authoring raw gradient strings directly inside atoms or organisms.
          </p>
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Gradient catalog</h2>
          <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>
            These are the six approved gradients currently exposed by the design system.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: theme?.spacingHorizontalL ?? "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))"
          }}
        >
          {oneuiGradientNames.map((gradientName) => (
            <GradientCard
              key={gradientName}
              gradient={gradients[gradientName]}
              note={gradientNameNotes[gradientName]}
              theme={theme}
            />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Hero variants</h2>
          <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>
            The hero gradients are available here directly, not only inside the HeroBanner organism story pages.
          </p>
        </div>
        <div style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
          <OneUIHeroBanner
            contentTone="inverse"
            description="Primary branded hero treatment for prominent landing experiences."
            gradientName="deepSpectrum"
            height="comfortable"
            surfaceVariant="gradient"
            title="deepSpectrum"
          />
          <OneUIHeroBanner
            contentTone="inverse"
            description="Darker alternative for secondary hero and compact branded panel moments."
            gradientName="midnightBlue"
            height="comfortable"
            surfaceVariant="gradient"
            title="midnightBlue"
          />
        </div>
      </section>

      <section style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Approved usage gallery</h2>
          <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>
            These examples show the approved pattern space: hero surfaces, compact overlay panels, icon containers, and section accents.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: theme?.spacingHorizontalL ?? "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))"
          }}
        >
          <article
            style={{
              ...applyGradientSurface(gradients.midnightBlue),
              borderRadius: theme?.borderRadiusXLarge ?? "1rem",
              color: theme?.colorNeutralForegroundOnBrand ?? theme?.colorNeutralForegroundInverted,
              display: "grid",
              gap: theme?.spacingVerticalXS ?? "0.25rem",
              minHeight: "7rem",
              padding: theme?.spacingHorizontalL ?? "1rem"
            }}
          >
            <strong>Compact overlay panel</strong>
            <span>222.22 · BARC.L</span>
            <span style={{ color: theme?.colorNeutralForegroundInverted2 ?? theme?.colorNeutralForegroundInverted }}>
              Suitable for weather or stock overlays.
            </span>
          </article>

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
            <div
              style={{
                ...applyGradientSurface(gradients.tealShift),
                alignItems: "center",
                borderRadius: theme?.borderRadiusCircular ?? "9999px",
                color: theme?.colorNeutralForegroundOnBrand ?? theme?.colorNeutralForegroundInverted,
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
            <div>
              <strong>Decorative icon backplate</strong>
              <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>
                Use tealShift for compact decorative emphasis around icons or small branded indicators.
              </p>
            </div>
          </article>

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
            <div
              style={{
                ...applyGradientSurface(gradients.limeSky),
                borderRadius: theme?.borderRadiusCircular ?? "9999px",
                height: "0.375rem",
                width: "6rem"
              }}
            />
            <div>
              <strong>Section accent</strong>
              <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>
                Use lighter roles for section accents or low-density header emphasis instead of coating full content panels.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        style={{
          background: theme?.colorNeutralBackground2,
          border: `1px solid ${theme?.colorNeutralStroke2}`,
          borderRadius: theme?.borderRadiusXLarge ?? "1rem",
          display: "grid",
          gap: theme?.spacingVerticalS ?? "0.5rem",
          padding: theme?.spacingHorizontalXL ?? "1.5rem"
        }}
      >
        <h2 style={{ margin: 0 }}>Not approved by default</h2>
        <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>
          Standard buttons and icon buttons are intentionally not shown with gradients here. The design system does not yet expose component-level semantic gradient tokens for button default, hover, pressed, focus, and disabled states. Showing gradient buttons on this foundation page would imply an approved pattern that the token contract does not currently support.
        </p>
      </section>
    </div>
  );
};

export const ApprovedUsage = {
  render: () => <GradientShowcase />
};
