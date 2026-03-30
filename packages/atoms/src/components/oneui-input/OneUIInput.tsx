import React from "react";
import { Input } from "@fluentui/react-components";

import { useOneUIInputClassName } from "./OneUIInput.styles.js";
import type { OneUIInputProps } from "./OneUIInput.types.js";

export const OneUIInput = React.forwardRef<HTMLInputElement, OneUIInputProps>((props, ref) => {
  const { appearance, className, stretch = false, ...inputProps } = props;
  const inputClassName = useOneUIInputClassName(
    {
      appearance,
      stretch
    },
    className
  );

  return <Input {...inputProps} appearance={appearance} className={inputClassName} ref={ref} />;
});

OneUIInput.displayName = "OneUIInput";
