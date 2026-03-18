import type { HTMLAttributes, JSX, ReactNode } from "react";

export type ActionCardLayout = "auto" | "horizontal" | "stacked";
export type ActionCardDensity = "default" | "compact";

export type ActionCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actions?: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  density?: ActionCardDensity;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  isDisabled?: boolean;
  layout?: ActionCardLayout;
  meta?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
};
