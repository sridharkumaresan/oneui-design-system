# OneUI SPFx Enterprise Search

This project is an isolated SharePoint Framework consumer that proves how published `@functions-oneui` packages can power a config-driven enterprise search experience. It lives inside the OneUI repository for convenience, but it is intentionally not part of the monorepo workspace graph.

## Purpose

- Consume published OneUI packages from local Verdaccio
- Rebuild the existing Barclays Connections search page structure on top of reusable OneUI organisms
- Keep UI concerns separate from application orchestration
- Keep repositories swappable so dummy data can later become SharePoint list configuration plus Graph search with minimal churn

## Technology

- SharePoint Framework `1.22.2`
- React `17`
- Fluent UI React v9
- OneUI theme bridge through `OneUISpfxProvider`
- pnpm

## OneUI dependencies

The consumer is pinned to exact OneUI beta versions from local Verdaccio:

- `0.0.0-beta-20260410234143`

The local `.npmrc` routes the `@functions-oneui` scope to Verdaccio:

```ini
@functions-oneui:registry=http://127.0.0.1:4873/
registry=https://registry.npmjs.org/
```

If you need to switch to another registry:

1. update `.npmrc`
2. update the exact OneUI versions in `package.json`
3. run `pnpm install`

## Folder structure

```text
src/
  common/
  domain/
    search/
  application/
    search/
  infrastructure/
    config/
    search/
  presentation/
    components/
    hooks/
    viewModels/
  webparts/
    enterpriseSearch/
```

### Layer responsibilities

- `common`: shared constants, utility helpers, narrow cross-cutting types
- `domain`: search-specific contracts and normalized models
- `application`: URL state, orchestration, config resolution, page state
- `infrastructure`: repository interfaces and dummy implementations
- `presentation`: React components and local rendering adapters
- `webparts`: SPFx composition root only

## Current experience

The first foundation includes:

- page hero built with `HeroBanner`
- search form built on `SearchAutocomplete`
- config-driven vertical tabs
- grouped `All` layout using `SmartLoadingContainer` and `SmartLoadingSection`
- dedicated vertical rendering using the same section shell
- deep linking with:
  - `q` for query text
  - `v` for vertical key

Visible validation choices are intentionally limited to:

- `Dummy data`
- `Real data`

Internal runtime modes still exist, but they are not exposed in the normal preview UI.

Examples:

- `?q=people&v=all`
- `?q=benefits&v=news`

## Data source strategy

Dummy repositories live behind interfaces:

- `IVerticalConfigRepository`
- `ISearchRepository`

Today:

- `DummyVerticalConfigRepository` returns enabled vertical metadata
- `DummySearchRepository` returns realistic local mock results per vertical

This phase also makes the SharePoint-backed config seam real:

- `SharePointVerticalConfigRepository` now reads `SP_Search_Config` through a small SharePoint list client seam
- `GraphSearchRepository` remains a skeleton and is not wired for real runtime use yet

The application layer should not need to change when that swap happens.

## Running locally

Use Node 22 for SPFx.

```bash
pnpm install
pnpm start
```

For a production package:

```bash
pnpm build
```

## Browser preview harness

This consumer also includes a lightweight local preview harness so the team can validate screens on machines without a tenant or SharePoint workbench.

Run it with:

```bash
pnpm preview
```

This launches a Vite browser shell that mounts the same `EnterpriseSearchHost` used by the SPFx web part, with the same dummy repositories and application orchestration. That means you can validate:

- page layout
- hero banner rendering
- tabs and deep links
- smart container states
- responsive behavior
- result card composition

It does **not** replace real SharePoint-host validation. It is a fast front-end harness for UI and application-flow development before you move to a tenant-backed environment.

In `Dummy data` mode:

- local mock data is fetched over HTTP for both config and results
- any non-empty query returns the configured mock result set for the selected vertical
- true text filtering is intentionally out of scope for now
- the goal is to exercise submit, state transitions, aggregate rendering, dedicated rendering, and deep-link behavior

Useful example routes:

- `http://localhost:4174/?q=people&v=all`
- `http://localhost:4174/?q=benefits&v=news`
- `http://localhost:4174/?q=policy&v=it-hr-colleague-direct`

You can also build the harness:

```bash
pnpm preview:build
```

## High-level architecture decisions

- The web part class is only a host adapter.
- OneUI theming is injected at the SPFx boundary through `OneUISpfxProvider`.
- URL parsing and serialization are isolated in the application layer.
- Synthetic `All` vertical composition is owned by the orchestrator, not the UI.
- Result cards are local presentation adapters so the page can evolve without contaminating the shared library.
- `SmartLoadingContainer` is used from day one so the eventual real search flow keeps the same structural shell.
- Aggregate mode drives `SmartProgressBar` from actual section-state metadata.
- Search is explicit-submit only for now. Pressing Enter or clicking `Search` runs the query. Changing the selected vertical reruns the current query if one already exists.
- Typeahead and auto-suggest are intentionally out of scope for the current phase.

## Repository seams and replacement strategy

### Vertical config

Currently available:

- `src/infrastructure/config/repositories/DummyVerticalConfigRepository.ts`
- `src/infrastructure/config/repositories/SharePointVerticalConfigRepository.ts`

Current SharePoint-backed responsibility:

- read `SP_Search_Config`
- map list items into `VerticalConfig`
- sanitize invalid rows
- deduplicate conflicting keys
- guarantee a stable enabled/sorted/default-safe config set
- preserve stable vertical keys used by the URL contract

### Search results

Replace:

- `src/infrastructure/search/repositories/DummySearchRepository.ts`

With:

- `GraphSearchRepository`

Expected future responsibility:

- build Graph queries outside React
- fetch vertical-specific results
- normalize raw payloads into `NormalizedSearchResult`
- preserve the existing application contracts

## Hybrid mode

Hybrid mode is now the primary integration-validation mode.

Behavior:

- config comes from SharePoint through `SharePointVerticalConfigRepository`
- search results still come from `DummySearchRepository`
- the visible vertical tabs, aggregate participation, section placement, and default vertical all come from `SP_Search_Config`
- deep links are validated only after config finishes loading

The SharePoint-backed path is enabled in the SPFx host when the web part is not running from localhost.

Key files:

- [`EnterpriseSearch.tsx`](./src/webparts/enterpriseSearch/components/EnterpriseSearch.tsx)
- [`createSearchCompositionRoot.ts`](./src/webparts/enterpriseSearch/composition/createSearchCompositionRoot.ts)
- [`SharePointRestListClient.ts`](./src/infrastructure/config/clients/SharePointRestListClient.ts)
- [`SharePointVerticalConfigRepository.ts`](./src/infrastructure/config/repositories/SharePointVerticalConfigRepository.ts)

## SharePoint list client seam

The SharePoint read path is intentionally split into two layers:

- `ISharePointListClient`
  - transport seam
  - owns REST request concerns only
- `SharePointVerticalConfigRepository`
  - config interpretation seam
  - owns mapping, sanitization, dedupe, and fallback-safe selection

This keeps raw list access details out of the repository consumer path and makes repository tests easy to write with a mocked client.

## Notes

- ACE is intentionally out of scope for this first phase.
- Infinite scroll is not implemented yet, but the response models already leave space for cursors and paging metadata.
- This project is intentionally isolated from the root workspace to avoid SPFx toolchain constraints leaking into the shared library build graph.
- The preview harness is intentionally inside this consumer so it stays coupled to the same source tree. If the team finds it valuable, the same idea can later be extracted into a reusable internal package or template for other SPFx consumers.

## Runtime modes

The consumer now supports three explicit runtime modes, resolved only at the composition root:

- `dummy`
  - config from `DummyVerticalConfigRepository`
  - search from `DummySearchRepository`
- `hybrid`
  - config from `SharePointVerticalConfigRepository`
  - search from `DummySearchRepository`
- `real`
  - config from `SharePointVerticalConfigRepository`
  - mixed search execution through a source router
  - configured verticals use `GraphSearchRepository`
  - all other verticals continue through `DummySearchRepository`

The mode is selected in:

- [`createSearchCompositionRoot.ts`](./src/webparts/enterpriseSearch/composition/createSearchCompositionRoot.ts)

No mode checks exist in the page components or orchestrator.

### Visible mode selection

The preview harness collapses those internals into two visible choices only:

- `Dummy data` -> internal `dummy`
- `Real data` -> internal `real`

The mixed/routed behavior used by `real` mode is intentionally hidden from the visible UI.

## Mock HTTP transport

Preview dummy mode now uses real HTTP requests instead of direct in-memory repository reads.

Running `pnpm preview` starts both:

- the preview UI
- the local mock API served by the Vite dev server

Available mock endpoints:

- `GET /api/search/config`
- `POST /api/search/query`

The mock API returns local fixture data, but it still exercises:

- fetch/network transport
- async timing
- repository mapping
- loading, delayed, empty, and error state handling

### Mock state simulation

The mock API supports developer-only preview URL parameters:

- `mockDelayMs=900`
- `mockStatus=empty`
- `mockStatus=error`
- `mockStatus=request-error`
- `mockTarget=files` or another vertical key

These are intentionally not exposed through visible UI controls.

## Mixed search source resolution

Real Graph enablement is now controlled per vertical instead of globally.

The runtime config can supply:

- `searchSourceOverrides`

This maps stable vertical keys to source keys such as:

- `dummy`
- `graph`

The source router resolves the backing repository per vertical at runtime. That means:

- dedicated vertical searches resolve their own source cleanly
- synthetic aggregate sections resolve their source independently
- one Graph-backed section can run beside several dummy-backed sections without changing the UI model

The current validation setup enables exactly one real vertical:

- `files -> graph`

That registration happens only at the runtime/composition boundary, not in core orchestration logic.

## Composition root

The composition root owns:

- runtime mode selection
- repository selection
- per-vertical search source resolution
- fallback sample executors for local preview
- query-template registry construction
- request-descriptor builder construction
- orchestrator wiring

This keeps infrastructure concerns out of the application layer and prevents mode-specific branching from spreading through the codebase.

## Architecture layers

- `common`
  - shared constants and cross-cutting primitive types
- `domain`
  - stable, API-agnostic search models and contracts
- `application`
  - orchestration, vertical resolution, URL state, request descriptors, and builder services
- `infrastructure`
  - SharePoint config schema, dummy repositories, Graph skeletons, mappers, and integration seams
- `presentation`
  - React components that render state only
- `webparts`
  - SPFx host and runtime composition root

## Proposed SP_Search_Config schema

Recommended list: `SP_Search_Config`

| Column | Type | Required | Notes |
|---|---|---:|---|
| `Title` | Single line of text | yes | display title |
| `Key` | Single line of text | yes | stable URL-safe key |
| `Enabled` | Yes/No | yes | inclusion flag |
| `DefaultVertical` | Yes/No | no | one record should be default |
| `SortOrder` | Number | yes | stable ordering |
| `IconName` | Single line of text | no | Fluent or local icon metadata |
| `Kind` | Choice | yes | `standard` or `synthetic-aggregate` |
| `LayoutRegion` | Choice | no | `main` or `side` |
| `ResultType` | Choice | yes | `document`, `event`, `news`, `person`, `resource`, `file` |
| `RenderingHint` | Choice/Text | no | `document-list`, `resource-grid`, etc. |
| `AggregateParticipation` | Yes/No | no | whether the vertical participates in aggregate mode |
| `EntityTypes` | Single line of text | no | comma-delimited Graph entity types |
| `FieldSelection` | Multiple lines plain text or single line | no | comma-delimited requested fields |
| `TemplateKey` | Single line of text | yes | query template registry key |
| `ExtraFilters` | Multiple lines plain text or single line | no | comma-delimited filters |
| `SortKeys` | Single line of text | no | comma-delimited sort placeholders |
| `ScopeType` | Choice | no | `tenant`, `sites`, `custom` |
| `SiteIds` | Multiple lines plain text or single line | no | comma-delimited site ids |
| `DataSourceKey` | Single line of text | no | future custom source binding |
| `SummarySize` | Number | no | preview count in aggregate mode |
| `DedicatedSize` | Number | no | page size in dedicated mode |
| `SupportsInfiniteScroll` | Yes/No | no | future paging hint |
| `SupportsRefiners` | Yes/No | no | future refiners hint |
| `SupportsViewMore` | Yes/No | no | view-more behavior |
| `ViewMoreTargetKey` | Single line of text | no | optional redirect target vertical |

Mapping and validation live in:

- [`SharePointVerticalConfigItemDto.ts`](./src/infrastructure/config/contracts/SharePointVerticalConfigItemDto.ts)
- [`SharePointVerticalConfigMapper.ts`](./src/infrastructure/config/mappers/SharePointVerticalConfigMapper.ts)

## Validation and sanitization rules

The SharePoint config mapper is intentionally defensive.

Implemented behavior:

- keys are normalized to lowercase URL-safe tokens
- empty strings are treated as missing
- malformed comma-delimited fields are reduced to clean non-empty string arrays
- invalid booleans fall back to safe defaults
- invalid numbers fall back to default values
- missing optional fields are tolerated
- missing required fields cause the row to be rejected
- malformed rows are rejected individually and do not poison the whole config set

The mapper rejects rows with:

- unusable or invalid keys
- missing display title
- unsupported vertical kind
- unsupported result type

Only valid rows move beyond infrastructure.

## Duplicate, default, and fallback handling

Implemented rules:

- duplicate keys: first valid row wins after stable SharePoint ordering; later duplicates are rejected
- invalid rows: ignored and counted in diagnostics
- missing default: the first valid enabled row becomes the default
- multiple defaults: the earliest valid default wins; later defaults are downgraded
- no valid rows from SharePoint:
  - repository throws a controlled error
  - runtime fallback behavior depends on `configFailureStrategy`

Current runtime strategies:

- SPFx host uses `error`
  - hybrid mode fails closed with an explicit config error state
- preview harness uses `fallback-dummy`
  - failed SharePoint config resolution falls back to dummy config for local iteration

This behavior is intentional and centralized in the composition root, not scattered across the app.

## Standard vertical execution flow

For any `standard` vertical, the pipeline is:

1. resolve vertical config from the registry
2. build `SearchIntent`
3. build `SearchRequestDescriptor`
4. execute the active search repository
5. normalize into domain results
6. return a presentation-friendly dedicated vertical result model

No standard vertical gets its own special orchestrator path.

## Synthetic aggregate execution flow

For a `synthetic-aggregate` vertical, the pipeline is:

1. resolve the aggregate vertical by `kind`
2. resolve aggregate children from config
3. exclude the aggregate vertical itself automatically
4. run per-section searches through the same standard execution pipeline
5. cap each section using its configured `summarySize`
6. derive stable `viewMoreUrl` values using the URL state service
7. return grouped section models with:
   - title
   - status
   - items
   - total
   - rendering hint
   - supportsViewMore
   - viewMoreUrl

This structure is ready for future parallel timing, retries, weighted progress, and caching.

## Extension model for adding a new vertical

In the normal case, adding a vertical should involve:

1. add config
2. add or reuse a query template key
3. add or reuse requested fields and entity types
4. add or reuse a rendering hint
5. optionally add a result normalizer or renderer registration if the result type is genuinely new

Core orchestrator changes should not be required for a standard vertical.

## Evolving query rules later

Query behavior now lives behind small builder services:

- `SearchQueryTemplateRegistry`
- `SearchFieldSelectionResolver`
- `SearchFilterComposer`
- `SearchRequestDescriptorBuilder`
- `GraphSearchRequestBodyBuilder`

This means future changes such as:

- different field sets
- extra filters
- template changes
- site scoping
- sort changes
- refiner placeholders

can be introduced without touching the UI and without pushing query logic into repositories.

## What is real now vs skeleton-only now

Implemented now:

- working dummy mode
- hybrid and real runtime composition seams
- real SharePoint config loading through `SharePointRestListClient`
- SharePoint config DTO, mapper, sanitization, and repository
- per-vertical mixed source routing
- Graph request/body builder
- real Graph client seam through SPFx
- one real Graph-backed vertical validation path
- sample Graph client for preview mode
- generic standard vertical execution pipeline
- metadata-driven synthetic aggregate pipeline
- preview harness
- config diagnostics store and console diagnostics
- test suites for core architecture seams

Still intentionally stubbed:

- telemetry
- caching
- infinite scroll / paging UI
- refiners
- per-section retry UX
- typeahead / auto-suggest

## Running hybrid mode in SPFx

Expected setup:

1. create or populate `SP_Search_Config` in the target SharePoint site
2. host the web part in SharePoint, not localhost
3. let the default host runtime select `hybrid` mode

In SharePoint-hosted runtime:

- config is loaded from the site list
- search remains dummy-backed
- diagnostics are disabled by default
- config fetch failures surface as explicit config errors rather than silently hiding the problem

## Running one real Graph-backed vertical

The first real Graph validation path is available in `real` mode.

Current behavior:

- `files` is routed to Graph
- all other verticals remain dummy-backed
- aggregate mode can include the real `files` section beside dummy sections

The Graph call path is:

1. vertical config resolves
2. request descriptor is built through the existing query/template/filter pipeline
3. `GraphSearchRequestBodyBuilder` creates the Graph payload
4. `GraphSpfxSearchClient` executes `/search/query`
5. `GraphSearchResultNormalizer` maps raw hits into normalized results
6. the routed repository returns the same `VerticalSearchResult` contract used by dummy sections

This keeps the UI source-agnostic.

## Onboarding a new vertical through SharePoint config

Normal onboarding flow:

1. add a new `SP_Search_Config` row with a stable `Key`
2. set `Kind`, `ResultType`, `TemplateKey`, `EntityTypes`, and field metadata
3. choose `LayoutRegion` and aggregate participation
4. set `SummarySize` and `DedicatedSize`
5. enable the row

In most cases that is enough.

Only add code when one of these is true:

- a truly new result type needs a new normalizer or presenter
- a new query template behavior is required
- a new transport/repository behavior is required

Core orchestration should not need to change for ordinary vertical onboarding.

## Onboarding the next Graph-backed vertical later

To move another vertical from dummy to Graph:

1. make sure its SharePoint config row has the right entity types, fields, template key, and filters
2. add a runtime `searchSourceOverrides` entry for that vertical key
3. if needed, add a new normalizer or rendering registration for a genuinely new result type

The orchestrator and presentation layer should not need to change.

## Test suites

Added durable tests for:

- URL state service
- SharePoint config mapper
- SharePoint config repository with mocked list client
- vertical config service
- request descriptor builder
- search orchestrator
- composition-root runtime wiring
- search source resolver
- mock HTTP search client
- dummy search repository
- Graph repository execution
- Graph result normalization

## Diagnostics

Config diagnostics are intentionally lightweight and non-visual.

The diagnostics store tracks:

- active runtime mode
- config source (`dummy`, `sharepoint`, or fallback path)
- loaded vertical keys
- selected default vertical
- rejected row count
- duplicate key collisions
- invalid keys
- selected search flow (`vertical` or `aggregate`)
- per-section search source (`dummy` or `graph`)
- whether Graph was used
- request duration
- transport source (`in-memory`, `mock-http`, or `graph`)
- normalized rejection counts for Graph hits
- section-level status and error category

When diagnostics are enabled, the host logs the snapshot through `console.table` so developers can validate SharePoint onboarding quickly without adding production UI noise.

## Graph failure behavior

Graph failures are localized intentionally.

Behavior:

- a dedicated Graph-backed vertical returns a section-level `error` result
- in aggregate mode, only that section fails
- dummy-backed sections continue rendering
- auth/request/response-shape failures are mapped to controlled user-facing messages
- raw Graph transport errors do not leak into React components

## Search interaction behavior

The current interaction contract is intentionally narrow:

- typing updates local query state only
- pressing Enter submits the current query
- clicking `Search` submits the current query
- changing the selected vertical reruns the current query when the query is non-empty
- no typeahead
- no auto-search while typing
- no suggestion dropdowns are part of the intended validation flow

## Dummy mode behavior

Dummy mode now behaves like a working mocked search experience:

- local typed mock data is served through the preview mock HTTP API
- aggregate mode renders grouped sections through the orchestrator
- dedicated vertical mode renders the selected vertical result list
- a small async delay is applied so loading states remain visible
- empty query keeps the page in its pre-search state
- any non-empty query returns the same vertical-local mock data set for now
- aggregate mode drives `SmartProgressBar`
- aggregate and dedicated sections render through `SmartLoadingContainer` / `SmartLoadingSection`

## Per-vertical presentation metadata

Vertical visual treatment remains config-driven.

Current presentation metadata includes:

- `iconName`
- `rendering.renderingHint`
- `rendering.sectionAccentTone`

That metadata flows from config through the application layer into the smart section shell, so section colors and presentation do not need to be hardcoded in the page components.
