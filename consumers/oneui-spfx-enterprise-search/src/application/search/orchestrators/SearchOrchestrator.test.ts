import { SearchOrchestrator } from "./SearchOrchestrator";
import { SearchFieldSelectionResolver } from "../services/SearchFieldSelectionResolver";
import { SearchFilterComposer } from "../services/SearchFilterComposer";
import { SearchQueryTemplateRegistry } from "../services/SearchQueryTemplateRegistry";
import { SearchRequestDescriptorBuilder } from "../services/SearchRequestDescriptorBuilder";
import { VerticalConfigService } from "../services/VerticalConfigService";
import { SearchUrlStateService } from "../url/SearchUrlStateService";
import { DummyVerticalConfigRepository } from "../../../infrastructure/config/repositories/DummyVerticalConfigRepository";
import { DummySearchRepository } from "../../../infrastructure/search/repositories/DummySearchRepository";
import { RoutedSearchRepository } from "../../../infrastructure/search/repositories/RoutedSearchRepository";
import { VerticalSearchSourceResolver } from "../../../infrastructure/search/resolvers/VerticalSearchSourceResolver";
import type { ISearchRepository } from "../../../infrastructure/search/contracts/ISearchRepository";
import type { SearchRequestDescriptor } from "../contracts/SearchRequestDescriptor";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";

const createOrchestrator = (searchRepository: ISearchRepository = new DummySearchRepository()): SearchOrchestrator =>
  new SearchOrchestrator(
    new VerticalConfigService(new DummyVerticalConfigRepository()),
    new SearchRequestDescriptorBuilder(
      new SearchQueryTemplateRegistry({
        "events-sites": (intent) => `${intent.queryText} event`,
        files: (intent) => `${intent.queryText} file`,
        knowledge: (intent) => intent.queryText,
        news: (intent) => `${intent.queryText} news`,
        people: (intent) => `${intent.queryText} person`,
        resources: (intent) => `${intent.queryText} resource`
      }),
      new SearchFieldSelectionResolver(),
      new SearchFilterComposer()
    ),
    searchRepository,
    new SearchUrlStateService(),
    new SearchConfigDiagnosticsStore()
  );

describe("SearchOrchestrator", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/search.aspx");
  });

  it("executes a standard vertical search", async () => {
    const orchestrator = createOrchestrator();
    const init = await orchestrator.initialize(window.location.href);
    const result = await orchestrator.execute("benefits", "news", init.verticals);

    expect(result.kind).toBe("vertical");
    if (result.kind === "vertical") {
      expect(result.selectedVertical.key).toBe("news");
      expect(result.result.vertical.key).toBe("news");
      expect(result.result.status).toBe("success");
      expect(result.result.total).toBeGreaterThan(0);
    }
  });

  it("executes a synthetic aggregate search without querying the aggregate as a child", async () => {
    const orchestrator = createOrchestrator();
    const init = await orchestrator.initialize(window.location.href);
    const result = await orchestrator.execute("people", "all", init.verticals);

    expect(result.kind).toBe("all");
    if (result.kind === "all") {
      expect(result.sections.every((section) => section.vertical.kind === "standard")).toBe(true);
      expect(result.sections.some((section) => section.viewMoreUrl?.includes("v=people"))).toBe(true);
      expect(result.layout.main.length).toBeGreaterThan(0);
      expect(result.layout.side.length).toBeGreaterThan(0);
      expect(result.sections.some((section) => section.status === "success")).toBe(true);
      expect(result.sections.some((section) => section.items.length > 0)).toBe(true);
    }
  });

  it("executes a deep-linked query through initialization and returns visible results", async () => {
    const orchestrator = createOrchestrator();

    window.history.replaceState({}, "", "/search.aspx?q=benefits&v=news");

    const init = await orchestrator.initialize(window.location.href);
    const result = await orchestrator.execute(init.queryText, init.selectedVerticalKey, init.verticals);

    expect(init.queryText).toBe("benefits");
    expect(init.selectedVerticalKey).toBe("news");
    expect(result.kind).toBe("vertical");
    if (result.kind === "vertical") {
      expect(result.result.status).toBe("success");
      expect(result.result.items.length).toBeGreaterThan(0);
    }
  });

  it("supports mixed aggregate execution with one graph-backed section and localized failures", async () => {
    const graphRepository: ISearchRepository = {
      async search(descriptor: SearchRequestDescriptor, vertical: VerticalConfig) {
        return {
          items: [],
          source: "graph",
          status: "error",
          errorMessage: "Graph search is unavailable for this section.",
          total: 0,
          vertical
        };
      }
    };
    const searchRepository = new RoutedSearchRepository(
      {
        dummy: new DummySearchRepository(),
        graph: graphRepository
      },
      new VerticalSearchSourceResolver({ files: "graph" }),
      new SearchConfigDiagnosticsStore()
    );
    const orchestrator = createOrchestrator(searchRepository);
    const init = await orchestrator.initialize(window.location.href);
    const result = await orchestrator.execute("policy", "all", init.verticals);

    expect(result.kind).toBe("all");
    if (result.kind === "all") {
      const filesSection = result.sections.find((section) => section.vertical.key === "files");
      const peopleSection = result.sections.find((section) => section.vertical.key === "people");

      expect(filesSection?.status).toBe("error");
      expect(filesSection?.errorMessage).toBe("Graph search is unavailable for this section.");
      expect(peopleSection?.status).not.toBe("error");
    }
  });

  it("creates aggregate loading execution models for smart sections and progress", async () => {
    const orchestrator = createOrchestrator();
    const init = await orchestrator.initialize(window.location.href);
    const execution = orchestrator.createPendingExecution("all", init.verticals, "benefits");

    expect(execution.kind).toBe("all");
    if (execution.kind === "all") {
      expect(execution.sections.every((section) => section.status === "loading")).toBe(true);
      expect(execution.progress.loading).toBe(execution.sections.length);
      expect(execution.progress.completed).toBe(0);
    }
  });

  it("transitions pending aggregate execution to delayed state", async () => {
    const orchestrator = createOrchestrator();
    const init = await orchestrator.initialize(window.location.href);
    const pendingExecution = orchestrator.createPendingExecution("all", init.verticals, "benefits");
    const delayedExecution = orchestrator.transitionExecutionStatus(pendingExecution, "delayed");

    expect(delayedExecution.kind).toBe("all");
    if (delayedExecution.kind === "all") {
      expect(delayedExecution.sections.every((section) => section.status === "delayed")).toBe(true);
      expect(delayedExecution.progress.delayed).toBe(delayedExecution.sections.length);
    }
  });
});
