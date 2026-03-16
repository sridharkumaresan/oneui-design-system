import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUICombobox } from "./OneUICombobox.js";

const demoOptions = [
  { label: "All", value: "all" },
  { label: "People", value: "people" },
  { label: "Sites", value: "sites" }
];

describe("OneUICombobox", () => {
  it("renders a combobox trigger", () => {
    renderWithOneUIProvider(
      <OneUICombobox aria-label="Scope" options={demoOptions} placeholder="Choose a scope" />
    );

    expect(screen.getByRole("combobox", { name: "Scope" })).toBeTruthy();
  });

  it("renders options when expanded", () => {
    renderWithOneUIProvider(
      <OneUICombobox aria-label="Scope" options={demoOptions} placeholder="Choose a scope" />
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Scope" }));

    expect(screen.getByText("People")).toBeTruthy();
    expect(screen.getByText("Sites")).toBeTruthy();
  });

  it("calls onOptionSelect when an option is chosen", () => {
    const onOptionSelect = vi.fn();
    renderWithOneUIProvider(
      <OneUICombobox aria-label="Scope" onOptionSelect={onOptionSelect} options={demoOptions} />
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Scope" }));
    fireEvent.click(screen.getByText("People"));

    expect(onOptionSelect).toHaveBeenCalledTimes(1);
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <OneUICombobox aria-label="Scope" options={demoOptions} placeholder="Choose a scope" />
    );

    await expectNoAxeViolations(container);
  });
});
