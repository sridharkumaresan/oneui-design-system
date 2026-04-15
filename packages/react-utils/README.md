# @functions-oneui/react-utils

React-focused utilities shared by OneUI packages.

## Image Loading

Reusable image lifecycle utilities are exposed from:

```ts
import { useImageLoader } from "@functions-oneui/react-utils";
// or
import { useImageLoader } from "@functions-oneui/react-utils/image-loading";
```

### Default behavior

- `empty` state when no `src` is provided
- `loading` while the current source is in flight
- optional `fallbackSrc` retry before surfacing `error`
- optional timeout handling
- `retry()` for consumers that need manual recovery
- width/height metadata when the image loads successfully

### Guidance

- Use the hook when you need a custom rendering experience.
- Use the higher-level `OneUIImage` atom from `@functions-oneui/atoms` for the common case.
- Keep image loading lazy where possible for large result sets.

## Progressive Loading

Shared contracts and helpers for coordinating multiple async sections are exposed from:

```ts
import {
  calculateProgressSummary,
  shouldMarkSectionDelayed,
  useLoadingCoordinator,
  useProgressiveLoading
} from "@functions-oneui/react-utils/progressive-loading";
```

### What belongs here

- generic loading contracts such as `LoadingStatus`, `LoadingSectionState`, and `LoadingProgressSummary`
- pure summary/delayed helpers
- generic React hooks for externally managed or loader-managed async coordination

### What does not belong here

- task-specific or search-specific types
- SPFx HTTP clients
- Graph or SharePoint SDK assumptions
- page layout or rendering decisions

### Architecture note

- Organisms render UI only and should receive status via props.
- `react-utils/progressive-loading` owns the generic contracts and orchestration helpers.
- Consumers own loader functions, retry behavior, data mapping, and final section body rendering.
- SPFx-specific fetching stays outside the reusable packages so the same primitives remain usable in ordinary React apps, internal portals, and future webparts.

### Externally managed state example

```ts
import {
  applyLoadingSectionUpdate,
  calculateProgressSummary,
  createLoadingCoordinatorState
} from "@functions-oneui/react-utils/progressive-loading";

const initialState = createLoadingCoordinatorState([
  { id: "news", title: "News" },
  { id: "people", title: "People" }
]);

const nextState = applyLoadingSectionUpdate(initialState, {
  id: "news",
  status: "success",
  count: 12
});

const progress = calculateProgressSummary(nextState.sections);
```

### Hook-managed state example

```tsx
import { useProgressiveLoading } from "@functions-oneui/react-utils/progressive-loading";

const loading = useProgressiveLoading({
  delayedThresholdMs: 1500,
  sections: [
    {
      id: "news",
      title: "News",
      loader: async ({ signal }) => {
        const response = await fetch("/api/news", { signal });
        return response.json();
      },
      getCount: (data) => data.items.length
    }
  ]
});
```

## Logging

Structured logging is exposed from the subpath import:

```ts
import {
  LoggerProvider,
  createConsoleTransport,
  createLogger,
  createMemoryTransport,
  createRedactionProcessor,
  useComponentLogger,
  useLogger
} from "@functions-oneui/react-utils/logging";
```

### Architecture

The logging subsystem is layered in two parts:

- Core: `createLogger`, log levels, structured events, child loggers, processors, transports, error normalization, redaction
- React: `LoggerProvider`, `useLogger`, `useComponentLogger`

The core logger does not depend on React. React integration only wraps a configured logger instance.

### Event model

Logs are normalized into structured events with fields such as:

- `timestamp`
- `level`
- `message`
- `namespace`
- `component`
- `feature`
- `metadata`
- `context`
- `environment`
- `sourcePackage`
- `correlationId`, `requestId`, `sessionId`
- `error`

### Basic usage

```ts
import {
  createConsoleTransport,
  createLogger,
  createRedactionProcessor
} from "@functions-oneui/react-utils/logging";

const logger = createLogger({
  level: "info",
  namespace: "oneui.portal",
  sourcePackage: "@functions-oneui/organism-hero-banner",
  transports: [createConsoleTransport()],
  processors: {
    redactors: [
      createRedactionProcessor({
        keys: ["authorization", "token"],
        paths: ["context.credentials.accessToken"]
      })
    ]
  }
});

logger.info("Hero banner rendered", {
  component: "HeroBanner",
  feature: "homepage",
  context: {
    slot: "lead"
  },
  metadata: {
    variant: "immersive"
  }
});
```

### Child loggers

Use `child()` to scope logs for a component, section, request, or feature.

```ts
const sectionLogger = logger.child({
  component: "SmartSection",
  requestId: "request-42",
  context: {
    sectionId: "recommended-links"
  }
});

sectionLogger.info("Section settled", {
  metadata: {
    status: "success"
  }
});
```

### Abort errors

Abort-style failures are normalized as `error.kind === "abort"`.

They are ignored by default so cancelled requests do not appear as ordinary errors. To capture them, opt in per logger or per call:

```ts
logger.warn("Request cancelled", {
  error: new DOMException("Aborted", "AbortError"),
  captureAbort: true
});
```

### React usage

```tsx
import {
  LoggerProvider,
  createConsoleTransport,
  createLogger,
  useComponentLogger
} from "@functions-oneui/react-utils/logging";

const appLogger = createLogger({
  namespace: "oneui.portal",
  transports: [createConsoleTransport()]
});

function HeroBanner(): JSX.Element {
  const logger = useComponentLogger("HeroBanner", {
    feature: "homepage"
  });

  return (
    <button
      onClick={() => {
        logger.info("CTA clicked", {
          metadata: {
            action: "open-directory"
          }
        });
      }}
    >
      Open directory
    </button>
  );
}

function App(): JSX.Element {
  return (
    <LoggerProvider logger={appLogger}>
      <HeroBanner />
    </LoggerProvider>
  );
}
```

### Testing

Use the memory transport directly, or the test harness helper.

```ts
import { createTestLogger } from "@functions-oneui/react-utils/logging";

const harness = createTestLogger({
  namespace: "test"
});

harness.logger.info("Rendered");
expect(harness.getEvents()).toHaveLength(1);
```

### Public API

The logging subpath exports:

- `createLogger`
- `createConsoleTransport`
- `createMemoryTransport`
- `createRedactionProcessor`
- `normalizeError`
- `LoggerProvider`
- `useLogger`
- `useComponentLogger`
- `createTestLogger`
- core logging types

The progressive-loading subpath exports:

- `LoadingStatus`
- `LoadingSectionState`
- `LoadingProgressSummary`
- `calculateProgressSummary`
- `shouldMarkSectionDelayed`
- `useLoadingCoordinator`
- `useProgressiveLoading`
