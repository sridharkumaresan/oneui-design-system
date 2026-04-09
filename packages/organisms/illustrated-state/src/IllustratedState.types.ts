import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { OneUIButtonProps, OneUIHeadingProps } from "@functions-oneui/atoms";

export type IllustratedStateVariant =
  | "custom"
  | "error"
  | "info"
  | "loading"
  | "no-access"
  | "no-data"
  | "no-recent"
  | "no-results";

export type IllustratedStateAction = {
  appearance?: OneUIButtonProps["appearance"];
  disabled?: boolean;
  label: string;
  onClick?: OneUIButtonProps["onClick"];
};

export type IllustratedStateProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  headingLevel?: OneUIHeadingProps["level"];
  illustration?: ReactNode;
  primaryAction?: IllustratedStateAction;
  secondaryAction?: IllustratedStateAction;
  surfaceAppearance?: "card" | "borderless";
  title?: ReactNode;
  variant?: IllustratedStateVariant;
};
