import type { SearchRuntimeMode } from "../common/types/runtime";

export const visibleDataModes = ["dummy", "real"] as const;

export type VisibleDataMode = (typeof visibleDataModes)[number];

export const isVisibleDataMode = (value: string | undefined): value is VisibleDataMode =>
  Boolean(value && visibleDataModes.indexOf(value as VisibleDataMode) >= 0);

export const getVisibleDataModeFromSearch = (search: string): VisibleDataMode => {
  const params = new URLSearchParams(search);
  const mode = params.get("mode") ?? undefined;

  return isVisibleDataMode(mode) ? mode : "dummy";
};

export const getRuntimeModeForVisibleDataMode = (mode: VisibleDataMode): SearchRuntimeMode =>
  mode === "real" ? "real" : "dummy";
