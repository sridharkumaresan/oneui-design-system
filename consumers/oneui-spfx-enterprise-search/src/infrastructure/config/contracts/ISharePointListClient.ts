export type SharePointListQuery = {
  listTitle: string;
  orderBy?: string[];
  select: string[];
  top?: number;
};

export interface ISharePointListClient {
  getItems<TItem extends Record<string, unknown>>(query: SharePointListQuery): Promise<TItem[]>;
}

