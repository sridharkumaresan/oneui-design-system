import React from "react";

import type { SmartLoadingSurfaceAppearance } from "./SmartLoadingContainer.types.js";

export const SmartLoadingSurfaceAppearanceContext = React.createContext<SmartLoadingSurfaceAppearance>(
  "raised"
);
