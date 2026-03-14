# @functions-oneui/react-utils

React-focused utilities shared by OneUI packages.

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
