import type { HTMLAttributes, JSX, ReactNode } from "react";

export type OneUIStackAlign = "start" | "center" | "end" | "stretch";
export type OneUIStackDirection = "row" | "column";
export type OneUIStackGap = "none" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type OneUIStackJustify = "start" | "center" | "end" | "between";

export type OneUIStackProps = HTMLAttributes<HTMLElement> & {
  align?: OneUIStackAlign;
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  direction?: OneUIStackDirection;
  gap?: OneUIStackGap;
  justify?: OneUIStackJustify;
  stretch?: boolean;
  wrap?: boolean;
};
