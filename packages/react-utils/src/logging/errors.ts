import { cloneValue, isRecord } from "./internal.js";
import type { NormalizedLogError } from "./types.js";

const NON_ERROR_NAME = "NonErrorThrow";
const MAX_DETAIL_DEPTH = 3;

const getStringValue = (value: Record<string, unknown>, key: string): string | undefined => {
  const candidate = value[key];
  return typeof candidate === "string" ? candidate : undefined;
};

const getRecordValue = (
  value: Record<string, unknown>,
  key: string
): Record<string, unknown> | undefined => {
  const candidate = value[key];
  return isRecord(candidate) ? candidate : undefined;
};

const isDomException = (value: unknown): value is DOMException => {
  return typeof DOMException !== "undefined" && value instanceof DOMException;
};

export const isAbortError = (value: unknown): boolean => {
  if (isDomException(value)) {
    return value.name === "AbortError";
  }

  if (!isRecord(value)) {
    return false;
  }

  return (
    getStringValue(value, "name") === "AbortError" || getStringValue(value, "code") === "ABORT_ERR"
  );
};

const snapshotValue = (
  value: unknown,
  depth = 0,
  seen = new WeakMap<object, unknown>()
): unknown => {
  if (!isRecord(value)) {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  if (depth >= MAX_DETAIL_DEPTH) {
    return Array.isArray(value) ? "[Array]" : "[Object]";
  }

  seen.set(value, true);

  if (Array.isArray(value)) {
    return value.map((entry) => snapshotValue(entry, depth + 1, seen));
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const snapshot: Record<string, unknown> = {};
  Object.entries(value).forEach(([key, entry]) => {
    if (key === "cause") {
      return;
    }

    snapshot[key] = snapshotValue(entry, depth + 1, seen);
  });

  return snapshot;
};

const normalizeCause = (
  value: unknown,
  seen = new WeakMap<object, NormalizedLogError>()
): NormalizedLogError | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  const normalized = normalizeError(value, seen);
  if (!normalized) {
    return undefined;
  }

  seen.set(value, normalized);
  return normalized;
};

export const normalizeError = (
  value: unknown,
  seen = new WeakMap<object, NormalizedLogError>()
): NormalizedLogError | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (value instanceof Error || isDomException(value)) {
    const errorLike = value as Error;
    const normalized: NormalizedLogError = {
      kind: isAbortError(errorLike) ? "abort" : isDomException(errorLike) ? "dom" : "error",
      name: errorLike.name || errorLike.constructor.name || "Error",
      message: errorLike.message || "Unknown error",
      stack: typeof errorLike.stack === "string" ? errorLike.stack : undefined
    };

    if (isRecord(errorLike) && typeof errorLike.code === "string") {
      normalized.code = errorLike.code;
    }

    const details = snapshotValue(errorLike);
    if (isRecord(details) && Object.keys(details).length > 0) {
      normalized.details = details;
    }

    if (isRecord(errorLike) && "cause" in errorLike) {
      normalized.cause = normalizeCause(errorLike.cause, seen);
    }

    return normalized;
  }

  if (typeof value === "string") {
    return {
      kind: "unknown",
      name: NON_ERROR_NAME,
      message: value
    };
  }

  if (!isRecord(value)) {
    return {
      kind: "unknown",
      name: NON_ERROR_NAME,
      message: String(value)
    };
  }

  const normalized: NormalizedLogError = {
    kind: isAbortError(value) ? "abort" : "unknown",
    name: getStringValue(value, "name") ?? NON_ERROR_NAME,
    message: getStringValue(value, "message") ?? "Unknown thrown value"
  };

  const code = getStringValue(value, "code");
  if (code) {
    normalized.code = code;
  }

  const stack = getStringValue(value, "stack");
  if (stack) {
    normalized.stack = stack;
  }

  const details = snapshotValue(cloneValue(value));
  if (isRecord(details) && Object.keys(details).length > 0) {
    normalized.details = details;
  }

  const cause = getRecordValue(value, "cause");
  if (cause) {
    normalized.cause = normalizeCause(cause, seen);
  }

  return normalized;
};
