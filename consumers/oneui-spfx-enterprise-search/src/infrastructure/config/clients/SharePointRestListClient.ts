import type { BaseComponentContext } from "@microsoft/sp-component-base";
import { SPHttpClient } from "@microsoft/sp-http";

import type { ISharePointListClient, SharePointListQuery } from "../contracts/ISharePointListClient";

type SharePointListResponse<TItem> = {
  value?: TItem[];
};

const escapeListTitle = (value: string): string => value.replace(/'/g, "''");

export class SharePointRestListClient implements ISharePointListClient {
  public constructor(private readonly context: BaseComponentContext) {}

  public async getItems<TItem extends Record<string, unknown>>(
    query: SharePointListQuery
  ): Promise<TItem[]> {
    const webUrl = this.context.pageContext.web.absoluteUrl.replace(/\/$/, "");
    const requestUrl = new URL(
      `${webUrl}/_api/web/lists/getbytitle('${escapeListTitle(query.listTitle)}')/items`
    );

    requestUrl.searchParams.set("$select", query.select.join(","));
    requestUrl.searchParams.set("$top", String(query.top ?? 200));

    if (query.orderBy?.length) {
      requestUrl.searchParams.set("$orderby", query.orderBy.join(","));
    }

    const response = await this.context.spHttpClient.get(
      requestUrl.toString(),
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`SharePoint config request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as SharePointListResponse<TItem>;
    return payload.value ?? [];
  }
}

