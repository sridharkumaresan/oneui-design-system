import type { IRequestDescriptorBuilder } from "../contracts/IRequestDescriptorBuilder";
import type { SearchIntent } from "../contracts/SearchIntent";
import type { SearchRequestDescriptor } from "../contracts/SearchRequestDescriptor";
import { SearchFieldSelectionResolver } from "./SearchFieldSelectionResolver";
import { SearchFilterComposer } from "./SearchFilterComposer";
import { SearchQueryTemplateRegistry } from "./SearchQueryTemplateRegistry";

export class SearchRequestDescriptorBuilder implements IRequestDescriptorBuilder {
  public constructor(
    private readonly queryTemplateRegistry: SearchQueryTemplateRegistry,
    private readonly fieldSelectionResolver: SearchFieldSelectionResolver,
    private readonly filterComposer: SearchFilterComposer
  ) {}

  public build(intent: SearchIntent): SearchRequestDescriptor {
    return {
      cursor: intent.cursor,
      entityTypes: intent.vertical.query.entityTypes.slice(),
      fields: this.fieldSelectionResolver.resolve(intent),
      filters: this.filterComposer.compose(intent),
      pageSize: intent.pageSize,
      promotedState: intent.vertical.query.promotedState,
      queryText: this.queryTemplateRegistry.resolve(intent),
      scope: {
        dataSourceKey: intent.vertical.source.dataSourceKey,
        scopeType: intent.vertical.source.scopeType,
        siteIds: intent.vertical.source.siteIds?.slice() ?? []
      },
      sortKeys: intent.vertical.query.sortKeys?.slice() ?? [],
      supportsRefiners: intent.vertical.query.supportsRefiners ?? false,
      templateKey: intent.vertical.query.templateKey,
      verticalKey: intent.vertical.key
    };
  }
}

