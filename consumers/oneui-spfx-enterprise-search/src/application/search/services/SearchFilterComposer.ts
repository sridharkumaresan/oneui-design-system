import type { SearchFilterDescriptor } from "../contracts/SearchRequestDescriptor";
import type { SearchIntent } from "../contracts/SearchIntent";

export class SearchFilterComposer {
  public compose(intent: SearchIntent): SearchFilterDescriptor[] {
    const filters: SearchFilterDescriptor[] = [];

    for (const filter of intent.vertical.query.extraFilters ?? []) {
      filters.push({
        field: "queryString",
        operator: "contains",
        value: filter
      });
    }

    if (intent.vertical.source.siteIds?.length) {
      filters.push({
        field: "siteId",
        operator: "in",
        value: intent.vertical.source.siteIds
      });
    }

    return filters;
  }
}

