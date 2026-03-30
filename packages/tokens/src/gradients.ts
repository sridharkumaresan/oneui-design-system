import { oneuiBrandGradientStopPositions } from "./foundations.js";

export const rawGradientTokenNames = [
  "gradientNavyCyan",
  "gradientCyanGreen",
  "gradientCyanYellow",
  "gradientCyanLightBlue",
  "gradientCyanPink"
] as const;

export const rawGradientDirections = [
  "toTopRight",
  "toTopLeft",
  "toBottomRight",
  "toBottomLeft"
] as const;

export type RawGradientTokenName = (typeof rawGradientTokenNames)[number];
export type RawGradientType = "linear";
export type RawGradientDirection = (typeof rawGradientDirections)[number];
export type RawGradientCssDirection =
  | "to top right"
  | "to top left"
  | "to bottom right"
  | "to bottom left";

export type RawGradientStop = {
  color: string;
  position: string;
};

export type RawGradientStopInput =
  | string
  | {
      color: string;
      position?: string;
    };

export type RawGradientDefinition = {
  label: string;
  // Direction is chosen per gradient variant.
  // The current brand spec uses `toTopRight` for all shipped variants,
  // but the token model supports the full direction set above.
  direction: RawGradientDirection;
  stops: readonly RawGradientStopInput[];
};

export type RawGradientToken = {
  id: RawGradientTokenName;
  label: string;
  type: RawGradientType;
  direction: RawGradientDirection;
  cssDirection: RawGradientCssDirection;
  angle: number;
  stops: RawGradientStop[];
  css: string;
  fallbackSolidColor: string;
};

const rawGradientDirectionToCssMap: Record<
  RawGradientDirection,
  RawGradientCssDirection
> = {
  toTopRight: "to top right",
  toTopLeft: "to top left",
  toBottomRight: "to bottom right",
  toBottomLeft: "to bottom left"
};

const rawGradientDirectionToAngleMap: Record<RawGradientDirection, number> = {
  toTopRight: 45,
  toTopLeft: 315,
  toBottomRight: 135,
  toBottomLeft: 225
};

const cloneStops = (stops: readonly RawGradientStop[]): RawGradientStop[] => {
  return stops.map((stop) => ({ ...stop }));
};

const toStopPosition = (index: number, totalStops: number): string => {
  if (totalStops === oneuiBrandGradientStopPositions.length) {
    return oneuiBrandGradientStopPositions[index];
  }

  if (totalStops <= 1) {
    return "0%";
  }

  const step = 100 / (totalStops - 1);
  const position = index * step;

  return `${Number.parseFloat(position.toFixed(2))}%`;
};

const normalizeStops = (stops: readonly RawGradientStopInput[]): RawGradientStop[] => {
  const requiresGeneratedPositions = stops.some(
    (stop) => typeof stop === "string" || !stop.position
  );

  return stops.map((stop, index) => {
    if (typeof stop === "string") {
      return {
        color: stop,
        position: toStopPosition(index, stops.length)
      };
    }

    return {
      color: stop.color,
      position: requiresGeneratedPositions
        ? toStopPosition(index, stops.length)
        : stop.position ?? toStopPosition(index, stops.length)
    };
  });
};

const buildCssGradient = (
  direction: RawGradientCssDirection,
  stops: readonly RawGradientStop[]
): string => {
  const stopList = stops.map((stop) => `${stop.color} ${stop.position}`).join(", ");
  return `linear-gradient(${direction}, ${stopList})`;
};

const createRawGradientToken = (
  id: RawGradientTokenName,
  definition: RawGradientDefinition
): RawGradientToken => {
  if (definition.stops.length < 2) {
    throw new Error("Raw gradient tokens require at least two color stops");
  }

  const stops = normalizeStops(definition.stops);
  const fallbackSolidColor = stops[stops.length - 1].color;
  const cssDirection = rawGradientDirectionToCssMap[definition.direction];

  return {
    id,
    label: definition.label,
    type: "linear",
    direction: definition.direction,
    cssDirection,
    angle: rawGradientDirectionToAngleMap[definition.direction],
    stops,
    css: buildCssGradient(cssDirection, stops),
    fallbackSolidColor
  };
};

// These are the authored company gradient variants.
// All current variants use `toTopRight` because that is what the active brand
// spec provided, not because the token system is limited to one direction.
// To change a single variant later, update only that variant's `direction`.
const rawGradientDefinitions = {
  gradientNavyCyan: {
    label: "Navy-Cyan",
    direction: "toTopRight",
    stops: [
      { color: "#00AEEF", position: "0%" },
      { color: "#009AEB", position: "15%" },
      { color: "#009DE1", position: "30%" },
      { color: "#0088D0", position: "45%" },
      { color: "#006BB9", position: "55%" },
      { color: "#004698", position: "70%" },
      { color: "#001877", position: "85%" },
      "#000063"
    ]
  },
  gradientCyanGreen: {
    label: "Cyan-Green",
    direction: "toTopRight",
    stops: [
      { color: "#75FAAC", position: "0%" },
      { color: "#67F1B3", position: "15%" },
      { color: "#42D9C8", position: "30%" },
      { color: "#25C6D9", position: "45%" },
      { color: "#10B8E5", position: "55%" },
      { color: "#04B0EC", position: "70%" },
      "#00AEEF"
    ]
  },
  gradientCyanYellow: {
    label: "Cyan-Yellow",
    direction: "toTopRight",
    stops: [
      { color: "#FFF598", position: "0%" },
      { color: "#CBEEA9", position: "15%" },
      { color: "#95DDBB", position: "30%" },
      { color: "#68CFCB", position: "45%" },
      { color: "#42C3D8", position: "55%" },
      { color: "#25B9E2", position: "70%" },
      { color: "#10B3E9", position: "85%" },
      { color: "#04AFED", position: "92.5%" },
      "#00AEEF"
    ]
  },
  gradientCyanLightBlue: {
    label: "Cyan-LightBlue",
    direction: "toTopRight",
    stops: [
      { color: "#AFFDFD", position: "0%" },
      { color: "#95F1FA", position: "15%" },
      { color: "#67DCF7", position: "30%" },
      { color: "#42CBF4", position: "45%" },
      { color: "#25BEF1", position: "55%" },
      { color: "#10B5F0", position: "70%" },
      { color: "#04AFEF", position: "85%" },
      "#00AEEF"
    ]
  },
  gradientCyanPink: {
    label: "Cyan-Pink",
    direction: "toTopRight",
    stops: [
      { color: "#F6CAC9", position: "0%" },
      { color: "#CBC5CF", position: "15%" },
      { color: "#95BFD7", position: "30%" },
      { color: "#68B9DE", position: "45%" },
      { color: "#42B5E4", position: "55%" },
      { color: "#25B2E9", position: "70%" },
      { color: "#10AFEC", position: "85%" },
      { color: "#04AEEE", position: "92.5%" },
      "#00AEEF"
    ]
  }
} as const satisfies Record<RawGradientTokenName, RawGradientDefinition>;

export const rawGradientTokens: Record<RawGradientTokenName, RawGradientToken> = {
  gradientNavyCyan: createRawGradientToken(
    "gradientNavyCyan",
    rawGradientDefinitions.gradientNavyCyan
  ),
  gradientCyanGreen: createRawGradientToken(
    "gradientCyanGreen",
    rawGradientDefinitions.gradientCyanGreen
  ),
  gradientCyanYellow: createRawGradientToken(
    "gradientCyanYellow",
    rawGradientDefinitions.gradientCyanYellow
  ),
  gradientCyanLightBlue: createRawGradientToken(
    "gradientCyanLightBlue",
    rawGradientDefinitions.gradientCyanLightBlue
  ),
  gradientCyanPink: createRawGradientToken(
    "gradientCyanPink",
    rawGradientDefinitions.gradientCyanPink
  )
};
