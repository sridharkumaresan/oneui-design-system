import * as React from "react";

import type { SearchExecutionResult } from "../../domain/search/contracts/SearchExecutionResult";
import type { SearchPageState } from "../../domain/search/contracts/SearchPageState";
import type { VerticalKey } from "../../domain/search/models/verticalKey";
import { SearchOrchestrator } from "../../application/search/orchestrators/SearchOrchestrator";

export type SearchPageController = {
  errorMessage?: string;
  execution?: SearchExecutionResult;
  hasSearched: boolean;
  isBusy: boolean;
  onQueryChange: (value: string) => void;
  onSearchSubmit: () => Promise<void>;
  onVerticalChange: (verticalKey: VerticalKey) => Promise<void>;
  queryText: string;
  selectedVerticalKey: VerticalKey;
  status: SearchPageState["status"];
  verticals: SearchPageState["verticals"];
};

const buildInitialState = (): SearchPageState => ({
  hasSearched: false,
  queryText: "",
  selectedVerticalKey: "all",
  status: "config-loading",
  verticals: []
});

export const useSearchPageController = (
  orchestrator: SearchOrchestrator
): SearchPageController => {
  const [state, setState] = React.useState<SearchPageState>(buildInitialState);
  const activeSearchId = React.useRef(0);
  const isMountedRef = React.useRef(true);
  const delayedTimerRef = React.useRef<number | undefined>(undefined);

  const finalizeStatus = React.useCallback((execution: SearchExecutionResult): SearchPageState["status"] => {
    if (execution.kind === "all") {
      if (execution.sections.some((section) => section.status === "delayed")) {
        return "delayed";
      }

      if (
        execution.sections.some(
          (section) => section.status === "loading" || section.status === "refreshing"
        )
      ) {
        return "searching";
      }

      if (execution.sections.some((section) => section.status === "error")) {
        return execution.sections.some((section) => section.status === "success") ? "partial-success" : "error";
      }

      return execution.sections.some((section) => section.status === "success") ? "success" : "empty";
    }

    if (execution.result.status === "success") {
      return "success";
    }

    if (execution.result.status === "delayed") {
      return "delayed";
    }

    if (execution.result.status === "loading" || execution.result.status === "refreshing") {
      return "searching";
    }

    if (execution.result.status === "empty") {
      return "empty";
    }

    return "error";
  }, []);

  const executeSearch = React.useCallback(
    async (queryText: string, verticalKey: VerticalKey, verticals: SearchPageState["verticals"]): Promise<void> => {
      activeSearchId.current += 1;
      const searchId = activeSearchId.current;
      const trimmedQuery = queryText.trim();

      if (delayedTimerRef.current) {
        window.clearTimeout(delayedTimerRef.current);
        delayedTimerRef.current = undefined;
      }

      orchestrator.syncUrl(trimmedQuery, verticalKey, window.location.href);

      if (!trimmedQuery) {
        if (!isMountedRef.current) {
          return;
        }

        setState((current) => ({
          ...current,
          errorMessage: undefined,
          execution: undefined,
          hasSearched: false,
          queryText,
          selectedVerticalKey: verticalKey,
          status: "ready"
        }));
        return;
      }

      const pendingExecution = orchestrator.createPendingExecution(verticalKey, verticals, trimmedQuery);

      setState((current) => ({
        ...current,
        errorMessage: undefined,
        execution: pendingExecution,
        hasSearched: true,
        queryText,
        selectedVerticalKey: verticalKey,
        status: "searching"
      }));

      delayedTimerRef.current = window.setTimeout(() => {
        if (!isMountedRef.current || activeSearchId.current !== searchId) {
          return;
        }

        setState((current) => ({
          ...current,
          execution: current.execution ? orchestrator.transitionExecutionStatus(current.execution, "delayed") : current.execution,
          status: "delayed"
        }));
      }, 550);

      try {
        const execution = await orchestrator.executeWithProgress(
          trimmedQuery,
          verticalKey,
          verticals,
          (intermediateExecution) => {
            if (!isMountedRef.current || activeSearchId.current !== searchId) {
              return;
            }

            setState((current) => ({
              ...current,
              execution: intermediateExecution,
              status: finalizeStatus(intermediateExecution)
            }));
          }
        );

        if (!isMountedRef.current || activeSearchId.current !== searchId) {
          return;
        }

        if (delayedTimerRef.current) {
          window.clearTimeout(delayedTimerRef.current);
          delayedTimerRef.current = undefined;
        }

        setState((current) => ({
          ...current,
          execution,
          status: finalizeStatus(execution)
        }));
      } catch (error) {
        if (!isMountedRef.current || activeSearchId.current !== searchId) {
          return;
        }

        if (delayedTimerRef.current) {
          window.clearTimeout(delayedTimerRef.current);
          delayedTimerRef.current = undefined;
        }

        setState((current) => ({
          ...current,
          errorMessage: error instanceof Error ? error.message : "Search failed.",
          execution: current.execution ? orchestrator.transitionExecutionStatus(current.execution, "delayed") : current.execution,
          status: "error"
        }));
      }
    },
    [finalizeStatus, orchestrator]
  );

  React.useEffect(() => {
    let isActive = true;
    isMountedRef.current = true;

    const initialize = async (): Promise<void> => {
      try {
        const nextState = await orchestrator.initialize(window.location.href);

        if (!isActive) {
          return;
        }

        setState((current) => ({
          ...current,
          ...nextState,
          hasSearched: Boolean(nextState.queryText)
        }));

        if (nextState.queryText) {
          await executeSearch(nextState.queryText, nextState.selectedVerticalKey, nextState.verticals);
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState((current) => ({
          ...current,
          errorMessage: error instanceof Error ? error.message : "Unable to initialize search page.",
          status: "error"
        }));
      }
    };

    initialize().then(
      () => undefined,
      () => undefined
    );

    return () => {
      isActive = false;
      isMountedRef.current = false;
      activeSearchId.current += 1;

      if (delayedTimerRef.current) {
        window.clearTimeout(delayedTimerRef.current);
        delayedTimerRef.current = undefined;
      }
    };
  }, [executeSearch, orchestrator]);

  return {
    errorMessage: state.errorMessage,
    execution: state.execution,
    hasSearched: state.hasSearched,
    isBusy: state.status === "config-loading" || state.status === "searching",
    onQueryChange: (value: string) => {
      setState((current) => ({
        ...current,
        queryText: value
      }));
    },
    onSearchSubmit: async () => executeSearch(state.queryText, state.selectedVerticalKey, state.verticals),
    onVerticalChange: async (verticalKey: VerticalKey) => {
      await executeSearch(state.queryText, verticalKey, state.verticals);
    },
    queryText: state.queryText,
    selectedVerticalKey: state.selectedVerticalKey,
    status: state.status,
    verticals: state.verticals
  };
};
