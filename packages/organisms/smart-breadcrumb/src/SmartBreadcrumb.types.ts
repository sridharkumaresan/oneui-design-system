import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";

export type SmartBreadcrumbItem = {
  ariaLabel?: string;
  href?: string;
  id: string;
  label: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
};

export type SmartBreadcrumbProps = HTMLAttributes<HTMLElement> & {
  items: SmartBreadcrumbItem[];
  maxVisibleItems?: number;
  overflowLabel?: string;
};
