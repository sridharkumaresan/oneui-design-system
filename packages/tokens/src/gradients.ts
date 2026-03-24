export const rawGradientTokenNames = [
  "navyCyan",
  "cyanGreen",
  "cyanYellow",
  "cyanLightBlue",
  "cyanPink"
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
  navyCyan: {
    label: "Navy-Cyan",
    direction: "toTopRight",
    stops: [
      "#00AEEF",
      "#0095DA",
      "#0067B6",
      "#004298",
      "#002581",
      "#001070",
      "#000466",
      "#000063"
    ]
  },
  cyanGreen: {
    label: "Cyan-Green",
    direction: "toTopRight",
    stops: [
      "#75FAAC",
      "#67F1B3",
      "#42D9C8",
      "#25C6D9",
      "#10B8E5",
      "#04B0EC",
      "#00AEEF"
    ]
  },
  cyanYellow: {
    label: "Cyan-Yellow",
    direction: "toTopRight",
    stops: [
      "#FFFF98",
      "#CBEEA9",
      "#95DDBB",
      "#68CFCB",
      "#42C3D8",
      "#25B9E2",
      "#10B3E9",
      "#04AFED",
      "#00AEEF"
    ]
  },
  cyanLightBlue: {
    label: "Cyan-LightBlue",
    direction: "toTopRight",
    stops: [
      "#AFFDFD",
      "#95F1FA",
      "#67DCF7",
      "#42CBF4",
      "#25BEF1",
      "#10B5F0",
      "#04AFEF",
      "#00AEEF"
    ]
  },
  cyanPink: {
    label: "Cyan-Pink",
    direction: "toTopRight",
    stops: [
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
  }
} as const satisfies Record<RawGradientTokenName, RawGradientDefinition>;

export const rawGradientTokens: Record<RawGradientTokenName, RawGradientToken> = {
  navyCyan: createRawGradientToken("navyCyan", rawGradientDefinitions.navyCyan),
  cyanGreen: createRawGradientToken("cyanGreen", rawGradientDefinitions.cyanGreen),
  cyanYellow: createRawGradientToken("cyanYellow", rawGradientDefinitions.cyanYellow),
  cyanLightBlue: createRawGradientToken(
    "cyanLightBlue",
    rawGradientDefinitions.cyanLightBlue
  ),
  cyanPink: createRawGradientToken("cyanPink", rawGradientDefinitions.cyanPink)
};
