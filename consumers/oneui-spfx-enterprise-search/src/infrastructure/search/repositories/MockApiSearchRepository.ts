import type { SearchRequestDescriptor } from "../../../application/search/contracts/SearchRequestDescriptor";
import type { VerticalSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { IMockSearchApiClient } from "../../mock-api/contracts/IMockSearchApiClient";
import type { ISearchRepository } from "../contracts/ISearchRepository";

export class MockApiSearchRepository implements ISearchRepository {
  public constructor(private readonly client: IMockSearchApiClient) {}

  public async search(
    descriptor: SearchRequestDescriptor,
    vertical: VerticalConfig
  ): Promise<VerticalSearchResult> {
    const response = await this.client.search({
      pageSize: descriptor.pageSize,
      queryText: descriptor.queryText,
      verticalKey: vertical.key
    });

    return {
      diagnostics: {
        requestDurationMs: response.requestDurationMs,
        transport: response.transport
      },
      errorMessage: response.errorMessage,
      items: response.items,
      status: response.status,
      total: response.total,
      vertical
    };
  }
}
