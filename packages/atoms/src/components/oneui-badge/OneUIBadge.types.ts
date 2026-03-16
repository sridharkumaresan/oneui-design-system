import type { HTMLAttributes, ReactNode } from "react";

export type OneUIBadgeAppearance = "filled" | "soft" | "outlined";
export type OneUIBadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";
export type OneUIBadgeShape = "rounded" | "pill";
export type OneUIBadgeSize = "sm" | "md";

export type OneUIBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  appearance?: OneUIBadgeAppearance;
  children?: ReactNode;
  icon?: ReactNode;
  shape?: OneUIBadgeShape;
  size?: OneUIBadgeSize;
  tone?: OneUIBadgeTone;
};
