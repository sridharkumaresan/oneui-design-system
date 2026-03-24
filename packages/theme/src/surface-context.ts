import React from "react";

import { oneuiLightSurfaceRecipes, type OneUISurfaceRecipes } from "./surfaces.js";

export const OneUISurfaceContext = React.createContext<OneUISurfaceRecipes>(
  oneuiLightSurfaceRecipes
);

export const useOneUISurfaces = (): OneUISurfaceRecipes => {
  return React.useContext(OneUISurfaceContext);
};
