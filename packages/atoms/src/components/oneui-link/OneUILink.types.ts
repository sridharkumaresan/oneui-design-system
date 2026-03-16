import type { HTMLAttributes, ReactNode } from "react";

export type OneUILinkTone = "brand" | "neutral" | "inverse";
export type OneUILinkUnderline = "always" | "hover" | "none";
export type OneUILinkIconPosition = "before" | "after";

export type OneUILinkProps = HTMLAttributes<HTMLElement> & {
  as?: "a" | "button" | "span";
  children?: ReactNode;
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  iconPosition?: OneUILinkIconPosition;
  rel?: string;
  target?: string;
  tone?: OneUILinkTone;
  type?: "button" | "submit" | "reset";
  underline?: OneUILinkUnderline;
};
