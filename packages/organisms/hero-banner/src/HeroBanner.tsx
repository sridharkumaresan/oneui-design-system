import React from "react";

import { OneUIHeading, OneUIText } from "@functions-oneui/atoms";

import { useHeroBannerClassNames } from "./HeroBanner.styles.js";
import type { HeroBannerProps } from "./HeroBanner.types.js";

export const HeroBanner = (props: HeroBannerProps): React.JSX.Element => {
  const {
    as = "section",
    backgroundColor,
    className,
    contentTone = "inverse",
    description,
    headingLevel = 2,
    height = "immersive",
    imageAlt,
    imageObjectPosition = "center center",
    imagePosition = "end",
    imageSrc,
    style,
    title,
    ...restProps
  } = props;
  const classNames = useHeroBannerClassNames({
    className,
    contentTone,
    height,
    imagePosition
  });
  const titleId = React.useId();
  const descriptionId = description ? React.useId() : undefined;
  const resolvedStyle = backgroundColor ? { ...style, backgroundColor } : style;
  const titleTone = contentTone === "inverse" ? "inverse" : "default";
  const descriptionTone = contentTone === "inverse" ? "inverse" : "secondary";
  const imageAltText = imageAlt ?? "";
  const imageIsDecorative = imageAltText.length === 0;

  return React.createElement(
    as,
    {
      ...restProps,
      "aria-describedby": descriptionId,
      "aria-labelledby": titleId,
      className: classNames.root,
      "data-oneui-hero-banner": "",
      "data-oneui-hero-banner-image-position": imagePosition,
      role: "region",
      style: resolvedStyle
    },
    <div className={classNames.inner}>
      <div className={classNames.content}>
        <div className={classNames.contentBody}>
          <OneUIHeading id={titleId} level={headingLevel} tone={titleTone}>
            {title}
          </OneUIHeading>
          {description ? (
            <OneUIText block id={descriptionId} size="bodyLarge" tone={descriptionTone}>
              {description}
            </OneUIText>
          ) : null}
        </div>
      </div>
      <div className={classNames.media}>
        <img
          alt={imageAltText}
          aria-hidden={imageIsDecorative ? "true" : undefined}
          className={classNames.image}
          draggable="false"
          src={imageSrc}
          style={{ objectPosition: imageObjectPosition }}
        />
      </div>
    </div>
  );
};
