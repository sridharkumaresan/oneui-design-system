import type { HTMLAttributes, JSX, MouseEventHandler, ReactNode } from "react";

import type { OneUIButtonProps } from "@functions-oneui/atoms";

export type ActionPanelLayout = "inline" | "stacked";

export type ActionPanelAction = {
  label: ReactNode;
  icon?: OneUIButtonProps["icon"];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  size?: OneUIButtonProps["size"];
};

export type ActionPanelProps = HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  description?: ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  layout?: ActionPanelLayout;
  primaryAction: ActionPanelAction;
  secondaryAction?: ActionPanelAction;
  title: ReactNode;
};
