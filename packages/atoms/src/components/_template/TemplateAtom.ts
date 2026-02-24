// @ts-nocheck
import React from "react";

export const TemplateAtom = ({ children, ...props }) => {
  return React.createElement("button", props, children);
};
