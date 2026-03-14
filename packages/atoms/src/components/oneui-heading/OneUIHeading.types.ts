import type { HTMLAttributes, ReactNode } from "react";

export type OneUIHeadingAlign = "start" | "center" | "end";
export type OneUIHeadingTone = "default" | "secondary" | "brand" | "inverse";

export type OneUIHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  tone?: OneUIHeadingTone;
  align?: OneUIHeadingAlign;
};
