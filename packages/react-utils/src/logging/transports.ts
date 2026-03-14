import { cloneValue } from "./internal.js";
import type { ConsoleTransportOptions, LogEvent, LogTransport, MemoryTransport } from "./types.js";

const defaultConsole = globalThis.console;

const getConsoleMethod = (
  event: LogEvent,
  consoleRef: NonNullable<ConsoleTransportOptions["console"]>
): ((...args: unknown[]) => void) => {
  if (event.error?.kind === "abort") {
    return consoleRef.debug ?? consoleRef.info ?? consoleRef.log ?? (() => undefined);
  }

  if (event.level === "trace" || event.level === "debug") {
    return consoleRef.debug ?? consoleRef.log ?? (() => undefined);
  }

  if (event.level === "info") {
    return consoleRef.info ?? consoleRef.log ?? (() => undefined);
  }

  if (event.level === "warn") {
    return consoleRef.warn ?? consoleRef.log ?? (() => undefined);
  }

  return consoleRef.error ?? consoleRef.log ?? (() => undefined);
};

const defaultFormatter = (
  event: LogEvent
): { summary: string; details: Record<string, unknown> } => {
  const summary = `[${event.level}] ${event.message}`;
  const details = {
    timestamp: event.timestamp,
    namespace: event.namespace,
    component: event.component,
    feature: event.feature,
    environment: event.environment,
    sourcePackage: event.sourcePackage,
    correlationId: event.correlationId,
    requestId: event.requestId,
    sessionId: event.sessionId,
    metadata: event.metadata,
    context: event.context,
    error: event.error
  };

  return { summary, details };
};

export const createConsoleTransport = (options: ConsoleTransportOptions = {}): LogTransport => {
  const consoleRef = options.console ?? defaultConsole;
  const formatter = options.format ?? defaultFormatter;

  return {
    emit(event: LogEvent): void {
      const method = getConsoleMethod(event, consoleRef);
      const formatted = formatter(event);
      method(formatted.summary, formatted.details);
    }
  };
};

export const createMemoryTransport = (): MemoryTransport => {
  const entries: LogEvent[] = [];

  return {
    emit(event: LogEvent): void {
      entries.push(cloneValue(event));
    },
    clear(): void {
      entries.length = 0;
    },
    getEvents(): readonly LogEvent[] {
      return entries.slice();
    },
    get events(): readonly LogEvent[] {
      return entries;
    }
  };
};
