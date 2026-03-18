import type { ButtonProps } from "@fluentui/react-components";

export type OneUIButtonAppearance = "primary" | "secondary" | "subtle" | "transparent";

export type OneUIButtonProps = Omit<ButtonProps, "appearance"> & {
  appearance?: OneUIButtonAppearance;
  stretch?: boolean;
};
