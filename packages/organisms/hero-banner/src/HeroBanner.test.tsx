import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { HeroBanner } from "./HeroBanner.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

const demoImageSrc =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='%23110077'/><circle cx='620' cy='180' r='120' fill='%2300d4ff' opacity='0.5'/><circle cx='520' cy='420' r='180' fill='%23ff4cb0' opacity='0.35'/></svg>";

describe("HeroBanner", () => {
  it("renders the title, description, and image", () => {
    renderWithOneUIProvider(
      <HeroBanner
        description="Welcome to Connections, how can we help you today?"
        imageAlt="Employee using a laptop"
        imageSrc={demoImageSrc}
        title="Good morning, Sridhar"
      />
    );

    expect(screen.getByRole("region", { name: "Good morning, Sridhar" })).toBeTruthy();
    expect(screen.getByText("Welcome to Connections, how can we help you today?")).toBeTruthy();
    expect(screen.getByAltText("Employee using a laptop")).toBeTruthy();
  });

  it("applies the configured background color", () => {
    renderWithOneUIProvider(
      <HeroBanner backgroundColor="rebeccapurple" imageSrc={demoImageSrc} title="Configured" />
    );

    const banner = document.querySelector("[data-oneui-hero-banner]") as HTMLElement;

    expect(banner.style.backgroundColor).toBe("rebeccapurple");
  });

  it("treats images as decorative when no alt text is supplied", () => {
    const { container } = renderWithOneUIProvider(
      <HeroBanner imageSrc={demoImageSrc} title="Decorative image" />
    );

    const imageElement = container.querySelector("img");

    expect(imageElement?.getAttribute("alt")).toBe("");
    expect(imageElement?.getAttribute("aria-hidden")).toBe("true");
  });

  it("supports swapping the image to the start side", () => {
    renderWithOneUIProvider(
      <HeroBanner imagePosition="start" imageSrc={demoImageSrc} title="Image on the left" />
    );

    expect(document.querySelector('[data-oneui-hero-banner-image-position="start"]')).toBeTruthy();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <HeroBanner
        description="Welcome to Connections, how can we help you today?"
        imageAlt="Employee using a laptop"
        imageSrc={demoImageSrc}
        title="Good morning, Sridhar"
      />
    );

    await expectNoAxeViolations(container);
  });
});
