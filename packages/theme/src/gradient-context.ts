import React from "react";

import { oneuiLightGradients, type OneUIGradients } from "./gradients.js";

export const OneUIGradientContext = React.createContext<OneUIGradients>(
  oneuiLightGradients
);

export const useOneUIGradients = (): OneUIGradients => {
  return React.useContext(OneUIGradientContext);
};
