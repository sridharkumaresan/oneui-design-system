import type { SearchRequestDescriptor } from "../../../application/search/contracts/SearchRequestDescriptor";
import type { VerticalSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";

export interface ISearchRepository {
  search(descriptor: SearchRequestDescriptor, vertical: VerticalConfig): Promise<VerticalSearchResult>;
}
