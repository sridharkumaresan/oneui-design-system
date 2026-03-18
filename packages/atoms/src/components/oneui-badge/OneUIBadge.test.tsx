import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUIBadge } from "./OneUIBadge.js";

describe("OneUIBadge", () => {
  it("renders badge content", () => {
    renderWithOneUIProvider(<OneUIBadge>Due 16 Apr 2025</OneUIBadge>);

    expect(screen.getByText("Due 16 Apr 2025")).toBeTruthy();
  });

  it("renders an icon when provided", () => {
    renderWithOneUIProvider(<OneUIBadge icon={<span data-testid="icon">!</span>}>Overdue</OneUIBadge>);

    expect(screen.getByTestId("icon")).toBeTruthy();
  });

  it("applies semantic styling hooks", () => {
    renderWithOneUIProvider(
      <OneUIBadge appearance="outlined" tone="danger">
        Overdue
      </OneUIBadge>
    );

    const badge = document.querySelector("[data-oneui-badge]");

    expect(badge).toBeTruthy();
    expect(badge?.getAttribute("style")).toContain("--oneui-badge-background");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <OneUIBadge icon={<span aria-hidden="true">!</span>} tone="warning">
        Due 16 Apr 2025
      </OneUIBadge>
    );

    await expectNoAxeViolations(container);
  });
});
