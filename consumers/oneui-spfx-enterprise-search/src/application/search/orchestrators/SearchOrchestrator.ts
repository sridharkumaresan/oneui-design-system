import { DEFAULT_PAGE_SIZE } from "../../../common/constants/searchDefaults";
import { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { LoadingStatus } from "../../../common/types/loading";
import type { IRequestDescriptorBuilder } from "../contracts/IRequestDescriptorBuilder";
import type { SearchIntent } from "../contracts/SearchIntent";
import type { SearchExecutionResult, SearchProgressItem, SearchProgressSummary } from "../../../domain/search/contracts/SearchExecutionResult";
import type { SearchPageState } from "../../../domain/search/contracts/SearchPageState";
import type { AllVerticalSectionResult, VerticalSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { VerticalKey } from "../../../domain/search/models/verticalKey";
import type { ISearchRepository } from "../../../infrastructure/search/contracts/ISearchRepository";
import { VerticalConfigService } from "../services/VerticalConfigService";
import { SearchUrlStateService } from "../url/SearchUrlStateService";

export type SearchInitialization = Pick<SearchPageState, "queryText" | "selectedVerticalKey" | "status" | "verticals">;

export class SearchOrchestrator {
  public constructor(
    private readonly configService: VerticalConfigService,
    private readonly requestDescriptorBuilder: IRequestDescriptorBuilder,
    private readonly searchRepository: ISearchRepository,
    private readonly urlStateService: SearchUrlStateService,
    private readonly diagnosticsStore?: SearchConfigDiagnosticsStore
  ) {}

  public async initialize(currentUrl: string): Promise<SearchInitialization> {
    const verticals = await this.configService.getEnabledVerticals();
    const urlState = this.urlStateService.parse(currentUrl);
    const selectedVertical = this.configService.resolveVertical(urlState.verticalKey, verticals);

    return {
      queryText: urlState.queryText,
      selectedVerticalKey: selectedVertical.key,
      status: urlState.queryText ? "searching" : "ready",
      verticals
    };
  }

  public syncUrl(queryText: string, verticalKey: VerticalKey, currentUrl: string): void {
    this.urlStateService.update({ queryText, verticalKey }, currentUrl);
  }

  public async execute(
    text: string,
    verticalKey: VerticalKey,
    verticals: VerticalConfig[]
  ): Promise<SearchExecutionResult> {
    const registry = this.configService.createRegistry(verticals);
    const selectedVertical = registry.resolve(verticalKey);

    this.diagnosticsStore?.startSearchSnapshot({
      flow: selectedVertical.kind === "synthetic-aggregate" ? "aggregate" : "vertical",
      mode: this.diagnosticsStore.getSnapshot()?.mode ?? "dummy",
      queryText: text,
      selectedVerticalKey: selectedVertical.key
    });

    if (selectedVertical.kind === "synthetic-aggregate") {
      const sectionResults = await Promise.all(
        registry.getAggregateChildren().map((vertical) => this.executeAggregateSection(vertical, text))
      );

      return this.buildAggregateExecution(selectedVertical, registry, sectionResults);
    }

    const result = await this.executeStandardVertical(selectedVertical, text, DEFAULT_PAGE_SIZE);

    return {
      kind: "vertical",
      progress: this.buildProgressSummary([result]),
      result,
      selectedVertical
    };
  }

  public async executeWithProgress(
    text: string,
    verticalKey: VerticalKey,
    verticals: VerticalConfig[],
    onUpdate?: (execution: SearchExecutionResult) => void
  ): Promise<SearchExecutionResult> {
    const registry = this.configService.createRegistry(verticals);
    const selectedVertical = registry.resolve(verticalKey);

    if (selectedVertical.kind !== "synthetic-aggregate") {
      const execution = await this.execute(text, verticalKey, verticals);
      onUpdate?.(execution);
      return execution;
    }

    const pendingExecution = this.createPendingExecution(verticalKey, verticals, text);
    let sections = pendingExecution.kind === "all" ? pendingExecution.sections : [];
    const emit = (): SearchExecutionResult => {
      const execution = this.buildAggregateExecution(selectedVertical, registry, sections);
      onUpdate?.(execution);
      return execution;
    };

    emit();

    await Promise.all(
      registry.getAggregateChildren().map(async (vertical) => {
        let nextSection: AllVerticalSectionResult;

        try {
          nextSection = await this.executeAggregateSection(vertical, text);
        } catch (error) {
          nextSection = {
            errorMessage: error instanceof Error ? error.message : `${vertical.title} failed to load.`,
            items: [],
            previewCount: vertical.rendering.summarySize,
            renderingHint: vertical.rendering.renderingHint,
            status: "error",
            supportsViewMore: vertical.rendering.supportsViewMore,
            total: 0,
            vertical,
            viewMoreUrl: vertical.rendering.supportsViewMore
              ? this.urlStateService.buildViewMoreUrl(text, vertical.key, window.location.href)
              : undefined
          };
        }

        sections = sections.map((section) =>
          section.vertical.key === vertical.key ? nextSection : section
        );
        emit();
      })
    );

    return this.buildAggregateExecution(selectedVertical, registry, sections);
  }

  public createPendingExecution(
    verticalKey: VerticalKey,
    verticals: VerticalConfig[],
    queryText: string,
    status: Extract<LoadingStatus, "loading" | "delayed"> = "loading"
  ): SearchExecutionResult {
    const registry = this.configService.createRegistry(verticals);
    const selectedVertical = registry.resolve(verticalKey);

    if (selectedVertical.kind === "synthetic-aggregate") {
      const sections = registry.getAggregateChildren().map((vertical) => ({
        items: [],
        previewCount: vertical.rendering.summarySize,
        renderingHint: vertical.rendering.renderingHint,
        status,
        supportsViewMore: vertical.rendering.supportsViewMore,
        total: 0,
        vertical,
        viewMoreUrl: vertical.rendering.supportsViewMore
          ? this.urlStateService.buildViewMoreUrl(queryText, vertical.key, window.location.href)
          : undefined
      }));

      return {
        kind: "all",
        layout: {
          main: registry.getLayoutGroups().main.map((vertical) => vertical.key),
          side: registry.getLayoutGroups().side.map((vertical) => vertical.key)
        },
        progress: this.buildProgressSummary(
          sections.map((section) => ({
            items: section.items,
            status: section.status,
            total: section.total,
            vertical: section.vertical
          }))
        ),
        sections,
        selectedVertical
      };
    }

    return {
      kind: "vertical",
      progress: this.buildProgressSummary([
        {
          items: [],
          status,
          total: 0,
          vertical: selectedVertical
        }
      ]),
      result: {
        items: [],
        status,
        total: 0,
        vertical: selectedVertical
      },
      selectedVertical
    };
  }

  public transitionExecutionStatus(
    execution: SearchExecutionResult,
    status: Extract<LoadingStatus, "loading" | "delayed">
  ): SearchExecutionResult {
    if (execution.kind === "all") {
      const sections = execution.sections.map((section) =>
        section.status === "loading" || section.status === "delayed"
          ? {
              ...section,
              status
            }
          : section
      );

      return {
        ...execution,
        progress: this.buildProgressSummary(
          sections.map((section) => ({
            items: section.items,
            status: section.status,
            total: section.total,
            vertical: section.vertical
          }))
        ),
        sections
      };
    }

    const nextResult =
      execution.result.status === "loading" || execution.result.status === "delayed"
        ? {
            ...execution.result,
            status
          }
        : execution.result;

    return {
      ...execution,
      progress: this.buildProgressSummary([
        {
          items: nextResult.items,
          status: nextResult.status,
          total: nextResult.total,
          vertical: nextResult.vertical
        }
      ]),
      result: nextResult
    };
  }

  private async executeStandardVertical(
    vertical: VerticalConfig,
    queryText: string,
    pageSize: number
  ): Promise<VerticalSearchResult> {
    const intent: SearchIntent = {
      pageSize,
      queryText,
      vertical
    };

    const descriptor = this.requestDescriptorBuilder.build(intent);
    return this.searchRepository.search(descriptor, vertical);
  }

  private async executeAggregateSection(
    vertical: VerticalConfig,
    queryText: string
  ): Promise<AllVerticalSectionResult> {
    const result = await this.executeStandardVertical(vertical, queryText, vertical.rendering.summarySize);

    return {
      errorMessage: result.status === "error" ? result.errorMessage ?? `${vertical.title} failed to load.` : undefined,
      items: result.items,
      previewCount: vertical.rendering.summarySize,
      renderingHint: vertical.rendering.renderingHint,
      status: result.status,
      supportsViewMore: vertical.rendering.supportsViewMore,
      total: result.total,
      vertical,
      viewMoreUrl: vertical.rendering.supportsViewMore
        ? this.urlStateService.buildViewMoreUrl(queryText, vertical.key, window.location.href)
        : undefined
    };
  }

  private buildProgressSummary(results: VerticalSearchResult[]): SearchProgressSummary {
    const items: SearchProgressItem[] = results.map((result) => ({
      accentTone: result.vertical.rendering.sectionAccentTone,
      count: result.total,
      id: result.vertical.key,
      label: result.vertical.title,
      status: result.status
    }));

    const counters = items.reduce(
      (accumulator, item) => {
        accumulator.total += 1;

        switch (item.status) {
          case "success":
            accumulator.success += 1;
            accumulator.completed += 1;
            break;
          case "empty":
            accumulator.empty += 1;
            accumulator.completed += 1;
            break;
          case "error":
            accumulator.error += 1;
            accumulator.completed += 1;
            break;
          case "loading":
            accumulator.loading += 1;
            break;
          case "refreshing":
            accumulator.refreshing += 1;
            break;
          case "delayed":
            accumulator.delayed += 1;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        completed: 0,
        delayed: 0,
        empty: 0,
        error: 0,
        loading: 0,
        refreshing: 0,
        success: 0,
        total: 0
      }
    );

    const percent = counters.total === 0 ? 0 : Math.round((counters.completed / counters.total) * 100);

    return {
      ...counters,
      description: "Synthetic All results aggregate underlying vertical execution status.",
      items,
      percent,
      title: "Enterprise search progress"
    };
  }

  private buildAggregateExecution(
    selectedVertical: VerticalConfig,
    registry: ReturnType<VerticalConfigService["createRegistry"]>,
    sections: AllVerticalSectionResult[]
  ): SearchExecutionResult {
    return {
      kind: "all",
      layout: {
        main: registry.getLayoutGroups().main.map((vertical) => vertical.key),
        side: registry.getLayoutGroups().side.map((vertical) => vertical.key)
      },
      progress: this.buildProgressSummary(
        sections.map((section) => ({
          count: section.total,
          items: section.items,
          status: section.status,
          total: section.total,
          vertical: section.vertical
        }))
      ),
      sections,
      selectedVertical
    };
  }
}
