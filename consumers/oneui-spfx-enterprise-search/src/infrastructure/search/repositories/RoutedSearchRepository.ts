import { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { SearchSourceKey } from "../../../common/types/searchSource";
import type { SearchRequestDescriptor } from "../../../application/search/contracts/SearchRequestDescriptor";
import type { VerticalSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { ISearchRepository } from "../contracts/ISearchRepository";
import { VerticalSearchSourceResolver } from "../resolvers/VerticalSearchSourceResolver";

type SearchErrorCategory = "auth" | "request" | "response-shape" | "unexpected";

export class RoutedSearchRepository implements ISearchRepository {
  public constructor(
    private readonly repositories: Partial<Record<SearchSourceKey, ISearchRepository>>,
    private readonly sourceResolver: VerticalSearchSourceResolver,
    private readonly diagnosticsStore?: SearchConfigDiagnosticsStore
  ) {}

  public async search(
    descriptor: SearchRequestDescriptor,
    vertical: VerticalConfig
  ): Promise<VerticalSearchResult> {
    const source = this.sourceResolver.resolve(vertical);
    const repository = this.repositories[source] ?? this.repositories.dummy;

    if (!repository) {
      return this.createFailureResult(
        source,
        vertical,
        "No search repository is configured for this vertical."
      );
    }

    try {
      const result = await repository.search(descriptor, vertical);
      const resolvedResult: VerticalSearchResult = {
        ...result,
        source
      };

      this.diagnosticsStore?.recordSearchEntry({
        errorMessage: resolvedResult.errorMessage,
        normalizationRejectedCount: resolvedResult.diagnostics?.rejectedHits ?? 0,
        requestBuilt: true,
        requestDurationMs: resolvedResult.diagnostics?.requestDurationMs,
        source,
        status: resolvedResult.status,
        templateKey: descriptor.templateKey,
        total: resolvedResult.total,
        transport: resolvedResult.diagnostics?.transport ?? (source === "graph" ? "graph" : "in-memory"),
        usedGraph: source === "graph",
        verticalKey: vertical.key
      });

      return resolvedResult;
    } catch (error) {
      const failure = this.createFailureResult(
        source,
        vertical,
        this.toUserFacingMessage(error, source)
      );

      this.diagnosticsStore?.recordSearchEntry({
        errorCategory: this.classifyError(error),
        errorMessage: failure.errorMessage,
        normalizationRejectedCount: 0,
        requestBuilt: true,
        requestDurationMs: failure.diagnostics?.requestDurationMs,
        source,
        status: failure.status,
        templateKey: descriptor.templateKey,
        total: failure.total,
        transport: failure.diagnostics?.transport ?? (source === "graph" ? "graph" : "in-memory"),
        usedGraph: source === "graph",
        verticalKey: vertical.key
      });

      return failure;
    }
  }

  private createFailureResult(
    source: SearchSourceKey,
    vertical: VerticalConfig,
    errorMessage: string
  ): VerticalSearchResult {
    return {
      errorMessage,
      items: [],
      source,
      status: "error",
      total: 0,
      vertical,
      diagnostics: {
        rejectedHits: 0,
        transport: source === "graph" ? "graph" : "in-memory"
      }
    };
  }

  private classifyError(error: unknown): SearchErrorCategory {
    const message = error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("access denied") || message.includes("forbidden") || message.includes("401") || message.includes("403")) {
      return "auth";
    }

    if (message.includes("invalid graph") || message.includes("unexpected graph response")) {
      return "response-shape";
    }

    if (message.includes("request") || message.includes("network") || message.includes("fetch")) {
      return "request";
    }

    return "unexpected";
  }

  private toUserFacingMessage(error: unknown, source: SearchSourceKey): string {
    const category = this.classifyError(error);

    if (source === "graph" && category === "auth") {
      return "This search source is unavailable because the current account does not have access.";
    }

    if (category === "response-shape") {
      return "This search source returned an unexpected response and could not be displayed.";
    }

    if (category === "request") {
      return "This search source is temporarily unavailable. Try again later.";
    }

    return "This search source could not be loaded.";
  }
}
