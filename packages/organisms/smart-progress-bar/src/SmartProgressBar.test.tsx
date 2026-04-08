import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { SmartProgressBar } from "./SmartProgressBar.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

describe("SmartProgressBar", () => {
  it("renders the explicit summary counters and progressbar", () => {
    renderWithOneUIProvider(
      <SmartProgressBar
        completed={4}
        delayed={1}
        empty={1}
        error={1}
        items={[
          { id: "news", label: "News", status: "success", count: 4 },
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

    expect(screen.getByText("Enterprise search")).toBeTruthy();
    expect(screen.getByRole("progressbar")).toBeTruthy();
    expect(screen.getByText("4 of 7 sources completed • 1 delayed • 1 error")).toBeTruthy();
    expect(screen.getByText("2 success • 1 empty • 1 delayed • 1 error")).toBeTruthy();
    expect(screen.getByText("News")).toBeTruthy();
    expect(screen.getByText("People")).toBeTruthy();
    expect(screen.getByLabelText("News: Success, 4 items")).toBeTruthy();
    expect(screen.getByLabelText("People: Delayed")).toBeTruthy();
  });

  it("supports summary-only rendering for embedded page layouts", () => {
    renderWithOneUIProvider(
      <SmartProgressBar
        completed={2}
        error={0}
        items={[]}
        loading={1}
        percent={67}
        showChips={false}
        success={2}
        summaryText="2 of 3 sections ready"
        title="Task dashboard"
        total={3}
      />
    );

    expect(screen.getByText("2 of 3 sections ready")).toBeTruthy();
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
          { id: "news", label: "News", status: "success", count: 4 },
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
