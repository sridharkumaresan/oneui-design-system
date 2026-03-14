import { normalizeError } from "./errors.js";
import { mergeRecords } from "./internal.js";
import { isLevelEnabled } from "./levels.js";
import type {
  LogEvent,
  LogInput,
  LogLevel,
  Logger,
  LoggerBindings,
  LoggerOptions,
  LoggerProcessors,
  LogSerializer,
  LogTransport
} from "./types.js";

interface LoggerState {
  level: LogLevel;
  transports: readonly LogTransport[];
  processors: Required<LoggerProcessors>;
  captureAbortErrors: boolean;
}

const mergeBindings = (base?: LoggerBindings, override?: LoggerBindings): LoggerBindings => {
  return {
    namespace: override?.namespace ?? base?.namespace,
    component: override?.component ?? base?.component,
    feature: override?.feature ?? base?.feature,
    environment: override?.environment ?? base?.environment,
    sourcePackage: override?.sourcePackage ?? base?.sourcePackage,
    correlationId: override?.correlationId ?? base?.correlationId,
    requestId: override?.requestId ?? base?.requestId,
    sessionId: override?.sessionId ?? base?.sessionId,
    metadata: mergeRecords(base?.metadata, override?.metadata),
    context: mergeRecords(base?.context, override?.context)
  };
};

const mergeEvent = (event: LogEvent, addition: Partial<LogEvent>): LogEvent => {
  return {
    ...event,
    ...addition,
    metadata: mergeRecords(event.metadata, addition.metadata),
    context: mergeRecords(event.context, addition.context)
  };
};

const createProcessors = (processors?: LoggerProcessors): Required<LoggerProcessors> => {
  return {
    enrichers: [...(processors?.enrichers ?? [])],
    filters: [...(processors?.filters ?? [])],
    serializers: [...(processors?.serializers ?? [])],
    redactors: [...(processors?.redactors ?? [])]
  };
};

const runSerializers = (event: LogEvent, serializers: readonly LogSerializer[]): LogEvent => {
  return serializers.reduce((currentEvent, serializer) => {
    return serializer(currentEvent);
  }, event);
};

const runProcessors = (
  event: LogEvent,
  processors: Required<LoggerProcessors>
): LogEvent | null => {
  try {
    let currentEvent = event;

    processors.enrichers.forEach((enricher) => {
      const addition = enricher(currentEvent);
      if (addition) {
        currentEvent = mergeEvent(currentEvent, addition);
      }
    });

    const shouldKeep = processors.filters.every((filter) => filter(currentEvent));
    if (!shouldKeep) {
      return null;
    }

    currentEvent = runSerializers(currentEvent, processors.serializers);
    currentEvent = runSerializers(currentEvent, processors.redactors);

    return currentEvent;
  } catch {
    return null;
  }
};

const emitEvent = (event: LogEvent, transports: readonly LogTransport[]): void => {
  transports.forEach((transport) => {
    try {
      transport.emit(event);
    } catch {
      return;
    }
  });
};

const createScopedLogger = (state: LoggerState, bindings: LoggerBindings): Logger => {
  const log = (level: LogLevel, message: string, input?: LogInput): LogEvent | null => {
    if (!isLevelEnabled(level, state.level)) {
      return null;
    }

    const eventBindings = mergeBindings(bindings, input);
    const error = normalizeError(input?.error);
    const captureAbort = input?.captureAbort ?? state.captureAbortErrors;

    if (error?.kind === "abort" && !captureAbort) {
      return null;
    }

    const event: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      message,
      namespace: eventBindings.namespace,
      component: eventBindings.component,
      feature: eventBindings.feature,
      environment: eventBindings.environment,
      sourcePackage: eventBindings.sourcePackage,
      correlationId: eventBindings.correlationId,
      requestId: eventBindings.requestId,
      sessionId: eventBindings.sessionId,
      metadata: eventBindings.metadata,
      context: eventBindings.context,
      error
    };

    const processedEvent = runProcessors(event, state.processors);
    if (!processedEvent) {
      return null;
    }

    emitEvent(processedEvent, state.transports);
    return processedEvent;
  };

  return {
    get level(): LogLevel {
      return state.level;
    },
    isLevelEnabled(level: LogLevel): boolean {
      return isLevelEnabled(level, state.level);
    },
    log,
    trace(message: string, input?: LogInput): LogEvent | null {
      return log("trace", message, input);
    },
    debug(message: string, input?: LogInput): LogEvent | null {
      return log("debug", message, input);
    },
    info(message: string, input?: LogInput): LogEvent | null {
      return log("info", message, input);
    },
    warn(message: string, input?: LogInput): LogEvent | null {
      return log("warn", message, input);
    },
    error(message: string, input?: LogInput): LogEvent | null {
      return log("error", message, input);
    },
    fatal(message: string, input?: LogInput): LogEvent | null {
      return log("fatal", message, input);
    },
    child(childBindings?: LoggerBindings): Logger {
      return createScopedLogger(state, mergeBindings(bindings, childBindings));
    }
  };
};

export const createLogger = (options: LoggerOptions = {}): Logger => {
  const state: LoggerState = {
    level: options.level ?? "info",
    transports: [...(options.transports ?? [])],
    processors: createProcessors(options.processors),
    captureAbortErrors: options.captureAbortErrors ?? false
  };

  return createScopedLogger(state, mergeBindings(undefined, options));
};
