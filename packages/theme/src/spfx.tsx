import React from "react";
import type { ReactNode } from "react";

import { deepMerge } from "./internal/object-utils.js";
import { OneUIProvider } from "./provider.js";
import type { OneUIProviderProps } from "./provider.js";
import { createOneuiTheme, type CreateOneuiThemeOptions, type OneUIThemeMode } from "./theme.js";

export type OneUISpfxThemePalette = Partial<{
  black: string;
  neutralDark: string;
  neutralLight: string;
  neutralLighter: string;
  neutralLighterAlt: string;
  neutralPrimary: string;
  neutralSecondary: string;
  neutralTertiary: string;
  themeDark: string;
  themeDarkAlt: string;
  themeDarker: string;
  themeLight: string;
  themePrimary: string;
  themeSecondary: string;
  themeTertiary: string;
  white: string;
}>;

export type OneUISpfxThemeSemanticColors = Partial<{
  bodyBackground: string;
  bodyText: string;
  disabledBackground: string;
  disabledBodyText: string;
  inputBorder: string;
  inputBorderHovered: string;
  link: string;
  linkHovered: string;
  primaryButtonBackground: string;
  primaryButtonBackgroundHovered: string;
  primaryButtonText: string;
  primaryButtonTextHovered: string;
}>;

export type OneUISpfxThemeInput = {
  isInverted?: boolean;
  palette?: OneUISpfxThemePalette;
  semanticColors?: OneUISpfxThemeSemanticColors;
};

type ResolvedThemeOverrides = Omit<CreateOneuiThemeOptions, "mode">;

const pickModeFromSpfxTheme = (
  spfxTheme: OneUISpfxThemeInput | undefined,
  mode: OneUIThemeMode | undefined
): OneUIThemeMode => {
  if (mode) {
    return mode;
  }

  return spfxTheme?.isInverted ? "dark" : "light";
};

export const createOneuiThemeOverridesFromSpfxTheme = (
  spfxTheme?: OneUISpfxThemeInput
): ResolvedThemeOverrides => {
  const palette = spfxTheme?.palette ?? {};
  const semanticColors = spfxTheme?.semanticColors ?? {};

  return {
    fluentTheme: {
      colorBrandBackground:
        semanticColors.primaryButtonBackground ?? palette.themeDarkAlt ?? palette.themePrimary,
      colorBrandBackgroundHover:
        semanticColors.primaryButtonBackgroundHovered ?? palette.themeDark ?? palette.themePrimary,
      colorBrandBackgroundPressed:
        palette.themeDarker ?? semanticColors.primaryButtonBackgroundHovered ?? palette.themeDark,
      colorBrandForeground1: palette.themePrimary,
      colorBrandForeground2: palette.themePrimary,
      colorBrandForegroundLink: semanticColors.link ?? palette.themePrimary,
      colorBrandForegroundLinkHover:
        semanticColors.linkHovered ?? palette.themeDark,
      colorBrandForegroundLinkPressed:
        semanticColors.linkHovered ?? palette.themeDarkAlt ?? palette.themeDark,
      oneuiColorBackgroundCanvas:
        semanticColors.bodyBackground ?? palette.neutralLighterAlt ?? palette.white,
      colorNeutralBackground1:
        semanticColors.bodyBackground ?? palette.white,
      colorNeutralBackground2:
        palette.neutralLighterAlt ?? semanticColors.bodyBackground ?? palette.white,
      colorNeutralForeground1:
        semanticColors.bodyText ?? palette.neutralPrimary,
      colorNeutralForeground2:
        semanticColors.bodyText ?? palette.neutralSecondary,
      colorNeutralForeground3:
        semanticColors.bodyText ?? palette.neutralSecondary,
      colorNeutralForeground4:
        semanticColors.disabledBodyText ?? palette.neutralTertiary,
      colorNeutralForegroundDisabled:
        semanticColors.disabledBodyText ?? palette.neutralTertiary,
      colorNeutralForegroundOnBrand:
        semanticColors.primaryButtonText ?? palette.white,
      colorNeutralForegroundOnBrandHover:
        semanticColors.primaryButtonTextHovered ?? palette.white,
      colorNeutralForegroundOnBrandPressed:
        semanticColors.primaryButtonTextHovered ?? palette.white,
      colorNeutralStroke1: semanticColors.inputBorder ?? palette.neutralLight,
      colorNeutralStroke1Hover:
        semanticColors.inputBorderHovered ?? palette.neutralLight,
      colorNeutralStroke2: semanticColors.inputBorder ?? palette.neutralLight,
      colorNeutralStrokeAccessible:
        semanticColors.inputBorder ?? palette.neutralLight,
      colorNeutralBackgroundDisabled:
        semanticColors.disabledBackground ?? palette.neutralLighter,
      oneuiColorInteractionSecondaryBackground:
        palette.white ?? semanticColors.bodyBackground,
      oneuiColorInteractionSecondaryBackgroundHover:
        palette.neutralLighterAlt ?? semanticColors.disabledBackground,
      oneuiColorInteractionSecondaryBackgroundPressed:
        palette.neutralLighter ?? semanticColors.disabledBackground,
      oneuiColorInteractionSecondaryForeground:
        semanticColors.bodyText ?? palette.neutralPrimary,
      oneuiColorInteractionSecondaryBorder:
        semanticColors.inputBorder ?? palette.neutralLight,
      oneuiColorInteractionSecondaryBorderHover:
        semanticColors.inputBorderHovered ?? palette.neutralTertiary,
      oneuiColorInteractionSecondaryBorderPressed:
        semanticColors.inputBorderHovered ?? palette.neutralTertiary,
      oneuiColorInteractionDisabledBackground:
        semanticColors.disabledBackground ?? palette.neutralLighter,
      oneuiColorInteractionDisabledForeground:
        semanticColors.disabledBodyText ?? palette.neutralTertiary,
      oneuiColorInteractionDisabledBorder:
        semanticColors.disabledBackground ?? palette.neutralLight
    }
  };
};

export const createOneuiThemeFromSpfxTheme = (
  spfxTheme?: OneUISpfxThemeInput,
  overrides: CreateOneuiThemeOptions = {}
) => {
  const mode = pickModeFromSpfxTheme(spfxTheme, overrides.mode as OneUIThemeMode | undefined);
  const spfxOverrides = createOneuiThemeOverridesFromSpfxTheme(spfxTheme);

  return createOneuiTheme({
    ...deepMerge(spfxOverrides, overrides),
    mode
  });
};

export type OneUISpfxProviderProps = Omit<
  OneUIProviderProps,
  "mode" | "themeOverrides"
> & {
  children?: ReactNode;
  mode?: OneUIThemeMode;
  spfxTheme?: OneUISpfxThemeInput;
  themeOverrides?: Omit<CreateOneuiThemeOptions, "mode">;
};

export const OneUISpfxProvider = (
  props: OneUISpfxProviderProps
): React.JSX.Element => {
  const {
    children,
    mode,
    spfxTheme,
    themeOverrides,
    ...providerProps
  } = props;

  const resolvedMode = pickModeFromSpfxTheme(spfxTheme, mode);
  const mergedThemeOverrides = React.useMemo(() => {
    return deepMerge(
      createOneuiThemeOverridesFromSpfxTheme(spfxTheme),
      themeOverrides ?? {}
    ) as Omit<CreateOneuiThemeOptions, "mode">;
  }, [spfxTheme, themeOverrides]);

  return (
    <OneUIProvider
      {...providerProps}
      mode={resolvedMode}
      themeOverrides={mergedThemeOverrides}
    >
      {children}
    </OneUIProvider>
  );
};
