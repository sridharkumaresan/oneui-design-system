export const rawGradientTokenNames = [
  "deepSpectrum",
  "limeSky",
  "softAqua",
  "tealShift",
  "midnightBlue",
  "pastelHorizon"
] as const;

export type RawGradientTokenName = (typeof rawGradientTokenNames)[number];
export type RawGradientType = "linear";
export type RawGradientDirection = "to bottom";

export type RawGradientStop = {
  color: string;
  position: string;
};

export type RawGradientToken = {
  id: RawGradientTokenName;
  type: RawGradientType;
  direction: RawGradientDirection;
  angle: 180;
  stops: RawGradientStop[];
  css: string;
  fallbackSolidColor: string;
};

const rawGradientDefinitions = {
  deepSpectrum: [
    "#00AEEF",
    "#00A9EB",
    "#009DE1",
    "#0088D0",
    "#006BB9",
    "#00469B",
    "#001877",
    "#000063"
  ],
  limeSky: [
    "#FFFF98",
    "#CBEEA9",
    "#95DDBB",
    "#68CFCB",
    "#42C3D8",
    "#25B9E2",
    "#10B3E9",
    "#04AFED",
    "#00AEEF"
  ],
  softAqua: [
    "#AFFDFD",
    "#95F1FA",
    "#67DCF7",
    "#42CBF4",
    "#25BEF1",
    "#10B5F0",
    "#04AFEF",
    "#00AEEF"
  ],
  tealShift: [
    "#75FAAC",
    "#67F1B3",
    "#42D9C8",
    "#25C6D9",
    "#10B8E5",
    "#04B0EC",
    "#00AEEF"
  ],
  midnightBlue: [
    "#000063",
    "#000466",
    "#001070",
    "#002581",
    "#004298",
    "#0067B6",
    "#0095DA",
    "#00AEEF"
  ],
  pastelHorizon: [
    "#F6CAC9",
    "#CBC5CF",
    "#95BFD7",
    "#68B9DE",
    "#42B5E4",
    "#25B2E9",
    "#10AFEC",
    "#04AEEE",
    "#00AEEF"
  ]
} as const satisfies Record<RawGradientTokenName, readonly string[]>;

const formatStopPosition = (value: number): string => {
  const rounded = Number(value.toFixed(2));
  return `${rounded}%`;
};

const buildStops = (colors: readonly string[]): RawGradientStop[] => {
  if (colors.length < 2) {
    throw new Error("Raw gradient tokens require at least two color stops");
  }

  const lastIndex = colors.length - 1;

  return colors.map((color, index) => ({
    color,
    position: formatStopPosition((index / lastIndex) * 100)
  }));
};

const buildCssGradient = (stops: RawGradientStop[]): string => {
  const stopList = stops.map((stop) => `${stop.color} ${stop.position}`).join(", ");
  return `linear-gradient(180deg, ${stopList})`;
};

const createRawGradientToken = (
  id: RawGradientTokenName,
  colors: readonly string[]
): RawGradientToken => {
  const stops = buildStops(colors);
  const fallbackSolidColor = colors[colors.length - 1];

  return {
    id,
    type: "linear",
    direction: "to bottom",
    angle: 180,
    stops,
    css: buildCssGradient(stops),
    fallbackSolidColor
  };
};

export const rawGradientTokens: Record<RawGradientTokenName, RawGradientToken> = {
  deepSpectrum: createRawGradientToken("deepSpectrum", rawGradientDefinitions.deepSpectrum),
  limeSky: createRawGradientToken("limeSky", rawGradientDefinitions.limeSky),
  softAqua: createRawGradientToken("softAqua", rawGradientDefinitions.softAqua),
  tealShift: createRawGradientToken("tealShift", rawGradientDefinitions.tealShift),
  midnightBlue: createRawGradientToken("midnightBlue", rawGradientDefinitions.midnightBlue),
  pastelHorizon: createRawGradientToken("pastelHorizon", rawGradientDefinitions.pastelHorizon)
};
