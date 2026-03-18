import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OneUICard, OneUIText } from "@functions-oneui/atoms";
import { oneuiLightGradients } from "@functions-oneui/theme";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { HeroBanner } from "./HeroBanner.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

describe("HeroBanner", () => {
  it("renders the title and description as a labeled region", () => {
    renderWithOneUIProvider(
      <HeroBanner
        description="Welcome to Connections, how can we help you today?"
        title="Good morning, Sridhar"
      />
    );

    expect(screen.getByRole("region", { name: "Good morning, Sridhar" })).toBeTruthy();
    expect(screen.getByText("Welcome to Connections, how can we help you today?")).toBeTruthy();
  });

  it("renders named slot content without coupling to child components", () => {
    renderWithOneUIProvider(
      <HeroBanner
        aside={<OneUICard>Aside</OneUICard>}
        eyebrow={<OneUIText>Breadcrumb</OneUIText>}
        footer={<OneUICard>Footer</OneUICard>}
        supportingContent={<OneUICard>Search</OneUICard>}
        title="Composable hero"
        topEnd={<span>Top end</span>}
        topStart={<span>Top start</span>}
      />
    );

    expect(document.querySelector("[data-oneui-hero-banner-top-row]")).toBeTruthy();
    expect(document.querySelector("[data-oneui-hero-banner-eyebrow]")?.textContent).toContain("Breadcrumb");
    expect(document.querySelector("[data-oneui-hero-banner-supporting-content]")?.textContent).toContain(
      "Search"
    );
    expect(document.querySelector("[data-oneui-hero-banner-aside]")?.textContent).toContain("Aside");
    expect(document.querySelector("[data-oneui-hero-banner-footer]")?.textContent).toContain("Footer");
  });

  it("applies the configured canonical gradient name", () => {
    renderWithOneUIProvider(
      <HeroBanner gradientName="midnightBlue" surfaceVariant="gradient" title="Gradient" />
    );

    const banner = document.querySelector("[data-oneui-hero-banner]") as HTMLElement;
    const gradient = oneuiLightGradients.midnightBlue;

    expect(banner.dataset.oneuiHeroBannerSurfaceVariant).toBe("gradient");
    expect(banner.dataset.oneuiHeroBannerGradientName).toBe("midnightBlue");
    const colorProbe = document.createElement("div");
    colorProbe.style.backgroundColor = gradient.fallbackSolidColor;

    expect(banner.style.backgroundColor).toBe(colorProbe.style.backgroundColor);
    expect(banner.style.backgroundImage).toContain("linear-gradient");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <HeroBanner
        description="Welcome to Connections, how can we help you today?"
        gradientName="deepSpectrum"
        surfaceVariant="gradient"
        title="Good morning, Sridhar"
      />
    );

    await expectNoAxeViolations(container);
  });
});
