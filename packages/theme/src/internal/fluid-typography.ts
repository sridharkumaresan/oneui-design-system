import { oneuiBreakpoints } from "@functions-oneui/tokens";

import type { OneUIFluentTheme } from "../theme.js";

export const oneuiFluidTypographySlots = [
  "fontSizeBase100",
  "fontSizeBase200",
  "fontSizeBase300",
  "fontSizeBase400",
  "fontSizeBase500",
  "fontSizeBase600",
  "fontSizeHero700",
  "fontSizeHero800"
] as const;

export const oneuiFluidTypographyViewportVar = "--oneui-fluid-viewport-width";

export type OneUIFluidTypographyScale = "compact" | "comfortable" | "expressive";

export type OneUIFluidTypographySettings = {
  enabled?: boolean;
  minViewport?: number;
  maxViewport?: number;
  scale?: OneUIFluidTypographyScale;
};

type ResolvedOneUIFluidTypographySettings = {
  enabled: boolean;
  maxViewport: number;
  minViewport: number;
  scale: OneUIFluidTypographyScale;
};

type FluidScaleSpec = {
  maxScale: number;
  minScale: number;
};

const parsePxValue = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const match = /^(-?\d*\.?\d+)px$/u.exec(value.trim());

  if (!match) {
    return undefined;
  }

  const numeric = Number.parseFloat(match[1]);

  return Number.isNaN(numeric) ? undefined : numeric;
};

const parseFontSizeValuePx = (value: unknown): number | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  const remMatch = /^(-?\d*\.?\d+)rem$/u.exec(trimmed);

  if (remMatch) {
    const numeric = Number.parseFloat(remMatch[1]);

    return Number.isNaN(numeric) ? undefined : numeric * 16;
  }

  const pxMatch = /^(-?\d*\.?\d+)px$/u.exec(trimmed);

  if (!pxMatch) {
    return undefined;
  }

  const numeric = Number.parseFloat(pxMatch[1]);

  return Number.isNaN(numeric) ? undefined : numeric;
};

const defaultFluidTypographySettings: ResolvedOneUIFluidTypographySettings = {
  enabled: false,
  maxViewport: 1440,
  minViewport: 320,
  scale: "comfortable"
};

const fallbackMinViewport =
  parsePxValue(oneuiBreakpoints.xs) ?? defaultFluidTypographySettings.minViewport;
const fallbackMaxViewport =
  parsePxValue(oneuiBreakpoints.xxl) ?? defaultFluidTypographySettings.maxViewport;

const fluidTypographyScaleMap: Record<
  OneUIFluidTypographyScale,
  Record<(typeof oneuiFluidTypographySlots)[number], FluidScaleSpec>
> = {
  compact: {
    fontSizeBase100: { minScale: 0.98, maxScale: 1 },
    fontSizeBase200: { minScale: 0.98, maxScale: 1 },
    fontSizeBase300: { minScale: 0.97, maxScale: 1 },
    fontSizeBase400: { minScale: 0.96, maxScale: 1 },
    fontSizeBase500: { minScale: 0.95, maxScale: 1 },
    fontSizeBase600: { minScale: 0.94, maxScale: 1 },
    fontSizeHero700: { minScale: 0.92, maxScale: 1 },
    fontSizeHero800: { minScale: 0.9, maxScale: 1 }
  },
  comfortable: {
    fontSizeBase100: { minScale: 0.97, maxScale: 1 },
    fontSizeBase200: { minScale: 0.97, maxScale: 1 },
    fontSizeBase300: { minScale: 0.96, maxScale: 1 },
    fontSizeBase400: { minScale: 0.95, maxScale: 1 },
    fontSizeBase500: { minScale: 0.94, maxScale: 1 },
    fontSizeBase600: { minScale: 0.92, maxScale: 1 },
    fontSizeHero700: { minScale: 0.9, maxScale: 1 },
    fontSizeHero800: { minScale: 0.88, maxScale: 1 }
  },
  expressive: {
    fontSizeBase100: { minScale: 0.96, maxScale: 1 },
    fontSizeBase200: { minScale: 0.96, maxScale: 1 },
    fontSizeBase300: { minScale: 0.95, maxScale: 1 },
    fontSizeBase400: { minScale: 0.94, maxScale: 1 },
    fontSizeBase500: { minScale: 0.93, maxScale: 1 },
    fontSizeBase600: { minScale: 0.91, maxScale: 1 },
    fontSizeHero700: { minScale: 0.89, maxScale: 1 },
    fontSizeHero800: { minScale: 0.87, maxScale: 1 }
  }
};

export const normalizeFluidTypographySettings = (
  settings: OneUIFluidTypographySettings | undefined
): ResolvedOneUIFluidTypographySettings => {
  const minViewport = settings?.minViewport ?? fallbackMinViewport;
  const requestedMaxViewport = settings?.maxViewport ?? fallbackMaxViewport;
  const maxViewport = Math.max(requestedMaxViewport, minViewport + 1);

  return {
    enabled: settings?.enabled === true,
    maxViewport,
    minViewport,
    scale: settings?.scale ?? defaultFluidTypographySettings.scale
  };
};

const createFluidFontSize = (
  basePx: number,
  spec: FluidScaleSpec,
  settings: ResolvedOneUIFluidTypographySettings
): string => {
  const min = basePx * spec.minScale;
  const max = basePx * spec.maxScale;
  const slope = (max - min) / (settings.maxViewport - settings.minViewport);
  const intercept = min - slope * settings.minViewport;

  return `clamp(${min.toFixed(2)}px, calc(${intercept.toFixed(2)}px + ${slope.toFixed(
    6
  )} * var(${oneuiFluidTypographyViewportVar}, 100vw)), ${max.toFixed(2)}px)`;
};

export const applyFluidTypographyToTheme = (
  theme: OneUIFluentTheme,
  settings: ResolvedOneUIFluidTypographySettings
): OneUIFluentTheme => {
  if (!settings.enabled) {
    return theme;
  }

  const scaleConfig = fluidTypographyScaleMap[settings.scale];
  const nextTheme: OneUIFluentTheme = { ...theme };

  for (const slot of oneuiFluidTypographySlots) {
    const basePx = parseFontSizeValuePx(theme[slot]);

    if (basePx === undefined) {
      continue;
    }

    nextTheme[slot] = createFluidFontSize(basePx, scaleConfig[slot], settings);
  }

  return nextTheme;
};
