import React from "react";
import * as fluentReactComponents from "@fluentui/react-components";
import type { ComponentProps, ReactNode } from "react";
import type { FluentProviderProps } from "@fluentui/react-components";

import { OneUIGradientContext } from "./gradient-context.js";
import { createOneuiGradients } from "./gradients.js";
import { OneUISurfaceContext } from "./surface-context.js";
import { createOneUISurfaceRecipes } from "./surfaces.js";
import { createOneuiTheme } from "./theme.js";
import type { CreateOneuiThemeOptions, OneUIThemeMode } from "./theme.js";

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
  themeOverrides?: Omit<CreateOneuiThemeOptions, "mode">;
  children?: ReactNode;
};

export const OneUIProvider = (props: OneUIProviderProps): React.JSX.Element => {
  const { mode = "light", themeOverrides, children, ...providerProps } = props;
  const theme = React.useMemo(() => {
    return createOneuiTheme({
      ...(themeOverrides ?? {}),
      mode
    });
  }, [mode, themeOverrides]);
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
    OneUIGradientContext.Provider,
    { value: gradients },
    React.createElement(
      OneUISurfaceContext.Provider,
      { value: surfaces },
      React.createElement(FluentProvider, { ...providerProps, theme }, children)
    )
  );
};
