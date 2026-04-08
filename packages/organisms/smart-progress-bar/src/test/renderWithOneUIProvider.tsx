import React from "react";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";

import { OneUIProvider } from "@functions-oneui/theme";

export const renderWithOneUIProvider = (ui: ReactElement): ReturnType<typeof render> => {
  return render(<OneUIProvider mode="light">{ui}</OneUIProvider>);
};
