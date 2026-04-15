import type { HTMLAttributeReferrerPolicy } from "react";

export type ImageLoadState = "empty" | "loading" | "loaded" | "error";

export type UseImageLoaderOptions = {
  crossOrigin?: "" | "anonymous" | "use-credentials";
  decode?: boolean;
  fallbackSrc?: string | null | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  src?: string | null | undefined;
  timeoutMs?: number;
};

export type UseImageLoaderResult = {
  didUseFallback: boolean;
  error?: string;
  height?: number;
  resolvedSrc?: string;
  retry: () => void;
  state: ImageLoadState;
  width?: number;
};
