import React from "react";
import { Button } from "@fluentui/react-components";

import { useOneUIButtonClassName } from "./OneUIButton.styles.js";
import type { OneUIButtonProps } from "./OneUIButton.types.js";

export const OneUIButton = React.forwardRef<HTMLButtonElement, OneUIButtonProps>((props, ref) => {
  const {
    appearance = "primary",
    size = "medium",
    stretch = false,
    className,
    children,
    ...buttonProps
  } = props;
  const buttonClassName = useOneUIButtonClassName(stretch, className);

  return (
    <Button
      {...buttonProps}
      appearance={appearance}
      className={buttonClassName}
      ref={ref}
      size={size}
    >
      {children}
    </Button>
  );
});

OneUIButton.displayName = "OneUIButton";
