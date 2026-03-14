import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUIHeading } from "./OneUIHeading.js";

describe("OneUIHeading", () => {
  it("renders heading content", () => {
    renderWithOneUIProvider(<OneUIHeading>Overview</OneUIHeading>);

    expect(screen.getByRole("heading", { name: "Overview" })).toBeTruthy();
  });

  it("supports semantic level overrides", () => {
    renderWithOneUIProvider(<OneUIHeading level={3}>Details</OneUIHeading>);

    expect(screen.getByRole("heading", { name: "Details" }).tagName).toBe("H3");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(<OneUIHeading>Accessible heading</OneUIHeading>);

    await expectNoAxeViolations(container);
  });
});
