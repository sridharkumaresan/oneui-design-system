import React from "react";

import { oneuiLightGradientRoles, type OneUIGradientRoles } from "./gradients.js";

export const OneUIGradientContext = React.createContext<OneUIGradientRoles>(
  oneuiLightGradientRoles
);

export const useOneUIGradients = (): OneUIGradientRoles => {
  return React.useContext(OneUIGradientContext);
};
