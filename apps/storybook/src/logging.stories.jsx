import React, { useMemo, useState } from "react";

import { Button, useFluent } from "@fluentui/react-components";
import {
  LoggerProvider,
  createLogger,
  createMemoryTransport,
  createRedactionProcessor,
  useComponentLogger,
  useLogger
} from "@functions-oneui/react-utils/logging";

const providerSetupCode = `
import {
  LoggerProvider,
  createConsoleTransport,
  createLogger,
  createRedactionProcessor
} from "@functions-oneui/react-utils/logging";

const logger = createLogger({
  level: "info",
  namespace: "oneui.portal",
  sourcePackage: "@functions-oneui/spfx-homepage",
  transports: [createConsoleTransport()],
  processors: {
    redactors: [
      createRedactionProcessor({
        keys: ["authorization", "token", "cookie"]
      })
    ]
  }
});

export function App(): JSX.Element {
  return (
    <LoggerProvider logger={logger}>
      <HomePage />
    </LoggerProvider>
  );
}
`.trim();

const testingCode = `
import { createTestLogger } from "@functions-oneui/react-utils/logging";

const harness = createTestLogger({
  namespace: "oneui.tests"
});

harness.logger.info("Hero banner rendered", {
  component: "HeroBanner"
});

expect(harness.getEvents()).toEqual([
  expect.objectContaining({
    message: "Hero banner rendered",
    component: "HeroBanner"
  })
]);
`.trim();

const DemoPanel = ({ events, onRefresh, onReset }) => {
  const fluent = useFluent();
  const theme = fluent.theme;
  const logger = useLogger();
  const componentLogger = useComponentLogger("LoggingShowcase", {
    namespace: "storybook.foundation",
    feature: "logging-demo",
    sourcePackage: "@functions-oneui/storybook"
  });

  const surfaceStyle = {
    background: theme?.colorNeutralBackground1,
    border: `1px solid ${theme?.colorNeutralStroke1 ?? "currentColor"}`,
    borderRadius: theme?.borderRadiusLarge,
    color: theme?.colorNeutralForeground1,
    boxShadow: theme?.shadow4,
    display: "grid",
    gap: theme?.spacingVerticalL ?? "1rem",
    padding: theme?.spacingHorizontalXL ?? "1.5rem",
    width: "min(100%, 1100px)"
  };

  const mutedStyle = {
    color: theme?.colorNeutralForeground3,
    margin: 0,
    lineHeight: 1.5
  };

  const sectionStyle = {
    display: "grid",
    gap: theme?.spacingVerticalM ?? "0.75rem"
  };

  const codeStyle = {
    background: theme?.colorNeutralBackground2,
    border: `1px solid ${theme?.colorNeutralStroke2 ?? "currentColor"}`,
    borderRadius: theme?.borderRadiusMedium,
    color: theme?.colorNeutralForeground2,
    fontFamily: theme?.fontFamilyMonospace,
    fontSize: theme?.fontSizeBase200,
    margin: 0,
    maxHeight: "26rem",
    overflow: "auto",
    padding: theme?.spacingHorizontalL ?? "1rem",
    whiteSpace: "pre-wrap"
  };

  const buttonRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: theme?.spacingHorizontalM ?? "0.75rem"
  };

  const listLabelStyle = {
    alignItems: "center",
    display: "flex",
    gap: theme?.spacingHorizontalS ?? "0.5rem",
    justifyContent: "space-between"
  };

  const emitInfo = () => {
    componentLogger.info("Demo info event", {
      metadata: {
        action: "preview-info",
        variant: "default"
      }
    });
    onRefresh();
  };

  const emitWarn = () => {
    componentLogger.warn("Demo warning event", {
      context: {
        sectionId: "logging-overview"
      },
      metadata: {
        status: "degraded"
      }
    });
    onRefresh();
  };

  const emitError = () => {
    componentLogger.error("Demo error event", {
      error: new Error("Simulated failure"),
      metadata: {
        action: "sync-content"
      }
    });
    onRefresh();
  };

  const emitScoped = () => {
    logger
      .child({
        component: "SmartSection",
        requestId: `request-${events.length + 1}`,
        context: {
          sectionId: "recommended-links"
        }
      })
      .info("Section settled", {
        metadata: {
          status: "success",
          itemCount: 6,
          token: "sensitive-demo-value"
        }
      });
    onRefresh();
  };

  const emitIgnoredAbort = () => {
    componentLogger.warn("Ignored abort event", {
      error: new DOMException("The operation was aborted.", "AbortError")
    });
    onRefresh();
  };

  const emitCapturedAbort = () => {
    componentLogger.warn("Captured abort event", {
      captureAbort: true,
      error: new DOMException("The operation was aborted.", "AbortError")
    });
    onRefresh();
  };

  return (
    <div style={surfaceStyle}>
      <div style={sectionStyle}>
        <div style={listLabelStyle}>
          <div>
            <h2 style={{ color: theme?.colorNeutralForeground1, margin: 0 }}>Structured Logging</h2>
            <p style={mutedStyle}>
              This demo uses a memory transport so emitted events stay visible inside Storybook.
              Root applications should usually add a console or telemetry transport as well.
            </p>
          </div>
          <Button appearance="secondary" onClick={onReset}>
            Clear events
          </Button>
        </div>

        <div style={buttonRowStyle}>
          <Button appearance="primary" onClick={emitInfo}>
            Emit info
          </Button>
          <Button appearance="secondary" onClick={emitWarn}>
            Emit warn
          </Button>
          <Button appearance="secondary" onClick={emitError}>
            Emit error
          </Button>
          <Button appearance="secondary" onClick={emitScoped}>
            Emit child logger event
          </Button>
          <Button appearance="secondary" onClick={emitIgnoredAbort}>
            Abort ignored by default
          </Button>
          <Button appearance="secondary" onClick={emitCapturedAbort}>
            Capture abort explicitly
          </Button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={listLabelStyle}>
          <h3 style={{ color: theme?.colorNeutralForeground1, margin: 0 }}>Captured events</h3>
          <span style={mutedStyle}>{events.length} event(s)</span>
        </div>
        <pre style={codeStyle}>{JSON.stringify(events, null, 2)}</pre>
      </div>

      <div style={{ ...sectionStyle, gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))" }}>
        <div style={sectionStyle}>
          <h3 style={{ color: theme?.colorNeutralForeground1, margin: 0 }}>App setup</h3>
          <pre style={codeStyle}>{providerSetupCode}</pre>
        </div>
        <div style={sectionStyle}>
          <h3 style={{ color: theme?.colorNeutralForeground1, margin: 0 }}>Testing pattern</h3>
          <pre style={codeStyle}>{testingCode}</pre>
        </div>
      </div>
    </div>
  );
};

const LoggingShowcase = () => {
  const [revision, setRevision] = useState(0);
  const [{ logger, transport }] = useState(() => {
    const memoryTransport = createMemoryTransport();
    const storyLogger = createLogger({
      level: "trace",
      namespace: "storybook.foundation",
      environment: "storybook",
      sourcePackage: "@functions-oneui/storybook",
      transports: [memoryTransport],
      processors: {
        redactors: [
          createRedactionProcessor({
            keys: ["token", "authorization"],
            paths: ["context.credentials.accessToken"]
          })
        ]
      }
    });

    return {
      logger: storyLogger,
      transport: memoryTransport
    };
  });

  const events = useMemo(() => {
    return transport
      .getEvents()
      .map((event) => ({
        timestamp: event.timestamp,
        level: event.level,
        message: event.message,
        namespace: event.namespace,
        component: event.component,
        feature: event.feature,
        requestId: event.requestId,
        metadata: event.metadata,
        context: event.context,
        error: event.error
      }))
      .reverse();
  }, [revision, transport]);

  const refresh = () => {
    setRevision((value) => value + 1);
  };

  const reset = () => {
    transport.clear();
    refresh();
  };

  return (
    <LoggerProvider logger={logger}>
      <DemoPanel events={events} onRefresh={refresh} onReset={reset} />
    </LoggerProvider>
  );
};

const meta = {
  title: "Foundation/Logging",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Logging should be documented as a foundation concern. Use LoggerProvider at the application or web part root, then use scoped child loggers or useComponentLogger inside organisms and app surfaces."
      },
      source: {
        code: providerSetupCode,
        language: "tsx"
      }
    }
  }
};

export default meta;

export const InteractiveDemo = {
  parameters: {
    docs: {
      description: {
        story:
          "The memory transport keeps logs visible in Storybook. Notice that abort errors are ignored by default, while scoped child logger events inherit namespace and request context."
      }
    }
  },
  render: () => {
    return <LoggingShowcase />;
  }
};
