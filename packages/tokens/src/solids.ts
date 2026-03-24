import { rawPalette } from "./internal/palette.js";

export const rawSolidTokenNames = [
  "brandSky",
  "brandBlue",
  "brandMidnight",
  "brandMint",
  "brandAqua",
  "brandPastel",
  "cyan",
  "navy",
  "lightBlue",
  "surfaceBlueDark",
  "surfaceBlueLight",
  "surfaceBlueLightest"
] as const;

export type RawSolidTokenName = (typeof rawSolidTokenNames)[number];
export type RawSolidType = "solid";

export type RawSolidToken = {
  id: RawSolidTokenName;
  label: string;
  type: RawSolidType;
  value: string;
  css: string;
  fallbackSolidColor: string;
};

const createRawSolidToken = (
  id: RawSolidTokenName,
  label: string,
  value: string
): RawSolidToken => {
  return {
    id,
    label,
    type: "solid",
    value,
    css: value,
    fallbackSolidColor: value
  };
};

export const rawSolidTokens: Record<RawSolidTokenName, RawSolidToken> = {
  brandSky: createRawSolidToken("brandSky", "Brand Sky", rawPalette.brand.primary),
  brandBlue: createRawSolidToken(
    "brandBlue",
    "Brand Blue",
    rawPalette.brand.interactive
  ),
  brandMidnight: createRawSolidToken("brandMidnight", "Brand Midnight", "#000063"),
  brandMint: createRawSolidToken("brandMint", "Brand Mint", "#75FAAC"),
  brandAqua: createRawSolidToken("brandAqua", "Brand Aqua", "#AFFDFD"),
  brandPastel: createRawSolidToken("brandPastel", "Brand Pastel", "#F6CAC9"),
  cyan: createRawSolidToken("cyan", "Cyan", "#0ED4F0"),
  navy: createRawSolidToken("navy", "Navy", "#000063"),
  lightBlue: createRawSolidToken("lightBlue", "LightBlue", "#E7F6FD"),
  // Backward-compatible aliases while older consumers move to the simpler solid keys.
  surfaceBlueDark: createRawSolidToken("surfaceBlueDark", "Surface Blue Dark", "#000063"),
  surfaceBlueLight: createRawSolidToken("surfaceBlueLight", "Surface Blue Light", "#0ED4F0"),
  surfaceBlueLightest: createRawSolidToken(
    "surfaceBlueLightest",
    "Surface Blue Lightest",
    "#E7F6FD"
  )
};
