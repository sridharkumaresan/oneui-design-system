export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export interface LoggerBindings {
  namespace?: string;
  component?: string;
  feature?: string;
  environment?: string;
  sourcePackage?: string;
  correlationId?: string;
  requestId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface NormalizedLogError {
  kind: "error" | "dom" | "abort" | "unknown";
  name: string;
  message: string;
  stack?: string;
  code?: string;
  details?: Record<string, unknown>;
  cause?: NormalizedLogError;
}

export interface LogEvent extends LoggerBindings {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: NormalizedLogError;
}

export interface LogInput extends LoggerBindings {
  error?: unknown;
  captureAbort?: boolean;
}

export type LogEnricher = (event: LogEvent) => Partial<LogEvent> | void;
export type LogFilter = (event: LogEvent) => boolean;
export type LogSerializer = (event: LogEvent) => LogEvent;

export interface LoggerProcessors {
  enrichers?: readonly LogEnricher[];
  filters?: readonly LogFilter[];
  serializers?: readonly LogSerializer[];
  redactors?: readonly LogSerializer[];
}

export interface LogTransport {
  emit(event: LogEvent): void;
  flush?(): Promise<void>;
}

export interface MemoryTransport extends LogTransport {
  readonly events: readonly LogEvent[];
  clear(): void;
  getEvents(): readonly LogEvent[];
}

export interface LogRedactionOptions {
  keys?: readonly string[];
  paths?: readonly string[];
  replacement?: string;
}

export interface ConsoleTransportOptions {
  console?: {
    debug?: (...args: unknown[]) => void;
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
    log?: (...args: unknown[]) => void;
  };
  format?: (event: LogEvent) => {
    summary: string;
    details?: Record<string, unknown>;
  };
}

export interface LoggerOptions extends LoggerBindings {
  level?: LogLevel;
  transports?: readonly LogTransport[];
  processors?: LoggerProcessors;
  captureAbortErrors?: boolean;
}

export interface Logger {
  readonly level: LogLevel;
  isLevelEnabled(level: LogLevel): boolean;
  log(level: LogLevel, message: string, input?: LogInput): LogEvent | null;
  trace(message: string, input?: LogInput): LogEvent | null;
  debug(message: string, input?: LogInput): LogEvent | null;
  info(message: string, input?: LogInput): LogEvent | null;
  warn(message: string, input?: LogInput): LogEvent | null;
  error(message: string, input?: LogInput): LogEvent | null;
  fatal(message: string, input?: LogInput): LogEvent | null;
  child(bindings?: LoggerBindings): Logger;
}

export interface TestLoggerHarness {
  logger: Logger;
  transport: MemoryTransport;
  getEvents(): readonly LogEvent[];
  clear(): void;
}
