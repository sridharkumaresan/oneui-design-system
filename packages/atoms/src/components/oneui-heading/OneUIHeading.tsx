import React from "react";

import { useOneUIHeadingClassName } from "./OneUIHeading.styles.js";
import type { OneUIHeadingProps } from "./OneUIHeading.types.js";

export const OneUIHeading = (props: OneUIHeadingProps): React.JSX.Element => {
  const { align = "start", children, className, level = 2, tone = "default", ...restProps } = props;
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;
  const resolvedClassName = useOneUIHeadingClassName({
    align,
    className,
    level,
    tone
  });

  return React.createElement(Component, { ...restProps, className: resolvedClassName }, children);
};
