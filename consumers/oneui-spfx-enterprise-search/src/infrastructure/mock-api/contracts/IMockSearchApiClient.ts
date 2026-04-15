import type { MockSearchConfigResponse, MockSearchQueryRequest, MockSearchQueryResponse } from "./MockSearchApiTypes";

export interface IMockSearchApiClient {
  getConfig(): Promise<MockSearchConfigResponse>;
  search(request: MockSearchQueryRequest): Promise<MockSearchQueryResponse>;
}
