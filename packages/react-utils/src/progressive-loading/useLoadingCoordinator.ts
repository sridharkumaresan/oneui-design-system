import React from "react";

import {
  applyLoadingSectionUpdate,
  createLoadingCoordinatorState,
  deriveLoadingProgress
} from "./deriveLoadingProgress.js";
import type {
  LoadingSectionDefinition,
  LoadingSectionUpdate,
  LoadingStatus,
  UseLoadingCoordinatorOptions,
  UseLoadingCoordinatorResult
} from "./types.js";

const createStatusUpdates = (
  definitions: LoadingSectionDefinition[],
  status: Extract<LoadingStatus, "idle" | "loading" | "delayed" | "refreshing">,
  ids?: string[]
): LoadingSectionUpdate[] => {
  const targetIds = ids ? new Set(ids) : undefined;

  return definitions
    .filter((definition) => (targetIds ? targetIds.has(definition.id) : true))
    .map((definition) => {
      return {
        id: definition.id,
        status
      };
    });
};

export const useLoadingCoordinator = (
  options: UseLoadingCoordinatorOptions
): UseLoadingCoordinatorResult => {
  const { sections: definitions } = options;
  const [state, setState] = React.useState(() => createLoadingCoordinatorState(definitions));

  React.useEffect(() => {
    setState(createLoadingCoordinatorState(definitions));
  }, [definitions]);

  const setSectionState = React.useCallback((update: LoadingSectionUpdate) => {
    setState((currentState) => applyLoadingSectionUpdate(currentState, update));
  }, []);

  const reset = React.useCallback(
    (ids?: string[]) => {
      setState((currentState) => {
        return createStatusUpdates(definitions, "idle", ids).reduce(applyLoadingSectionUpdate, currentState);
      });
    },
    [definitions]
  );

  const markLoading = React.useCallback(
    (ids?: string[]) => {
      setState((currentState) => {
        return createStatusUpdates(definitions, "loading", ids).reduce(
          applyLoadingSectionUpdate,
          currentState
        );
      });
    },
    [definitions]
  );

  const markDelayed = React.useCallback(
    (ids?: string[]) => {
      setState((currentState) => {
        return createStatusUpdates(definitions, "delayed", ids).reduce(
          applyLoadingSectionUpdate,
          currentState
        );
      });
    },
    [definitions]
  );

  const markRefreshing = React.useCallback(
    (ids?: string[]) => {
      setState((currentState) => {
        return createStatusUpdates(definitions, "refreshing", ids).reduce(
          applyLoadingSectionUpdate,
          currentState
        );
      });
    },
    [definitions]
  );

  const markSuccess = React.useCallback(
    (id: string, count?: number) => {
      setSectionState({
        count,
        id,
        status: count && count > 0 ? "success" : "empty"
      });
    },
    [setSectionState]
  );

  const markEmpty = React.useCallback(
    (id: string) => {
      setSectionState({
        id,
        status: "empty"
      });
    },
    [setSectionState]
  );

  const markError = React.useCallback(
    (id: string, errorMessage?: string) => {
      setSectionState({
        errorMessage,
        id,
        status: "error"
      });
    },
    [setSectionState]
  );

  const progress = React.useMemo(() => deriveLoadingProgress(state.sections), [state.sections]);

  return {
    ...state,
    markDelayed,
    markEmpty,
    markError,
    markLoading,
    markRefreshing,
    markSuccess,
    progress,
    reset,
    setSectionState
  };
};
