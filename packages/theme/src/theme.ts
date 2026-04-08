import * as fluentReactComponents from "@fluentui/react-components";
import {
  oneuiFluentThemeOverrides,
  requiredSemanticTokenPaths,
  semanticTokens
} from "@functions-oneui/tokens";

import {
  applyFluidTypographyToTheme,
  normalizeFluidTypographySettings
} from "./internal/fluid-typography.js";
import { semanticPathToThemeKeyMap } from "./internal/mapping.js";
import { deepMerge, getByPath } from "./internal/object-utils.js";
import type {
  OneUIFluidTypographyScale,
  OneUIFluidTypographySettings
} from "./internal/fluid-typography.js";

type OneUIThemeMode = keyof typeof semanticTokens;
type OneUITypographyMode = "static" | "fluid";
type SemanticTokenSet = (typeof semanticTokens)["light"];
type SemanticCategory = keyof SemanticTokenSet;
type UnknownRecord = Record<string, unknown>;

export type OneUIFluentTheme = Record<string, string | number>;
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends UnknownRecord ? DeepPartial<T[K]> : T[K];
};

export type CreateOneuiThemeOptions = {
  fluidTypography?: OneUIFluidTypographySettings;
  mode?: string;
  semanticTokens?: DeepPartial<SemanticTokenSet>;
  fluentTheme?: Partial<OneUIFluentTheme>;
  typography?: {
    fluid?: boolean;
  };
  typographyMode?: OneUITypographyMode;
};

const normalizeMode = (mode: string | undefined): OneUIThemeMode => {
  return mode === "dark" ? "dark" : "light";
};

const normalizeTypographyMode = (
  typographyMode: OneUITypographyMode | undefined
): OneUITypographyMode => {
  return typographyMode === "fluid" ? "fluid" : "static";
};

const resolveFluidTypographyEnabled = (overrides: CreateOneuiThemeOptions): boolean => {
  if (typeof overrides.fluidTypography?.enabled === "boolean") {
    return overrides.fluidTypography.enabled;
  }

  if (typeof overrides.typography?.fluid === "boolean") {
    return overrides.typography.fluid;
  }

  return normalizeTypographyMode(overrides.typographyMode) === "fluid";
};

const getBaseFluentTheme = (mode: OneUIThemeMode): OneUIFluentTheme => {
  const fluentModule = fluentReactComponents as {
    webDarkTheme?: unknown;
    webLightTheme?: unknown;
    default?: {
      webDarkTheme?: unknown;
      webLightTheme?: unknown;
    };
  };
  const darkTheme = fluentModule.webDarkTheme ?? fluentModule.default?.webDarkTheme;
  const lightTheme = fluentModule.webLightTheme ?? fluentModule.default?.webLightTheme;
  const resolvedTheme = mode === "dark" ? darkTheme : lightTheme;

  if (!resolvedTheme || typeof resolvedTheme !== "object") {
    throw new Error(`Failed to resolve the base Fluent ${mode} theme`);
  }

  return resolvedTheme as OneUIFluentTheme;
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

  mappedTheme.spacingVerticalXXS = assertThemeValue(
    mappedTheme.spacingHorizontalXXS,
    "spacingVerticalXXS"
  );
  mappedTheme.spacingVerticalXS = assertThemeValue(
    mappedTheme.spacingHorizontalXS,
    "spacingVerticalXS"
  );
  mappedTheme.spacingVerticalS = assertThemeValue(
    mappedTheme.spacingHorizontalS,
    "spacingVerticalS"
  );
  mappedTheme.spacingVerticalM = assertThemeValue(
    mappedTheme.spacingHorizontalM,
    "spacingVerticalM"
  );
  mappedTheme.spacingVerticalL = assertThemeValue(
    mappedTheme.spacingHorizontalL,
    "spacingVerticalL"
  );
  mappedTheme.spacingVerticalXL = assertThemeValue(
    mappedTheme.spacingHorizontalXL,
    "spacingVerticalXL"
  );
  mappedTheme.spacingVerticalXXL = assertThemeValue(
    mappedTheme.spacingHorizontalXXL,
    "spacingVerticalXXL"
  );
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
        throw new Error(
          `Missing theme mapping for semantic token: ${String(category)}.${requiredPath}`
        );
      }

      const semanticValue = getByPath(tokenCategory, requiredPath);
      if (semanticValue === undefined) {
        throw new Error(
          `Missing semantic token value for ${mode}: ${String(category)}.${requiredPath}`
        );
      }
    }
  }
};

validateSemanticCoverage(semanticTokens.light, "light");
validateSemanticCoverage(semanticTokens.dark, "dark");

export const oneuiLightTheme: OneUIFluentTheme = deepMerge(
  deepMerge(
    getBaseFluentTheme("light"),
    oneuiFluentThemeOverrides.light as UnknownRecord
  ) as OneUIFluentTheme,
  mapSemanticTokensToFluentTheme(semanticTokens.light) as UnknownRecord
) as OneUIFluentTheme;
export const oneuiDarkTheme: OneUIFluentTheme = deepMerge(
  deepMerge(
    getBaseFluentTheme("dark"),
    oneuiFluentThemeOverrides.dark as UnknownRecord
  ) as OneUIFluentTheme,
  mapSemanticTokensToFluentTheme(semanticTokens.dark) as UnknownRecord
) as OneUIFluentTheme;

export const createOneuiTheme = (overrides: CreateOneuiThemeOptions = {}): OneUIFluentTheme => {
  const mode = normalizeMode(overrides.mode);
  const fluidTypography = normalizeFluidTypographySettings({
    ...(overrides.fluidTypography ?? {}),
    enabled: resolveFluidTypographyEnabled(overrides)
  });
  const semanticOverrides = (overrides.semanticTokens ?? {}) as UnknownRecord;
  const fluentThemeOverrides = (overrides.fluentTheme ?? {}) as UnknownRecord;

  const baseSemanticTokens = mode === "dark" ? semanticTokens.dark : semanticTokens.light;
  const mergedSemanticTokens = deepMerge(
    baseSemanticTokens as UnknownRecord,
    semanticOverrides
  ) as SemanticTokenSet;
  const mappedTheme = mapSemanticTokensToFluentTheme(mergedSemanticTokens);
  const baseFluentTheme = deepMerge(
    getBaseFluentTheme(mode) as UnknownRecord,
    oneuiFluentThemeOverrides[mode] as UnknownRecord
  );
  const resolvedTheme = deepMerge(baseFluentTheme as UnknownRecord, mappedTheme as UnknownRecord);
  const themeWithOverrides = deepMerge(
    resolvedTheme as UnknownRecord,
    fluentThemeOverrides
  ) as OneUIFluentTheme;

  return applyFluidTypographyToTheme(themeWithOverrides, fluidTypography);
};

export const oneuiThemeModes = ["light", "dark"] as const;
export type {
  OneUIFluidTypographyScale,
  OneUIFluidTypographySettings,
  OneUIThemeMode,
  OneUITypographyMode,
  SemanticTokenSet
};
export { semanticPathToThemeKeyMap };
