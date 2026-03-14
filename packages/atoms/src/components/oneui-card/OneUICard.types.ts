import type { HTMLAttributes, JSX, ReactNode } from "react";

export type OneUICardAccent = "none" | "brand" | "success" | "danger";
export type OneUICardElevation = "flat" | "raised";
export type OneUICardPadding = "sm" | "md" | "lg";

export type OneUICardProps = HTMLAttributes<HTMLElement> & {
  accent?: OneUICardAccent;
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  elevation?: OneUICardElevation;
  padding?: OneUICardPadding;
};
