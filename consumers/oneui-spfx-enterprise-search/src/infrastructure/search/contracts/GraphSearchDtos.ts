export type GraphSearchRequestBodyDto = {
  requests: Array<{
    entityTypes: string[];
    fields: string[];
    from?: number;
    query: {
      queryString: string;
    };
    region?: string;
    sharePointOneDriveOptions?: {
      includeHiddenContent?: boolean;
    };
    size: number;
    sortProperties?: Array<{
      isDescending?: boolean;
      name: string;
    }>;
  }>;
};

export type GraphSearchHitDto = {
  hitId?: string;
  rank?: number;
  resource?: Record<string, unknown>;
  summary?: string;
};

export type GraphSearchHitsContainerDto = {
  hits?: GraphSearchHitDto[];
  total?: number;
  moreResultsAvailable?: boolean;
};

export type GraphSearchResponseDto = {
  value?: Array<{
    hitsContainers?: GraphSearchHitsContainerDto[];
  }>;
};
