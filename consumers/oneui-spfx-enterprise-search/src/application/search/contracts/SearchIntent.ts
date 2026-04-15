import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";

export type SearchIntent = {
  cursor?: string;
  pageSize: number;
  queryText: string;
  vertical: VerticalConfig;
};

