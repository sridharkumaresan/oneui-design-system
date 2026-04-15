import { SearchConfigDiagnosticsStore } from "../../../common/types/configDiagnostics";
import type { SearchRuntimeMode } from "../../../common/types/runtime";
import { SearchOrchestrator } from "../../../application/search/orchestrators/SearchOrchestrator";
import { SearchFieldSelectionResolver } from "../../../application/search/services/SearchFieldSelectionResolver";
import { SearchFilterComposer } from "../../../application/search/services/SearchFilterComposer";
import { SearchQueryTemplateRegistry } from "../../../application/search/services/SearchQueryTemplateRegistry";
import { SearchRequestDescriptorBuilder } from "../../../application/search/services/SearchRequestDescriptorBuilder";
import { VerticalConfigService } from "../../../application/search/services/VerticalConfigService";
import { SearchUrlStateService } from "../../../application/search/url/SearchUrlStateService";
import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import { FallbackVerticalConfigRepository, type ConfigFailureStrategy } from "../../../infrastructure/config/repositories/FallbackVerticalConfigRepository";
import { DummyVerticalConfigRepository } from "../../../infrastructure/config/repositories/DummyVerticalConfigRepository";
import { MockApiVerticalConfigRepository } from "../../../infrastructure/config/repositories/MockApiVerticalConfigRepository";
import { SharePointVerticalConfigRepository } from "../../../infrastructure/config/repositories/SharePointVerticalConfigRepository";
import type { ISharePointListClient } from "../../../infrastructure/config/contracts/ISharePointListClient";
import { createSampleSharePointListClient } from "../../../infrastructure/config/dummy/createSampleSharePointListClient";
import { GraphSearchRequestBodyBuilder } from "../../../infrastructure/search/mappers/GraphSearchRequestBodyBuilder";
import { GraphSearchResultNormalizer } from "../../../infrastructure/search/mappers/GraphSearchResultNormalizer";
import type { IGraphSearchClient } from "../../../infrastructure/search/contracts/IGraphSearchClient";
import { createSampleGraphSearchClient } from "../../../infrastructure/search/dummy/createSampleGraphSearchClient";
import { DummySearchRepository } from "../../../infrastructure/search/repositories/DummySearchRepository";
import { GraphSearchRepository } from "../../../infrastructure/search/repositories/GraphSearchRepository";
import { MockApiSearchRepository } from "../../../infrastructure/search/repositories/MockApiSearchRepository";
import { RoutedSearchRepository } from "../../../infrastructure/search/repositories/RoutedSearchRepository";
import { VerticalSearchSourceResolver, type VerticalSearchSourceOverrides } from "../../../infrastructure/search/resolvers/VerticalSearchSourceResolver";
import type { IMockSearchApiClient } from "../../../infrastructure/mock-api/contracts/IMockSearchApiClient";
import { HttpMockSearchApiClient } from "../../../infrastructure/mock-api/clients/HttpMockSearchApiClient";

export type SearchRuntimeConfig = {
  configFailureStrategy?: ConfigFailureStrategy;
  enableDiagnostics?: boolean;
  graphSearchClient?: IGraphSearchClient;
  mockApiBaseUrl?: string;
  mockApiClient?: IMockSearchApiClient;
  mode: SearchRuntimeMode;
  searchSourceOverrides?: VerticalSearchSourceOverrides;
  sharePointListClient?: ISharePointListClient;
  useSampleFallbacks?: boolean;
};

export type SearchCompositionRoot = {
  diagnosticsStore: SearchConfigDiagnosticsStore;
  orchestrator: SearchOrchestrator;
  runtimeConfig: SearchRuntimeConfig;
};

const createQueryTemplateRegistry = (): SearchQueryTemplateRegistry =>
  new SearchQueryTemplateRegistry({
    "events-sites": (intent) => `${intent.queryText} event content`,
    files: (intent) => `${intent.queryText} file`,
    knowledge: (intent) => intent.queryText,
    news: (intent) => `${intent.queryText} news`,
    people: (intent) => `${intent.queryText} person`,
    resources: (intent) => `${intent.queryText} resource`
  });

export const createSearchCompositionRoot = (
  runtimeConfig: SearchRuntimeConfig
): SearchCompositionRoot => {
  const diagnosticsStore = new SearchConfigDiagnosticsStore();
  const dummyConfigRepository = new DummyVerticalConfigRepository(diagnosticsStore, runtimeConfig.mode);
  const mockApiClient =
    runtimeConfig.mockApiClient ??
    (runtimeConfig.mockApiBaseUrl
      ? new HttpMockSearchApiClient(runtimeConfig.mockApiBaseUrl, () => {
          const params = new URLSearchParams(window.location.search);
          const delayMs = Number(params.get("mockDelayMs") ?? undefined);
          const status = params.get("mockStatus") ?? undefined;
          const targetVerticalKey = params.get("mockTarget") ?? undefined;

          return {
            delayMs: Number.isNaN(delayMs) ? undefined : delayMs,
            status:
              status === "empty" || status === "error" || status === "request-error" || status === "success"
                ? status
                : undefined,
            targetVerticalKey:
              targetVerticalKey === "*"
                ? "*"
                : (targetVerticalKey as VerticalConfig["key"] | undefined)
          };
        })
      : undefined);
  const resolvedSharePointListClient =
    runtimeConfig.sharePointListClient ??
    (runtimeConfig.useSampleFallbacks ? createSampleSharePointListClient() : undefined);

  const configRepository =
    runtimeConfig.mode === "dummy"
      ? mockApiClient
        ? new MockApiVerticalConfigRepository(mockApiClient, diagnosticsStore, runtimeConfig.mode)
        : dummyConfigRepository
      : new FallbackVerticalConfigRepository(
          new SharePointVerticalConfigRepository(
            resolvedSharePointListClient ??
              ({
                getItems: async () => {
                  throw new Error("SharePoint list client is not configured for hybrid/real mode.");
                }
              } as ISharePointListClient),
            diagnosticsStore,
            runtimeConfig.mode
          ),
          dummyConfigRepository,
          runtimeConfig.configFailureStrategy ?? "error",
          diagnosticsStore
        );

  const requestDescriptorBuilder = new SearchRequestDescriptorBuilder(
    createQueryTemplateRegistry(),
    new SearchFieldSelectionResolver(),
    new SearchFilterComposer()
  );

  const dummySearchRepository = mockApiClient ? new MockApiSearchRepository(mockApiClient) : new DummySearchRepository();
  const graphSearchClient =
    runtimeConfig.graphSearchClient ??
    (runtimeConfig.useSampleFallbacks ? createSampleGraphSearchClient() : undefined);
  const graphSearchRepository =
    graphSearchClient
      ? new GraphSearchRepository(
          new GraphSearchRequestBodyBuilder(),
          new GraphSearchResultNormalizer(),
          graphSearchClient
        )
      : undefined;
  const sourceResolver = new VerticalSearchSourceResolver(
    runtimeConfig.searchSourceOverrides,
    "dummy"
  );
  const searchRepository = new RoutedSearchRepository(
    {
      dummy: dummySearchRepository,
      graph: graphSearchRepository
    },
    sourceResolver,
    diagnosticsStore
  );

  return {
    diagnosticsStore,
    orchestrator: new SearchOrchestrator(
      new VerticalConfigService(configRepository),
      requestDescriptorBuilder,
      searchRepository,
      new SearchUrlStateService(),
      diagnosticsStore
    ),
    runtimeConfig
  };
};
