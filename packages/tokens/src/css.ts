import { rawGradientTokens } from "./gradients.js";
import { oneuiFluentThemeOverrides } from "./fluent.js";
import { rawSolidTokens } from "./solids.js";
import { semanticTokens } from "./tokens.js";

type UnknownRecord = Record<string, unknown>;

export type CreateOneuiCssVariablesOptions = {
  mode?: "light" | "dark";
  prefix?: string;
};

const flatten = (
  source: UnknownRecord,
  prefix: string,
  target: Record<string, string>
): void => {
  for (const [key, value] of Object.entries(source)) {
    const nextPrefix = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value as UnknownRecord, nextPrefix, target);
      continue;
    }

    target[nextPrefix] = String(value);
  }
};

const normalizeMode = (mode: CreateOneuiCssVariablesOptions["mode"]): "light" | "dark" => {
  return mode === "dark" ? "dark" : "light";
};

export const createOneuiCssVariables = (
  options: CreateOneuiCssVariablesOptions = {}
): Record<string, string> => {
  const mode = normalizeMode(options.mode);
  const prefix = options.prefix ?? "oneui";
  const cssVariables: Record<string, string> = {};

  flatten(
    semanticTokens[mode] as unknown as UnknownRecord,
    `--${prefix}`,
    cssVariables
  );
  flatten(
    oneuiFluentThemeOverrides[mode] as unknown as UnknownRecord,
    `--${prefix}-fluent`,
    cssVariables
  );

  for (const [name, gradient] of Object.entries(rawGradientTokens)) {
    cssVariables[`--${prefix}-gradient-${name}`] = gradient.css;
    cssVariables[`--${prefix}-gradient-${name}-fallback`] = gradient.fallbackSolidColor;
  }

  for (const [name, solid] of Object.entries(rawSolidTokens)) {
    cssVariables[`--${prefix}-solid-${name}`] = solid.value;
  }

  return cssVariables;
};

export const createOneuiCssVariablesStylesheet = (
  options: CreateOneuiCssVariablesOptions = {}
): string => {
  const variables = createOneuiCssVariables(options);
  const declarations = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`);

  return `:root {\n${declarations.join("\n")}\n}`;
};
