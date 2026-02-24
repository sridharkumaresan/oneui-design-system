// @ts-nocheck
import React from "react";

import { TemplateAtom } from "./TemplateAtom.js";

const meta = {
  title: "Internal/TemplateAtom",
  parameters: {
    docs: {
      description: {
        story: "Golden template story. Do not publish this component."
      }
    }
  }
};

export default meta;

export const Example = {
  render: () => React.createElement(TemplateAtom, null, "Template")
};
