import {
  createOneUISurfacePropertyPaneOptions,
  defineOneUISurfacePolicy,
  resolveOneUISurfaceStyle,
  type OneUISurfaceKind,
  type OneUISurfacePolicy,
  type OneUISurfacePolicyInput,
  type OneUISurfacePropertyPaneOption,
  type ResolveOneUISurfaceVariantOptions
} from "./surfaces.js";

export const oneuiBannerSurfaceAvailabilityModes = [
  "gradientOnly",
  "solidOnly",
  "both"
] as const;

export type OneUIBannerSurfaceAvailabilityMode =
  (typeof oneuiBannerSurfaceAvailabilityModes)[number];

export type OneUIBannerSurfacePickerConfig = ResolveOneUISurfaceVariantOptions & {
  policy?: OneUISurfacePolicyInput | OneUISurfacePolicy;
  availability?: OneUIBannerSurfaceAvailabilityMode;
  selectedKey?: string;
};

export type OneUIBannerSurfacePickerOption = OneUISurfacePropertyPaneOption & {
  isDefault: boolean;
};

export type OneUIBannerSurfacePickerResolution = {
  defaultKey: string;
  effectiveKey: string;
  options: OneUIBannerSurfacePickerOption[];
};

const getAllowedSurfaceKinds = (
  availability: OneUIBannerSurfaceAvailabilityMode
): OneUISurfaceKind[] => {
  if (availability === "gradientOnly") {
    return ["gradient"];
  }

  if (availability === "solidOnly") {
    return ["solid"];
  }

  return ["gradient", "solid"];
};

const canUseSurfaceType = (
  type: OneUISurfaceKind,
  availability: OneUIBannerSurfaceAvailabilityMode
): boolean => {
  return getAllowedSurfaceKinds(availability).includes(type);
};

const getVisibleOptions = (
  config: OneUIBannerSurfacePickerConfig
): OneUISurfacePropertyPaneOption[] => {
  const availability = config.availability ?? "both";
  const options = createOneUISurfacePropertyPaneOptions(config.policy, config);

  return options.filter((option) => {
    return canUseSurfaceType(option.type, availability);
  });
};

const toPickerOption = (
  option: OneUISurfacePropertyPaneOption,
  defaultKey: string
): OneUIBannerSurfacePickerOption => {
  return {
    ...option,
    isDefault: option.key === defaultKey
  };
};

export const buildOneUIBannerSurfacePickerOptions = (
  config: OneUIBannerSurfacePickerConfig
): OneUIBannerSurfacePickerResolution => {
  const visibleOptions = getVisibleOptions(config);
  const policy = defineOneUISurfacePolicy(config.policy);
  const requestedDefaultKey = policy.defaultVariantKey;
  const defaultOption =
    visibleOptions.find((option) => option.key === requestedDefaultKey) ??
    visibleOptions[0];
  const defaultKey = defaultOption?.key ?? requestedDefaultKey;
  const effectiveKey =
    config.selectedKey && visibleOptions.some((option) => option.key === config.selectedKey)
      ? config.selectedKey
      : defaultKey;
  const options = visibleOptions.map((option) => toPickerOption(option, defaultKey));

  return {
    defaultKey,
    effectiveKey,
    options
  };
};

export const getOneUIBannerSurfaceEffectiveKey = (
  config: OneUIBannerSurfacePickerConfig
): string => {
  return buildOneUIBannerSurfacePickerOptions(config).effectiveKey;
};

export const getOneUIBannerSurfaceStyle = (
  config: OneUIBannerSurfacePickerConfig
): ReturnType<typeof resolveOneUISurfaceStyle> => {
  return resolveOneUISurfaceStyle(getOneUIBannerSurfaceEffectiveKey(config), {
    mode: config.mode,
    policy: config.policy,
    theme: config.theme
  });
};
