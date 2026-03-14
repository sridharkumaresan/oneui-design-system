import React from "react";

import { useOneUICardClassName } from "./OneUICard.styles.js";
import type { OneUICardProps } from "./OneUICard.types.js";

export const OneUICard = (props: OneUICardProps): React.JSX.Element => {
  const {
    accent = "none",
    as,
    children,
    className,
    elevation = "flat",
    padding = "md",
    ...restProps
  } = props;
  const Component = (as ?? "div") as keyof React.JSX.IntrinsicElements;
  const resolvedClassName = useOneUICardClassName({
    accent,
    className,
    elevation,
    padding
  });

  return React.createElement(
    Component,
    { ...restProps, className: resolvedClassName, "data-oneui-card": "" },
    children
  );
};
