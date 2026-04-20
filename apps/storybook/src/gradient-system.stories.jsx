import React from "react";

import { useFluent } from "@fluentui/react-components";
import {
  useOneUIGradients,
  oneuiGradientNames
} from "@functions-oneui/theme";
import { HeroBanner as OneUIHeroBanner } from "@functions-oneui/organism-hero-banner";

const playgroundDirections = [
  "toTopRight",
  "toTopLeft",
  "toBottomRight",
  "toBottomLeft"
];

const playgroundDirectionToCssMap = {
  toTopRight: "to top right",
  toTopLeft: "to top left",
  toBottomRight: "to bottom right",
  toBottomLeft: "to bottom left"
};

const gradientNameNotes = {
  gradientNavyCyan: {
    title: "Hero secondary",
    usage: "Darker branded hero or compact branded panel surfaces.",
    approved: "Secondary hero moments, compact stock/weather overlays, dark branded promo panels."
  },
  gradientCyanYellow: {
    title: "Feature surface",
    usage: "Lighter feature and campaign surfaces with lower visual weight.",
    approved: "Section accents, promotional strips, low-density highlight bands."
  },
  gradientCyanLightBlue: {
    title: "Soft promotional surface",
    usage: "Soft branded surfaces for promotional or supportive content.",
    approved: "Promo cards, onboarding callouts, optional decorative panels."
  },
  gradientCyanGreen: {
    title: "Icon accent",
    usage: "Compact decorative accents around icon or metric containers.",
    approved: "Icon backplates, compact indicator containers, branded mini-panels."
  },
  gradientCyanPink: {
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

const buildGradientCss = (gradient, direction) => {
  const cssDirection = playgroundDirectionToCssMap[direction];
  const stopList = gradient.stops
    .map((stop) => `${stop.color} ${stop.position}`)
    .join(", ");

  return `linear-gradient(${cssDirection}, ${stopList})`;
};

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
            These are the five approved branded gradients currently exposed by the design system.
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
            HeroBanner consumes semantic surface keys. The raw gradient names below remain the
            paint layer behind those surfaces.
          </p>
        </div>
        <div style={{ display: "grid", gap: theme?.spacingVerticalL ?? "1rem" }}>
          <OneUIHeroBanner
            contentTone="inverse"
            description="Primary branded hero treatment for prominent landing experiences."
            height="comfortable"
            surfaceKey="heroPrimary"
            title="heroPrimary"
          />
          <OneUIHeroBanner
            contentTone="inverse"
            description="Darker alternative for secondary hero and compact branded panel moments."
            height="comfortable"
            surfaceKey="heroSecondary"
            title="heroSecondary"
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
              ...applyGradientSurface(gradients.gradientNavyCyan),
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
                ...applyGradientSurface(gradients.gradientCyanGreen),
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
                Use gradientCyanGreen for compact decorative emphasis around icons or small branded indicators.
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
                ...applyGradientSurface(gradients.gradientCyanYellow),
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

const GradientDirectionPlayground = ({ direction, gradientName }) => {
  const { theme } = useFluent();
  const gradients = useOneUIGradients();
  const gradient = gradients[gradientName];
  const experimentalCss = buildGradientCss(gradient, direction);

  return (
    <div
      style={{
        background: theme?.colorNeutralBackground1,
        color: theme?.colorNeutralForeground1,
        display: "grid",
        gap: theme?.spacingVerticalXL ?? "1.5rem",
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
            Experimental preview
          </p>
          <h1 style={{ margin: 0 }}>Gradient direction playground</h1>
          <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0, maxWidth: "72ch" }}>
            This story lets you preview alternate directions without changing the canonical token definitions.
            The approved shipped variants still come from the token package exactly as defined by the brand spec.
          </p>
        </div>
      </section>

      <section
        style={{
          background: theme?.colorNeutralBackground2,
          border: `1px solid ${theme?.colorNeutralStroke2}`,
          borderRadius: theme?.borderRadiusXLarge ?? "1rem",
          display: "grid",
          gap: theme?.spacingVerticalL ?? "1rem",
          padding: theme?.spacingHorizontalXL ?? "1.5rem"
        }}
      >
        <div
          style={{
            backgroundColor: gradient.fallbackSolidColor,
            backgroundImage: experimentalCss,
            borderRadius: theme?.borderRadiusLarge ?? "0.75rem",
            minHeight: "14rem"
          }}
        />
        <div style={{ display: "grid", gap: theme?.spacingVerticalXS ?? "0.25rem" }}>
          <strong>
            {gradient.label} · {direction}
          </strong>
          <code
            style={{
              color: theme?.colorNeutralForeground3,
              fontFamily: theme?.fontFamilyMonospace,
              fontSize: theme?.fontSizeBase200,
              overflowWrap: "anywhere"
            }}
          >
            {experimentalCss}
          </code>
          <p style={{ color: theme?.colorNeutralForeground2, lineHeight: 1.5, margin: 0 }}>
            Token default direction: <code>{gradient.direction}</code>. This preview overrides the direction in Storybook only.
          </p>
        </div>
      </section>
    </div>
  );
};

export const DirectionPlayground = {
  args: {
    gradientName: "gradientCyanGreen",
    direction: "toTopRight"
  },
  argTypes: {
    gradientName: {
      control: { type: "select" },
      options: oneuiGradientNames
    },
    direction: {
      control: { type: "inline-radio" },
      options: playgroundDirections
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Experimental Storybook-only playground for trying alternate gradient directions. This does not modify the canonical token definitions or imply that all directions are brand-approved."
      }
    }
  },
  render: (args) => <GradientDirectionPlayground {...args} />
};
