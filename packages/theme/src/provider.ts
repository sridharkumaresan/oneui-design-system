import React from "react";
import * as fluentReactComponents from "@fluentui/react-components";
import type { ComponentProps, ReactNode } from "react";
import type { FluentProviderProps } from "@fluentui/react-components";

import { OneUIGradientContext } from "./gradient-context.js";
import { createOneuiGradients } from "./gradients.js";
import { OneUISurfaceContext } from "./surface-context.js";
import { createOneUISurfaceRecipes } from "./surfaces.js";
import { createOneuiTheme } from "./theme.js";
import { OneUIThemeModeContext } from "./theme-mode-context.js";
import type {
  CreateOneuiThemeOptions,
  OneUIFluidTypographySettings,
  OneUIThemeMode,
  OneUITypographyMode
} from "./theme.js";

const fluentModule = fluentReactComponents as {
  FluentProvider?: React.ComponentType<FluentProviderProps>;
  default?: {
    FluentProvider?: React.ComponentType<FluentProviderProps>;
  };
};
const FluentProvider = fluentModule.FluentProvider ?? fluentModule.default?.FluentProvider;

if (!FluentProvider) {
  throw new Error("Failed to resolve FluentProvider from @fluentui/react-components");
}

type FluentProviderBaseProps = Omit<ComponentProps<typeof FluentProvider>, "theme">;

export type OneUIProviderProps = FluentProviderBaseProps & {
  mode?: OneUIThemeMode;
  fluidTypography?: OneUIFluidTypographySettings;
  typographyMode?: OneUITypographyMode;
  themeOverrides?: Omit<CreateOneuiThemeOptions, "mode">;
  children?: ReactNode;
};

export const OneUIProvider = (props: OneUIProviderProps): React.JSX.Element => {
  const {
    mode = "light",
    fluidTypography,
    typographyMode,
    themeOverrides,
    children,
    ...providerProps
  } = props;
  const theme = React.useMemo(() => {
    return createOneuiTheme({
      ...(themeOverrides ?? {}),
      fluidTypography,
      mode,
      typographyMode
    });
  }, [fluidTypography, mode, themeOverrides, typographyMode]);
  const gradients = React.useMemo(() => {
    return createOneuiGradients(mode);
  }, [mode]);
  const surfaces = React.useMemo(() => {
    return createOneUISurfaceRecipes({
      mode,
      theme
    });
  }, [mode, theme]);

  return React.createElement(
    OneUIThemeModeContext.Provider,
    { value: mode },
    React.createElement(
      OneUIGradientContext.Provider,
      { value: gradients },
      React.createElement(
        OneUISurfaceContext.Provider,
        { value: surfaces },
        React.createElement(FluentProvider, { ...providerProps, theme }, children)
      )
    )
  );
};
