import React from "react";

import { OneUIHeading, OneUIText } from "@functions-oneui/atoms";
import { useOneUIId } from "@functions-oneui/react-utils";
import {
  resolveOneUISurfaceVariantKey,
  useOneUISurfaces
} from "@functions-oneui/theme";

import { useHeroBannerClassNames } from "./HeroBanner.styles.js";
import type { HeroBannerProps } from "./HeroBanner.types.js";

export const HeroBanner = (props: HeroBannerProps): React.JSX.Element => {
  const {
    as = "section",
    aside,
    backgroundColor,
    className,
    contentTone,
    description,
    eyebrow,
    footer,
    headingLevel = 2,
    height = "immersive",
    surfaceKey = "gradientCyanGreen",
    style,
    supportingContent,
    title,
    topEnd,
    topStart,
    ...restProps
  } = props;
  const surfaces = useOneUISurfaces();
  const titleId = useOneUIId("oneui-hero-banner-title");
  const heroBannerDescriptionId = useOneUIId("oneui-hero-banner-description");
  const descriptionId = description ? heroBannerDescriptionId : undefined;
  const resolvedSurfaceKey = resolveOneUISurfaceVariantKey(surfaceKey);
  const resolvedSurface = surfaces[resolvedSurfaceKey];
  const resolvedContentTone =
    contentTone ??
    (resolvedSurface.recommendedForeground === "inverse" ? "inverse" : "default");
  const classNames = useHeroBannerClassNames({
    className,
    contentTone: resolvedContentTone,
    hasAside: Boolean(aside),
    height
  });
  const titleTone = resolvedContentTone === "inverse" ? "inverse" : "default";
  const descriptionTone = resolvedContentTone === "inverse" ? "inverse" : "secondary";
  const surfaceStyle = backgroundColor
    ? {
        backgroundColor
      }
    : {
        backgroundColor: resolvedSurface.background.backgroundColor,
        backgroundImage: resolvedSurface.background.backgroundImage,
        border: resolvedSurface.borderColor
          ? `1px solid ${resolvedSurface.borderColor}`
          : undefined
      };

  const resolvedStyle = {
    ...surfaceStyle,
    ...style
  };

  return React.createElement(
    as,
    {
      ...restProps,
      "aria-describedby": descriptionId,
      "aria-labelledby": titleId,
      className: classNames.root,
      "data-oneui-hero-banner": "",
      "data-oneui-hero-banner-gradient-name": resolvedSurface.rawGradientName,
      "data-oneui-hero-banner-selected-surface-key": surfaceKey,
      "data-oneui-hero-banner-surface-key": resolvedSurface.key,
      "data-oneui-hero-banner-surface-variant": resolvedSurface.type,
      role: "region",
      style: resolvedStyle
    },
    <div className={classNames.inner}>
      {topStart || topEnd ? (
        <div className={classNames.topRow} data-oneui-hero-banner-top-row="">
          <div data-oneui-hero-banner-top-start="">{topStart}</div>
          <div data-oneui-hero-banner-top-end="">{topEnd}</div>
        </div>
      ) : null}
      <div className={classNames.mainGrid} data-oneui-hero-banner-main="">
        <div className={classNames.contentColumn}>
          <div className={classNames.textBlock}>
            {eyebrow ? <div data-oneui-hero-banner-eyebrow="">{eyebrow}</div> : null}
            <OneUIHeading id={titleId} level={headingLevel} tone={titleTone}>
              {title}
            </OneUIHeading>
            {description ? (
              <OneUIText block id={descriptionId} size="bodyLarge" tone={descriptionTone}>
                {description}
              </OneUIText>
            ) : null}
          </div>
          {supportingContent ? (
            <div className={classNames.supportingContent} data-oneui-hero-banner-supporting-content="">
              {supportingContent}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div className={classNames.aside} data-oneui-hero-banner-aside="">
            {aside}
          </div>
        ) : null}
      </div>
      {footer ? (
        <div className={classNames.footer} data-oneui-hero-banner-footer="">
          {footer}
        </div>
      ) : null}
    </div>
  );
};
