import type { SearchRequestDescriptor } from "../../../application/search/contracts/SearchRequestDescriptor";
import type { GraphSearchRequestBodyDto } from "../contracts/GraphSearchDtos";

export class GraphSearchRequestBodyBuilder {
  public build(descriptor: SearchRequestDescriptor): GraphSearchRequestBodyDto {
    const queryParts = [descriptor.queryText.trim()];

    descriptor.filters.forEach((filter) => {
      if (filter.operator === "in" && Array.isArray(filter.value) && filter.value.length > 0) {
        queryParts.push(`${filter.field}:(${filter.value.join(" OR ")})`);
        return;
      }

      if (typeof filter.value === "string" && filter.value.trim().length > 0) {
        queryParts.push(`${filter.field}:${filter.value}`);
      }
    });

    if (descriptor.scope.scopeType === "sites" && descriptor.scope.siteIds.length > 0) {
      queryParts.push(`(${descriptor.scope.siteIds.map((siteId) => `siteId:${siteId}`).join(" OR ")})`);
    }

    if (descriptor.promotedState && descriptor.promotedState !== "any") {
      queryParts.push(`promotedState:${descriptor.promotedState}`);
    }

    return {
      requests: [
        {
          entityTypes: descriptor.entityTypes,
          fields: descriptor.fields,
          from: descriptor.cursor ? Number(descriptor.cursor) || 0 : 0,
          query: {
            queryString: queryParts.filter(Boolean).join(" ")
          },
          size: descriptor.pageSize,
          sortProperties: descriptor.sortKeys.map((name) => ({
            name
          }))
        }
      ]
    };
  }
}
