import type {
  LoadingCoordinatorState,
  LoadingProgressSnapshot,
  LoadingProgressSummary,
  LoadingSectionDefinition,
  LoadingSectionState,
  LoadingSectionUpdate
} from "./types.js";

const compareSections = (
  left: Pick<LoadingSectionDefinition, "id" | "order">,
  right: Pick<LoadingSectionDefinition, "id" | "order">
): number => {
  return (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER) ||
    left.id.localeCompare(right.id);
};

const completedStatuses = new Set<LoadingSectionState["status"]>(["success", "empty", "error"]);

export const createLoadingCoordinatorState = (
  definitions: LoadingSectionDefinition[]
): LoadingCoordinatorState => {
  const sections = definitions
    .map<LoadingSectionState>((definition) => {
      return {
        ...definition,
        count: 0,
        retryable: false,
        status: "idle"
      };
    })
    .sort(compareSections);

  return {
    sectionMap: Object.fromEntries(sections.map((section) => [section.id, section])),
    sections
  };
};

export const applyLoadingSectionUpdate = (
  currentState: LoadingCoordinatorState,
  update: LoadingSectionUpdate
): LoadingCoordinatorState => {
  const currentSection = currentState.sectionMap[update.id];

  if (!currentSection) {
    return currentState;
  }

  const nextTimestamp = Date.now();
  const isCompletedStatus = completedStatuses.has(update.status);
  const nextSection: LoadingSectionState = {
    ...currentSection,
    completedAt: isCompletedStatus ? nextTimestamp : undefined,
    count:
      update.status === "success"
        ? Math.max(0, update.count ?? currentSection.count)
        : update.status === "refreshing"
          ? currentSection.count
          : update.status === "idle" || update.status === "loading" || update.status === "delayed"
            ? 0
            : currentSection.count,
    data:
      update.status === "loading" || update.status === "delayed" || update.status === "idle"
        ? undefined
        : update.data ?? currentSection.data,
    errorMessage: update.status === "error" ? update.errorMessage : undefined,
    retryable: update.status === "error",
    startedAt:
      update.status === "loading" || update.status === "refreshing"
        ? currentSection.startedAt ?? nextTimestamp
        : currentSection.startedAt,
    status: update.status,
    updatedAt: nextTimestamp
  };

  const sectionMap = {
    ...currentState.sectionMap,
    [nextSection.id]: nextSection
  };

  return {
    sectionMap,
    sections: currentState.sections.map((section) => {
      return section.id === nextSection.id ? nextSection : section;
    })
  };
};

export const getCompletedSectionCount = (sections: LoadingSectionState[]): number => {
  return sections.filter((section) => completedStatuses.has(section.status)).length;
};

export const getCompletionRatio = (sections: LoadingSectionState[]): number => {
  if (!sections.length) {
    return 0;
  }

  return getCompletedSectionCount(sections) / sections.length;
};

export const deriveLoadingProgressSummary = (
  sections: LoadingSectionState[]
): LoadingProgressSummary => {
  const success = sections.filter((section) => section.status === "success").length;
  const empty = sections.filter((section) => section.status === "empty").length;
  const error = sections.filter((section) => section.status === "error").length;
  const loading = sections.filter((section) => section.status === "loading").length;
  const delayed = sections.filter((section) => section.status === "delayed").length;
  const refreshing = sections.filter((section) => section.status === "refreshing").length;
  const completed = getCompletedSectionCount(sections);

  return {
    completed,
    delayed,
    empty,
    error,
    loading,
    percent: Math.round(getCompletionRatio(sections) * 100),
    refreshing,
    success,
    total: sections.length
  };
};

export const deriveLoadingProgress = (
  sections: LoadingSectionState[]
): LoadingProgressSnapshot => {
  const summary = deriveLoadingProgressSummary(sections);
  const totalItems = sections.reduce((sum, section) => sum + section.count, 0);

  return {
    ...summary,
    hasActiveLoads: summary.loading > 0 || summary.delayed > 0 || summary.refreshing > 0,
    hasAnyResults: totalItems > 0,
    isComplete: summary.total > 0 && summary.completed === summary.total,
    totalItems
  };
};
