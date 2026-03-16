import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUILink } from "./OneUILink.js";

describe("OneUILink", () => {
  it("renders a semantic anchor when href is provided", () => {
    renderWithOneUIProvider(<OneUILink href="#details">Full details</OneUILink>);

    expect(screen.getByRole("link", { name: "Full details" })).toBeTruthy();
  });

  it("renders a semantic button when onClick is provided without href", () => {
    const onClick = vi.fn();
    renderWithOneUIProvider(<OneUILink onClick={onClick}>Show details</OneUILink>);

    fireEvent.click(screen.getByRole("button", { name: "Show details" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled content as non-interactive text", () => {
    renderWithOneUIProvider(
      <OneUILink disabled href="#details">
        Full details
      </OneUILink>
    );

    expect(screen.queryByRole("link", { name: "Full details" })).toBeNull();
    expect(document.querySelector("[data-oneui-link][aria-disabled='true']")).toBeTruthy();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <OneUILink href="#details" icon={<span aria-hidden="true">↗</span>}>
        Full details
      </OneUILink>
    );

    await expectNoAxeViolations(container);
  });
});
