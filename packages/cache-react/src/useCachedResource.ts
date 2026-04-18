import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildCacheStorageKey } from "@functions-oneui/cache";
import type {
  CacheEngine,
  CacheFetcher,
  CacheGetOrFetchSnapshotResult,
  CachePolicy,
  CacheScope,
  CacheSnapshot
} from "@functions-oneui/cache";
import type {
  CachedResourceInternalState,
  CachedResourceLifecycleState,
  CachedResourceStatus,
  UseCachedResourceOptions,
  UseCachedResourceResult
} from "./types.js";

const idleState = <TData>(): CachedResourceInternalState<TData> => ({
  lifecycleState: "idle",
  source: "none",
  status: "idle"
});

const hasSnapshotData = <TData>(snapshot: CacheSnapshot<TData> | undefined): snapshot is CacheSnapshot<TData> & {
  record: NonNullable<CacheSnapshot<TData>["record"]>;
} => snapshot?.record !== undefined;

const hasUsableData = <TData>(state: CachedResourceInternalState<TData>): boolean => state.data !== undefined;

const isEmptyResult = <TData>(data: TData | undefined, isEmptyData: ((data: TData) => boolean) | undefined): boolean => {
  if (data === undefined) {
    return false;
  }

  return isEmptyData?.(data) ?? false;
};

const toSuccessStatus = <TData>(
  lifecycleState: CachedResourceLifecycleState,
  data: TData | undefined,
  isEmptyData: ((data: TData) => boolean) | undefined
): CachedResourceStatus => {
  if (isEmptyResult(data, isEmptyData)) {
    return "empty";
  }

  return lifecycleState === "stale" ? "success-stale" : "success-fresh";
};

const toStateFromResult = <TData>(
  result: CacheGetOrFetchSnapshotResult<TData>,
  isEmptyData: ((data: TData) => boolean) | undefined
): CachedResourceInternalState<TData> => {
  const lifecycleState = result.snapshot.state;

  return {
    data: result.data,
    lifecycleState,
    snapshot: result.snapshot,
    source: result.source,
    status: toSuccessStatus(lifecycleState, result.data, isEmptyData)
  };
};

const readCachedSnapshot = async <TData>(
  engine: CacheEngine,
  scope: CacheScope,
  policy: CachePolicy | undefined,
  isEmptyData: ((data: TData) => boolean) | undefined
): Promise<CachedResourceInternalState<TData> | undefined> => {
  const snapshot = await engine.getSnapshot<TData>(scope, policy);

  if (!hasSnapshotData(snapshot) || snapshot.state === "expired") {
    return undefined;
  }

  const data = snapshot.record.data;

  return {
    data,
    lifecycleState: snapshot.state,
    snapshot,
    source: "cache",
    status: toSuccessStatus(snapshot.state, data, isEmptyData)
  };
};

const policySignature = (policy: CachePolicy | undefined): string => {
  if (!policy) {
    return "";
  }

  return JSON.stringify({
    bustOnVersionChange: policy.bustOnVersionChange,
    expireTimeMs: policy.expireTimeMs,
    metadata: policy.metadata,
    staleTimeMs: policy.staleTimeMs,
    version: policy.version
  });
};

const isBrowserDocumentVisible = (): boolean => {
  if (typeof document === "undefined") {
    return true;
  }

  return document.visibilityState !== "hidden";
};

const supportsVisibilityEvents = (): boolean =>
  typeof document !== "undefined" && typeof document.addEventListener === "function";

export const useCachedResource = <TData>(
  options: UseCachedResourceOptions<TData>
): UseCachedResourceResult<TData> => {
  const {
    allowStale = true,
    enabled = true,
    engine,
    fetcher,
    isEmptyData,
    keepStaleDataOnError = true,
    policy,
    refreshIntervalMs,
    refreshWhenVisibleOnly = true,
    revalidateOnVisible = true,
    revalidateIfStale = false,
    scope
  } = options;
  const dependencyList = options.deps ?? [];
  const scopeKey = buildCacheStorageKey(scope);
  const policyKey = useMemo(() => policySignature(policy), [policy]);
  const fetcherRef = useRef<CacheFetcher<TData>>(fetcher);
  const isEmptyDataRef = useRef<typeof isEmptyData>(isEmptyData);
  const scopeRef = useRef<CacheScope>(scope);
  const policyRef = useRef<CachePolicy | undefined>(policy);
  const [state, setState] = useState<CachedResourceInternalState<TData>>(() => idleState<TData>());

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    isEmptyDataRef.current = isEmptyData;
  }, [isEmptyData]);

  useEffect(() => {
    scopeRef.current = scope;
  }, [scope, scopeKey]);

  useEffect(() => {
    policyRef.current = policy;
  }, [policy, policyKey]);

  const runRefresh = useCallback(
    async (background: boolean): Promise<TData | undefined> => {
      let previousState: CachedResourceInternalState<TData> | undefined;

      setState((current) => {
        previousState = current;

        if (hasUsableData(current)) {
          return {
            ...current,
            error: undefined,
            status: background || current.status !== "loading-first-load" ? "refreshing" : current.status
          };
        }

        return {
          ...current,
          error: undefined,
          status: "loading-first-load"
        };
      });

      try {
        const currentScope = scopeRef.current;
        const currentPolicy = policyRef.current;
        const data = await engine.refresh<TData>(currentScope, () => fetcherRef.current(), currentPolicy);
        const snapshot = await engine.getSnapshot<TData>(currentScope, currentPolicy);
        const lifecycleState = snapshot.state;
        const nextState: CachedResourceInternalState<TData> = {
          data,
          lifecycleState,
          snapshot,
          source: "network",
          status: toSuccessStatus(lifecycleState, data, isEmptyDataRef.current)
        };

        setState(nextState);
        return data;
      } catch (error) {
        setState((current) => {
          const retained = hasUsableData(current) ? current : previousState;

          if (keepStaleDataOnError && retained && hasUsableData(retained)) {
            return {
              ...retained,
              error,
              status: "error-with-stale-data"
            };
          }

          return {
            lifecycleState: "idle",
            error,
            source: "none",
            status: "error"
          };
        });

        return undefined;
      }
    },
    [engine, keepStaleDataOnError, policyKey, scopeKey]
  );

  useEffect(() => {
    if (!enabled) {
      setState(idleState<TData>());
      return;
    }

    let cancelled = false;

    const load = async (): Promise<void> => {
      setState((current) =>
        hasUsableData(current)
          ? {
              ...current,
              error: undefined
            }
          : {
              lifecycleState: "idle",
              source: "none",
              status: "loading-first-load"
            }
      );

      try {
        const currentScope = scopeRef.current;
        const currentPolicy = policyRef.current;
        const result = await engine.getOrFetchSnapshot<TData>(currentScope, () => fetcherRef.current(), currentPolicy, {
          allowStale,
          revalidateIfStale: false
        });

        if (cancelled) {
          return;
        }

        const nextState = toStateFromResult(result, isEmptyDataRef.current);
        setState(nextState);

        if (nextState.lifecycleState === "stale" && revalidateIfStale) {
          void runRefresh(true);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const cachedState = allowStale
          ? await readCachedSnapshot<TData>(engine, scopeRef.current, policyRef.current, isEmptyDataRef.current).catch(
              () => undefined
            )
          : undefined;

        if (cancelled) {
          return;
        }

        if (cachedState && hasUsableData(cachedState)) {
          setState({
            ...cachedState,
            error,
            status: "error-with-stale-data"
          });
          return;
        }

        setState({
          lifecycleState: "idle",
          error,
          source: "none",
          status: "error"
        });
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [allowStale, enabled, engine, policyKey, revalidateIfStale, runRefresh, scopeKey, ...dependencyList]);

  useEffect(() => {
    if (!enabled || !refreshIntervalMs || refreshIntervalMs <= 0) {
      return;
    }

    let cancelled = false;
    let timerId: number | undefined;

    const scheduleNext = (): void => {
      if (cancelled) {
        return;
      }

      timerId = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        if (refreshWhenVisibleOnly && !isBrowserDocumentVisible()) {
          scheduleNext();
          return;
        }

        runRefresh(true).then(scheduleNext, scheduleNext);
      }, refreshIntervalMs);
    };

    scheduleNext();

    return () => {
      cancelled = true;
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [enabled, refreshIntervalMs, refreshWhenVisibleOnly, runRefresh]);

  useEffect(() => {
    if (!enabled || !refreshWhenVisibleOnly || !revalidateOnVisible || !supportsVisibilityEvents()) {
      return;
    }

    let cancelled = false;

    const handleVisibilityChange = (): void => {
      if (document.visibilityState !== "visible") {
        return;
      }

      engine.getSnapshot<TData>(scopeRef.current, policyRef.current).then(
        (snapshot) => {
          if (cancelled || snapshot.state === "fresh") {
            return;
          }

          void runRefresh(true);
        },
        () => undefined
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, engine, refreshWhenVisibleOnly, revalidateOnVisible, runRefresh]);

  const refresh = useCallback(() => runRefresh(false), [runRefresh]);

  return {
    data: state.data,
    error: state.error,
    hasData: hasUsableData(state),
    isEmpty: state.status === "empty",
    isError: state.status === "error" || state.status === "error-with-stale-data",
    isIdle: state.status === "idle",
    isLoading: state.status === "loading-first-load",
    isRefreshing: state.status === "refreshing",
    lifecycleState: state.lifecycleState,
    refresh,
    snapshot: state.snapshot,
    source: state.source,
    status: state.status
  };
};
