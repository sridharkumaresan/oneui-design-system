import React from "react";

import { shouldMarkSectionDelayed } from "./delayed-state.js";
import {
  applyLoadingSectionUpdate,
  createLoadingCoordinatorState,
  deriveLoadingProgress
} from "./deriveLoadingProgress.js";
import type {
  LoadingSectionConfig,
  LoadingSectionLoadResult,
  LoadingSectionUpdate,
  LoadingStatus,
  UseProgressiveLoadingOptions,
  UseProgressiveLoadingResult
} from "./types.js";

const isStructuredLoadResult = <TData,>(
  value: TData | LoadingSectionLoadResult<TData>
): value is LoadingSectionLoadResult<TData> => {
  return typeof value === "object" && value !== null && "data" in value;
};

const normalizeLoadResult = <TData,>(
  config: LoadingSectionConfig<TData>,
  value: TData | LoadingSectionLoadResult<TData>
): LoadingSectionUpdate => {
  const resolved = isStructuredLoadResult(value) ? value : { data: value };
  const count = resolved.count ?? (config.getCount ? config.getCount(resolved.data) : undefined);
  const isEmpty = resolved.isEmpty ?? (config.isEmpty ? config.isEmpty(resolved.data) : (count ?? 0) === 0);

  return {
    count,
    data: resolved.data,
    id: config.id,
    status: isEmpty ? "empty" : "success"
  };
};

const createLoadingUpdate = (id: string, status: Extract<LoadingStatus, "loading" | "refreshing">): LoadingSectionUpdate => {
  return {
    id,
    status
  };
};

export const useProgressiveLoading = <TData = unknown>(
  options: UseProgressiveLoadingOptions<TData>
): UseProgressiveLoadingResult => {
  const { autoStart = true, delayedThresholdMs = 1200, sections: configs } = options;
  const definitions = React.useMemo(() => {
    return configs.map((config) => ({
      id: config.id,
      order: config.order,
      title: config.title
    }));
  }, [configs]);
  const [state, setState] = React.useState(() => createLoadingCoordinatorState(definitions));
  const [isRunning, setIsRunning] = React.useState(false);
  const abortControllersRef = React.useRef<Record<string, AbortController>>({});
  const delayedTimersRef = React.useRef<Record<string, number>>({});
  const sectionMapRef = React.useRef(state.sectionMap);

  React.useEffect(() => {
    setState(createLoadingCoordinatorState(definitions));
  }, [definitions]);

  React.useEffect(() => {
    sectionMapRef.current = state.sectionMap;
  }, [state.sectionMap]);

  const clearDelayedTimer = React.useCallback((id: string) => {
    const timer = delayedTimersRef.current[id];

    if (timer) {
      window.clearTimeout(timer);
      delete delayedTimersRef.current[id];
    }
  }, []);

  const abortSection = React.useCallback(
    (id: string) => {
      clearDelayedTimer(id);
      const controller = abortControllersRef.current[id];

      if (controller) {
        controller.abort();
        delete abortControllersRef.current[id];
      }
    },
    [clearDelayedTimer]
  );

  const setSectionState = React.useCallback((update: LoadingSectionUpdate) => {
    setState((currentState) => applyLoadingSectionUpdate(currentState, update));
  }, []);

  const runSectionLoader = React.useCallback(
    async (config: LoadingSectionConfig<TData>) => {
      abortSection(config.id);

      const controller = new AbortController();
      abortControllersRef.current[config.id] = controller;
      const currentState = sectionMapRef.current[config.id];
      setSectionState(
        createLoadingUpdate(config.id, currentState?.status === "success" ? "refreshing" : "loading")
      );

      delayedTimersRef.current[config.id] = window.setTimeout(() => {
        setState((latestState) => {
          const latestSection = latestState.sectionMap[config.id];

          if (
            latestSection &&
            (latestSection.status === "loading" || latestSection.status === "refreshing") &&
            shouldMarkSectionDelayed({
              startedAt: latestSection.startedAt,
              thresholdMs: delayedThresholdMs
            })
          ) {
            return applyLoadingSectionUpdate(latestState, {
              id: config.id,
              status: "delayed"
            });
          }

          return latestState;
        });
      }, delayedThresholdMs);

      try {
        const result = await config.loader({
          signal: controller.signal
        });

        setSectionState(normalizeLoadResult(config, result));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred while loading this section.";

        setSectionState({
          errorMessage,
          id: config.id,
          status: "error"
        });
      } finally {
        clearDelayedTimer(config.id);
        delete abortControllersRef.current[config.id];
      }
    },
    [abortSection, clearDelayedTimer, delayedThresholdMs, setSectionState]
  );

  const runMany = React.useCallback(
    async (targetIds?: string[]) => {
      const ids = targetIds ?? configs.map((config) => config.id);
      setIsRunning(true);
      await Promise.all(
        configs
          .filter((config) => ids.includes(config.id))
          .map((config) => {
            return runSectionLoader(config);
          })
      );
      setIsRunning(false);
    },
    [configs, runSectionLoader]
  );

  const loadAll = React.useCallback(async () => {
    await runMany();
  }, [runMany]);

  const retryAll = React.useCallback(async () => {
    await runMany();
  }, [runMany]);

  const retrySection = React.useCallback(
    async (id: string) => {
      await runMany([id]);
    },
    [runMany]
  );

  React.useEffect(() => {
    if (!autoStart) {
      return;
    }

    void loadAll();

    return () => {
      configs.forEach((config) => {
        abortSection(config.id);
      });
    };
  }, [abortSection, autoStart, configs, loadAll]);

  const progress = React.useMemo(() => deriveLoadingProgress(state.sections), [state.sections]);

  return {
    ...state,
    isRunning,
    loadAll,
    progress,
    retryAll,
    retrySection,
    setSectionState
  };
};
