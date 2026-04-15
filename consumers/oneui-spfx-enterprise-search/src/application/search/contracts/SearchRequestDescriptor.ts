export type SearchFilterDescriptor = {
  field: string;
  operator: "contains" | "equals" | "in";
  value: string | string[];
};

export type SearchScopeDescriptor = {
  dataSourceKey?: string;
  scopeType: "tenant" | "sites" | "custom";
  siteIds: string[];
};

export type SearchRequestDescriptor = {
  cursor?: string;
  entityTypes: string[];
  fields: string[];
  filters: SearchFilterDescriptor[];
  pageSize: number;
  promotedState?: "any" | "promoted" | "not-promoted";
  queryText: string;
  scope: SearchScopeDescriptor;
  sortKeys: string[];
  supportsRefiners: boolean;
  templateKey: string;
  verticalKey: string;
};

