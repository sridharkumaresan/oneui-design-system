import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUIButton } from "./OneUIButton.js";

describe("OneUIButton", () => {
  it("renders button content", () => {
    renderWithOneUIProvider(<OneUIButton>Save</OneUIButton>);

    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("calls the click handler when enabled", () => {
    const onClick = vi.fn();
    renderWithOneUIProvider(<OneUIButton onClick={onClick}>Save</OneUIButton>);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call the click handler when disabled", () => {
    const onClick = vi.fn();
    renderWithOneUIProvider(
      <OneUIButton disabled onClick={onClick}>
        Save
      </OneUIButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(<OneUIButton>Accessible</OneUIButton>);

    await expectNoAxeViolations(container);
  });
});
