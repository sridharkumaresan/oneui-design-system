import React from "react";

import { useOneUITextClassName } from "./OneUIText.styles.js";
import type { OneUITextProps } from "./OneUIText.types.js";

export const OneUIText = (props: OneUITextProps): React.JSX.Element => {
  const {
    as,
    block = false,
    children,
    className,
    size = "body",
    tone = "primary",
    truncate = false,
    weight = "regular",
    ...restProps
  } = props;
  const Component = (as ?? (block ? "p" : "span")) as keyof React.JSX.IntrinsicElements;
  const resolvedClassName = useOneUITextClassName({
    block,
    className,
    size,
    tone,
    truncate,
    weight
  });

  return React.createElement(Component, { ...restProps, className: resolvedClassName }, children);
};
