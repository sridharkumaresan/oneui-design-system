import {
  rawGradientTokenNames,
  rawGradientTokens,
  type RawGradientStop,
  type RawGradientToken
} from "@functions-oneui/tokens";

export const oneuiGradientNames = rawGradientTokenNames;
export const oneuiLegacyGradientNames = [
  "deepSpectrum",
  "limeSky",
  "softAqua",
  "tealShift",
  "midnightBlue",
  "pastelHorizon"
] as const;

export type OneUIGradientName = (typeof oneuiGradientNames)[number];
export type OneUILegacyGradientName = (typeof oneuiLegacyGradientNames)[number];
export type OneUIResolvableGradientName =
  | OneUIGradientName
  | OneUILegacyGradientName;

export type OneUIGradient = {
  name: OneUIResolvableGradientName;
  label: string;
  type: RawGradientToken["type"];
  direction: RawGradientToken["direction"];
  cssDirection: RawGradientToken["cssDirection"];
  angle: RawGradientToken["angle"];
  stops: RawGradientStop[];
  css: string;
  fallbackSolidColor: string;
};

export type OneUIGradients = Record<OneUIResolvableGradientName, OneUIGradient>;

const oneuiLegacyGradientAliasMap: Record<
  OneUILegacyGradientName,
  OneUIGradientName
> = {
  deepSpectrum: "cyanGreen",
  limeSky: "cyanYellow",
  softAqua: "cyanLightBlue",
  tealShift: "cyanGreen",
  midnightBlue: "navyCyan",
  pastelHorizon: "cyanPink"
};

const cloneStops = (stops: readonly RawGradientStop[]): RawGradientStop[] => {
  return stops.map((stop) => ({ ...stop }));
};

const createResolvedGradient = (
  name: OneUIResolvableGradientName,
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
  const canonicalEntries = Object.fromEntries(
    oneuiGradientNames.map((name) => {
      return [name, createResolvedGradient(name, rawGradientTokens[name])];
    })
  ) as Record<OneUIGradientName, OneUIGradient>;

  const legacyEntries = Object.fromEntries(
    oneuiLegacyGradientNames.map((legacyName) => {
      const replacementName = oneuiLegacyGradientAliasMap[legacyName];

      return [
        legacyName,
        createResolvedGradient(legacyName, rawGradientTokens[replacementName])
      ];
    })
  ) as Record<OneUILegacyGradientName, OneUIGradient>;

  return {
    ...canonicalEntries,
    ...legacyEntries
  };
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
