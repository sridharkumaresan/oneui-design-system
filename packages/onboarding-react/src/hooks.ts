import React from "react";

import { OneUIOnboardingContext } from "./context.js";

const useRequiredContext = () => {
  const context = React.useContext(OneUIOnboardingContext);

  if (!context) {
    throw new Error("OneUI onboarding hooks must be used inside OneUIOnboardingProvider.");
  }

  return context;
};

export const useOnboarding = () => {
  const context = useRequiredContext();

  return {
    controller: context.controller,
    tours: context.tours
  };
};

export const useOnboardingTour = (tourId: string) => {
  const { controller } = useRequiredContext();

  return React.useMemo(() => {
    return {
      tour: controller.getTour(tourId),
      canStart: (reason?: "manual" | "auto" | "resume") => {
        return controller.canStartTour(tourId, {
          reason
        });
      },
      start: (reason?: "manual" | "auto" | "resume") => {
        return controller.startTour(tourId, {
          reason
        });
      },
      restart: () => {
        return controller.restartTour(tourId);
      },
      stop: () => {
        if (controller.getActiveTourId() === tourId) {
          controller.stopTour();
        }
      },
      isActive: () => controller.getActiveTourId() === tourId
    };
  }, [controller, tourId]);
};

export const useOnboardingTarget = (name: string) => {
  const { registerTarget, unregisterTarget } = useRequiredContext();

  const ref = React.useCallback(
    (element: Element | null) => {
      if (element) {
        registerTarget(name, element);
        return;
      }

      unregisterTarget(name, element);
    },
    [name, registerTarget, unregisterTarget]
  );

  return {
    ref
  };
};
