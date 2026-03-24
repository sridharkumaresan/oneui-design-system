import React from "react";

import { HeroBanner } from "./HeroBanner.js";
import type {
  BrandedHeroBannerProps,
  BrandedHeroBannerVariant
} from "./HeroBanner.types.js";

const brandedHeroVariantToSurfaceKey: Record<
  BrandedHeroBannerVariant,
  "heroPrimary" | "heroSecondary"
> = {
  primary: "heroPrimary",
  secondary: "heroSecondary"
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
      surfaceKey={brandedHeroVariantToSurfaceKey[variant]}
    />
  );
};
