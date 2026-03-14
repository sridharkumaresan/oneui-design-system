import { useEffect } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createMemoryTransport } from "./transports.js";
import { createLogger } from "./createLogger.js";
import { LoggerProvider } from "./react/LoggerProvider.js";
import { useComponentLogger, useLogger } from "./react/hooks.js";

const Probe = (): null => {
  const logger = useLogger();

  useEffect(() => {
    logger.info("Provider hook event", {
      feature: "logging"
    });
  }, [logger]);

  return null;
};

const ComponentProbe = (): null => {
  const logger = useComponentLogger("HeroBanner", {
    namespace: "portal.home"
  });

  useEffect(() => {
    logger.info("Component hook event", {
      context: {
        slot: "lead"
      }
    });
  }, [logger]);

  return null;
};

describe("React logging integration", () => {
  it("provides the configured logger through context", () => {
    const transport = createMemoryTransport();
    const logger = createLogger({ transports: [transport] });

    render(
      <LoggerProvider logger={logger}>
        <Probe />
      </LoggerProvider>
    );

    expect(transport.getEvents()[0]).toEqual(
      expect.objectContaining({
        message: "Provider hook event",
        feature: "logging"
      })
    );
  });

  it("creates scoped component loggers", () => {
    const transport = createMemoryTransport();
    const logger = createLogger({ transports: [transport] });

    render(
      <LoggerProvider logger={logger}>
        <ComponentProbe />
      </LoggerProvider>
    );

    expect(transport.getEvents()[0]).toEqual(
      expect.objectContaining({
        namespace: "portal.home",
        component: "HeroBanner",
        context: {
          slot: "lead"
        }
      })
    );
  });
});
