import { driver } from "driver.js";
import type { Config, Driver, DriveStep, PopoverDOM } from "driver.js";

import {
  oneuiOnboardingClassNames,
  type OnboardingActionBehavior,
  type OnboardingActionContext,
  type OnboardingFullPageStepDefinition,
  type OnboardingAnalyticsAdapter,
  type OnboardingAnalyticsEvent,
  type OnboardingController,
  type OnboardingControllerOptions,
  type OnboardingPersistenceAdapter,
  type OnboardingPersistenceRecord,
  type OnboardingRunContext,
  type OnboardingStartReason,
  type OnboardingStartResult,
  type OnboardingStepDefinition,
  type OnboardingStepTarget,
  type OnboardingTargetResolveContext,
  type OnboardingTourDefinition,
  type OnboardingVisualConfig,
  type StartOnboardingTourOptions
} from "./types.js";

type ResolvedStep = {
  source: OnboardingStepDefinition;
  driveStep: DriveStep;
};

type RuntimeState = {
  activeTourId?: string;
  activeDriver?: Driver;
};

const noopAnalyticsAdapter: OnboardingAnalyticsAdapter = {
  track: () => {}
};

const defaultPersistence = new Map<string, OnboardingPersistenceRecord>();
const memoryPersistenceAdapter: OnboardingPersistenceAdapter = {
  load: (tourId) => {
    return defaultPersistence.get(tourId);
  },
  save: (tourId, record) => {
    defaultPersistence.set(tourId, record);
  },
  clear: (tourId) => {
    defaultPersistence.delete(tourId);
  }
};

const decoratePopoverDom = (
  popover: PopoverDOM,
  classNames: typeof oneuiOnboardingClassNames,
  options: {
    activeIndex: number;
    stepCount: number;
    visual?: OnboardingVisualConfig;
  }
): void => {
  const progressDisplay = options.visual?.progressDisplay ?? "count";
  const appearance = options.visual?.appearance ?? "neutral";

  popover.wrapper.classList.add(classNames.popover);
  popover.wrapper.setAttribute("data-oneui-onboarding-appearance", appearance);
  popover.arrow.setAttribute("data-oneui-onboarding-arrow", "");
  popover.arrow.setAttribute("data-oneui-onboarding-appearance", appearance);
  popover.title.classList.add(classNames.title);
  popover.description.classList.add(classNames.description);
  popover.footer.classList.add(classNames.footer);
  popover.progress.classList.add(classNames.progress);
  popover.previousButton.classList.add(classNames.button, classNames.previousButton);
  popover.nextButton.classList.add(classNames.button, classNames.nextButton);
  popover.closeButton.classList.add(classNames.closeButton);
  popover.footerButtons.classList.add(classNames.navigation);

  popover.footer.querySelector(`.${classNames.pagination}`)?.remove();
  popover.footer.querySelector(`.${classNames.footerCenter}`)?.remove();
  popover.progress.classList.toggle(classNames.progressCount, progressDisplay !== "dots");
  popover.progress.setAttribute(
    "aria-label",
    `Step ${options.activeIndex + 1} of ${options.stepCount}`
  );

  const footerCenter = popover.wrapper.ownerDocument.createElement("div");
  footerCenter.className = classNames.footerCenter;

  if (progressDisplay === "dots" || progressDisplay === "dots-and-count") {
    const pagination = popover.wrapper.ownerDocument.createElement("div");
    pagination.className = classNames.pagination;
    pagination.setAttribute("aria-hidden", "true");

    for (let index = 0; index < options.stepCount; index += 1) {
      const dot = popover.wrapper.ownerDocument.createElement("span");
      dot.className =
        index === options.activeIndex
          ? `${classNames.paginationDot} ${classNames.paginationDotActive}`
          : classNames.paginationDot;
      pagination.append(dot);
    }

    footerCenter.append(pagination);
  }

  footerCenter.append(popover.progress);
  popover.footer.replaceChildren(popover.previousButton, footerCenter, popover.nextButton);

  if (progressDisplay === "dots") {
    popover.progress.style.position = "absolute";
    popover.progress.style.inlineSize = "1px";
    popover.progress.style.blockSize = "1px";
    popover.progress.style.margin = "-1px";
    popover.progress.style.overflow = "hidden";
    popover.progress.style.clip = "rect(0 0 0 0)";
  } else {
    popover.progress.removeAttribute("style");
  }
};

const isFullPageStep = (
  step: OnboardingStepDefinition
): step is OnboardingFullPageStepDefinition => step.kind === "full-page";

const appendTextElement = (
  documentRef: Document,
  parent: HTMLElement,
  tagName: keyof HTMLElementTagNameMap,
  className: string,
  text: string,
  id?: string
): HTMLElement => {
  const element = documentRef.createElement(tagName);
  element.className = className;
  element.textContent = text;
  if (id) {
    element.id = id;
  }
  parent.append(element);
  return element;
};

const createActionButton = (
  documentRef: Document,
  className: string,
  label: string,
  onClick: () => Promise<void> | void
): HTMLButtonElement => {
  const button = documentRef.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", () => {
    void onClick();
  });
  return button;
};

const safeWarn = (message: string): void => {
  globalThis.console?.warn?.(message);
};

const resolveElement = (
  target: OnboardingStepTarget | undefined,
  context: OnboardingTargetResolveContext
): Element | string | undefined => {
  if (!target) {
    return undefined;
  }

  if (typeof target === "string") {
    return target;
  }

  if (target instanceof Element) {
    return target;
  }

  if (typeof target === "function") {
    return target() ?? undefined;
  }

  switch (target.kind) {
    case "selector":
      return target.selector;
    case "element":
      return target.element;
    case "named":
      return context.registry?.get(target.name) ?? undefined;
    case "resolver":
      return target.resolve(context) ?? undefined;
    default:
      return undefined;
  }
};

const uniqueSeenStepIds = (
  existing: string[] | undefined,
  stepId: string
): string[] => {
  const next = new Set(existing ?? []);
  next.add(stepId);
  return [...next];
};

const buildAnalyticsEvent = (
  event: Omit<OnboardingAnalyticsEvent, "tourVersion">,
  tour: OnboardingTourDefinition
): OnboardingAnalyticsEvent => {
  return {
    ...event,
    tourVersion: tour.version
  };
};

const nowIso = (): string => new Date().toISOString();

const resolveStepVisual = (
  tour: OnboardingTourDefinition,
  step: OnboardingStepDefinition
): OnboardingVisualConfig => {
  return {
    ...(tour.visual ?? {}),
    ...(step.visual ?? {})
  };
};

const renderFullPagePopover = (
  popover: PopoverDOM,
  classNames: typeof oneuiOnboardingClassNames,
  options: {
    activeIndex: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    onAction: (
      action: NonNullable<OnboardingFullPageStepDefinition["primaryAction"]>,
      fallbackBehavior: OnboardingActionBehavior
    ) => Promise<void> | void;
    onClose: () => void;
    step: OnboardingFullPageStepDefinition;
    stepCount: number;
    visual?: OnboardingVisualConfig;
  }
): void => {
  const documentRef = popover.wrapper.ownerDocument;
  const progressDisplay = options.visual?.progressDisplay ?? "count";
  const appearance = options.visual?.appearance ?? "neutral";
  const layout = options.step.layout ?? "centered-card";
  const size = options.step.size ?? "md";
  const titleId = `${options.step.id}-full-page-title`;
  const descriptionId = `${options.step.id}-full-page-description`;
  const progressText = `Step ${options.activeIndex + 1} of ${options.stepCount}`;
  const mediaPosition = options.step.media?.position ?? (layout === "split-media" ? "left" : "top");

  popover.wrapper.classList.add(classNames.popover, classNames.fullPage);
  popover.wrapper.setAttribute("data-oneui-onboarding-appearance", appearance);
  popover.wrapper.setAttribute("data-oneui-onboarding-kind", "full-page");
  popover.wrapper.setAttribute("data-oneui-onboarding-layout", layout);
  popover.wrapper.setAttribute("data-oneui-onboarding-size", size);
  popover.wrapper.setAttribute("data-oneui-onboarding-media-position", mediaPosition);
  popover.wrapper.setAttribute("role", "dialog");
  popover.wrapper.setAttribute("aria-modal", "true");
  popover.wrapper.setAttribute("aria-labelledby", titleId);
  popover.wrapper.setAttribute("aria-describedby", descriptionId);
  popover.wrapper.tabIndex = -1;
  popover.arrow.hidden = true;

  const panel = documentRef.createElement("div");
  panel.className = classNames.fullPagePanel;

  const content = documentRef.createElement("div");
  content.className = classNames.fullPageContent;

  if (options.step.eyebrow) {
    appendTextElement(
      documentRef,
      content,
      "p",
      classNames.fullPageEyebrow,
      options.step.eyebrow
    );
  }

  appendTextElement(
    documentRef,
    content,
    "h2",
    classNames.fullPageTitle,
    options.step.title,
    titleId
  );

  appendTextElement(
    documentRef,
    content,
    "p",
    classNames.fullPageDescription,
    options.step.description ?? "",
    descriptionId
  );

  if (options.step.body) {
    appendTextElement(
      documentRef,
      content,
      "p",
      classNames.fullPageBody,
      options.step.body
    );
  }

  const footer = documentRef.createElement("div");
  footer.className = classNames.footer;

  const footerCenter = documentRef.createElement("div");
  footerCenter.className = classNames.footerCenter;

  if (progressDisplay === "dots" || progressDisplay === "dots-and-count") {
    const pagination = documentRef.createElement("div");
    pagination.className = classNames.pagination;
    pagination.setAttribute("aria-hidden", "true");

    for (let index = 0; index < options.stepCount; index += 1) {
      const dot = documentRef.createElement("span");
      dot.className =
        index === options.activeIndex
          ? `${classNames.paginationDot} ${classNames.paginationDotActive}`
          : classNames.paginationDot;
      pagination.append(dot);
    }

    footerCenter.append(pagination);
  }

  const progress = documentRef.createElement("span");
  progress.className = classNames.progress;
  progress.textContent = progressText;
  progress.setAttribute("aria-label", progressText);
  if (progressDisplay === "dots") {
    progress.classList.add(classNames.visuallyHidden);
  }
  footerCenter.append(progress);

  const actions = documentRef.createElement("div");
  actions.className = classNames.fullPageActions;

  const secondaryAction =
    options.step.secondaryAction ??
    (!options.isFirstStep
      ? {
          label: "Previous",
          behavior: "previous" as const
        }
      : undefined);
  const primaryAction =
    options.step.primaryAction ??
    ({
      label: options.isLastStep ? "Done" : "Next",
      behavior: options.isLastStep ? "complete" : "next"
    } as const);

  if (secondaryAction) {
    actions.append(
      createActionButton(
        documentRef,
        `${classNames.button} ${classNames.fullPageSecondaryAction}`,
        secondaryAction.label,
        async () => {
          await options.onAction(secondaryAction, secondaryAction.behavior ?? "skip");
        }
      )
    );
  }

  actions.append(
    createActionButton(
      documentRef,
      `${classNames.button} ${classNames.fullPagePrimaryAction}`,
      primaryAction.label,
      async () => {
        await options.onAction(primaryAction, primaryAction.behavior ?? "next");
      }
    )
  );

  footer.append(footerCenter, actions);
  content.append(footer);

  if (options.step.media?.type === "image") {
    const media = documentRef.createElement("figure");
    media.className = classNames.fullPageMedia;

    const image = documentRef.createElement("img");
    image.alt = options.step.media.alt;
    image.src = options.step.media.src;
    media.append(image);

    if (mediaPosition === "top") {
      panel.append(media, content);
    } else {
      panel.append(mediaPosition === "left" ? media : content, mediaPosition === "left" ? content : media);
    }
  } else {
    panel.append(content);
  }

  popover.wrapper.replaceChildren(panel);

  if (options.step.allowClose !== false) {
    const closeButton = createActionButton(
      documentRef,
      classNames.closeButton,
      "Close",
      options.onClose
    );
    closeButton.setAttribute("aria-label", "Close onboarding");
    panel.append(closeButton);
  }

  setTimeout(() => {
    popover.wrapper.focus();
  }, 0);
};

export const createOnboardingController = (
  options: OnboardingControllerOptions
): OnboardingController => {
  const tours = new Map(options.tours.map((tour) => [tour.id, tour]));
  const runtime: RuntimeState = {};
  const analytics = options.analytics ?? noopAnalyticsAdapter;
  const persistence = options.persistence ?? memoryPersistenceAdapter;
  const scopeId = options.scopeId ?? "oneui-onboarding";
  const documentRef = options.document ?? globalThis.document;
  const classNames = {
    ...oneuiOnboardingClassNames,
    ...(options.classNames ?? {})
  };

  const applyScopeAttribute = (): void => {
    documentRef?.body?.setAttribute("data-oneui-onboarding-scope", scopeId);
  };

  const clearScopeAttribute = (): void => {
    if (documentRef?.body?.getAttribute("data-oneui-onboarding-scope") === scopeId) {
      documentRef.body.removeAttribute("data-oneui-onboarding-scope");
    }
  };

  const stopTour = (): void => {
    runtime.activeDriver?.destroy();
    runtime.activeDriver = undefined;
    runtime.activeTourId = undefined;
    clearScopeAttribute();
  };

  const getTour = (tourId: string): OnboardingTourDefinition | undefined => {
    return tours.get(tourId);
  };

  const canStartTour = async (
    tourId: string,
    startOptions: StartOnboardingTourOptions = {}
  ): Promise<boolean> => {
    const tour = getTour(tourId);
    if (!tour) {
      return false;
    }

    const persistedState = await persistence.load(tour.id);
    const runContext: OnboardingRunContext = {
      persistedState,
      reason: startOptions.reason ?? "manual",
      tour
    };

    if (tour.shouldRun && !tour.shouldRun(runContext)) {
      return false;
    }

    if (
      startOptions.force !== true &&
      persistedState?.status === "completed" &&
      tour.allowRestart !== true
    ) {
      return false;
    }

    return true;
  };

  const startTour = async (
    tourId: string,
    startOptions: StartOnboardingTourOptions = {}
  ): Promise<OnboardingStartResult> => {
    const tour = getTour(tourId);
    if (!tour) {
      return {
        ok: false,
        tourId,
        reason: "not-found",
        message: `Unknown onboarding tour '${tourId}'.`
      };
    }

    const canStart = await canStartTour(tourId, startOptions);
    if (!canStart) {
      return {
        ok: false,
        tourId,
        reason: "blocked",
        message: `Onboarding tour '${tourId}' is blocked by persistence or run rules.`
      };
    }

    stopTour();

    const resolvedSteps: ResolvedStep[] = [];
    for (const step of tour.steps) {
      const driverInstance = runtime.activeDriver;
      const fullPageStep = isFullPageStep(step);
      const resolvedElement = fullPageStep
        ? undefined
        : resolveElement(step.target, {
            document: documentRef,
            driver: driverInstance,
            registry: options.registry,
            step,
            tour
          });

      if (!fullPageStep && !resolvedElement) {
        analytics.track(
          buildAnalyticsEvent(
            {
              eventName: "step_missing_target",
              reason: "missing-target",
              stepId: step.id,
              tourId: tour.id
            },
            tour
          )
        );

        if ((tour.targetMissingBehavior ?? "skip") === "abort") {
          return {
            ok: false,
            tourId,
            reason: "no-targets",
            message: `Onboarding tour '${tourId}' aborted because step '${step.id}' could not resolve a target.`
          };
        }

        continue;
      }

      resolvedSteps.push({
        source: step,
        driveStep: fullPageStep
          ? {
              disableActiveInteraction: true,
              popover: {
                title: step.title,
                description: step.description,
                showButtons: step.allowClose === false ? [] : ["close"],
                showProgress: true
              }
            }
          : {
              ...(step.driverStep ?? {}),
              element: resolvedElement,
              disableActiveInteraction: step.allowInteraction === true ? false : true,
              popover: {
                ...(step.popover ?? {}),
                title: step.title,
                description: step.description,
                side: step.side ?? step.popover?.side,
                align: step.align ?? step.popover?.align,
                showButtons: step.showButtons,
                disableButtons: step.disableButtons,
                showProgress: step.showProgress,
                nextBtnText: step.nextButtonLabel,
                prevBtnText: step.previousButtonLabel,
                doneBtnText: step.doneButtonLabel
              }
            }
      });
    }

    if (resolvedSteps.length === 0) {
      return {
        ok: false,
        tourId,
        reason: "no-targets",
        message: `Onboarding tour '${tourId}' has no resolvable steps.`
      };
    }

    let completionReason: "completed" | "dismissed" | undefined;
    const driverFactory = options.driverFactory ?? driver;
    let currentRecord =
      startOptions.force === true
        ? {}
        : ((await persistence.load(tour.id)) ?? {});
    const saveRecord = (nextRecord: OnboardingPersistenceRecord): void => {
      currentRecord = nextRecord;
      persistence.save(tour.id, nextRecord);
    };
    const defaultConfig: Config = {
      allowClose: true,
      allowKeyboardControl: true,
      animate: true,
      overlayClickBehavior: "close",
      popoverClass: classNames.popover,
      showProgress: true,
      smoothScroll: true,
      stagePadding: 8,
      stageRadius: 16
    };
    let driverInstance: Driver;

    const completeActiveStep = (stepIndex: number): void => {
      completionReason = "completed";
      saveRecord({
        ...currentRecord,
        activeStepId: resolvedSteps[stepIndex]?.source.id,
        completedAt: nowIso(),
        status: "completed",
        version: tour.version
      });
      analytics.track(
        buildAnalyticsEvent(
          {
            eventName: "tour_completed",
            reason: "manual",
            stepId: resolvedSteps[stepIndex]?.source.id,
            stepIndex,
            tourId: tour.id
          },
          tour
        )
      );
      driverInstance.destroy();
    };

    const dismissActiveStep = (stepIndex: number): void => {
      completionReason = "dismissed";
      saveRecord({
        ...currentRecord,
        activeStepId: resolvedSteps[stepIndex]?.source.id,
        dismissedAt: nowIso(),
        status: "dismissed",
        version: tour.version
      });
      analytics.track(
        buildAnalyticsEvent(
          {
            eventName: "tour_dismissed",
            reason: "close",
            stepId: resolvedSteps[stepIndex]?.source.id,
            stepIndex,
            tourId: tour.id
          },
          tour
        )
      );
      driverInstance.destroy();
    };

    const moveFromAction = (behavior: OnboardingActionBehavior, stepIndex: number): void => {
      switch (behavior) {
        case "next":
          if (driverInstance.isLastStep()) {
            completeActiveStep(stepIndex);
            return;
          }
          driverInstance.moveNext();
          return;
        case "previous":
          driverInstance.movePrevious();
          return;
        case "complete":
          completeActiveStep(stepIndex);
          return;
        case "skip":
          dismissActiveStep(stepIndex);
          return;
        case "custom":
          return;
        default:
          return;
      }
    };

    const invokeStepAction = async (
      step: OnboardingStepDefinition,
      stepIndex: number,
      action: NonNullable<OnboardingFullPageStepDefinition["primaryAction"]>,
      fallbackBehavior: OnboardingActionBehavior
    ): Promise<void> => {
      const behavior = action.behavior ?? fallbackBehavior;
      const runAction = action.actionId
        ? (options.actionHandlers?.[action.actionId] ?? options.onAction)
        : undefined;

      if (action.actionId && !runAction) {
        safeWarn(
          `OneUI onboarding action '${action.actionId}' has no registered handler.`
        );
      }

      const context: OnboardingActionContext | undefined = action.actionId
        ? {
            action,
            actionId: action.actionId,
            behavior,
            step,
            stepIndex,
            tour
          }
        : undefined;

      if (runAction && context) {
        await Promise.resolve(runAction(context)).catch((error: unknown) => {
          safeWarn(
            `OneUI onboarding action '${context.actionId}' failed: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        });
      }

      moveFromAction(behavior, stepIndex);
    };

    driverInstance = driverFactory({
      ...defaultConfig,
      ...(tour.driverConfig ?? {}),
      steps: resolvedSteps.map((resolvedStep) => resolvedStep.driveStep),
      onPopoverRender: (popover, opts) => {
        const stepIndex = opts.state.activeIndex ?? 0;
        const sourceStep = resolvedSteps[stepIndex]?.source;

        if (sourceStep && isFullPageStep(sourceStep)) {
          renderFullPagePopover(popover, classNames, {
            activeIndex: stepIndex,
            isFirstStep: driverInstance.isFirstStep(),
            isLastStep: driverInstance.isLastStep(),
            onAction: (action, fallbackBehavior) => {
              return invokeStepAction(sourceStep, stepIndex, action, fallbackBehavior);
            },
            onClose: () => {
              dismissActiveStep(stepIndex);
            },
            step: sourceStep,
            stepCount: resolvedSteps.length,
            visual: resolveStepVisual(tour, sourceStep)
          });
        } else {
          decoratePopoverDom(popover, classNames, {
            activeIndex: stepIndex,
            stepCount: resolvedSteps.length,
            visual: sourceStep ? resolveStepVisual(tour, sourceStep) : tour.visual
          });
        }
        tour.driverConfig?.onPopoverRender?.(popover, opts);
      },
      onHighlighted: (element, currentStep, opts) => {
        const stepIndex = opts.state.activeIndex ?? 0;
        const sourceStep = resolvedSteps[stepIndex]?.source;
        if (!sourceStep) {
          return;
        }

        saveRecord({
          ...currentRecord,
          activeStepId: sourceStep.id,
          seenStepIds: uniqueSeenStepIds(currentRecord.seenStepIds, sourceStep.id),
          startedAt: currentRecord.startedAt ?? nowIso(),
          status: "in-progress",
          version: tour.version
        });

        analytics.track(
          buildAnalyticsEvent(
            {
              eventName: "step_viewed",
              stepId: sourceStep.id,
              stepIndex,
              tourId: tour.id
            },
            tour
          )
        );

        tour.driverConfig?.onHighlighted?.(element, currentStep, opts);
      },
      onNextClick: (element, currentStep, opts) => {
        if (driverInstance.isLastStep()) {
          completeActiveStep(opts.state.activeIndex ?? 0);
          return;
        }

        driverInstance.moveNext();
        tour.driverConfig?.onNextClick?.(element, currentStep, opts);
      },
      onPrevClick: (element, currentStep, opts) => {
        driverInstance.movePrevious();
        tour.driverConfig?.onPrevClick?.(element, currentStep, opts);
      },
      onCloseClick: (element, currentStep, opts) => {
        dismissActiveStep(opts.state.activeIndex ?? 0);
        tour.driverConfig?.onCloseClick?.(element, currentStep, opts);
      },
      onDestroyed: (element, currentStep, opts) => {
        runtime.activeDriver = undefined;
        runtime.activeTourId = undefined;
        clearScopeAttribute();
        tour.driverConfig?.onDestroyed?.(element, currentStep, opts);
      }
    });

    runtime.activeDriver = driverInstance;
    runtime.activeTourId = tour.id;

    const persistedState =
      startOptions.force === true
        ? undefined
        : await persistence.load(tour.id);
    const requestedIndex = startOptions.startAtStepId
      ? resolvedSteps.findIndex((step) => step.source.id === startOptions.startAtStepId)
      : -1;
    const resumedIndex =
      requestedIndex >= 0
        ? requestedIndex
        : persistedState?.activeStepId
          ? resolvedSteps.findIndex((step) => step.source.id === persistedState.activeStepId)
          : -1;
    const startIndex = resumedIndex >= 0 ? resumedIndex : 0;
    const startReason: OnboardingStartReason =
      startOptions.reason ?? (startIndex > 0 ? "resume" : "manual");

    saveRecord({
      ...(persistedState ?? {}),
      startedAt: persistedState?.startedAt ?? nowIso(),
      status: "in-progress",
      version: tour.version
    });
    analytics.track(
      buildAnalyticsEvent(
        {
          eventName: "tour_started",
          reason: startReason,
          stepId: resolvedSteps[startIndex]?.source.id,
          stepIndex: startIndex,
          tourId: tour.id
        },
        tour
      )
    );

    applyScopeAttribute();
    driverInstance.drive(startIndex);

    if (completionReason === "dismissed") {
      clearScopeAttribute();
    }

    return {
      ok: true,
      tourId,
      stepCount: resolvedSteps.length,
      startIndex
    };
  };

  return {
    getTours: () => [...tours.values()],
    getTour,
    getScopeId: () => scopeId,
    getActiveTourId: () => runtime.activeTourId,
    canStartTour,
    startTour,
    restartTour: (tourId) =>
      startTour(tourId, {
        force: true,
        reason: "manual"
      }),
    stopTour,
    refresh: () => {
      runtime.activeDriver?.refresh();
    },
    destroy: stopTour
  };
};
