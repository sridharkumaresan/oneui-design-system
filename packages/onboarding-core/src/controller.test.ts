import { describe, expect, it, vi } from "vitest";

import { createOnboardingController } from "./controller.js";
import type { OnboardingAnalyticsEvent, OnboardingPersistenceRecord } from "./types.js";

const makeDriverFactory = () => {
  let config: any;
  const state = {
    activeIndex: 0
  };
  const api = {
    isActive: () => true,
    refresh: vi.fn(),
    drive: vi.fn((index?: number) => {
      state.activeIndex = index ?? 0;
      const step = config.steps?.[state.activeIndex];
      config.onHighlighted?.(undefined, step, { config, state, driver: api });
    }),
    setConfig: vi.fn(),
    setSteps: vi.fn(),
    getConfig: () => config,
    getState: () => state,
    getActiveIndex: () => state.activeIndex,
    isFirstStep: () => state.activeIndex === 0,
    isLastStep: () => state.activeIndex === (config.steps?.length ?? 1) - 1,
    getActiveStep: () => config.steps?.[state.activeIndex],
    getActiveElement: () => undefined,
    getPreviousElement: () => undefined,
    getPreviousStep: () => undefined,
    moveNext: vi.fn(() => {
      state.activeIndex += 1;
      const step = config.steps?.[state.activeIndex];
      config.onHighlighted?.(undefined, step, { config, state, driver: api });
    }),
    movePrevious: vi.fn(() => {
      state.activeIndex = Math.max(0, state.activeIndex - 1);
      const step = config.steps?.[state.activeIndex];
      config.onHighlighted?.(undefined, step, { config, state, driver: api });
    }),
    moveTo: vi.fn(),
    hasNextStep: () => true,
    hasPreviousStep: () => true,
    highlight: vi.fn(),
    destroy: vi.fn(() => {
      config.onDestroyed?.(undefined, config.steps?.[state.activeIndex], { config, state, driver: api });
    })
  };

  return {
    factory: (nextConfig?: any) => {
      config = nextConfig;
      return api;
    },
    api
  };
};

const createPopoverDom = () => {
  const wrapper = document.createElement("div");
  const title = document.createElement("h2");
  const description = document.createElement("p");
  const footer = document.createElement("div");
  const progress = document.createElement("span");
  const previousButton = document.createElement("button");
  const nextButton = document.createElement("button");
  const closeButton = document.createElement("button");
  const footerButtons = document.createElement("div");

  footer.append(progress, footerButtons);
  footerButtons.append(previousButton, nextButton);
  wrapper.append(title, description, footer, closeButton);

  return {
    wrapper,
    arrow: document.createElement("span"),
    title,
    description,
    footer,
    progress,
    previousButton,
    nextButton,
    closeButton,
    footerButtons
  };
};

describe("createOnboardingController", () => {
  it("starts a tour and tracks analytics for visible steps", async () => {
    const events: OnboardingAnalyticsEvent[] = [];
    const persistence = new Map<string, OnboardingPersistenceRecord>();
    const driverFactory = makeDriverFactory();
    const target = document.createElement("button");
    document.body.append(target);

    const controller = createOnboardingController({
      tours: [
        {
          id: "welcome",
          version: "1",
          steps: [
            {
              id: "step-1",
              title: "First step",
              target: { kind: "element", element: target }
            }
          ]
        }
      ],
      analytics: {
        track: (event) => {
          events.push(event);
        }
      },
      persistence: {
        load: (tourId) => persistence.get(tourId),
        save: (tourId, record) => {
          persistence.set(tourId, record);
        }
      },
      driverFactory: driverFactory.factory,
      document
    });

    const result = await controller.startTour("welcome");

    expect(result.ok).toBe(true);
    expect(driverFactory.api.drive).toHaveBeenCalledWith(0);
    expect(events.map((event) => event.eventName)).toEqual(["tour_started", "step_viewed"]);
    expect(document.body.getAttribute("data-oneui-onboarding-scope")).toBe("oneui-onboarding");
  });

  it("skips missing targets when configured to skip", async () => {
    const driverFactory = makeDriverFactory();
    const controller = createOnboardingController({
      tours: [
        {
          id: "welcome",
          version: "1",
          steps: [
            { id: "missing", target: { kind: "named", name: "missing" } },
            { id: "present", target: { kind: "selector", selector: "body" } }
          ]
        }
      ],
      driverFactory: driverFactory.factory,
      document
    });

    const result = await controller.startTour("welcome");

    expect(result).toMatchObject({
      ok: true,
      stepCount: 1
    });
  });

  it("restarts a completed tour from the beginning", async () => {
    const persistence = new Map<string, OnboardingPersistenceRecord>();
    const driverFactory = makeDriverFactory();
    const target = document.createElement("button");
    document.body.append(target);

    const controller = createOnboardingController({
      tours: [
        {
          id: "welcome",
          version: "1",
          steps: [
            {
              id: "step-1",
              title: "First step",
              target: { kind: "element", element: target }
            }
          ]
        }
      ],
      persistence: {
        load: (tourId) => persistence.get(tourId),
        save: (tourId, record) => {
          persistence.set(tourId, record);
        }
      },
      driverFactory: driverFactory.factory,
      document
    });

    const firstRun = await controller.startTour("welcome");
    expect(firstRun.ok).toBe(true);

    const config = driverFactory.api.getConfig();
    config.onNextClick?.(undefined, config.steps?.[0], {
      config,
      state: { activeIndex: 0 },
      driver: driverFactory.api
    });

    expect(persistence.get("welcome")?.status).toBe("completed");

    const restarted = await controller.restartTour("welcome");

    expect(restarted).toMatchObject({
      ok: true,
      startIndex: 0
    });
    expect(driverFactory.api.drive).toHaveBeenLastCalledWith(0);
    expect(persistence.get("welcome")?.status).toBe("in-progress");
  });

  it("decorates branded tours with pagination indicators", async () => {
    const driverFactory = makeDriverFactory();
    const controller = createOnboardingController({
      tours: [
        {
          id: "welcome",
          version: "1",
          visual: {
            appearance: "brand",
            progressDisplay: "dots-and-count"
          },
          steps: [
            { id: "first", target: { kind: "selector", selector: "body" } },
            { id: "second", target: { kind: "selector", selector: "body" } },
            { id: "third", target: { kind: "selector", selector: "body" } }
          ]
        }
      ],
      driverFactory: driverFactory.factory,
      document
    });

    await controller.startTour("welcome");

    const popover = createPopoverDom();
    const config = driverFactory.api.getConfig();
    config.onPopoverRender?.(popover, {
      config,
      state: { activeIndex: 1 },
      driver: driverFactory.api
    });

    expect(popover.wrapper.getAttribute("data-oneui-onboarding-appearance")).toBe("brand");
    expect(popover.arrow.getAttribute("data-oneui-onboarding-appearance")).toBe("brand");
    expect(popover.footer.children[0]).toBe(popover.previousButton);
    expect(popover.footer.children[1]?.classList.contains("oneui-onboarding-footer-center")).toBe(true);
    expect(popover.footer.children[2]).toBe(popover.nextButton);
    expect(popover.footer.children[1]?.querySelectorAll(".oneui-onboarding-pagination-dot")).toHaveLength(3);
    expect(popover.footer.children[1]?.querySelectorAll(".oneui-onboarding-pagination-dot-active")).toHaveLength(1);
    expect(popover.progress.getAttribute("aria-label")).toBe("Step 2 of 3");
  });

  it("renders a full-page step from config with dialog semantics and media", async () => {
    const driverFactory = makeDriverFactory();
    const controller = createOnboardingController({
      tours: [
        {
          id: "announcement",
          version: "1",
          steps: [
            {
              id: "new-view",
              kind: "full-page",
              eyebrow: "New feature",
              title: "New dashboard views are available",
              description: "Switch between compact and detailed layouts.",
              body: "Choose the view that best fits your workflow.",
              layout: "split-media",
              media: {
                type: "image",
                src: "https://example.test/dashboard.png",
                alt: "Preview of compact and detailed dashboard views",
                position: "left"
              }
            }
          ]
        }
      ],
      driverFactory: driverFactory.factory,
      document
    });

    await controller.startTour("announcement");

    const popover = createPopoverDom();
    const config = driverFactory.api.getConfig();
    config.onPopoverRender?.(popover, {
      config,
      state: { activeIndex: 0 },
      driver: driverFactory.api
    });

    expect(popover.wrapper.getAttribute("role")).toBe("dialog");
    expect(popover.wrapper.getAttribute("aria-modal")).toBe("true");
    expect(popover.wrapper.getAttribute("data-oneui-onboarding-kind")).toBe("full-page");
    expect(popover.wrapper.getAttribute("data-oneui-onboarding-layout")).toBe("split-media");
    expect(popover.wrapper.textContent).toContain("New dashboard views are available");
    expect(popover.wrapper.textContent).toContain("Choose the view that best fits your workflow.");
    const image = popover.wrapper.querySelector("img");
    expect(image?.getAttribute("src")).toBe("https://example.test/dashboard.png");
    expect(image?.getAttribute("alt")).toBe("Preview of compact and detailed dashboard views");
  });

  it("invokes a primary action handler and then follows the configured behavior", async () => {
    const actionHandler = vi.fn();
    const driverFactory = makeDriverFactory();
    const controller = createOnboardingController({
      tours: [
        {
          id: "announcement",
          version: "1",
          steps: [
            {
              id: "new-view",
              kind: "full-page",
              title: "New dashboard views are available",
              primaryAction: {
                label: "Choose dashboard view",
                actionId: "open-dashboard-preferences",
                behavior: "custom"
              }
            }
          ]
        }
      ],
      actionHandlers: {
        "open-dashboard-preferences": actionHandler
      },
      driverFactory: driverFactory.factory,
      document
    });

    await controller.startTour("announcement");

    const popover = createPopoverDom();
    const config = driverFactory.api.getConfig();
    config.onPopoverRender?.(popover, {
      config,
      state: { activeIndex: 0 },
      driver: driverFactory.api
    });

    popover.wrapper
      .querySelector<HTMLButtonElement>(".oneui-onboarding-full-page-primary-action")
      ?.click();
    await Promise.resolve();

    expect(actionHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: "open-dashboard-preferences",
        behavior: "custom",
        stepIndex: 0
      })
    );
    expect(driverFactory.api.moveNext).not.toHaveBeenCalled();
    expect(driverFactory.api.destroy).not.toHaveBeenCalled();
  });

  it("supports secondary action behavior", async () => {
    const persistence = new Map<string, OnboardingPersistenceRecord>();
    const driverFactory = makeDriverFactory();
    const controller = createOnboardingController({
      tours: [
        {
          id: "announcement",
          version: "1",
          steps: [
            {
              id: "new-view",
              kind: "full-page",
              title: "New dashboard views are available",
              secondaryAction: {
                label: "Maybe later",
                behavior: "complete"
              }
            }
          ]
        }
      ],
      persistence: {
        load: (tourId) => persistence.get(tourId),
        save: (tourId, record) => {
          persistence.set(tourId, record);
        }
      },
      driverFactory: driverFactory.factory,
      document
    });

    await controller.startTour("announcement");

    const popover = createPopoverDom();
    const config = driverFactory.api.getConfig();
    config.onPopoverRender?.(popover, {
      config,
      state: { activeIndex: 0 },
      driver: driverFactory.api
    });

    popover.wrapper
      .querySelector<HTMLButtonElement>(".oneui-onboarding-full-page-secondary-action")
      ?.click();
    await Promise.resolve();

    expect(persistence.get("announcement")?.status).toBe("completed");
    expect(driverFactory.api.destroy).toHaveBeenCalled();
  });

  it("does not crash when a configured action handler is missing", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const driverFactory = makeDriverFactory();
    const controller = createOnboardingController({
      tours: [
        {
          id: "announcement",
          version: "1",
          steps: [
            {
              id: "new-view",
              kind: "full-page",
              title: "New dashboard views are available",
              primaryAction: {
                label: "Choose dashboard view",
                actionId: "missing-handler",
                behavior: "next"
              }
            },
            {
              id: "search",
              target: { kind: "selector", selector: "body" },
              title: "Search"
            }
          ]
        }
      ],
      driverFactory: driverFactory.factory,
      document
    });

    await controller.startTour("announcement");

    const popover = createPopoverDom();
    const config = driverFactory.api.getConfig();
    config.onPopoverRender?.(popover, {
      config,
      state: { activeIndex: 0 },
      driver: driverFactory.api
    });

    expect(() => {
      popover.wrapper
        .querySelector<HTMLButtonElement>(".oneui-onboarding-full-page-primary-action")
        ?.click();
    }).not.toThrow();
    await Promise.resolve();

    expect(warnSpy).toHaveBeenCalledWith(
      "OneUI onboarding action 'missing-handler' has no registered handler."
    );
    expect(driverFactory.api.moveNext).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("supports mixed full-page and focus-element steps without breaking focus tours", async () => {
    const driverFactory = makeDriverFactory();
    const target = document.createElement("button");
    document.body.append(target);

    const controller = createOnboardingController({
      tours: [
        {
          id: "mixed",
          version: "1",
          steps: [
            {
              id: "intro",
              kind: "full-page",
              title: "Welcome"
            },
            {
              id: "targeted",
              target: { kind: "element", element: target },
              title: "Targeted step"
            }
          ]
        }
      ],
      driverFactory: driverFactory.factory,
      document
    });

    const result = await controller.startTour("mixed");

    expect(result).toMatchObject({
      ok: true,
      stepCount: 2
    });
    const steps = driverFactory.api.getConfig().steps;
    expect(steps?.[0]?.element).toBeUndefined();
    expect(steps?.[1]?.element).toBe(target);
  });
});
