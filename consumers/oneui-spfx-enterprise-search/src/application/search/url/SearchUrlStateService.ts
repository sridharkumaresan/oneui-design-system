import {
  DEFAULT_QUERY_PARAM_KEY,
  DEFAULT_VERTICAL_PARAM_KEY
} from "../../../common/constants/searchDefaults";

export type SearchUrlState = {
  queryText: string;
  verticalKey?: string;
};

export class SearchUrlStateService {
  public parse(currentUrl: string): SearchUrlState {
    const url = new URL(currentUrl, window.location.origin);
    return {
      queryText: url.searchParams.get(DEFAULT_QUERY_PARAM_KEY)?.trim() ?? "",
      verticalKey: url.searchParams.get(DEFAULT_VERTICAL_PARAM_KEY) ?? undefined
    };
  }

  public serialize(state: SearchUrlState, currentUrl: string): string {
    const url = new URL(currentUrl, window.location.origin);

    if (state.queryText) {
      url.searchParams.set(DEFAULT_QUERY_PARAM_KEY, state.queryText);
    } else {
      url.searchParams.delete(DEFAULT_QUERY_PARAM_KEY);
    }

    if (state.verticalKey) {
      url.searchParams.set(DEFAULT_VERTICAL_PARAM_KEY, state.verticalKey);
    } else {
      url.searchParams.delete(DEFAULT_VERTICAL_PARAM_KEY);
    }

    return `${url.pathname}${url.search}${url.hash}`;
  }

  public update(state: SearchUrlState, currentUrl: string): void {
    const nextRelativeUrl = this.serialize(state, currentUrl);
    window.history.replaceState({}, "", nextRelativeUrl);
  }

  public buildViewMoreUrl(queryText: string, verticalKey: string, currentUrl: string): string {
    return this.serialize({ queryText, verticalKey }, currentUrl);
  }
}
