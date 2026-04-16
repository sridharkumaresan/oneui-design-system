import type { CSSProperties, ImgHTMLAttributes, ReactNode } from "react";

import type { ImageLoadState } from "@functions-oneui/react-utils";

export type OneUIImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export type OneUIImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "children" | "src"> & {
  alt: string;
  aspectRatio?: number | string;
  borderRadius?: CSSProperties["borderRadius"];
  emptyFallback?: ReactNode;
  errorFallback?: ReactNode;
  fallbackSrc?: string;
  fit?: OneUIImageFit;
  loadingFallback?: ReactNode;
  renderStatus?: (context: {
    retry: () => void;
    resolvedSrc?: string;
    state: ImageLoadState;
  }) => ReactNode;
  showRetryOnError?: boolean;
  src?: string | null | undefined;
  timeoutMs?: number;
};
