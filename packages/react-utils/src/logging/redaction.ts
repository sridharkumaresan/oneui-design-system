import { isRecord } from "./internal.js";
import type { LogEvent, LogRedactionOptions, LogSerializer } from "./types.js";

const DEFAULT_REPLACEMENT = "[REDACTED]";

const redactValue = (
  value: unknown,
  currentPath: readonly string[],
  keySet: ReadonlySet<string>,
  pathSet: ReadonlySet<string>,
  replacement: string,
  seen = new WeakMap<object, unknown>()
): unknown => {
  if (!isRecord(value)) {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (Array.isArray(value)) {
    const clone: unknown[] = [];
    seen.set(value, clone);
    value.forEach((entry, index) => {
      clone.push(
        redactValue(entry, [...currentPath, String(index)], keySet, pathSet, replacement, seen)
      );
    });
    return clone;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  const clone: Record<string, unknown> = {};
  seen.set(value, clone);

  Object.entries(value).forEach(([key, entry]) => {
    const nextPath = [...currentPath, key];
    const fullPath = nextPath.join(".");
    const keyMatch = keySet.has(key.toLowerCase());
    const pathMatch = pathSet.has(fullPath);

    clone[key] =
      keyMatch || pathMatch
        ? replacement
        : redactValue(entry, nextPath, keySet, pathSet, replacement, seen);
  });

  return clone;
};

export const createRedactionProcessor = (options: LogRedactionOptions = {}): LogSerializer => {
  const keySet = new Set((options.keys ?? []).map((key) => key.toLowerCase()));
  const pathSet = new Set(options.paths ?? []);
  const replacement = options.replacement ?? DEFAULT_REPLACEMENT;

  return (event: LogEvent): LogEvent => {
    return redactValue(event, [], keySet, pathSet, replacement) as LogEvent;
  };
};
