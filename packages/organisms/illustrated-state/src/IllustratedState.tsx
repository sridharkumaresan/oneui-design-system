import React from "react";

import {
  OneUIButton,
  OneUIHeading,
  OneUIText,
  type OneUIButtonProps
} from "@functions-oneui/atoms";
import { mergeClasses } from "@fluentui/react-components";

import { useIllustratedStateClassNames } from "./IllustratedState.styles.js";
import type {
  IllustratedStateAction,
  IllustratedStateProps,
  IllustratedStateVariant
} from "./IllustratedState.types.js";

const variantCopyMap: Record<
  Exclude<IllustratedStateVariant, "custom">,
  {
    description: string;
    title: string;
  }
> = {
  error: {
    description: "We couldn't load this content right now. Try again in a moment.",
    title: "Something went wrong"
  },
  info: {
    description: "Share the next best step or the most helpful explanation for this moment.",
    title: "Nothing here right now"
  },
  loading: {
    description: "We're still preparing this content for you.",
    title: "Getting things ready"
  },
  "no-access": {
    description: "Ask the content owner or your administrator if you need access to this area.",
    title: "You don't have access"
  },
  "no-data": {
    description: "Content will appear here once data becomes available.",
    title: "Nothing to show yet"
  },
  "no-recent": {
    description: "Recent items will appear here after you start using this experience.",
    title: "No recent items"
  },
  "no-results": {
    description: "Try a broader search, clear some filters, or search with different keywords.",
    title: "No results found"
  }
};

const renderActionButton = (
  action: IllustratedStateAction,
  defaults: {
    appearance: OneUIButtonProps["appearance"];
  }
): React.ReactNode => {
  return (
    <OneUIButton
      appearance={action.appearance ?? defaults.appearance}
      disabled={action.disabled}
      onClick={action.onClick}
      size="small"
    >
      {action.label}
    </OneUIButton>
  );
};

const MagnifierGlyph = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="48" viewBox="0 0 48 48" width="48">
    <circle cx="21" cy="21" r="9.5" stroke="currentColor" strokeWidth="2.5" />
    <path d="m28 28 8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    <path d="M30 11.5h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    <path d="M33 8.5v6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
  </svg>
);

const TrayGlyph = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="48" viewBox="0 0 48 48" width="48">
    <path
      d="M12 18.5h24l-3 13H15l-3-13Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2.5"
    />
    <path
      d="M17 18.5 20 13h8l3 5.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.5"
    />
    <path d="M18.5 26h11" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
  </svg>
);

const LockGlyph = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="48" viewBox="0 0 48 48" width="48">
    <rect height="15" rx="4" stroke="currentColor" strokeWidth="2.5" width="18" x="15" y="20" />
    <path
      d="M19 20v-3.5a5 5 0 1 1 10 0V20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.5"
    />
    <circle cx="24" cy="27.5" fill="currentColor" r="2" />
  </svg>
);

const ClockGlyph = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="48" viewBox="0 0 48 48" width="48">
    <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" />
    <path d="M24 18.5v6l4 2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    <circle cx="13" cy="24" fill="currentColor" r="1.75" />
    <circle cx="9" cy="24" fill="currentColor" r="1.25" opacity="0.65" />
  </svg>
);

const WarningGlyph = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="48" viewBox="0 0 48 48" width="48">
    <path
      d="M24 11.5 37 35H11L24 11.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2.5"
    />
    <path d="M24 19v8.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    <circle cx="24" cy="31.5" fill="currentColor" r="1.8" />
  </svg>
);

const InfoGlyph = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="48" viewBox="0 0 48 48" width="48">
    <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" />
    <path d="M24 22.5v7" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    <circle cx="24" cy="18" fill="currentColor" r="1.7" />
  </svg>
);

const SpinnerGlyph = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height="48"
    viewBox="0 0 48 48"
    width="48"
  >
    <path
      d="M24 13a11 11 0 1 0 10.6 14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.75"
    />
  </svg>
);

const getPaletteClassName = (
  classNames: ReturnType<typeof useIllustratedStateClassNames>,
  variant: IllustratedStateVariant
): string => {
  if (variant === "error") {
    return classNames.illustrationPaletteDanger;
  }

  if (variant === "loading") {
    return classNames.illustrationPaletteInfo;
  }

  if (variant === "no-access") {
    return classNames.illustrationPaletteWarning;
  }

  if (variant === "no-data") {
    return classNames.illustrationPaletteSuccess;
  }

  if (variant === "no-recent") {
    return classNames.illustrationPaletteBrand;
  }

  if (variant === "info" || variant === "custom") {
    return classNames.illustrationPaletteInfo;
  }

  return classNames.illustrationPaletteNeutral;
};

const getVariantGlyph = (
  variant: IllustratedStateVariant,
  classNames: ReturnType<typeof useIllustratedStateClassNames>
): React.ReactNode => {
  if (variant === "loading") {
    return <SpinnerGlyph className={classNames.spinnerGlyph} />;
  }

  if (variant === "error") {
    return <WarningGlyph />;
  }

  if (variant === "no-data") {
    return <TrayGlyph />;
  }

  if (variant === "no-access") {
    return <LockGlyph />;
  }

  if (variant === "no-recent") {
    return <ClockGlyph />;
  }

  if (variant === "no-results") {
    return <MagnifierGlyph />;
  }

  return <InfoGlyph />;
};

const DefaultIllustration = ({
  classNames,
  illustration,
  variant
}: {
  classNames: ReturnType<typeof useIllustratedStateClassNames>;
  illustration?: React.ReactNode;
  variant: IllustratedStateVariant;
}): React.ReactNode => {
  if (illustration) {
    return <>{illustration}</>;
  }

  return (
    <div
      className={mergeClasses(
        classNames.illustrationScene,
        getPaletteClassName(classNames, variant)
      )}
    >
      <span aria-hidden="true" className={classNames.stage} />
      <span aria-hidden="true" className={classNames.stageHalo} />
      <span aria-hidden="true" className={classNames.stageAccentBlock} />
      <span aria-hidden="true" className={classNames.stageDetailDot} />
      <span aria-hidden="true" className={classNames.illustrationGlyph}>
        {getVariantGlyph(variant, classNames)}
      </span>
    </div>
  );
};

export const IllustratedState = (props: IllustratedStateProps): React.JSX.Element => {
  const {
    actions,
    children,
    className,
    description,
    headingLevel = 2,
    illustration,
    primaryAction,
    secondaryAction,
    surfaceAppearance = "card",
    title,
    variant = "info",
    ...restProps
  } = props;
  const classNames = useIllustratedStateClassNames(className);
  const titleId = React.useId();
  const defaultCopy =
    variant === "custom"
      ? undefined
      : variantCopyMap[variant as Exclude<IllustratedStateVariant, "custom">];
  const resolvedTitle = title ?? defaultCopy?.title;
  const resolvedDescription = description ?? defaultCopy?.description;
  const role = variant === "loading" ? "status" : resolvedTitle ? "region" : undefined;
  const actionContent =
    actions ??
    (primaryAction || secondaryAction ? (
      <>
        {secondaryAction ? renderActionButton(secondaryAction, { appearance: "secondary" }) : null}
        {primaryAction ? renderActionButton(primaryAction, { appearance: "primary" }) : null}
      </>
    ) : null);

  return (
    <section
      {...restProps}
      aria-live={variant === "loading" ? "polite" : undefined}
      aria-labelledby={resolvedTitle ? titleId : undefined}
      className={classNames.root}
      data-oneui-surface-appearance={surfaceAppearance}
      data-oneui-illustrated-state=""
      role={role}
    >
      <div
        className={mergeClasses(
          classNames.surface,
          surfaceAppearance === "borderless" ? classNames.surfaceBorderless : undefined
        )}
      >
        <div className={classNames.illustrationWrap}>
          <DefaultIllustration
            classNames={classNames}
            illustration={illustration}
            variant={variant}
          />
        </div>

        <div className={classNames.copy}>
          {resolvedTitle ? (
            <OneUIHeading id={titleId} level={headingLevel}>
              {resolvedTitle}
            </OneUIHeading>
          ) : null}
          {resolvedDescription ? (
            <OneUIText className={classNames.description} tone="secondary">
              {resolvedDescription}
            </OneUIText>
          ) : null}
        </div>

        {children ? <div className={classNames.extras}>{children}</div> : null}

        {actionContent ? <div className={classNames.actions}>{actionContent}</div> : null}
      </div>
    </section>
  );
};
