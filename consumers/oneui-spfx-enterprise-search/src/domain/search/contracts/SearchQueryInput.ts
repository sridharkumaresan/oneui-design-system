import type { VerticalKey } from "../models/verticalKey";

export type SearchQueryInput = {
  cursor?: string;
  pageSize?: number;
  requestId?: string;
  text: string;
  verticalKey: VerticalKey;
};

