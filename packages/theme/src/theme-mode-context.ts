import React from "react";

import type { OneUIThemeMode } from "./theme.js";

export const OneUIThemeModeContext = React.createContext<OneUIThemeMode>("light");

export const useOneUIThemeMode = (): OneUIThemeMode => {
  return React.useContext(OneUIThemeModeContext);
};
