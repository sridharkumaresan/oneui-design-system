import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUIInput } from "./OneUIInput.js";

describe("OneUIInput", () => {
  it("renders an input with placeholder text", () => {
    renderWithOneUIProvider(<OneUIInput aria-label="Search" placeholder="Search intranet" />);

    expect(screen.getByRole("textbox", { name: "Search" })).toBeTruthy();
    expect(screen.getByPlaceholderText("Search intranet")).toBeTruthy();
  });

  it("calls onChange when the value updates", () => {
    const onChange = vi.fn();
    renderWithOneUIProvider(<OneUIInput aria-label="Search" onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "policies" }
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("renders disabled state correctly", () => {
    renderWithOneUIProvider(<OneUIInput aria-label="Disabled" disabled />);

    expect((screen.getByRole("textbox", { name: "Disabled" }) as HTMLInputElement).disabled).toBe(
      true
    );
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <OneUIInput aria-label="Accessible input" placeholder="Search intranet" />
    );

    await expectNoAxeViolations(container);
  });
});
