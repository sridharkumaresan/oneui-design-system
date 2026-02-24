import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";
import { OneUIProvider } from "@functions-oneui/theme";

import { ActionPanel } from "./ActionPanel.js";

const renderInProvider = (ui: React.ReactElement) => {
  return render(React.createElement(OneUIProvider, { mode: "light" }, ui));
};

describe("ActionPanel", () => {
  it("renders required content and optional description", () => {
    renderInProvider(
      React.createElement(ActionPanel, {
        title: "Review Request",
        description: "Approve or request changes.",
        primaryAction: { label: "Approve" }
      })
    );

    expect(screen.getByRole("heading", { name: "Review Request" })).toBeTruthy();
    expect(screen.getByText("Approve or request changes.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Approve" })).toBeTruthy();
  });

  it("renders and invokes primary and secondary actions", async () => {
    const primaryClick = vi.fn();
    const secondaryClick = vi.fn();
    const user = userEvent.setup();

    renderInProvider(
      React.createElement(ActionPanel, {
        title: "Review Request",
        primaryAction: { label: "Approve", onClick: primaryClick },
        secondaryAction: { label: "Request Changes", onClick: secondaryClick }
      })
    );

    await user.click(screen.getByRole("button", { name: "Approve" }));
    await user.click(screen.getByRole("button", { name: "Request Changes" }));

    expect(primaryClick).toHaveBeenCalledTimes(1);
    expect(secondaryClick).toHaveBeenCalledTimes(1);
  });

  it("supports stacked layout and keeps button tab order", async () => {
    const user = userEvent.setup();

    renderInProvider(
      React.createElement(ActionPanel, {
        title: "Review Request",
        layout: "stacked",
        primaryAction: { label: "Approve" },
        secondaryAction: { label: "Request Changes" }
      })
    );

    const panel = screen.getByRole("region", { name: "Review Request" });
    expect(panel.getAttribute("data-layout")).toBe("stacked");

    const primaryButton = screen.getByRole("button", { name: "Approve" });
    const secondaryButton = screen.getByRole("button", { name: "Request Changes" });

    expect(primaryButton.style.width).toBe("100%");
    expect(secondaryButton.style.width).toBe("100%");

    await user.tab();
    expect(document.activeElement).toBe(primaryButton);
    await user.tab();
    expect(document.activeElement).toBe(secondaryButton);

    expect(primaryButton.style.outline).not.toBe("none");
    expect(secondaryButton.style.outline).not.toBe("none");
  });

  it("respects disabled action state", async () => {
    const primaryClick = vi.fn();
    const secondaryClick = vi.fn();
    const user = userEvent.setup();

    renderInProvider(
      React.createElement(ActionPanel, {
        title: "Review Request",
        primaryAction: { label: "Approve", onClick: primaryClick, disabled: true },
        secondaryAction: { label: "Request Changes", onClick: secondaryClick, disabled: true }
      })
    );

    const primaryButton = screen.getByRole("button", { name: "Approve" });
    const secondaryButton = screen.getByRole("button", { name: "Request Changes" });

    await user.click(primaryButton);
    await user.click(secondaryButton);

    expect(primaryButton.getAttribute("disabled")).not.toBeNull();
    expect(secondaryButton.getAttribute("disabled")).not.toBeNull();
    expect(primaryClick).not.toHaveBeenCalled();
    expect(secondaryClick).not.toHaveBeenCalled();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderInProvider(
      React.createElement(ActionPanel, {
        title: "Review Request",
        description: "Approve or request changes.",
        primaryAction: { label: "Approve" },
        secondaryAction: { label: "Request Changes" }
      })
    );

    await expectNoAxeViolations(container);
  });
});
