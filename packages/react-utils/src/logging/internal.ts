export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const mergeRecords = (
  base?: Record<string, unknown>,
  override?: Record<string, unknown>
): Record<string, unknown> | undefined => {
  if (!base && !override) {
    return undefined;
  }

  return {
    ...(base ?? {}),
    ...(override ?? {})
  };
};

export const cloneValue = <T>(value: T, seen = new WeakMap<object, unknown>()): T => {
  if (!isRecord(value)) {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value) as T;
  }

  if (Array.isArray(value)) {
    const clone: unknown[] = [];
    seen.set(value, clone);
    value.forEach((entry) => {
      clone.push(cloneValue(entry, seen));
    });
    return clone as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  const clone: Record<string, unknown> = {};
  seen.set(value, clone);

  Object.entries(value).forEach(([key, entry]) => {
    clone[key] = cloneValue(entry, seen);
  });

  return clone as T;
};
