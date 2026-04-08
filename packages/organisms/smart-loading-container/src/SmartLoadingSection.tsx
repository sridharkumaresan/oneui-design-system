import React from "react";

import {
  OneUIBadge,
  OneUIButton,
  OneUIHeading,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";
import { useOneUIId } from "@functions-oneui/react-utils";
import type { LoadingStatus } from "@functions-oneui/react-utils/progressive-loading";
import { mergeClasses } from "@fluentui/react-components";

import { useSmartLoadingContainerClassNames } from "./SmartLoadingContainer.styles.js";
import type { SmartLoadingSectionProps } from "./SmartLoadingContainer.types.js";

type AccentTone = NonNullable<SmartLoadingSectionProps["accentTone"]>;

const statusToneMap: Record<
  LoadingStatus,
  "warning" | "danger" | "neutral" | "info" | "success" | "brand"
> = {
  delayed: "warning",
  empty: "neutral",
  error: "danger",
  idle: "neutral",
  loading: "info",
  refreshing: "brand",
  success: "success"
};

const statusAppearanceMap: Record<LoadingStatus, "soft" | "outlined"> = {
  delayed: "outlined",
  empty: "outlined",
  error: "outlined",
  idle: "outlined",
  loading: "outlined",
  refreshing: "outlined",
  success: "outlined"
};

const SpinnerIcon = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
  >
    <path
      d="M6 1.25a4.75 4.75 0 1 0 4.56 6.06"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const WarningIcon = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
    <path
      d="M6 1.5 10.75 10H1.25L6 1.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.25"
    />
    <path d="M6 4.5V6.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.25" />
    <circle cx="6" cy="8.5" fill="currentColor" r=".7" />
  </svg>
);

const EmptyIcon = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
    <circle cx="5" cy="5" r="3.25" stroke="currentColor" strokeWidth="1.25" />
    <path d="m7.6 7.6 2 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.25" />
  </svg>
);

const SuccessIcon = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
    <path
      d="m2.5 6.1 2.1 2.15 4.9-4.8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const AvatarFallbackIcon = (): React.JSX.Element => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
    <circle cx="8" cy="5.25" r="2.25" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M3.25 12a4.75 4.75 0 0 1 9.5 0"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.4"
    />
  </svg>
);

const getStatusIcon = (
  effectiveStatus: LoadingStatus,
  spinnerClassName?: string
): React.JSX.Element => {
  if (effectiveStatus === "loading" || effectiveStatus === "refreshing") {
    return <SpinnerIcon className={spinnerClassName} />;
  }

  if (effectiveStatus === "delayed" || effectiveStatus === "error") {
    return <WarningIcon />;
  }

  if (effectiveStatus === "empty" || effectiveStatus === "idle") {
    return <EmptyIcon />;
  }

  return <SuccessIcon />;
};

const getSectionAccentClassNames = (
  classNames: ReturnType<typeof useSmartLoadingContainerClassNames>,
  accentTone: AccentTone
): {
  avatar: string;
  header: string;
  section: string;
} => {
  switch (accentTone) {
    case "brand":
      return {
        avatar: classNames.sectionAvatarAccentBrand,
        header: classNames.sectionHeaderAccentBrand,
        section: classNames.sectionAccentBrand
      };
    case "info":
      return {
        avatar: classNames.sectionAvatarAccentInfo,
        header: classNames.sectionHeaderAccentInfo,
        section: classNames.sectionAccentInfo
      };
    case "success":
      return {
        avatar: classNames.sectionAvatarAccentSuccess,
        header: classNames.sectionHeaderAccentSuccess,
        section: classNames.sectionAccentSuccess
      };
    case "warning":
      return {
        avatar: classNames.sectionAvatarAccentWarning,
        header: classNames.sectionHeaderAccentWarning,
        section: classNames.sectionAccentWarning
      };
    case "danger":
      return {
        avatar: classNames.sectionAvatarAccentDanger,
        header: classNames.sectionHeaderAccentDanger,
        section: classNames.sectionAccentDanger
      };
    default:
      return {
        avatar: classNames.sectionAvatarAccentNeutral,
        header: classNames.sectionHeaderAccentNeutral,
        section: classNames.sectionAccentNeutral
      };
  }
};

const getStatusInlineIconClassName = (
  classNames: ReturnType<typeof useSmartLoadingContainerClassNames>,
  effectiveStatus: LoadingStatus
): string => {
  if (effectiveStatus === "loading" || effectiveStatus === "refreshing") {
    return mergeClasses(classNames.statusInlineIcon, classNames.statusInlineIconInfo);
  }

  if (effectiveStatus === "delayed") {
    return mergeClasses(classNames.statusInlineIcon, classNames.statusInlineIconWarning);
  }

  if (effectiveStatus === "error") {
    return mergeClasses(classNames.statusInlineIcon, classNames.statusInlineIconDanger);
  }

  return mergeClasses(classNames.statusInlineIcon, classNames.statusInlineIconNeutral);
};

const getStatusInlineMessageClassName = (
  classNames: ReturnType<typeof useSmartLoadingContainerClassNames>,
  effectiveStatus: LoadingStatus
): string => {
  if (effectiveStatus === "loading" || effectiveStatus === "refreshing") {
    return mergeClasses(classNames.statusInlineMessage, classNames.statusInlineMessageInfo);
  }

  if (effectiveStatus === "delayed") {
    return mergeClasses(classNames.statusInlineMessage, classNames.statusInlineMessageWarning);
  }

  if (effectiveStatus === "error") {
    return mergeClasses(classNames.statusInlineMessage, classNames.statusInlineMessageDanger);
  }

  return mergeClasses(classNames.statusInlineMessage, classNames.statusInlineMessageSubtle);
};

const getEffectiveStatus = ({
  delayedTriggered,
  status
}: {
  delayedTriggered: boolean;
  status: LoadingStatus;
}): LoadingStatus => {
  if (status === "loading" && delayedTriggered) {
    return "delayed";
  }

  return status;
};

const getStatusSummaryText = ({
  count,
  effectiveStatus,
  statusDisplayMode
}: {
  count?: number;
  effectiveStatus: LoadingStatus;
  statusDisplayMode: NonNullable<SmartLoadingSectionProps["statusDisplayMode"]>;
}): React.ReactNode => {
  if (statusDisplayMode === "minimal") {
    if (effectiveStatus === "success") {
      return typeof count === "number" ? `${count} results` : "Ready";
    }

    if (effectiveStatus === "refreshing") {
      return "Refreshing";
    }

    if (effectiveStatus === "loading") {
      return "Loading";
    }

    if (effectiveStatus === "delayed") {
      return "Delayed";
    }

    if (effectiveStatus === "error") {
      return "Error";
    }

    if (effectiveStatus === "empty") {
      return "No results";
    }
  }

  if (effectiveStatus === "success") {
    return typeof count === "number" ? `${count} results` : "Ready";
  }

  if (effectiveStatus === "refreshing") {
    return "Refreshing";
  }

  if (effectiveStatus === "loading") {
    return "Fetching results...";
  }

  if (effectiveStatus === "delayed") {
    return "Taking longer than expected";
  }

  if (effectiveStatus === "error") {
    return "Error loading results";
  }

  if (effectiveStatus === "empty") {
    return "No results";
  }

  return "Ready";
};

const getStatusBadgeText = (effectiveStatus: LoadingStatus): React.ReactNode | null => {
  if (effectiveStatus === "success") {
    return null;
  }

  if (effectiveStatus === "refreshing") {
    return "Refreshing";
  }

  if (effectiveStatus === "loading") {
    return "Loading";
  }

  if (effectiveStatus === "delayed") {
    return "Delayed";
  }

  if (effectiveStatus === "error") {
    return "Error";
  }

  if (effectiveStatus === "empty") {
    return "Empty";
  }

  return "Ready";
};

const renderStateBody = ({
  classNames,
  delayedMessage,
  effectiveStatus,
  emptyMessage,
  errorMessage,
  loadingLabel,
  onRetry,
  retryLabel
}: Pick<
  SmartLoadingSectionProps,
  "delayedMessage" | "emptyMessage" | "errorMessage" | "loadingLabel" | "onRetry" | "retryLabel"
> & {
  classNames: ReturnType<typeof useSmartLoadingContainerClassNames>;
  effectiveStatus: Extract<LoadingStatus, "loading" | "delayed" | "error" | "empty" | "idle">;
}): React.ReactNode => {
  const renderSimpleStateMessage = (message: React.ReactNode): React.ReactNode => {
    const inlineIconClassName = getStatusInlineIconClassName(classNames, effectiveStatus);
    const inlineMessageClassName = mergeClasses(
      getStatusInlineMessageClassName(classNames, effectiveStatus),
      classNames.statusInlineMessageBody
    );

    return (
      <div className={classNames.stateMessage}>
        <span className={mergeClasses(classNames.statusInline, classNames.statusInlineBody)}>
          <span className={inlineIconClassName}>
            {effectiveStatus === "loading" ? (
              <SpinnerIcon className={classNames.spinnerIcon} />
            ) : (
              getStatusIcon(effectiveStatus)
            )}
          </span>
          <span className={inlineMessageClassName}>{message}</span>
        </span>
      </div>
    );
  };

  if (effectiveStatus === "loading") {
    return renderSimpleStateMessage(loadingLabel ?? "Loading section content...");
  }

  if (effectiveStatus === "delayed") {
    return renderSimpleStateMessage(
      delayedMessage ?? "This section is taking longer than usual to respond."
    );
  }

  if (effectiveStatus === "error") {
    return (
      <OneUIStack className={classNames.stateMessage} gap="sm">
        {renderSimpleStateMessage(errorMessage ?? "We could not load content for this section.")}
        {onRetry ? (
          <div className={classNames.stateActionsRow}>
            <OneUIButton onClick={onRetry}>{retryLabel ?? "Retry"}</OneUIButton>
          </div>
        ) : null}
      </OneUIStack>
    );
  }

  if (effectiveStatus === "empty") {
    return renderSimpleStateMessage(
      emptyMessage ?? "No content is available for this section right now."
    );
  }

  return renderSimpleStateMessage("This section is ready to load.");
};

const shouldAutoCollapse = ({
  autoCollapseOnDelayed,
  autoCollapseOnError,
  collapseOnEmpty,
  effectiveStatus
}: {
  autoCollapseOnDelayed: boolean;
  autoCollapseOnError: boolean;
  collapseOnEmpty: boolean;
  effectiveStatus: LoadingStatus;
}): boolean => {
  if (effectiveStatus === "error") {
    return autoCollapseOnError;
  }

  if (effectiveStatus === "delayed") {
    return autoCollapseOnDelayed;
  }

  if (effectiveStatus === "empty") {
    return collapseOnEmpty;
  }

  return false;
};

export const SmartLoadingSection = (props: SmartLoadingSectionProps): React.JSX.Element => {
  const {
    actions,
    accentTone = "neutral",
    as = "section",
    autoCollapseOnDelayed = false,
    autoCollapseOnError = false,
    avatar,
    children,
    className,
    collapsible = false,
    collapseOnEmpty = false,
    count,
    defaultCollapsed = false,
    delayedMessage,
    delayedThresholdMs,
    description,
    emptyMessage,
    errorMessage,
    expandOnSuccess = false,
    headingLevel = 3,
    loadingLabel,
    onCollapsedChange,
    onRetry,
    retryLabel,
    status,
    statusDisplayMode = "inline",
    title,
    ...restProps
  } = props;
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const [delayedTriggered, setDelayedTriggered] = React.useState(false);
  const bodyId = useOneUIId("oneui-smart-loading-section-body");
  const titleId = useOneUIId("oneui-smart-loading-section-title");
  const classNames = useSmartLoadingContainerClassNames("single", className);
  const Component = as as React.ElementType;
  const effectiveStatus = getEffectiveStatus({
    delayedTriggered,
    status
  });
  const collapsed = collapsible ? internalCollapsed : false;
  const showChildren = effectiveStatus === "success" || effectiveStatus === "refreshing";
  const stateBody = showChildren
    ? children
    : renderStateBody({
        classNames,
        delayedMessage,
        effectiveStatus,
        emptyMessage,
        errorMessage,
        loadingLabel,
        onRetry,
        retryLabel
      });
  const summaryText = getStatusSummaryText({
    count,
    effectiveStatus,
    statusDisplayMode
  });
  const statusBadgeText = getStatusBadgeText(effectiveStatus);
  const hasActions = Boolean(actions);
  const displayCount =
    typeof count === "number"
      ? count
      : effectiveStatus === "loading" ||
          effectiveStatus === "refreshing" ||
          effectiveStatus === "delayed" ||
          effectiveStatus === "empty"
        ? 0
        : undefined;
  const accentClassNames = getSectionAccentClassNames(classNames, accentTone);
  const statusInlineIconClassName = getStatusInlineIconClassName(classNames, effectiveStatus);
  const statusInlineMessageClassName = getStatusInlineMessageClassName(classNames, effectiveStatus);

  React.useEffect(() => {
    if (status !== "loading" || !delayedThresholdMs) {
      setDelayedTriggered(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setDelayedTriggered(true);
    }, delayedThresholdMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delayedThresholdMs, status]);

  React.useEffect(() => {
    if (!collapsible) {
      return;
    }

    const nextShouldCollapse = shouldAutoCollapse({
      autoCollapseOnDelayed,
      autoCollapseOnError,
      collapseOnEmpty,
      effectiveStatus
    });

    if (nextShouldCollapse && !internalCollapsed) {
      setInternalCollapsed(true);
      onCollapsedChange?.(true);
      return;
    }

    if (
      expandOnSuccess &&
      (effectiveStatus === "success" || effectiveStatus === "refreshing") &&
      internalCollapsed
    ) {
      setInternalCollapsed(false);
      onCollapsedChange?.(false);
    }
  }, [
    autoCollapseOnDelayed,
    autoCollapseOnError,
    collapseOnEmpty,
    collapsible,
    effectiveStatus,
    expandOnSuccess,
    internalCollapsed,
    onCollapsedChange
  ]);

  const handleToggle = React.useCallback(() => {
    if (!collapsible) {
      return;
    }

    const nextCollapsed = !internalCollapsed;
    setInternalCollapsed(nextCollapsed);
    onCollapsedChange?.(nextCollapsed);
  }, [collapsible, internalCollapsed, onCollapsedChange]);

  const statusIndicator =
    effectiveStatus === "loading" ||
    effectiveStatus === "refreshing" ||
    effectiveStatus === "delayed" ||
    effectiveStatus === "error" ||
    effectiveStatus === "empty" ||
    effectiveStatus === "idle" ? (
      <span className={classNames.statusInline}>
        <span className={statusInlineIconClassName}>
          {effectiveStatus === "loading" || effectiveStatus === "refreshing" ? (
            <SpinnerIcon className={classNames.spinnerIcon} />
          ) : (
            getStatusIcon(effectiveStatus)
          )}
        </span>
        <span className={statusInlineMessageClassName}>{summaryText}</span>
      </span>
    ) : null;

  const statusDisplay =
    statusDisplayMode === "minimal" ? (
      <OneUIText
        className={classNames.statusSummaryMinimal}
        tone={effectiveStatus === "error" ? "danger" : "secondary"}
      >
        {summaryText}
      </OneUIText>
    ) : (
      <div className={classNames.headerMeta}>
        {typeof displayCount === "number" ? (
          <OneUIBadge
            appearance="outlined"
            className={classNames.countBadge}
            shape="pill"
            size="sm"
            tone={accentTone === "info" ? "brand" : accentTone}
          >
            {displayCount}
          </OneUIBadge>
        ) : null}
        {statusDisplayMode === "badge" && statusBadgeText ? (
          <OneUIBadge
            appearance={statusAppearanceMap[effectiveStatus]}
            className={classNames.statusBadge}
            icon={getStatusIcon(effectiveStatus, classNames.spinnerIcon)}
            shape="pill"
            size="sm"
            tone={statusToneMap[effectiveStatus]}
          >
            {statusDisplayMode === "badge" ? summaryText : statusBadgeText}
          </OneUIBadge>
        ) : null}
        {statusDisplayMode === "inline" ? statusIndicator : null}
      </div>
    );

  const stateRegionClassName = mergeClasses(
    classNames.stateRegion,
    effectiveStatus === "loading" ||
      effectiveStatus === "delayed" ||
      effectiveStatus === "error" ||
      effectiveStatus === "empty" ||
      effectiveStatus === "idle"
      ? classNames.stateRegionFeedback
      : undefined,
    effectiveStatus === "loading"
      ? classNames.stateRegionLoading
      : effectiveStatus === "delayed"
        ? classNames.stateRegionDelayed
        : effectiveStatus === "error"
          ? classNames.stateRegionError
          : effectiveStatus === "empty"
            ? classNames.stateRegionEmpty
            : undefined
  );

  return React.createElement(
    Component,
    {
      ...restProps,
      "aria-busy":
        effectiveStatus === "loading" ||
        effectiveStatus === "delayed" ||
        effectiveStatus === "refreshing",
      "aria-labelledby": titleId,
      className: mergeClasses(classNames.section, accentClassNames.section),
      "data-oneui-smart-loading-section": ""
    },
    <>
      <div className={mergeClasses(classNames.sectionHeader, accentClassNames.header)}>
        <div className={classNames.sectionHeaderMain}>
          <span className={mergeClasses(classNames.sectionAvatar, accentClassNames.avatar)}>
            {avatar ?? <AvatarFallbackIcon />}
          </span>
          <div className={classNames.sectionHeading}>
            <OneUIHeading className={classNames.sectionTitle} id={titleId} level={headingLevel}>
              {title}
            </OneUIHeading>
            {description ? <OneUIText tone="secondary">{description}</OneUIText> : null}
          </div>
        </div>

        <div className={classNames.sectionMetaRail}>
          {statusDisplay}
          {hasActions ? <span className={classNames.metaAction}>{actions}</span> : null}
          {collapsible ? (
            <button
              aria-controls={bodyId}
              aria-expanded={!collapsed}
              aria-label={`${collapsed ? "Expand" : "Collapse"} ${String(title)}`}
              className={classNames.chevronButton}
              onClick={handleToggle}
              type="button"
            >
              <span
                aria-hidden="true"
                className={collapsed ? classNames.chevronCollapsed : classNames.chevronExpanded}
              />
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={mergeClasses(
          classNames.bodyViewport,
          collapsed ? classNames.bodyViewportCollapsed : undefined
        )}
        data-oneui-smart-loading-section-body=""
        id={bodyId}
      >
        <div className={classNames.bodyViewportInner}>
          <div className={classNames.body}>
            {showChildren ? (
              <>
                {effectiveStatus === "refreshing" ? (
                  <div className={classNames.stateBanner}>
                    <OneUIText tone="secondary">
                      Refreshing section content while keeping current results visible.
                    </OneUIText>
                  </div>
                ) : null}
                {children}
              </>
            ) : (
              <div className={stateRegionClassName}>
                {effectiveStatus === "loading" ? (
                  <div aria-hidden="true" className={classNames.loadingSkeleton}>
                    <div className={classNames.loadingLinePrimary} />
                    <div className={classNames.loadingLineSecondary} />
                    <div className={classNames.loadingLineTertiary} />
                  </div>
                ) : null}
                <div className={classNames.stateBody}>{stateBody}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
