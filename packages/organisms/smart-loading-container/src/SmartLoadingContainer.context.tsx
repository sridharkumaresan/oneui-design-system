import React from "react";

import type {
  SmartLoadingShape,
  SmartLoadingSurfaceAppearance
} from "./SmartLoadingContainer.types.js";

export const SmartLoadingSurfaceAppearanceContext = React.createContext<SmartLoadingSurfaceAppearance>(
  "raised"
);

export const SmartLoadingShapeContext = React.createContext<SmartLoadingShape>("square");
