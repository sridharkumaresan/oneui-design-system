import type { GraphSearchRequestBodyDto, GraphSearchResponseDto } from "./GraphSearchDtos";

export interface IGraphSearchClient {
  executeSearch(body: GraphSearchRequestBodyDto): Promise<GraphSearchResponseDto>;
}
