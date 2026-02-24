import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  SmartSectionAutoCollapseState,
  SmartSectionControllerOptions,
  SmartSectionControllerResult,
  SmartSectionEvent,
  SmartSectionRequestKey
} from "./SmartSection.types.js";

const DEFAULT_SLOW_THRESHOLD_MS = 1200;
const DEFAULT_INITIAL_VISIBLE_COUNT = 3;
const DEFAULT_AUTO_COLLAPSE_ON: SmartSectionAutoCollapseState[] = ["slow", "empty", "error"];

const toPositiveInt = (value: number | undefined, fallbackValue: number): number => {
  if (!Number.isFinite(value)) {
    return fallbackValue;
  }

  const normalized = Math.floor(value as number);
  return normalized > 0 ? normalized : fallbackValue;
};

const normalizeError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value;
  }

  return new Error(String(value));
};

const isAbortError = (value: unknown): boolean => {
  if (value instanceof DOMException && value.name === "AbortError") {
    return true;
  }

  if (value instanceof Error && value.name === "AbortError") {
    return true;
  }

  return false;
};

const isRequestKeyEnabled = (requestKey: SmartSectionRequestKey): boolean => {
  return requestKey !== null && requestKey !== undefined;
};

const buildLiveMessage = (
  status: SmartSectionControllerResult<unknown>["status"],
  itemCount: number
): string => {
  if (status === "loading") {
    return "Loading section.";
  }

  if (status === "slow") {
    return "Loading is taking longer than expected.";
  }

  if (status === "success") {
    return `${itemCount} item${itemCount === 1 ? "" : "s"} loaded.`;
  }

  if (status === "empty") {
    return "No items found for this section.";
  }

  if (status === "error") {
    return "Section failed to load.";
  }

  return "Section is idle.";
};

export const useSmartSectionController = <Item, RequestParams = unknown>(
  options: SmartSectionControllerOptions<Item, RequestParams>
): SmartSectionControllerResult<Item, RequestParams> => {
  const {
    sectionId,
    enabled = true,
    requestKey,
    requestParams,
    fetcher,
    onEvent,
    slowThresholdMs,
    initialVisibleCount,
    autoCollapseOn,
    autoExpandOnRequest = true,
    keepPreviousData = true,
    reducedMotion
  } = options;

  const resolvedSlowThresholdMs = toPositiveInt(slowThresholdMs, DEFAULT_SLOW_THRESHOLD_MS);
  const resolvedInitialVisibleCount = toPositiveInt(
    initialVisibleCount,
    DEFAULT_INITIAL_VISIBLE_COUNT
  );
  const resolvedAutoCollapseOn =
    autoCollapseOn && autoCollapseOn.length > 0
      ? Array.from(new Set(autoCollapseOn))
      : DEFAULT_AUTO_COLLAPSE_ON;

  const [status, setStatus] =
    useState<SmartSectionControllerResult<Item, RequestParams>["status"]>("idle");
  const [items, setItems] = useState<Item[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const itemsRef = useRef<Item[]>([]);
  const requestCounterRef = useRef(0);
  const lastRequestedKeyRef = useRef<SmartSectionRequestKey>(undefined);
  const autoCollapsedReasonRef = useRef<SmartSectionAutoCollapseState | null>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequestRef = useRef<{ id: number; controller: AbortController } | null>(null);

  const latestRef = useRef({
    sectionId,
    enabled,
    requestKey,
    requestParams,
    fetcher,
    onEvent,
    slowThresholdMs: resolvedSlowThresholdMs,
    initialVisibleCount: resolvedInitialVisibleCount,
    autoCollapseOn: resolvedAutoCollapseOn,
    autoExpandOnRequest,
    keepPreviousData
  });

  latestRef.current = {
    sectionId,
    enabled,
    requestKey,
    requestParams,
    fetcher,
    onEvent,
    slowThresholdMs: resolvedSlowThresholdMs,
    initialVisibleCount: resolvedInitialVisibleCount,
    autoCollapseOn: resolvedAutoCollapseOn,
    autoExpandOnRequest,
    keepPreviousData
  };

  const emitEvent = useCallback((event: SmartSectionEvent): void => {
    latestRef.current.onEvent?.(event);
  }, []);

  const clearSlowTimer = useCallback(() => {
    if (slowTimerRef.current) {
      clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
    }
  }, []);

  const cancelActiveRequest = useCallback(() => {
    clearSlowTimer();

    if (activeRequestRef.current) {
      activeRequestRef.current.controller.abort();
      activeRequestRef.current = null;
    }
  }, [clearSlowTimer]);

  const collapse = useCallback(
    (reason: "slow" | "empty" | "error" | "manual") => {
      autoCollapsedReasonRef.current = reason === "manual" ? null : reason;

      setIsExpanded((previousValue) => {
        if (!previousValue) {
          return previousValue;
        }

        emitEvent({
          type: "collapse",
          sectionId: latestRef.current.sectionId,
          requestKey: latestRef.current.requestKey,
          reason,
          timestamp: Date.now()
        });

        return false;
      });
    },
    [emitEvent]
  );

  const expand = useCallback(
    (reason: "request" | "manual") => {
      autoCollapsedReasonRef.current = null;

      setIsExpanded((previousValue) => {
        if (previousValue) {
          return previousValue;
        }

        emitEvent({
          type: "expand",
          sectionId: latestRef.current.sectionId,
          requestKey: latestRef.current.requestKey,
          reason,
          timestamp: Date.now()
        });

        return true;
      });
    },
    [emitEvent]
  );

  const startFetch = useCallback(
    (isRetry: boolean) => {
      const current = latestRef.current;

      if (!current.enabled || !isRequestKeyEnabled(current.requestKey)) {
        return;
      }

      cancelActiveRequest();

      if (current.autoExpandOnRequest) {
        expand("request");
      }

      const hasPreviousItems = current.keepPreviousData && itemsRef.current.length > 0;

      setStatus("loading");
      setError(null);
      setIsRefreshing(hasPreviousItems);

      if (!hasPreviousItems) {
        itemsRef.current = [];
        setItems([]);
        setTotalCount(0);
      }

      const requestId = requestCounterRef.current + 1;
      requestCounterRef.current = requestId;
      const controller = new AbortController();
      activeRequestRef.current = { id: requestId, controller };

      slowTimerRef.current = setTimeout(() => {
        if (activeRequestRef.current?.id !== requestId) {
          return;
        }

        setStatus("slow");

        if (
          !(current.keepPreviousData && itemsRef.current.length > 0) &&
          current.autoCollapseOn.includes("slow")
        ) {
          collapse("slow");
        }
      }, current.slowThresholdMs);

      void Promise.resolve(
        current.fetcher({
          requestKey: current.requestKey,
          requestParams: current.requestParams,
          signal: controller.signal,
          isRetry
        })
      )
        .then((result) => {
          if (activeRequestRef.current?.id !== requestId) {
            return;
          }

          clearSlowTimer();
          activeRequestRef.current = null;

          const nextItems = Array.isArray(result.items) ? result.items : [];
          const nextTotalCount =
            typeof result.totalCount === "number" ? result.totalCount : nextItems.length;

          itemsRef.current = nextItems;
          setItems(nextItems);
          setTotalCount(nextTotalCount);
          setError(null);
          setIsRefreshing(false);

          if (nextItems.length === 0) {
            setStatus("empty");

            if (current.autoCollapseOn.includes("empty")) {
              collapse("empty");
            }

            emitEvent({
              type: "settled",
              sectionId: current.sectionId,
              requestKey: current.requestKey,
              status: "empty",
              itemCount: 0,
              timestamp: Date.now()
            });

            return;
          }

          setStatus("success");
          if (autoCollapsedReasonRef.current === "slow") {
            expand("request");
          }

          emitEvent({
            type: "settled",
            sectionId: current.sectionId,
            requestKey: current.requestKey,
            status: "success",
            itemCount: nextItems.length,
            timestamp: Date.now()
          });
        })
        .catch((reason: unknown) => {
          if (activeRequestRef.current?.id !== requestId) {
            return;
          }

          clearSlowTimer();
          activeRequestRef.current = null;

          if (isAbortError(reason)) {
            return;
          }

          const normalizedError = normalizeError(reason);
          setStatus("error");
          setError(normalizedError);
          setIsRefreshing(false);

          if (current.autoCollapseOn.includes("error")) {
            collapse("error");
          }

          emitEvent({
            type: "settled",
            sectionId: current.sectionId,
            requestKey: current.requestKey,
            status: "error",
            itemCount: itemsRef.current.length,
            timestamp: Date.now()
          });
        });
    },
    [cancelActiveRequest, clearSlowTimer, collapse, emitEvent, expand]
  );

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (typeof reducedMotion === "boolean") {
      setPrefersReducedMotion(reducedMotion);
      return;
    }

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setPrefersReducedMotion(false);
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setPrefersReducedMotion(media.matches);
    };

    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => {
        media.removeEventListener("change", update);
      };
    }

    media.addListener(update);
    return () => {
      media.removeListener(update);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled || !isRequestKeyEnabled(requestKey)) {
      cancelActiveRequest();
      setStatus("idle");
      setError(null);
      setIsRefreshing(false);
      lastRequestedKeyRef.current = requestKey;
      return;
    }

    if (Object.is(lastRequestedKeyRef.current, requestKey)) {
      return;
    }

    lastRequestedKeyRef.current = requestKey;
    startFetch(false);
  }, [enabled, requestKey, cancelActiveRequest, startFetch]);

  useEffect(() => {
    return () => {
      cancelActiveRequest();
    };
  }, [cancelActiveRequest]);

  const toggleExpanded = useCallback(() => {
    if (isExpanded) {
      collapse("manual");
      return;
    }

    expand("manual");
  }, [collapse, expand, isExpanded]);

  const retry = useCallback(() => {
    const current = latestRef.current;

    if (!current.enabled || !isRequestKeyEnabled(current.requestKey)) {
      return;
    }

    emitEvent({
      type: "retry",
      sectionId: current.sectionId,
      requestKey: current.requestKey,
      timestamp: Date.now()
    });

    startFetch(true);
  }, [emitEvent, startFetch]);

  const boundedVisibleCount = resolvedInitialVisibleCount;
  const visibleItems = useMemo(
    () => (isExpanded ? items.slice(0, boundedVisibleCount) : []),
    [boundedVisibleCount, isExpanded, items]
  );
  const hasMore = items.length > boundedVisibleCount;
  const isSlow = status === "slow";
  const isError = status === "error";
  const isEmpty = status === "empty";
  const isBusy = status === "loading" || status === "slow";

  const liveMessage = buildLiveMessage(
    status,
    visibleItems.length > 0 ? visibleItems.length : items.length
  );

  return {
    sectionId,
    requestKey,
    requestParams,
    status,
    items,
    visibleItems,
    totalCount,
    error,
    isExpanded,
    isBusy,
    isRefreshing,
    isSlow,
    isError,
    isEmpty,
    reducedMotion: prefersReducedMotion,
    visibleCount: boundedVisibleCount,
    hasMore,
    liveMessage,
    toggleExpanded,
    retry
  };
};
