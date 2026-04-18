import React from "react";
import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OneUIText } from "@functions-oneui/atoms";
import { expectNoAxeViolations } from "@functions-oneui/testing";

import { SmartLoadingContainer } from "./SmartLoadingContainer.js";
import { SmartLoadingSection } from "./SmartLoadingSection.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

describe("SmartLoadingContainer", () => {
  it("renders consumer children for success and refreshing states", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection count={3} status="success" title="News">
          <OneUIText>Three news results are available.</OneUIText>
        </SmartLoadingSection>
        <SmartLoadingSection count={3} status="refreshing" title="People">
          <OneUIText>Existing people results remain visible.</OneUIText>
        </SmartLoadingSection>
      </SmartLoadingContainer>
    );

    expect(screen.getByText("Three news results are available.")).toBeTruthy();
    expect(screen.getByText("Existing people results remain visible.")).toBeTruthy();
    expect(
      screen.getByText("Refreshing section content while keeping current results visible.")
    ).toBeTruthy();
  });

  it("supports retry actions and delayed messaging", () => {
    const onRetry = vi.fn();

    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection
          delayedMessage="Taking longer than expected."
          status="delayed"
          title="People"
        />
        <SmartLoadingSection
          errorMessage="Unable to load this source."
          onRetry={onRetry}
          retryLabel="Try again"
          status="error"
          title="Resources"
        />
      </SmartLoadingContainer>
    );

    expect(screen.getByText("Taking longer than expected.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("auto-collapses error sections when configured", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection autoCollapseOnError collapsible status="error" title="Resources" />
      </SmartLoadingContainer>
    );

    const button = screen.getByRole("button", { name: "Expand Resources" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("supports delayed threshold escalation with optional auto-collapse", async () => {
    vi.useFakeTimers();

    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection
          autoCollapseOnDelayed
          collapsible
          delayedThresholdMs={100}
          loadingLabel="Loading people..."
          status="loading"
          title="People"
        />
      </SmartLoadingContainer>
    );

    const button = screen.getByRole("button", { name: "Collapse People" });
    expect(button.getAttribute("aria-expanded")).toBe("true");

    await act(async () => {
      vi.advanceTimersByTime(120);
      await Promise.resolve();
    });

    expect(button.getAttribute("aria-expanded")).toBe("false");
    vi.useRealTimers();
  });

  it("supports delayed sections remaining expanded when auto-collapse is disabled", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection
          collapsible
          delayedMessage="Taking longer than expected."
          status="delayed"
          title="Sites"
        />
      </SmartLoadingContainer>
    );

    expect(screen.getByText("Taking longer than expected.")).toBeTruthy();
    expect(screen.getByText("Taking longer than expected")).toBeTruthy();
  });

  it("allows empty sections to be re-expanded after auto-collapse", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection
          collapseOnEmpty
          collapsible
          emptyMessage="No matching records."
          status="empty"
          title="People"
        />
      </SmartLoadingContainer>
    );

    const headerButton = screen.getByRole("button", { name: "Expand People" });
    expect(headerButton.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(headerButton);

    expect(headerButton.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("No matching records.")).toBeTruthy();
  });

  it("renders custom state content when provided", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection
          emptyContent={<OneUIText>Custom empty body</OneUIText>}
          status="empty"
          title="People"
        />
      </SmartLoadingContainer>
    );

    expect(screen.getByText("Custom empty body")).toBeTruthy();
  });

  it("allows container-level flat section surfaces", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer surfaceAppearance="flat" title="Enterprise search">
        <SmartLoadingSection status="empty" title="People" />
      </SmartLoadingContainer>
    );

    expect(screen.getByRole("region", { name: "People" }).getAttribute("data-oneui-surface-appearance")).toBe(
      "flat"
    );
  });

  it("allows container-level square section shapes", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer shape="square" title="Enterprise search">
        <SmartLoadingSection status="empty" title="People" />
      </SmartLoadingContainer>
    );

    expect(screen.getByRole("region", { name: "People" }).getAttribute("data-oneui-shape")).toBe(
      "square"
    );
  });

  it("allows section-level shape override", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer shape="rounded" title="Enterprise search">
        <SmartLoadingSection shape="square" status="empty" title="People" />
      </SmartLoadingContainer>
    );

    expect(screen.getByRole("region", { name: "People" }).getAttribute("data-oneui-shape")).toBe(
      "square"
    );
  });

  it("applies section className to the section root", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection className="custom-section" status="empty" title="People" />
      </SmartLoadingContainer>
    );

    expect(screen.getByRole("region", { name: "People" }).classList.contains("custom-section")).toBe(
      true
    );
  });

  it("hides children when the section is not settled successfully", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection loadingLabel="Fetching..." status="loading" title="People">
          <OneUIText>Hidden child content</OneUIText>
        </SmartLoadingSection>
      </SmartLoadingContainer>
    );

    expect(screen.getByText("Fetching...")).toBeTruthy();
    expect(screen.getByText("Fetching results...")).toBeTruthy();
    expect(screen.queryByText("Hidden child content")).toBeNull();
  });

  it("supports collapsible sections", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection
          collapsible
          defaultCollapsed
          loadingLabel="Fetching..."
          status="loading"
          title="People"
        />
      </SmartLoadingContainer>
    );

    const headerButton = screen.getByRole("button", { name: "Expand People" });
    expect(headerButton.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(headerButton);

    expect(headerButton.getAttribute("aria-expanded")).toBe("true");
  });

  it("renders the result count inside the header and keeps a separate chevron control", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection collapsible count={24} status="success" title="News" />
      </SmartLoadingContainer>
    );

    expect(screen.getByText("24")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Collapse News" })).toBeTruthy();
  });

  it("derives default avatar initials from the section title", () => {
    renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection count={3} status="success" title="Sites and events" />
      </SmartLoadingContainer>
    );

    expect(screen.getByText("SA")).toBeTruthy();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <SmartLoadingContainer title="Enterprise search">
        <SmartLoadingSection count={3} status="success" title="News">
          <OneUIText>Three news results are available.</OneUIText>
        </SmartLoadingSection>
      </SmartLoadingContainer>
    );

    await expectNoAxeViolations(container);
  }, 20000);
});
