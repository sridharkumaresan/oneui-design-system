import {
  rawGradientTokenNames,
  rawGradientTokens,
  type RawGradientStop,
  type RawGradientToken,
  type RawGradientTokenName
} from "@functions-oneui/tokens";

export const oneuiGradientNames = rawGradientTokenNames;

export type OneUIGradientName = (typeof oneuiGradientNames)[number];
export type OneUIGradient = {
  name: OneUIGradientName;
  type: RawGradientToken["type"];
  direction: RawGradientToken["direction"];
  angle: RawGradientToken["angle"];
  stops: RawGradientStop[];
  css: string;
  fallbackSolidColor: string;
};
export type OneUIGradients = Record<OneUIGradientName, OneUIGradient>;

const cloneStops = (stops: RawGradientStop[]): RawGradientStop[] => {
  return stops.map((stop) => ({ ...stop }));
};

const resolveGradients = (): OneUIGradients => {
  return Object.fromEntries(
    oneuiGradientNames.map((name) => {
      const gradientToken = rawGradientTokens[name];

      const resolvedGradient: OneUIGradient = {
        name,
        type: gradientToken.type,
        direction: gradientToken.direction,
        angle: gradientToken.angle,
        stops: cloneStops(gradientToken.stops),
        css: gradientToken.css,
        fallbackSolidColor: gradientToken.fallbackSolidColor
      };

      return [name, resolvedGradient];
    })
  ) as OneUIGradients;
};

const normalizeMode = (mode: string | undefined): "light" | "dark" => {
  return mode === "dark" ? "dark" : "light";
};

export const oneuiLightGradients = resolveGradients();
export const oneuiDarkGradients = resolveGradients();

export const createOneuiGradients = (mode?: string): OneUIGradients => {
  return normalizeMode(mode) === "dark" ? oneuiDarkGradients : oneuiLightGradients;
};

// Backward-compatible aliases while the workspace migrates to canonical gradient names.
export const oneuiGradientRoleNames = oneuiGradientNames;
export type OneUIGradientRoleName = OneUIGradientName;
export type OneUIGradientRole = OneUIGradient;
export type OneUIGradientRoles = OneUIGradients;
export const oneuiLightGradientRoles = oneuiLightGradients;
export const oneuiDarkGradientRoles = oneuiDarkGradients;
export const createOneuiGradientRoles = createOneuiGradients;
