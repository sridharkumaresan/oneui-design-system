import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { SmartProgressBar } from "./SmartProgressBar.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

describe("SmartProgressBar", () => {
  it("renders slim mode by default and expands to reveal details", () => {
    renderWithOneUIProvider(
      <SmartProgressBar
        completed={4}
        delayed={1}
        empty={1}
        error={1}
        items={[
          { count: 4, id: "news", label: "News", status: "success" },
          { id: "people", label: "People", status: "delayed" }
        ]}
        loading={0}
        percent={57}
        refreshing={0}
        success={2}
        title="Enterprise search"
        total={7}
      />
    );

    const toggle = screen.getByRole("button", { name: /enterprise search/i });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("progressbar")).toBeTruthy();

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getAllByText("4 of 7 sources completed • 1 delayed • 1 error").length).toBe(2);
    expect(screen.getByText("2 success • 1 empty • 1 delayed • 1 error")).toBeTruthy();
    expect(screen.getByText("News")).toBeTruthy();
    expect(screen.getByText("People")).toBeTruthy();
    expect(screen.getByLabelText("News: Success, 4 items")).toBeTruthy();
    expect(screen.getByLabelText("People: Delayed")).toBeTruthy();
  });

  it("supports full mode for always-expanded rendering", () => {
    renderWithOneUIProvider(
      <SmartProgressBar
        completed={2}
        error={0}
        items={[]}
        loading={1}
        mode="full"
        percent={67}
        showChips={false}
        success={2}
        summaryText="2 of 3 sections ready"
        title="Task dashboard"
        total={3}
      />
    );

    expect(screen.getByText("2 of 3 sections ready")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /task dashboard/i })).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("uses a consistent pill appearance for all status chips", () => {
    const { container } = renderWithOneUIProvider(
      <SmartProgressBar
        completed={3}
        error={1}
        items={[
          { id: "news", label: "News", status: "success" },
          { id: "people", label: "People", status: "loading" },
          { id: "files", label: "Files", status: "empty" },
          { id: "resources", label: "Resources", status: "error" }
        ]}
        loading={1}
        mode="full"
        success={1}
        title="Enterprise search"
        total={7}
      />
    );

    const chips = Array.from(container.querySelectorAll("[data-oneui-badge-appearance]"));
    expect(chips.length).toBe(4);
    expect(chips.every((chip) => chip.getAttribute("data-oneui-badge-appearance") === "soft")).toBe(
      true
    );
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <SmartProgressBar
        completed={4}
        delayed={1}
        empty={1}
        error={1}
        items={[
          { count: 4, id: "news", label: "News", status: "success" },
          { id: "people", label: "People", status: "delayed" }
        ]}
        loading={0}
        percent={57}
        refreshing={0}
        success={2}
        title="Enterprise search"
        total={7}
      />
    );

    await expectNoAxeViolations(container);
  });
});
