import type { HTMLAttributes, JSX, ReactNode } from "react";

import type { OneUIGradientRoleName } from "@functions-oneui/theme";

export type HeroBannerContentTone = "default" | "inverse";
export type HeroBannerHeight = "comfortable" | "immersive";
export type HeroBannerSurfaceVariant = "solid" | "gradient";

export type HeroBannerProps = HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  aside?: ReactNode;
  backgroundColor?: string;
  contentTone?: HeroBannerContentTone;
  description?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  gradientRole?: OneUIGradientRoleName;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  height?: HeroBannerHeight;
  supportingContent?: ReactNode;
  surfaceVariant?: HeroBannerSurfaceVariant;
  title: ReactNode;
  topEnd?: ReactNode;
  topStart?: ReactNode;
};
