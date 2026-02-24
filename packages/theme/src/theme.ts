import { requiredSemanticTokenPaths, semanticTokens } from "@functions-oneui/tokens";

import { semanticPathToThemeKeyMap } from "./internal/mapping.js";
import { deepMerge, getByPath } from "./internal/object-utils.js";

type OneUIThemeMode = keyof typeof semanticTokens;
type SemanticTokenSet = (typeof semanticTokens)["light"];
type SemanticCategory = keyof SemanticTokenSet;
type UnknownRecord = Record<string, unknown>;

export type OneUIFluentTheme = Record<string, string | number>;
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends UnknownRecord ? DeepPartial<T[K]> : T[K];
};

export type CreateOneuiThemeOptions = {
  mode?: string;
  semanticTokens?: DeepPartial<SemanticTokenSet>;
  fluentTheme?: Partial<OneUIFluentTheme>;
};

const normalizeMode = (mode: string | undefined): OneUIThemeMode => {
  return mode === "dark" ? "dark" : "light";
};

const assertThemeValue = (value: unknown, keyName: string): string | number => {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  throw new Error(`Expected a string or number token value for '${keyName}'`);
};

const mapSemanticTokensToFluentTheme = (tokens: SemanticTokenSet): OneUIFluentTheme => {
  const mappedTheme: OneUIFluentTheme = {};

  for (const [category, mapping] of Object.entries(semanticPathToThemeKeyMap) as [
    SemanticCategory,
    Record<string, string>
  ][]) {
    const categoryTokens = tokens[category] as UnknownRecord;

    for (const [semanticPath, themeKey] of Object.entries(mapping)) {
      mappedTheme[themeKey] = assertThemeValue(
        getByPath(categoryTokens, semanticPath),
        `${String(category)}.${semanticPath}`
      );
    }
  }

  mappedTheme.spacingVerticalXXS = assertThemeValue(mappedTheme.spacingHorizontalXXS, "spacingVerticalXXS");
  mappedTheme.spacingVerticalXS = assertThemeValue(mappedTheme.spacingHorizontalXS, "spacingVerticalXS");
  mappedTheme.spacingVerticalS = assertThemeValue(mappedTheme.spacingHorizontalS, "spacingVerticalS");
  mappedTheme.spacingVerticalM = assertThemeValue(mappedTheme.spacingHorizontalM, "spacingVerticalM");
  mappedTheme.spacingVerticalL = assertThemeValue(mappedTheme.spacingHorizontalL, "spacingVerticalL");
  mappedTheme.spacingVerticalXL = assertThemeValue(mappedTheme.spacingHorizontalXL, "spacingVerticalXL");
  mappedTheme.spacingVerticalXXL = assertThemeValue(mappedTheme.spacingHorizontalXXL, "spacingVerticalXXL");
  mappedTheme.strokeWidthThick = assertThemeValue(tokens.shadows.focusRing, "shadows.focusRing");

  return mappedTheme;
};

const validateSemanticCoverage = (tokens: SemanticTokenSet, mode: OneUIThemeMode): void => {
  for (const [category, requiredPaths] of Object.entries(requiredSemanticTokenPaths) as [
    SemanticCategory,
    string[]
  ][]) {
    const categoryMap = semanticPathToThemeKeyMap[category] as Record<string, string> | undefined;
    const tokenCategory = tokens[category] as UnknownRecord;

    for (const requiredPath of requiredPaths) {
      const mappedThemeKey = categoryMap?.[requiredPath];

      if (!mappedThemeKey) {
        throw new Error(`Missing theme mapping for semantic token: ${String(category)}.${requiredPath}`);
      }

      const semanticValue = getByPath(tokenCategory, requiredPath);
      if (semanticValue === undefined) {
        throw new Error(`Missing semantic token value for ${mode}: ${String(category)}.${requiredPath}`);
      }
    }
  }
};

validateSemanticCoverage(semanticTokens.light, "light");
validateSemanticCoverage(semanticTokens.dark, "dark");

export const oneuiLightTheme: OneUIFluentTheme = mapSemanticTokensToFluentTheme(semanticTokens.light);
export const oneuiDarkTheme: OneUIFluentTheme = mapSemanticTokensToFluentTheme(semanticTokens.dark);

export const createOneuiTheme = (overrides: CreateOneuiThemeOptions = {}): OneUIFluentTheme => {
  const mode = normalizeMode(overrides.mode);
  const semanticOverrides = (overrides.semanticTokens ?? {}) as UnknownRecord;
  const fluentThemeOverrides = (overrides.fluentTheme ?? {}) as UnknownRecord;

  const baseSemanticTokens = mode === "dark" ? semanticTokens.dark : semanticTokens.light;
  const mergedSemanticTokens = deepMerge(baseSemanticTokens as UnknownRecord, semanticOverrides) as SemanticTokenSet;
  const mappedTheme = mapSemanticTokensToFluentTheme(mergedSemanticTokens);

  return deepMerge(mappedTheme as UnknownRecord, fluentThemeOverrides) as OneUIFluentTheme;
};

export const oneuiThemeModes = ["light", "dark"] as const;
export type { OneUIThemeMode, SemanticTokenSet };
export { semanticPathToThemeKeyMap };
