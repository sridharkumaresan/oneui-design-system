import type { NormalizedSearchResult } from "../../../domain/search/contracts/SearchResult";
import { dummySearchData } from "./dummySearchData";
import type { GraphSearchRequestBodyDto, GraphSearchResponseDto } from "../contracts/GraphSearchDtos";
import type { IGraphSearchClient } from "../contracts/IGraphSearchClient";

export const createSampleGraphSearchClient = (): IGraphSearchClient => {
  return {
    async executeSearch(body: GraphSearchRequestBodyDto): Promise<GraphSearchResponseDto> {
      const query = body.requests[0]?.query?.queryString?.toLowerCase() ?? "";
      const sourceItems: NormalizedSearchResult[] = dummySearchData.files;
      const hits = sourceItems
        .filter((item: NormalizedSearchResult) => {
          if (!query) {
            return true;
          }

          return `${item.title} ${item.summary ?? ""}`.toLowerCase().includes(query);
        })
        .slice(0, body.requests[0]?.size ?? 10)
        .map((item: NormalizedSearchResult) => ({
          hitId: item.id,
          resource: {
            createdBy: item.createdBy,
            id: item.id,
            lastModifiedDateTime: item.modifiedTime,
            name: item.title,
            summary: item.summary,
            webUrl: item.url
          },
          summary: item.summary
        }));

      return {
        value: [
          {
            hitsContainers: [
              {
                hits,
                total: hits.length
              }
            ]
          }
        ]
      };
    }
  };
};
