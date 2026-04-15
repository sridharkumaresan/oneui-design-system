export const searchRuntimeModes = ["dummy", "hybrid", "real"] as const;

export type SearchRuntimeMode = (typeof searchRuntimeModes)[number];

export const isSearchRuntimeMode = (value: string | undefined): value is SearchRuntimeMode =>
  Boolean(value && searchRuntimeModes.indexOf(value as SearchRuntimeMode) >= 0);

