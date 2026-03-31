import type { HTMLAttributes, JSX, ReactNode } from "react";

import type { OneUIResolvableSurfaceVariantKey } from "@functions-oneui/theme";

export type HeroBannerContentTone = "default" | "inverse";
export type HeroBannerHeight = "tiny" | "comfortable" | "immersive";

export type HeroBannerSlots = {
  as?: keyof JSX.IntrinsicElements;
  aside?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  height?: HeroBannerHeight;
  supportingContent?: ReactNode;
  title: ReactNode;
  topEnd?: ReactNode;
  topStart?: ReactNode;
};

export type HeroBannerProps = HTMLAttributes<HTMLElement> &
  HeroBannerSlots & {
    backgroundColor?: string;
    contentTone?: HeroBannerContentTone;
    surfaceKey?: OneUIResolvableSurfaceVariantKey;
  };

export type BrandedHeroBannerProps = HeroBannerProps;
