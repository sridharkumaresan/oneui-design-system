export const searchSourceKeys = ["dummy", "graph"] as const;

export type SearchSourceKey = (typeof searchSourceKeys)[number];

export const isSearchSourceKey = (value: string | undefined): value is SearchSourceKey =>
  Boolean(value && searchSourceKeys.indexOf(value as SearchSourceKey) >= 0);
