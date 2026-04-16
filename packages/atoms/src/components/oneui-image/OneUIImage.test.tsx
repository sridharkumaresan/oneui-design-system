import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { renderWithOneUIProvider } from "../../test/renderWithOneUIProvider.js";
import { OneUIImage } from "./OneUIImage.js";

let currentBehavior: "success" | "error" = "success";

class MockImage {
  public naturalHeight = 240;
  public naturalWidth = 320;
  public onerror: ((event?: Event) => void) | null = null;
  public onload: (() => void) | null = null;

  public set src(_value: string) {
    queueMicrotask(() => {
      if (currentBehavior === "success") {
        this.onload?.();
      } else {
        this.onerror?.(new Event("error"));
      }
    });
  }
}

describe("OneUIImage", () => {
  const originalImage = globalThis.Image;

  beforeEach(() => {
    currentBehavior = "success";
    globalThis.Image = MockImage as unknown as typeof Image;
  });

  afterEach(() => {
    globalThis.Image = originalImage;
  });

  it("renders empty fallback when no src is provided", () => {
    renderWithOneUIProvider(<OneUIImage alt="Empty state" src={undefined} />);

    expect(screen.getByText("No image available")).toBeTruthy();
  });

  it("renders an image after successful load", async () => {
    renderWithOneUIProvider(<OneUIImage alt="Loaded state" src="https://example.com/a.png" />);

    await waitFor(() => {
      expect(screen.getByRole("img", { name: "Loaded state" })).toBeTruthy();
    });
  });

  it("applies a custom root border radius", () => {
    const { container } = renderWithOneUIProvider(
      <OneUIImage alt="Custom radius" borderRadius="12px" src={undefined} />
    );

    expect(container.querySelector("[data-oneui-image]")?.getAttribute("style")).toContain(
      "border-radius: 12px"
    );
  });

  it("renders the fallback source after a primary load error", async () => {
    let attempt = 0;
    globalThis.Image = class extends MockImage {
      public override set src(_value: string) {
        attempt += 1;
        queueMicrotask(() => {
          if (attempt === 1) {
            this.onerror?.(new Event("error"));
            return;
          }

          this.onload?.();
        });
      }
    } as unknown as typeof Image;

    renderWithOneUIProvider(
      <OneUIImage
        alt="Fallback state"
        fallbackSrc="https://example.com/fallback.png"
        src="https://example.com/a.png"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("img", { name: "Fallback state" })).toBeTruthy();
    });
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(<OneUIImage alt="Accessible image" src={undefined} />);

    await expectNoAxeViolations(container);
  });
});
