import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUICard } from "./OneUICard.js";

describe("OneUICard", () => {
  it("renders card content", () => {
    renderWithOneUIProvider(<OneUICard>Card body</OneUICard>);

    expect(screen.getByText("Card body")).toBeTruthy();
    expect(document.querySelector("[data-oneui-card]")).toBeTruthy();
  });

  it("supports semantic element overrides", () => {
    renderWithOneUIProvider(<OneUICard as="section">Section card</OneUICard>);

    expect(document.querySelector("section[data-oneui-card]")).toBeTruthy();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <OneUICard>
        <h2>Card heading</h2>
        <p>Card copy</p>
      </OneUICard>
    );

    await expectNoAxeViolations(container);
  });
});
