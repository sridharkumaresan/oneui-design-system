import {
  rawGradientTokens,
  type RawGradientStop,
  type RawGradientToken,
  type RawGradientTokenName
} from "@functions-oneui/tokens";

export const oneuiGradientRoleNames = [
  "heroPrimary",
  "heroSecondary",
  "featureSurface",
  "softPromotionalSurface",
  "iconAccent",
  "decorativePastelSurface"
] as const;

export type OneUIGradientRoleName = (typeof oneuiGradientRoleNames)[number];
export type OneUIGradientRole = {
  role: OneUIGradientRoleName;
  gradientId: RawGradientTokenName;
  type: RawGradientToken["type"];
  direction: RawGradientToken["direction"];
  angle: RawGradientToken["angle"];
  stops: RawGradientStop[];
  css: string;
  fallbackSolidColor: string;
};
export type OneUIGradientRoles = Record<OneUIGradientRoleName, OneUIGradientRole>;

type OneUIGradientRoleMapping = Record<OneUIGradientRoleName, RawGradientTokenName>;

const defaultGradientRoleMapping: OneUIGradientRoleMapping = {
  heroPrimary: "deepSpectrum",
  heroSecondary: "midnightBlue",
  featureSurface: "limeSky",
  softPromotionalSurface: "softAqua",
  iconAccent: "tealShift",
  decorativePastelSurface: "pastelHorizon"
};

const cloneStops = (stops: RawGradientStop[]): RawGradientStop[] => {
  return stops.map((stop) => ({ ...stop }));
};

const resolveGradientRoles = (mapping: OneUIGradientRoleMapping): OneUIGradientRoles => {
  return Object.fromEntries(
    oneuiGradientRoleNames.map((role) => {
      const gradientId = mapping[role];
      const gradientToken = rawGradientTokens[gradientId];

      const resolvedRole: OneUIGradientRole = {
        role,
        gradientId,
        type: gradientToken.type,
        direction: gradientToken.direction,
        angle: gradientToken.angle,
        stops: cloneStops(gradientToken.stops),
        css: gradientToken.css,
        fallbackSolidColor: gradientToken.fallbackSolidColor
      };

      return [role, resolvedRole];
    })
  ) as OneUIGradientRoles;
};

const normalizeMode = (mode: string | undefined): "light" | "dark" => {
  return mode === "dark" ? "dark" : "light";
};

export const oneuiLightGradientRoles = resolveGradientRoles(defaultGradientRoleMapping);
export const oneuiDarkGradientRoles = resolveGradientRoles(defaultGradientRoleMapping);

export const createOneuiGradientRoles = (mode?: string): OneUIGradientRoles => {
  return normalizeMode(mode) === "dark" ? oneuiDarkGradientRoles : oneuiLightGradientRoles;
};
