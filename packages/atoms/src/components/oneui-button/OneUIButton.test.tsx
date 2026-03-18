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

  it("applies semantic styles for all supported appearances", () => {
    const { rerender } = renderWithOneUIProvider(
      <OneUIButton appearance="primary">Primary</OneUIButton>
    );
    const primaryButton = screen.getByRole("button", { name: "Primary" });

    expect(primaryButton).toBeTruthy();
    expect(primaryButton.getAttribute("data-oneui-button-appearance")).toBe("primary");
    expect(primaryButton.getAttribute("style")).toContain("--oneui-button-background");

    rerender(
      <OneUIButton appearance="secondary">Secondary</OneUIButton>
    );
    const secondaryButton = screen.getByRole("button", { name: "Secondary" });
    expect(secondaryButton).toBeTruthy();
    expect(secondaryButton.getAttribute("data-oneui-button-appearance")).toBe("secondary");

    rerender(<OneUIButton appearance="subtle">Subtle</OneUIButton>);
    const subtleButton = screen.getByRole("button", { name: "Subtle" });
    expect(subtleButton).toBeTruthy();
    expect(subtleButton.getAttribute("data-oneui-button-appearance")).toBe("subtle");

    rerender(<OneUIButton appearance="transparent">Transparent</OneUIButton>);
    const transparentButton = screen.getByRole("button", { name: "Transparent" });
    expect(transparentButton).toBeTruthy();
    expect(transparentButton.getAttribute("data-oneui-button-appearance")).toBe("transparent");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(<OneUIButton>Accessible</OneUIButton>);

    await expectNoAxeViolations(container);
  });
});
