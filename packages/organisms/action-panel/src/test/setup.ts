import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: vi.fn(() => {
    return {
      measureText: () => ({ width: 0 })
    };
  })
});

afterEach(() => {
  cleanup();
});
