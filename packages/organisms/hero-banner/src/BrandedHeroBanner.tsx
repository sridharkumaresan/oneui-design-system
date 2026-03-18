import React from "react";

import { HeroBanner } from "./HeroBanner.js";
import type {
  BrandedHeroBannerProps,
  BrandedHeroBannerVariant
} from "./HeroBanner.types.js";

const brandedHeroVariantToGradientName: Record<
  BrandedHeroBannerVariant,
  "deepSpectrum" | "midnightBlue"
> = {
  primary: "deepSpectrum",
  secondary: "midnightBlue"
};

export const BrandedHeroBanner = (
  props: BrandedHeroBannerProps
): React.JSX.Element => {
  const { variant = "primary", ...restProps } = props;

  return (
    <HeroBanner
      {...restProps}
      contentTone="inverse"
      data-oneui-branded-hero-banner=""
      data-oneui-branded-hero-banner-variant={variant}
      gradientName={brandedHeroVariantToGradientName[variant]}
      surfaceVariant="gradient"
    />
  );
};
