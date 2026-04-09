import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { IllustratedState } from "./IllustratedState.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

describe("IllustratedState", () => {
  it("renders default copy for a built-in variant", () => {
    renderWithOneUIProvider(<IllustratedState variant="no-results" />);

    expect(screen.getByRole("region", { name: "No results found" })).toBeTruthy();
    expect(
      screen.getByText(
        "Try a broader search, clear some filters, or search with different keywords."
      )
    ).toBeTruthy();
  });

  it("renders custom copy and action handlers", () => {
    const onRetry = vi.fn();
    const onBack = vi.fn();

    renderWithOneUIProvider(
      <IllustratedState
        description="Reload the feed to try again."
        primaryAction={{ label: "Retry", onClick: onRetry }}
        secondaryAction={{ label: "Go back", onClick: onBack }}
        title="Feed unavailable"
        variant="error"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(screen.getByRole("region", { name: "Feed unavailable" })).toBeTruthy();
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders custom illustration and extra content", () => {
    renderWithOneUIProvider(
      <IllustratedState
        illustration={<div data-testid="custom-illustration">art</div>}
        title="Custom state"
        variant="custom"
      >
        <div data-testid="custom-children">Extra details</div>
      </IllustratedState>
    );

    expect(screen.getByTestId("custom-illustration")).toBeTruthy();
    expect(screen.getByTestId("custom-children")).toBeTruthy();
  });

  it("supports a borderless embedded surface appearance", () => {
    renderWithOneUIProvider(
      <IllustratedState
        surfaceAppearance="borderless"
        title="Embedded state"
        variant="no-data"
      />
    );

    expect(
      screen.getByRole("region", { name: "Embedded state" }).getAttribute(
        "data-oneui-surface-appearance"
      )
    ).toBe("borderless");
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <IllustratedState
        description="Try a broader search, clear some filters, or search with different keywords."
        primaryAction={{ label: "Try again" }}
        title="No results found"
        variant="no-results"
      />
    );

    await expectNoAxeViolations(container);
  });
});
