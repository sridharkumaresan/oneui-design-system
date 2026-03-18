import React from "react";
import { useFluent } from "@fluentui/react-components";

import { OneUIHeading, OneUIText } from "@functions-oneui/atoms";
import { useOneUIId } from "@functions-oneui/react-utils";
import { useOneUIGradients } from "@functions-oneui/theme";

import { useHeroBannerClassNames } from "./HeroBanner.styles.js";
import type { HeroBannerProps } from "./HeroBanner.types.js";

export const HeroBanner = (props: HeroBannerProps): React.JSX.Element => {
  const {
    as = "section",
    aside,
    backgroundColor,
    className,
    contentTone = "inverse",
    description,
    eyebrow,
    footer,
    gradientName = "deepSpectrum",
    headingLevel = 2,
    height = "immersive",
    style,
    supportingContent,
    surfaceVariant = "solid",
    title,
    topEnd,
    topStart,
    ...restProps
  } = props;
  const classNames = useHeroBannerClassNames({
    className,
    contentTone,
    hasAside: Boolean(aside),
    height
  });
  const gradients = useOneUIGradients();
  const theme = ((useFluent() as unknown as { theme?: Record<string, string | number | undefined> })
    .theme ?? {}) as Record<string, string | number | undefined>;
  const titleId = useOneUIId("oneui-hero-banner-title");
  const descriptionId = description
    ? useOneUIId("oneui-hero-banner-description")
    : undefined;
  const titleTone = contentTone === "inverse" ? "inverse" : "default";
  const descriptionTone = contentTone === "inverse" ? "inverse" : "secondary";
  const resolvedGradient = gradients[gradientName];
  const surfaceStyle =
    surfaceVariant === "gradient"
      ? {
          backgroundColor: resolvedGradient.fallbackSolidColor,
          backgroundImage: resolvedGradient.css
        }
      : {
          backgroundColor:
            backgroundColor ??
            (contentTone === "inverse"
              ? String(
                  theme.oneuiColorBackgroundBrandStrong ??
                    theme.colorBrandBackground ??
                    ""
                )
              : String(
                  theme.colorNeutralBackground1 ??
                    theme.oneuiColorBackgroundCanvas ??
                    ""
                ))
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
      "data-oneui-hero-banner-gradient-name": surfaceVariant === "gradient" ? gradientName : undefined,
      "data-oneui-hero-banner-surface-variant": surfaceVariant,
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
