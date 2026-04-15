import type { HTMLAttributes, JSX, ReactNode } from "react";

import type { LoadingStatus } from "@functions-oneui/react-utils/progressive-loading";

export type SmartLoadingLayout = "single" | "split";
export type SmartLoadingSurfaceAppearance = "flat" | "raised";
export type SmartLoadingShape = "rounded" | "square";
export type SmartLoadingSectionAccentTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type SmartLoadingContainerProps = HTMLAttributes<HTMLElement> & {
  actions?: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  description?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  layout?: SmartLoadingLayout;
  progressSlot?: ReactNode;
  shape?: SmartLoadingShape;
  surfaceAppearance?: SmartLoadingSurfaceAppearance;
  title: ReactNode;
};

export type SmartLoadingSectionProps = HTMLAttributes<HTMLElement> & {
  autoCollapseOnDelayed?: boolean;
  autoCollapseOnError?: boolean;
  actions?: ReactNode;
  accentTone?: SmartLoadingSectionAccentTone;
  as?: keyof JSX.IntrinsicElements;
  avatar?: ReactNode;
  children?: ReactNode;
  className?: string;
  collapsible?: boolean;
  collapseOnEmpty?: boolean;
  count?: number;
  defaultCollapsed?: boolean;
  delayedThresholdMs?: number;
  delayedContent?: ReactNode;
  delayedMessage?: ReactNode;
  description?: ReactNode;
  emptyContent?: ReactNode;
  emptyMessage?: ReactNode;
  errorContent?: ReactNode;
  errorMessage?: ReactNode;
  expandOnSuccess?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  idleContent?: ReactNode;
  loadingContent?: ReactNode;
  loadingLabel?: ReactNode;
  onCollapsedChange?: (collapsed: boolean) => void;
  onRetry?: () => void;
  retryLabel?: ReactNode;
  shape?: SmartLoadingShape;
  statusDisplayMode?: "inline" | "badge" | "minimal";
  surfaceAppearance?: SmartLoadingSurfaceAppearance;
  status: LoadingStatus;
  title: ReactNode;
};
