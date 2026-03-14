import type { HTMLAttributes, JSX, ReactNode } from "react";

export type OneUITextTone = "primary" | "secondary" | "brand" | "success" | "danger" | "inverse";
export type OneUITextSize = "caption" | "body" | "bodyLarge";
export type OneUITextWeight = "regular" | "medium" | "semibold" | "bold";

export type OneUITextProps = HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  block?: boolean;
  children?: ReactNode;
  size?: OneUITextSize;
  tone?: OneUITextTone;
  truncate?: boolean;
  weight?: OneUITextWeight;
};
