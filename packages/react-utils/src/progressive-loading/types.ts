/**
 * Shared async section lifecycle used by the reusable organisms and consuming apps.
 */
export type LoadingStatus =
  | "idle"
  | "loading"
  | "success"
  | "empty"
  | "error"
  | "delayed"
  | "refreshing";

export type LoadingPhase = LoadingStatus;

export type LoadingSectionDefinition = {
  id: string;
  order?: number;
  title: string;
};

/**
 * Minimal shared state for a single async section.
 * Consumers can keep their own domain models and store them in `data`.
 */
export type LoadingSectionState = LoadingSectionDefinition & {
  completedAt?: number;
  count: number;
  data?: unknown;
  errorMessage?: string;
  retryable: boolean;
  startedAt?: number;
  status: LoadingStatus;
  updatedAt?: number;
};

export type LoadingSectionStatus = LoadingSectionState;

/**
 * Aggregate counters derived from a list of section states.
 */
export type LoadingProgressSummary = {
  completed: number;
  delayed: number;
  empty: number;
  error: number;
  loading: number;
  percent: number;
  refreshing: number;
  success: number;
  total: number;
};

export type LoadingProgressSnapshot = LoadingProgressSummary & {
  hasActiveLoads: boolean;
  hasAnyResults: boolean;
  isComplete: boolean;
  totalItems: number;
};

export type LoadingCoordinatorState = {
  sectionMap: Record<string, LoadingSectionState>;
  sections: LoadingSectionState[];
};

export type LoadingSectionLoaderContext = {
  signal: AbortSignal;
};

export type LoadingSectionLoadResult<TData = unknown> = {
  count?: number;
  data: TData;
  isEmpty?: boolean;
};

/**
 * Declarative loader contract for consumer-owned async sections.
 */
export type LoadingSectionConfig<TData = unknown> = LoadingSectionDefinition & {
  getCount?: (data: TData) => number;
  isEmpty?: (data: TData) => boolean;
  loader: (context: LoadingSectionLoaderContext) => Promise<TData | LoadingSectionLoadResult<TData>>;
};

export type DelayedStateOptions = {
  now?: number;
  startedAt?: number;
  thresholdMs: number;
};

export type LoadingSectionUpdate =
  | {
      data?: unknown;
      id: string;
      status: "idle" | "loading" | "delayed" | "refreshing";
    }
  | {
      count?: number;
      data?: unknown;
      id: string;
      status: "success";
    }
  | {
      data?: unknown;
      id: string;
      status: "empty";
    }
  | {
      data?: unknown;
      errorMessage?: string;
      id: string;
      status: "error";
    };

export type UseLoadingCoordinatorOptions = {
  sections: LoadingSectionDefinition[];
};

export type UseProgressiveLoadingOptions<TData = unknown> = {
  autoStart?: boolean;
  delayedThresholdMs?: number;
  sections: LoadingSectionConfig<TData>[];
};

export type UseLoadingCoordinatorResult = LoadingCoordinatorState & {
  markDelayed: (ids?: string[]) => void;
  markEmpty: (id: string) => void;
  markError: (id: string, errorMessage?: string) => void;
  markLoading: (ids?: string[]) => void;
  markRefreshing: (ids?: string[]) => void;
  markSuccess: (id: string, count?: number) => void;
  progress: LoadingProgressSnapshot;
  reset: (ids?: string[]) => void;
  setSectionState: (update: LoadingSectionUpdate) => void;
};

export type UseProgressiveLoadingResult = LoadingCoordinatorState & {
  isRunning: boolean;
  loadAll: () => Promise<void>;
  progress: LoadingProgressSnapshot;
  retryAll: () => Promise<void>;
  retrySection: (id: string) => Promise<void>;
  setSectionState: (update: LoadingSectionUpdate) => void;
};
