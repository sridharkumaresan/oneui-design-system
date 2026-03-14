import React from "react";

import { useOneUIStackClassName } from "./OneUIStack.styles.js";
import type { OneUIStackProps } from "./OneUIStack.types.js";

export const OneUIStack = (props: OneUIStackProps): React.JSX.Element => {
  const {
    align = "stretch",
    as,
    children,
    className,
    direction = "column",
    gap = "md",
    justify = "start",
    stretch = false,
    wrap = false,
    ...restProps
  } = props;
  const Component = (as ?? "div") as keyof React.JSX.IntrinsicElements;
  const resolvedClassName = useOneUIStackClassName({
    align,
    className,
    direction,
    gap,
    justify,
    stretch,
    wrap
  });

  return React.createElement(
    Component,
    { ...restProps, className: resolvedClassName, "data-oneui-stack": "" },
    children
  );
};
