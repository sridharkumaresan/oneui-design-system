// @ts-nocheck
import React from "react";

import { FluentProvider } from "@fluentui/react-components";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { oneuiLightTheme } from "@functions-oneui/theme";
import { expectNoAxeViolations } from "@functions-oneui/testing";

import { OneUIButton } from "./OneUIButton.js";

const renderInProvider = (ui) => {
  return render(React.createElement(FluentProvider, { theme: oneuiLightTheme }, ui));
};

describe("OneUIButton", () => {
  it("renders button content", () => {
    renderInProvider(React.createElement(OneUIButton, null, "Save"));

    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("supports stretch customization", () => {
    renderInProvider(React.createElement(OneUIButton, { stretch: true }, "Wide"));

    const button = screen.getByRole("button", { name: "Wide" });
    expect(button.style.width).toBe("100%");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderInProvider(React.createElement(OneUIButton, null, "Accessible"));

    await expectNoAxeViolations(container);
  });
});
