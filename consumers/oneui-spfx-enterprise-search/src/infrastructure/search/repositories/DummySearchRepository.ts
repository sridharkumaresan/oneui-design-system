import type { SearchRequestDescriptor } from "../../../application/search/contracts/SearchRequestDescriptor";
import type {
  NormalizedSearchResult,
  VerticalSearchResult
} from "../../../domain/search/contracts/SearchResult";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import { dummySearchData } from "../dummy/dummySearchData";
import type { ISearchRepository } from "../contracts/ISearchRepository";

const DEFAULT_DUMMY_SEARCH_DELAY_MS = 360;

const wait = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export class DummySearchRepository implements ISearchRepository {
  public constructor(private readonly delayMs: number = DEFAULT_DUMMY_SEARCH_DELAY_MS) {}

  public async search(
    descriptor: SearchRequestDescriptor,
    vertical: VerticalConfig
  ): Promise<VerticalSearchResult> {
    if (vertical.kind === "synthetic-aggregate") {
      throw new Error("Synthetic aggregate vertical must be composed by the orchestrator.");
    }

    const standardKey = vertical.key as Exclude<VerticalConfig["key"], "all">;

    await wait(this.delayMs);

    const query = descriptor.queryText.trim();
    const sourceItems: NormalizedSearchResult[] = dummySearchData[standardKey];
    const visibleItems = query ? sourceItems : [];

    return {
      items: visibleItems.slice(0, descriptor.pageSize),
      status: visibleItems.length > 0 ? "success" : "empty",
      total: visibleItems.length,
      vertical
    };
  }
}
