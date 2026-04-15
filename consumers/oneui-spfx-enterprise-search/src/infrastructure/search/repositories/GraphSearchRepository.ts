import type { SearchRequestDescriptor } from "../../../application/search/contracts/SearchRequestDescriptor";
import type { VerticalSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { IGraphSearchClient } from "../contracts/IGraphSearchClient";
import { GraphSearchRequestBodyBuilder } from "../mappers/GraphSearchRequestBodyBuilder";
import { GraphSearchResultNormalizer } from "../mappers/GraphSearchResultNormalizer";
import type { ISearchRepository } from "../contracts/ISearchRepository";

export class GraphSearchRepository implements ISearchRepository {
  public constructor(
    private readonly requestBodyBuilder: GraphSearchRequestBodyBuilder,
    private readonly normalizer: GraphSearchResultNormalizer,
    private readonly graphSearchClient: IGraphSearchClient
  ) {}

  public async search(
    descriptor: SearchRequestDescriptor,
    vertical: VerticalConfig
  ): Promise<VerticalSearchResult> {
    const body = this.requestBodyBuilder.build(descriptor);
    const response = await this.graphSearchClient.executeSearch(body);
    const normalized = this.normalizer.normalize(response, vertical);

    return {
      diagnostics: {
        rejectedHits: normalized.rejectedHits
      },
      items: normalized.items,
      status: normalized.items.length > 0 ? "success" : "empty",
      total: normalized.total,
      vertical
    };
  }
}
