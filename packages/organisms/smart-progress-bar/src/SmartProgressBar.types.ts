import type { HTMLAttributes, ReactNode } from "react";

import type { LoadingStatus } from "@functions-oneui/react-utils/progressive-loading";

export type SmartProgressBarItem = {
  count?: number;
  id: string;
  label: ReactNode;
  status: LoadingStatus;
};

export type SmartProgressBarProps = HTMLAttributes<HTMLElement> & {
  ariaLabel?: string;
  chipsAriaLabel?: string;
  completed: number;
  delayed?: number;
  description?: ReactNode;
  empty?: number;
  error?: number;
  items?: SmartProgressBarItem[];
  loading?: number;
  percent?: number;
  progressBarAriaLabel?: string;
  refreshing?: number;
  showChips?: boolean;
  showProgressBar?: boolean;
  showSummary?: boolean;
  success?: number;
  summaryText?: ReactNode;
  title: ReactNode;
  total: number;
};
