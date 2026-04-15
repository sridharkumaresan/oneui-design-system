import type { HTMLAttributes, ReactNode } from "react";

import type { LoadingStatus } from "@functions-oneui/react-utils/progressive-loading";
import type { OneUIBadgeTone } from "@functions-oneui/atoms";

export type SmartProgressBarItem = {
  accentTone?: OneUIBadgeTone;
  count?: number;
  id: string;
  label: ReactNode;
  status: LoadingStatus;
  tone?: OneUIBadgeTone;
};

export type SmartProgressBarMode = "full" | "slim";

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
  mode?: SmartProgressBarMode;
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
