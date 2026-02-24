// @ts-nocheck
import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TemplateAtom } from "./TemplateAtom.js";

describe("TemplateAtom", () => {
  it("renders content", () => {
    render(React.createElement(TemplateAtom, null, "Template"));

    expect(screen.getByRole("button", { name: "Template" })).toBeTruthy();
  });
});
