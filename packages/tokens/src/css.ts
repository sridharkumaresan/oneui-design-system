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

    const stringValue = String(value);

    target[nextPrefix] = stringValue;
    target[toKebabCssVariableName(nextPrefix)] = stringValue;
  }
};

const toKebabCssVariableName = (name: string): string => {
  return name.replace(/([a-z0-9])([A-Z])/gu, "$1-$2").toLowerCase();
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
    const gradientName = `--${prefix}-gradient-${name}`;
    const gradientFallbackName = `--${prefix}-gradient-${name}-fallback`;

    cssVariables[gradientName] = gradient.css;
    cssVariables[toKebabCssVariableName(gradientName)] = gradient.css;
    cssVariables[gradientFallbackName] = gradient.fallbackSolidColor;
    cssVariables[toKebabCssVariableName(gradientFallbackName)] = gradient.fallbackSolidColor;
  }

  for (const [name, solid] of Object.entries(rawSolidTokens)) {
    const solidName = `--${prefix}-solid-${name}`;

    cssVariables[solidName] = solid.value;
    cssVariables[toKebabCssVariableName(solidName)] = solid.value;
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
