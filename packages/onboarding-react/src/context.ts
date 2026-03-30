import React from "react";
import type { OnboardingController, OnboardingTourDefinition } from "@functions-oneui/onboarding-core";

export type OneUIOnboardingContextValue = {
  controller: OnboardingController;
  registerTarget: (name: string, element: Element | null) => void;
  unregisterTarget: (name: string, element?: Element | null) => void;
  tours: OnboardingTourDefinition[];
};

export const OneUIOnboardingContext = React.createContext<OneUIOnboardingContextValue | null>(null);
