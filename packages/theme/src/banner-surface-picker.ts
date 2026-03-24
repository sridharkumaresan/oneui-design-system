import {
  createOneUISurfacePropertyPaneOptions,
  defineOneUISurfacePolicy,
  resolveOneUISurfaceStyle,
  resolveOneUISurfaceVariant,
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
    return !option.hiddenFromSelections && canUseSurfaceType(option.type, availability);
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

const getSelectedOption = (
  config: OneUIBannerSurfacePickerConfig
): OneUISurfacePropertyPaneOption | undefined => {
  const { selectedKey } = config;
  if (!selectedKey) {
    return undefined;
  }

  const options = createOneUISurfacePropertyPaneOptions(config.policy, config);
  const existingSelection = options.find((option) => option.key === selectedKey);
  if (existingSelection) {
    return existingSelection;
  }

  const resolved = resolveOneUISurfaceVariant(selectedKey, config);
  if (!resolved.isDeprecatedSelection) {
    return undefined;
  }

  return {
    key: selectedKey,
    text: `${resolved.resolvedEntry.label} (Legacy)`,
    surfaceRole: resolved.recipe.key,
    type: resolved.recipe.type,
    group: resolved.recipe.group,
    description: resolved.resolvedEntry.description,
    preview: resolved.resolvedEntry.preview,
    hiddenFromSelections: true,
    deprecated: true,
    replacementKey: resolved.resolvedKey
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
    visibleOptions[0] ??
    getSelectedOption(config);
  const defaultKey = defaultOption?.key ?? requestedDefaultKey;
  const selectedOption = getSelectedOption(config);
  const effectiveKey = config.selectedKey ?? defaultKey;
  const options = visibleOptions.map((option) => toPickerOption(option, defaultKey));

  if (
    selectedOption &&
    !options.some((option) => option.key === selectedOption.key)
  ) {
    options.push(
      toPickerOption(
        {
          ...selectedOption,
          hiddenFromSelections: true
        },
        defaultKey
      )
    );
  }

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
