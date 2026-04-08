# Progressive Loading Architecture

## Responsibilities

### Organisms

`@functions-oneui/organism-smart-progress-bar`

- renders aggregate progress and source status chips
- accepts only props
- knows nothing about loaders, task shapes, or SPFx
- should feel embedded in a page rather than like a self-contained dashboard widget

`@functions-oneui/organism-smart-loading-container`

- renders reusable section shells and state visuals
- accepts only props and arbitrary children
- does not fetch data
- should remain generic across search, task, approvals, and rail-style layouts

### React Utils

`@functions-oneui/react-utils/progressive-loading`

- defines shared contracts
- calculates aggregate progress
- provides delayed-state helper logic
- offers hooks for externally managed or loader-managed coordination

### Consumers Own

- API clients and loader functions
- SharePoint, Graph, REST, or enterprise API specifics
- data mapping and domain-specific rendering
- retry policies and page-level orchestration
- final decisions about layout density, ordering, and actions

## Why SPFx Fetching Stays Outside

SPFx webparts have tenant-specific HTTP, authentication, and lifecycle concerns. Keeping that logic outside the reusable packages preserves:

- reuse across non-SPFx React apps
- testability of shared packages
- predictable dependency boundaries
- easier maintenance when SharePoint-specific APIs evolve
