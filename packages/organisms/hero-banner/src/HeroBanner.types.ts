import type { HTMLAttributes, JSX, ReactNode } from "react";

export type HeroBannerContentTone = "default" | "inverse";
export type HeroBannerHeight = "comfortable" | "immersive";
export type HeroBannerImagePosition = "start" | "end";

export type HeroBannerProps = HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  backgroundColor?: string;
  contentTone?: HeroBannerContentTone;
  description?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  height?: HeroBannerHeight;
  imageAlt?: string;
  imageObjectPosition?: string;
  imagePosition?: HeroBannerImagePosition;
  imageSrc: string;
  title: ReactNode;
};
