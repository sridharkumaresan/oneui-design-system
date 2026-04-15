import type { SearchIntent } from "../contracts/SearchIntent";

export class SearchFieldSelectionResolver {
  public resolve(intent: SearchIntent): string[] {
    return intent.vertical.query.requestedFields?.slice() ?? [];
  }
}

