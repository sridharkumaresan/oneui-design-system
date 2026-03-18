import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useOneUIId } from "./useOneUIId.js";

const reactModule = React as typeof React & { useId?: () => string };
const originalUseId = reactModule.useId;

const Probe = (): React.JSX.Element => {
  const id = useOneUIId("probe");

  return <div data-testid="probe" id={id} />;
};

describe("useOneUIId", () => {
  afterEach(() => {
    reactModule.useId = originalUseId;
  });

  it("uses React.useId when it is available", () => {
    reactModule.useId = () => ":r1:";

    render(<Probe />);

    expect(screen.getByTestId("probe").id).toBe("probe-r1");
  });

  it("falls back to a stable ref-based id when React.useId is unavailable", () => {
    delete reactModule.useId;

    const { rerender } = render(<Probe />);
    const firstId = screen.getByTestId("probe").id;

    rerender(<Probe />);

    expect(screen.getByTestId("probe").id).toBe(firstId);
    expect(firstId.startsWith("probe-")).toBe(true);
  });
});
