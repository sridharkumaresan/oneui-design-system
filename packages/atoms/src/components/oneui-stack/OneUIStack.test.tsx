import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUIStack } from "./OneUIStack.js";

describe("OneUIStack", () => {
  it("renders children in a flex container", () => {
    renderWithOneUIProvider(
      <OneUIStack>
        <span>One</span>
        <span>Two</span>
      </OneUIStack>
    );

    expect(screen.getByText("One")).toBeTruthy();
    expect(screen.getByText("Two")).toBeTruthy();
    expect(document.querySelector("[data-oneui-stack]")).toBeTruthy();
  });

  it("supports semantic element overrides", () => {
    renderWithOneUIProvider(
      <OneUIStack as="section">
        <span>Section body</span>
      </OneUIStack>
    );

    expect(document.querySelector("section[data-oneui-stack]")).toBeTruthy();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <OneUIStack>
        <button type="button">First</button>
        <button type="button">Second</button>
      </OneUIStack>
    );

    await expectNoAxeViolations(container);
  });
});
