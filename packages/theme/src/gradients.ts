import {
  rawGradientTokenNames,
  rawGradientTokens,
  type RawGradientStop,
  type RawGradientToken
} from "@functions-oneui/tokens";

export const oneuiGradientNames = rawGradientTokenNames;

export type OneUIGradientName = (typeof oneuiGradientNames)[number];
export type OneUIResolvableGradientName = OneUIGradientName;

export type OneUIGradient = {
  name: OneUIGradientName;
  label: string;
  type: RawGradientToken["type"];
  direction: RawGradientToken["direction"];
  cssDirection: RawGradientToken["cssDirection"];
  angle: RawGradientToken["angle"];
  stops: RawGradientStop[];
  css: string;
  fallbackSolidColor: string;
};

export type OneUIGradients = Record<OneUIGradientName, OneUIGradient>;

const cloneStops = (stops: readonly RawGradientStop[]): RawGradientStop[] => {
  return stops.map((stop) => ({ ...stop }));
};

const createResolvedGradient = (
  name: OneUIGradientName,
  gradientToken: RawGradientToken
): OneUIGradient => {
  return {
    name,
    label: gradientToken.label,
    type: gradientToken.type,
    direction: gradientToken.direction,
    cssDirection: gradientToken.cssDirection,
    angle: gradientToken.angle,
    stops: cloneStops(gradientToken.stops),
    css: gradientToken.css,
    fallbackSolidColor: gradientToken.fallbackSolidColor
  };
};

const resolveGradients = (): OneUIGradients => {
  return Object.fromEntries(
    oneuiGradientNames.map((name) => {
      return [name, createResolvedGradient(name, rawGradientTokens[name])];
    })
  ) as Record<OneUIGradientName, OneUIGradient>;
};

const normalizeMode = (mode: string | undefined): "light" | "dark" => {
  return mode === "dark" ? "dark" : "light";
};

export const oneuiLightGradients = resolveGradients();
export const oneuiDarkGradients = resolveGradients();

export const createOneuiGradients = (mode?: string): OneUIGradients => {
  return normalizeMode(mode) === "dark" ? oneuiDarkGradients : oneuiLightGradients;
};

export const oneuiGradientRoleNames = oneuiGradientNames;
export type OneUIGradientRoleName = OneUIGradientName;
export type OneUIGradientRole = OneUIGradient;
export type OneUIGradientRoles = OneUIGradients;
export const oneuiLightGradientRoles = oneuiLightGradients;
export const oneuiDarkGradientRoles = oneuiDarkGradients;
export const createOneuiGradientRoles = createOneuiGradients;
