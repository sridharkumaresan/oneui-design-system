import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OneUIBadge, OneUIButton, OneUILink, OneUIText } from "@functions-oneui/atoms";
import { expectNoAxeViolations } from "@functions-oneui/testing";

import { ActionCard } from "./ActionCard.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

const createMeta = () => (
  <>
    <OneUIText block tone="secondary">
      Owner Maya Rivera
    </OneUIText>
    <OneUIText block tone="secondary">
      Updated 03 Mar 2024, 10:13 GMT
    </OneUIText>
  </>
);

describe("ActionCard", () => {
  it("renders the root and explicit internal regions", () => {
    renderWithOneUIProvider(
      <ActionCard
        actions={<OneUIButton>Approve</OneUIButton>}
        eyebrow="ITEM | REF-10024"
        footer={<OneUIText>Footer summary</OneUIText>}
        meta={createMeta()}
        status={
          <OneUIBadge appearance="filled" tone="danger">
            Overdue
          </OneUIBadge>
        }
        title="Quarterly access review"
      />
    );

    expect(screen.getByRole("article", { name: "Quarterly access review" })).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="mainGrid"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="contentRegion"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="statusRegion"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="dividerRegion"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="actionsRegion"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="footerRegion"]')).toBeTruthy();
  });

  it("renders only the required content region when optional slots are omitted", () => {
    renderWithOneUIProvider(<ActionCard title="Quarterly access review" />);

    expect(document.querySelector('[data-oneui-action-card-region="contentRegion"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="statusRegion"]')).toBeNull();
    expect(document.querySelector('[data-oneui-action-card-region="dividerRegion"]')).toBeNull();
    expect(document.querySelector('[data-oneui-action-card-region="actionsRegion"]')).toBeNull();
    expect(document.querySelector('[data-oneui-action-card-region="footerRegion"]')).toBeNull();
  });

  it("renders divider and action rail only when actions are supplied", () => {
    const { rerender } = renderWithOneUIProvider(
      <ActionCard
        actions={<OneUIButton>Approve</OneUIButton>}
        title="Quarterly access review"
      />
    );

    expect(document.querySelector('[data-oneui-action-card-region="dividerRegion"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="actionsRegion"]')).toBeTruthy();

    rerender(
      <ActionCard
        status={
          <OneUIBadge appearance="soft" tone="warning">
            Due 16 Apr 2025
          </OneUIBadge>
        }
        title="Quarterly access review"
      />
    );

    expect(document.querySelector('[data-oneui-action-card-region="statusRegion"]')).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-region="dividerRegion"]')).toBeNull();
    expect(document.querySelector('[data-oneui-action-card-region="actionsRegion"]')).toBeNull();
  });

  it("preserves logical action order and keeps interactions working", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();

    const { container } = renderWithOneUIProvider(
      <ActionCard
        actions={
          <>
            <OneUIButton onClick={onApprove}>Approve</OneUIButton>
            <OneUIButton appearance="secondary" onClick={onReject}>
              Reject
            </OneUIButton>
            <OneUILink href="/details/42" underline="always">
              Full details
            </OneUILink>
          </>
        }
        title="Quarterly access review"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(
      Array.from(container.querySelectorAll('[data-oneui-action-card-region="actionsRegion"] button, [data-oneui-action-card-region="actionsRegion"] a')).map(
        (element) => element.textContent?.trim()
      )
    ).toEqual(["Approve", "Reject", "Full details"]);
  });

  it("supports long titles and long meta content without dropping region structure", () => {
    renderWithOneUIProvider(
      <ActionCard
        layout="horizontal"
        meta={
          <>
            <OneUIText block tone="secondary">
              Owner Maya Rivera
            </OneUIText>
            <OneUIText block tone="secondary">
              This record includes a deliberately long supporting description to confirm the action
              surface maintains its content, status, divider, and actions grammar under heavier
              copy.
            </OneUIText>
          </>
        }
        status={
          <OneUIBadge appearance="soft" tone="warning">
            Due 16 Apr 2025
          </OneUIBadge>
        }
        title="Quarterly access review and environment provisioning readiness assessment for extended service onboarding"
      />
    );

    expect(
      screen.getByText(
        "This record includes a deliberately long supporting description to confirm the action surface maintains its content, status, divider, and actions grammar under heavier copy."
      )
    ).toBeTruthy();
    expect(document.querySelector('[data-oneui-action-card-layout="horizontal"]')).toBeTruthy();
  });

  it("applies disabled shell semantics without removing content", () => {
    renderWithOneUIProvider(
      <ActionCard
        actions={<OneUIButton disabled>Approve</OneUIButton>}
        isDisabled
        title="Quarterly access review"
      />
    );

    const card = document.querySelector("[data-oneui-action-card]");

    expect(card?.getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("button", { name: "Approve" })).toBeTruthy();
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <ActionCard
        actions={
          <>
            <OneUIButton>Approve</OneUIButton>
            <OneUIButton appearance="secondary">Reject</OneUIButton>
            <OneUILink href="/details/42" underline="always">
              Full details
            </OneUILink>
          </>
        }
        eyebrow="ITEM | REF-10024"
        footer={<OneUIText>Review the environment checklist before final sign-off.</OneUIText>}
        meta={createMeta()}
        status={
          <OneUIBadge appearance="filled" tone="danger">
            Overdue
          </OneUIBadge>
        }
        title="Quarterly access review"
      />
    );

    await expectNoAxeViolations(container);
  });
});
