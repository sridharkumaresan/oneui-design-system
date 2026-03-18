import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OneUICard, OneUIText } from "@functions-oneui/atoms";
import { oneuiLightGradients } from "@functions-oneui/theme";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { BrandedHeroBanner } from "./BrandedHeroBanner.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

describe("BrandedHeroBanner", () => {
  it("renders the primary branded variant by default", () => {
    renderWithOneUIProvider(<BrandedHeroBanner title="Phase 1 banner" />);

    const banner = document.querySelector(
      "[data-oneui-branded-hero-banner]"
    ) as HTMLElement;
    const primaryGradient = oneuiLightGradients.deepSpectrum;
    const colorProbe = document.createElement("div");
    colorProbe.style.backgroundColor = primaryGradient.fallbackSolidColor;

    expect(screen.getByRole("region", { name: "Phase 1 banner" })).toBeTruthy();
    expect(banner.dataset.oneuiBrandedHeroBannerVariant).toBe("primary");
    expect(banner.dataset.oneuiHeroBannerSurfaceVariant).toBe("gradient");
    expect(banner.dataset.oneuiHeroBannerGradientName).toBe("deepSpectrum");
    expect(banner.style.backgroundColor).toBe(colorProbe.style.backgroundColor);
    expect(banner.style.backgroundImage).toContain("linear-gradient");
  });

  it("maps the secondary variant to the canonical secondary hero gradient", () => {
    renderWithOneUIProvider(
      <BrandedHeroBanner title="Secondary phase 1 banner" variant="secondary" />
    );

    const banner = document.querySelector(
      "[data-oneui-branded-hero-banner]"
    ) as HTMLElement;

    expect(banner.dataset.oneuiBrandedHeroBannerVariant).toBe("secondary");
    expect(banner.dataset.oneuiHeroBannerGradientName).toBe("midnightBlue");
  });

  it("keeps the same slot-based composition model as the base banner", () => {
    renderWithOneUIProvider(
      <BrandedHeroBanner
        aside={<OneUICard>Aside</OneUICard>}
        eyebrow={<OneUIText>Breadcrumb</OneUIText>}
        footer={<OneUICard>Footer</OneUICard>}
        supportingContent={<OneUICard>Search</OneUICard>}
        title="Composable phase 1 banner"
        topEnd={<span>Top end</span>}
        topStart={<span>Top start</span>}
      />
    );

    expect(document.querySelector("[data-oneui-hero-banner-top-row]")).toBeTruthy();
    expect(document.querySelector("[data-oneui-hero-banner-eyebrow]")?.textContent).toContain(
      "Breadcrumb"
    );
    expect(
      document.querySelector("[data-oneui-hero-banner-supporting-content]")?.textContent
    ).toContain("Search");
    expect(document.querySelector("[data-oneui-hero-banner-aside]")?.textContent).toContain(
      "Aside"
    );
    expect(document.querySelector("[data-oneui-hero-banner-footer]")?.textContent).toContain(
      "Footer"
    );
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <BrandedHeroBanner
        description="Use the branded wrapper to lock existing experiences to the approved OneUI gradient shell."
        title="Adopt the brand banner"
      />
    );

    await expectNoAxeViolations(container);
  });
});
