import type { SearchIntent } from "../contracts/SearchIntent";

export type SearchQueryTemplateResolver = (intent: SearchIntent) => string;

export class SearchQueryTemplateRegistry {
  public constructor(
    private readonly resolvers: Record<string, SearchQueryTemplateResolver>,
    private readonly fallbackResolver: SearchQueryTemplateResolver = (intent) => intent.queryText
  ) {}

  public resolve(intent: SearchIntent): string {
    const resolver = this.resolvers[intent.vertical.query.templateKey] ?? this.fallbackResolver;
    return resolver(intent);
  }
}

