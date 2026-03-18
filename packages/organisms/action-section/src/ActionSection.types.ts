import type { HTMLAttributes, ReactNode } from "react";

export type ActionSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
  count?: ReactNode;
  headerAction?: ReactNode;
  title: ReactNode;
};
