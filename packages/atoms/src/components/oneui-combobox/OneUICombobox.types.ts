import type { ComboboxProps } from "@fluentui/react-components";
import type { ReactNode } from "react";

export type OneUIComboboxOption = {
  disabled?: boolean;
  label: string;
  text?: string;
  value: string;
  content?: ReactNode;
};

export type OneUIComboboxProps = Omit<ComboboxProps, "children"> & {
  options?: OneUIComboboxOption[];
  stretch?: boolean;
};
