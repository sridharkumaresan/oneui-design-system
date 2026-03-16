import React from "react";
import { Combobox, Option } from "@fluentui/react-components";

import { useOneUIComboboxClassName } from "./OneUICombobox.styles.js";
import type { OneUIComboboxProps } from "./OneUICombobox.types.js";

export const OneUICombobox = React.forwardRef<HTMLInputElement, OneUIComboboxProps>(
  (props, ref) => {
    const { className, options = [], stretch = false, ...comboboxProps } = props;
    const comboboxClassName = useOneUIComboboxClassName(stretch, className);

    return (
      <Combobox {...comboboxProps} className={comboboxClassName} ref={ref}>
        {options.map((option) => (
          <Option
            disabled={option.disabled}
            key={option.value}
            text={option.text ?? option.label}
            value={option.value}
          >
            {option.content ?? option.label}
          </Option>
        ))}
      </Combobox>
    );
  }
);

OneUICombobox.displayName = "OneUICombobox";
