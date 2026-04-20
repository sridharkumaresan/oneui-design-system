import React from "react";
import { createOnboardingController } from "@functions-oneui/onboarding-core";
import type {
  OnboardingActionHandler,
  OnboardingAnalyticsAdapter,
  OnboardingController,
  OnboardingControllerOptions,
  OnboardingPersistenceAdapter,
  OnboardingTourDefinition
} from "@functions-oneui/onboarding-core";
import { createOneUIOnboardingVariableStylesheet } from "@functions-oneui/onboarding-styles";
import { createOneuiTheme, useOneUIThemeMode } from "@functions-oneui/theme";
import type { OneUIThemeMode } from "@functions-oneui/theme";

import { OneUIOnboardingContext } from "./context.js";

const STYLE_ELEMENT_ID_PREFIX = "oneui-onboarding-theme";

const createRegistry = (targetsRef: React.MutableRefObject<Map<string, Element>>): {
  get: (name: string) => Element | undefined;
} => {
  return {
    get: (name) => targetsRef.current.get(name)
  };
};

export type OneUIOnboardingProviderProps = {
  tours: OnboardingTourDefinition[];
  actionHandlers?: Record<string, OnboardingActionHandler | undefined>;
  onAction?: OnboardingActionHandler;
  analytics?: OnboardingAnalyticsAdapter;
  persistence?: OnboardingPersistenceAdapter;
  scopeId?: string;
  mode?: OneUIThemeMode;
  autoInjectThemeVariables?: boolean;
  controllerOverrides?: Partial<
    Pick<OnboardingControllerOptions, "classNames" | "document" | "driverFactory">
  >;
  children?: React.ReactNode;
};

const useScopedThemeVariables = (
  scopeId: string,
  enabled: boolean,
  mode: OneUIThemeMode
): void => {
  const theme = React.useMemo(() => {
    return createOneuiTheme({
      mode
    });
  }, [mode]);

  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return undefined;
    }

    const styleId = `${STYLE_ELEMENT_ID_PREFIX}-${scopeId}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.append(styleElement);
    }

    styleElement.textContent = createOneUIOnboardingVariableStylesheet({
      mode,
      scopeId,
      theme
    });

    return () => {
      styleElement?.remove();
    };
  }, [enabled, scopeId, theme]);
};

export const OneUIOnboardingProvider = (
  props: OneUIOnboardingProviderProps
): React.JSX.Element => {
  const {
    analytics,
    actionHandlers,
    autoInjectThemeVariables = true,
    children,
    controllerOverrides,
    mode: modeProp,
    onAction,
    persistence,
    scopeId: scopeIdProp,
    tours
  } = props;
  const inheritedMode = useOneUIThemeMode();
  const mode = modeProp ?? inheritedMode;
  const reactScopeId = React.useId().replace(/:/g, "");
  const scopeId = scopeIdProp ?? `oneui-onboarding-${reactScopeId}`;
  const targetsRef = React.useRef(new Map<string, Element>());

  useScopedThemeVariables(scopeId, autoInjectThemeVariables, mode);

  const controllerRef = React.useRef<OnboardingController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = createOnboardingController({
      actionHandlers,
      analytics,
      document:
        controllerOverrides?.document ?? (typeof document === "undefined" ? undefined : document),
      driverFactory: controllerOverrides?.driverFactory,
      classNames: controllerOverrides?.classNames,
      onAction,
      persistence,
      registry: createRegistry(targetsRef),
      scopeId,
      tours
    });
  }

  React.useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
    };
  }, []);

  const registerTarget = React.useCallback((name: string, element: Element | null) => {
    if (!element) {
      targetsRef.current.delete(name);
      return;
    }

    targetsRef.current.set(name, element);
  }, []);

  const unregisterTarget = React.useCallback((name: string, element?: Element | null) => {
    const current = targetsRef.current.get(name);
    if (!current || !element || current === element) {
      targetsRef.current.delete(name);
    }
  }, []);

  const contextValue = React.useMemo(() => {
    return {
      controller: controllerRef.current as OnboardingController,
      registerTarget,
      tours
    };
  }, [registerTarget, tours]);

  return React.createElement(
    OneUIOnboardingContext.Provider,
    { value: { ...contextValue, unregisterTarget } },
    children
  );
};
