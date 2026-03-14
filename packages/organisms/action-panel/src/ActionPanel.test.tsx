import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";
import { ActionPanel } from "./ActionPanel.js";

describe("ActionPanel", () => {
  it("renders the title, description, and actions", () => {
    renderWithOneUIProvider(
      <ActionPanel
        description="Review the release state before publishing changes."
        primaryAction={{ label: "Approve" }}
        secondaryAction={{ label: "View details" }}
        title="Release review"
      />
    );

    expect(screen.getByRole("region", { name: "Release review" })).toBeTruthy();
    expect(screen.getByText("Review the release state before publishing changes.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Approve" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "View details" })).toBeTruthy();
  });

  it("calls action handlers in response to clicks", () => {
    const onPrimaryClick = vi.fn();
    const onSecondaryClick = vi.fn();

    renderWithOneUIProvider(
      <ActionPanel
        primaryAction={{ label: "Approve", onClick: onPrimaryClick }}
        secondaryAction={{ label: "View details", onClick: onSecondaryClick }}
        title="Release review"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View details" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    expect(onSecondaryClick).toHaveBeenCalledTimes(1);
    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  it("keeps the secondary action before the primary action in keyboard order", () => {
    renderWithOneUIProvider(
      <ActionPanel
        primaryAction={{ label: "Continue" }}
        secondaryAction={{ label: "Back" }}
        title="Release review"
      />
    );

    const actionLabels = screen.getAllByRole("button").map((element) => element.textContent);

    expect(actionLabels).toEqual(["Back", "Continue"]);
  });

  it("supports the stacked layout", () => {
    renderWithOneUIProvider(
      <ActionPanel layout="stacked" primaryAction={{ label: "Continue" }} title="Review" />
    );

    expect(document.querySelector('[data-oneui-action-panel-layout="stacked"]')).toBeTruthy();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <ActionPanel
        description="Review the release state before publishing changes."
        primaryAction={{ label: "Approve" }}
        secondaryAction={{ label: "View details" }}
        title="Release review"
      />
    );

    await expectNoAxeViolations(container);
  });
});
