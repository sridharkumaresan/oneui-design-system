import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OneUILink } from "@functions-oneui/atoms";
import { expectNoAxeViolations } from "@functions-oneui/testing";

import { ActionSection } from "./ActionSection.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

describe("ActionSection", () => {
  it("renders the title, count, header action, and stack", () => {
    renderWithOneUIProvider(
      <ActionSection
        count="3"
        headerAction={
          <OneUILink href="/queues/it-requests" underline="always">
            View all
          </OneUILink>
        }
        title="IT Request"
      >
        <div>First card</div>
        <div>Second card</div>
      </ActionSection>
    );

    expect(screen.getByRole("region", { name: /it request/i })).toBeTruthy();
    expect(screen.getByText("(3)")).toBeTruthy();
    expect(screen.getByRole("link", { name: "View all" })).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-section-region="stack"]')).toBeTruthy();
    expect(screen.getByText("First card")).toBeTruthy();
    expect(screen.getByText("Second card")).toBeTruthy();
  });

  it("renders cleanly without count or header action", () => {
    renderWithOneUIProvider(
      <ActionSection title="Review queue">
        <div>Only card</div>
      </ActionSection>
    );

    expect(screen.getByRole("region", { name: "Review queue" })).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-section-region="headerAction"]')).toBeNull();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <ActionSection
        count="2"
        headerAction={
          <OneUILink href="/queues/review" underline="always">
            View queue
          </OneUILink>
        }
        title="Review queue"
      >
        <div>First card</div>
        <div>Second card</div>
      </ActionSection>
    );

    await expectNoAxeViolations(container);
  });
});
