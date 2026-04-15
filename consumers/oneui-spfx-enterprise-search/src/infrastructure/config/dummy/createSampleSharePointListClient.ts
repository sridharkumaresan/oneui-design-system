import type { SharePointVerticalConfigItemDto } from "../contracts/SharePointVerticalConfigItemDto";
import type { ISharePointListClient, SharePointListQuery } from "../contracts/ISharePointListClient";
import { sampleSharePointConfigItems } from "./sharePointConfigItems";

export const createSampleSharePointListClient = (
  items: SharePointVerticalConfigItemDto[] = sampleSharePointConfigItems
): ISharePointListClient => ({
  async getItems<TItem extends Record<string, unknown>>(_query: SharePointListQuery): Promise<TItem[]> {
    return items as unknown as TItem[];
  }
});

