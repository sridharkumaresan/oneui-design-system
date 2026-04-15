import type { MSGraphClientFactory } from "@microsoft/sp-http-msgraph";

import type { GraphSearchRequestBodyDto, GraphSearchResponseDto } from "../contracts/GraphSearchDtos";
import type { IGraphSearchClient } from "../contracts/IGraphSearchClient";

export class GraphSpfxSearchClient implements IGraphSearchClient {
  public constructor(
    private readonly graphClientFactory: MSGraphClientFactory
  ) {}

  public async executeSearch(body: GraphSearchRequestBodyDto): Promise<GraphSearchResponseDto> {
    const client = await this.graphClientFactory.getClient("3");

    return client.api("/search/query").version("v1.0").post(body) as Promise<GraphSearchResponseDto>;
  }
}
