import React from "react";

import { HeroBanner } from "./HeroBanner.js";
import type { BrandedHeroBannerProps } from "./HeroBanner.types.js";

export const BrandedHeroBanner = (
  props: BrandedHeroBannerProps
): React.JSX.Element => {
  const { surfaceKey = "heroPrimary", ...restProps } = props;

  return (
    <HeroBanner
      {...restProps}
      contentTone="inverse"
      data-oneui-branded-hero-banner=""
      data-oneui-branded-hero-banner-surface-key={surfaceKey}
      surfaceKey={surfaceKey}
    />
  );
};
