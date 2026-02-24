type UnknownRecord = Record<string, unknown>;

const isPlainObject = (value: unknown): value is UnknownRecord => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

export const deepMerge = <T extends UnknownRecord>(
  base: T,
  overrides: UnknownRecord | undefined
): T => {
  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return (overrides === undefined ? base : overrides) as T;
  }

  const merged: UnknownRecord = { ...base };

  for (const [key, value] of Object.entries(overrides)) {
    const existing = merged[key];

    if (isPlainObject(value) && isPlainObject(existing)) {
      merged[key] = deepMerge(existing, value);
      continue;
    }

    merged[key] = value;
  }

  return merged as T;
};

export const getByPath = (source: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((value, segment) => {
    if (value && typeof value === "object" && segment in (value as UnknownRecord)) {
      return (value as UnknownRecord)[segment];
    }

    return undefined;
  }, source);
};
