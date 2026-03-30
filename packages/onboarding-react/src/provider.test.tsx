import React from "react";
import { Button } from "@fluentui/react-components";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { OneUIProvider } from "@functions-oneui/theme";

import { OneUIOnboardingProvider } from "./provider.js";
import { useOnboardingTarget, useOnboardingTour } from "./hooks.js";

const TourDemo = () => {
  const target = useOnboardingTarget("search");
  const tour = useOnboardingTour("welcome");

  return (
    <div>
      <Button onClick={() => tour.start()}>Start tour</Button>
      <Button onClick={() => tour.restart()}>Restart tour</Button>
      <div ref={target.ref}>Search box</div>
    </div>
  );
};

afterEach(() => {
  cleanup();
});

describe("OneUIOnboardingProvider", () => {
  it("registers targets and starts a tour through the hook API", async () => {
    const startSpy = vi.fn();

    const driverFactory = vi.fn((config) => {
      return {
        isActive: () => true,
        refresh: vi.fn(),
        drive: startSpy,
        setConfig: vi.fn(),
        setSteps: vi.fn(),
        getConfig: () => config,
        getState: () => ({}),
        getActiveIndex: () => 0,
        isFirstStep: () => true,
        isLastStep: () => true,
        getActiveStep: () => undefined,
        getActiveElement: () => undefined,
        getPreviousElement: () => undefined,
        getPreviousStep: () => undefined,
        moveNext: vi.fn(),
        movePrevious: vi.fn(),
        moveTo: vi.fn(),
        hasNextStep: () => false,
        hasPreviousStep: () => false,
        highlight: vi.fn(),
        destroy: vi.fn()
      };
    });

    render(
      <OneUIProvider>
        <OneUIOnboardingProvider
          controllerOverrides={{
            driverFactory
          }}
          tours={[
            {
              id: "welcome",
              version: "1",
              steps: [{ id: "search", target: { kind: "named", name: "search" } }]
            }
          ]}
        >
          <TourDemo />
        </OneUIOnboardingProvider>
      </OneUIProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Start tour" }));

    await waitFor(() => {
      expect(startSpy).toHaveBeenCalledWith(0);
    });
  });

  it("restarts a completed tour through the hook API", async () => {
    let configRef;

    const driverFactory = vi.fn((config) => {
      configRef = config;

      return {
        isActive: () => true,
        refresh: vi.fn(),
        drive: vi.fn(),
        setConfig: vi.fn(),
        setSteps: vi.fn(),
        getConfig: () => config,
        getState: () => ({}),
        getActiveIndex: () => 0,
        isFirstStep: () => true,
        isLastStep: () => true,
        getActiveStep: () => undefined,
        getActiveElement: () => undefined,
        getPreviousElement: () => undefined,
        getPreviousStep: () => undefined,
        moveNext: vi.fn(),
        movePrevious: vi.fn(),
        moveTo: vi.fn(),
        hasNextStep: () => false,
        hasPreviousStep: () => false,
        highlight: vi.fn(),
        destroy: vi.fn()
      };
    });

    render(
      <OneUIProvider>
        <OneUIOnboardingProvider
          controllerOverrides={{
            driverFactory
          }}
          tours={[
            {
              id: "welcome",
              version: "1",
              steps: [{ id: "search", target: { kind: "named", name: "search" } }]
            }
          ]}
        >
          <TourDemo />
        </OneUIOnboardingProvider>
      </OneUIProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Start tour" }));

    await waitFor(() => {
      expect(driverFactory).toHaveBeenCalledTimes(1);
    });

    configRef.onNextClick?.(undefined, configRef.steps?.[0], {
      config: configRef,
      state: { activeIndex: 0 },
      driver: driverFactory.mock.results[0].value
    });

    fireEvent.click(screen.getByRole("button", { name: "Restart tour" }));

    await waitFor(() => {
      expect(driverFactory).toHaveBeenCalledTimes(2);
    });
  });
});
