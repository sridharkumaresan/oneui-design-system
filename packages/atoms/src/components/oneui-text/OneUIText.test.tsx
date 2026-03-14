import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUIText } from "./OneUIText.js";

describe("OneUIText", () => {
  it("renders text content", () => {
    renderWithOneUIProvider(<OneUIText>Body copy</OneUIText>);

    expect(screen.getByText("Body copy")).toBeTruthy();
  });

  it("supports semantic element overrides", () => {
    renderWithOneUIProvider(
      <OneUIText as="p" block>
        Paragraph copy
      </OneUIText>
    );

    expect(screen.getByText("Paragraph copy").tagName).toBe("P");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(<OneUIText>Accessible copy</OneUIText>);

    await expectNoAxeViolations(container);
  });
});
