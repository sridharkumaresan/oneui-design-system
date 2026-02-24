import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";
import { OneUIProvider } from "@functions-oneui/theme";

import { SmartSection } from "./SmartSection.js";
import type { SmartSectionFetchResult } from "./SmartSection.types.js";

type DemoItem = {
  id: string;
  label: string;
};

const renderItem = (item: DemoItem): React.ReactNode => React.createElement("span", null, item.label);

const renderInProvider = (ui: React.ReactElement) => {
  return render(React.createElement(OneUIProvider, { mode: "light" }, ui));
};

describe("SmartSection accessibility", () => {
  it("has no obvious axe violations", async () => {
    const fetcher = async (): Promise<SmartSectionFetchResult<DemoItem>> => ({
      items: [{ id: "one", label: "One" }],
      totalCount: 1
    });

    const { container } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "a11y",
        title: "A11y Section",
        requestKey: "a11y-key",
        enabled: true,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("One");
    await expectNoAxeViolations(container);
  });

  it("supports keyboard toggling with proper aria semantics", async () => {
    const fetcher = async (): Promise<SmartSectionFetchResult<DemoItem>> => ({
      items: [{ id: "one", label: "One" }],
      totalCount: 1
    });

    renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "keyboard",
        title: "Keyboard Section",
        requestKey: "keyboard-key",
        enabled: true,
        fetcher,
        renderItem
      })
    );

    await screen.findByText("One");

    const toggle = screen.getByRole("button", { name: /Keyboard Section/ });
    const panel = screen.getByRole("region", { name: "Keyboard Section" });

    expect(toggle.getAttribute("aria-controls")).toBe(panel.id);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    toggle.focus();
    await userEvent.keyboard("{Enter}");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.keyDown(toggle, { key: " ", code: "Space", charCode: 32 });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("updates aria-live status text when section settles", async () => {
    const fetcher = async (): Promise<SmartSectionFetchResult<DemoItem>> => ({
      items: [{ id: "one", label: "One" }],
      totalCount: 1
    });

    const { container } = renderInProvider(
      React.createElement(SmartSection<DemoItem>, {
        sectionId: "live",
        title: "Live Section",
        requestKey: "live-key",
        enabled: true,
        fetcher,
        renderItem
      })
    );

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();

    await waitFor(() => {
      expect(liveRegion?.textContent).toContain("loaded");
    });
  });
});
