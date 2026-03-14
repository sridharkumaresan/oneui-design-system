import { describe, expect, it, vi } from "vitest";

import { createLogger } from "./createLogger.js";
import { createRedactionProcessor } from "./redaction.js";
import { createConsoleTransport, createMemoryTransport } from "./transports.js";

describe("createLogger", () => {
  it("filters events below the configured minimum level", () => {
    const transport = createMemoryTransport();
    const logger = createLogger({
      level: "warn",
      transports: [transport]
    });

    expect(logger.info("Ignored event")).toBeNull();
    expect(logger.error("Captured event")).toEqual(
      expect.objectContaining({
        level: "error",
        message: "Captured event"
      })
    );
    expect(transport.getEvents()).toHaveLength(1);
  });

  it("inherits and merges child logger bindings", () => {
    const transport = createMemoryTransport();
    const logger = createLogger({
      namespace: "oneui",
      sourcePackage: "@functions-oneui/organism-action-panel",
      context: { tenant: "alpha" },
      metadata: { app: "portal" },
      transports: [transport]
    });

    const child = logger.child({
      component: "ActionPanel",
      requestId: "request-1",
      context: { sectionId: "hero" },
      metadata: { surface: "home" }
    });

    child.info("Panel rendered", {
      context: { state: "ready" },
      metadata: { attempt: 1 }
    });

    expect(transport.getEvents()[0]).toEqual(
      expect.objectContaining({
        namespace: "oneui",
        component: "ActionPanel",
        sourcePackage: "@functions-oneui/organism-action-panel",
        requestId: "request-1",
        context: {
          tenant: "alpha",
          sectionId: "hero",
          state: "ready"
        },
        metadata: {
          app: "portal",
          surface: "home",
          attempt: 1
        }
      })
    );
  });

  it("does not log abort errors unless explicitly enabled", () => {
    const transport = createMemoryTransport();
    const logger = createLogger({ transports: [transport] });
    const abortError = new DOMException("The operation was aborted.", "AbortError");

    expect(logger.error("Fetch aborted", { error: abortError })).toBeNull();
    expect(transport.getEvents()).toHaveLength(0);

    const captured = logger.error("Fetch aborted", {
      error: abortError,
      captureAbort: true
    });

    expect(captured).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          kind: "abort",
          name: "AbortError"
        })
      })
    );
    expect(transport.getEvents()).toHaveLength(1);
  });

  it("applies redaction processors before emitting events", () => {
    const transport = createMemoryTransport();
    const logger = createLogger({
      transports: [transport],
      processors: {
        redactors: [
          createRedactionProcessor({
            keys: ["authorization"],
            paths: ["context.credentials.token"]
          })
        ]
      }
    });

    logger.info("Secure event", {
      metadata: {
        authorization: "Bearer abc",
        visible: true
      },
      context: {
        credentials: {
          token: "secret-value",
          label: "demo"
        }
      }
    });

    expect(transport.getEvents()[0]).toEqual(
      expect.objectContaining({
        metadata: {
          authorization: "[REDACTED]",
          visible: true
        },
        context: {
          credentials: {
            token: "[REDACTED]",
            label: "demo"
          }
        }
      })
    );
  });

  it("stores captured events immutably in memory transport", () => {
    const transport = createMemoryTransport();
    const logger = createLogger({ transports: [transport] });
    const metadata = {
      nested: {
        state: "initial"
      }
    };

    logger.info("Immutable event", { metadata });
    metadata.nested.state = "mutated";

    expect(transport.getEvents()[0].metadata).toEqual({
      nested: {
        state: "initial"
      }
    });
  });

  it("writes structured output through the console transport", () => {
    const debug = vi.fn();
    const info = vi.fn();
    const warn = vi.fn();
    const error = vi.fn();

    const logger = createLogger({
      transports: [
        createConsoleTransport({
          console: {
            debug,
            info,
            warn,
            error,
            log: vi.fn()
          }
        })
      ]
    });

    logger.error("Boom", { error: new Error("kaboom") });

    expect(error).toHaveBeenCalledWith(
      "[error] Boom",
      expect.objectContaining({
        error: expect.objectContaining({
          kind: "error",
          message: "kaboom"
        })
      })
    );
    expect(info).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(debug).not.toHaveBeenCalled();
  });
});
