import React from "react";

import { useOneUIBadgeClassNames } from "./OneUIBadge.styles.js";
import type { OneUIBadgeProps } from "./OneUIBadge.types.js";

export const OneUIBadge = React.forwardRef<HTMLSpanElement, OneUIBadgeProps>((props, ref) => {
  const {
    appearance = "soft",
    children,
    className,
    icon,
    shape = "pill",
    size = "md",
    tone = "neutral",
    ...restProps
  } = props;
  const classNames = useOneUIBadgeClassNames({
    appearance,
    className,
    shape,
    size,
    tone
  });

  return (
    <span {...restProps} className={classNames.root} data-oneui-badge="" ref={ref}>
      {icon ? <span className={classNames.icon}>{icon}</span> : null}
      <span className={classNames.content}>{children}</span>
    </span>
  );
});

OneUIBadge.displayName = "OneUIBadge";
