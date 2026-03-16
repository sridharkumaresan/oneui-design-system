import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { SmartBreadcrumb } from "./SmartBreadcrumb.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

const items = [
  { href: "#home", id: "home", label: "Home" },
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#hub", id: "hub", label: "Hub" },
  { href: "#sites", id: "sites", label: "Sites" },
  { id: "current", label: "Directory" }
];

describe("SmartBreadcrumb", () => {
  it("renders the current item", () => {
    renderWithOneUIProvider(<SmartBreadcrumb items={items} maxVisibleItems={4} />);

    expect(screen.getByRole("navigation")).toBeTruthy();
    expect(screen.getByText("Directory")).toBeTruthy();
  });

  it("collapses overflow items into a menu trigger", () => {
    renderWithOneUIProvider(<SmartBreadcrumb items={items} maxVisibleItems={4} />);

    expect(screen.getByRole("button", { name: "More locations" })).toBeTruthy();
  });

  it("marks the last breadcrumb item as current", () => {
    renderWithOneUIProvider(
      <SmartBreadcrumb
        items={[
          { href: "#home", id: "home", label: "Home" },
          { href: "#team", id: "team", label: "Team" },
          { id: "current", label: "Directory" }
        ]}
        maxVisibleItems={2}
      />
    );

    expect(screen.getByRole("button", { name: "Directory" }).getAttribute("aria-current")).toBe("page");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(<SmartBreadcrumb items={items} maxVisibleItems={4} />);

    await expectNoAxeViolations(container);
  });
});
