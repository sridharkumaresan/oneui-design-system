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

import {
  SmartLoadingShapeContext,
  SmartLoadingSurfaceAppearanceContext
} from "./SmartLoadingContainer.context.js";
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

const getAvatarLabel = (title: React.ReactNode): string => {
  const plainTitle = typeof title === "string" ? title.trim() : "";

  if (!plainTitle) {
    return "?";
  }

  const words = plainTitle.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 1).toUpperCase();
  }

  return `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`.toUpperCase();
};

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

const getStatusInlineClassName = (
  classNames: ReturnType<typeof useSmartLoadingContainerClassNames>,
  effectiveStatus: LoadingStatus
): string => {
  if (effectiveStatus === "loading" || effectiveStatus === "refreshing") {
    return mergeClasses(classNames.statusInline, classNames.statusInlineInfo);
  }

  if (effectiveStatus === "delayed") {
    return mergeClasses(classNames.statusInline, classNames.statusInlineWarning);
  }

  if (effectiveStatus === "error") {
    return mergeClasses(classNames.statusInline, classNames.statusInlineDanger);
  }

  return classNames.statusInline;
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
      return "Ready";
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
    return "Ready";
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
  delayedContent,
  delayedMessage,
  emptyContent,
  effectiveStatus,
  errorContent,
  emptyMessage,
  errorMessage,
  idleContent,
  loadingContent,
  loadingLabel,
  onRetry,
  retryLabel
}: Pick<
  SmartLoadingSectionProps,
  | "delayedContent"
  | "delayedMessage"
  | "emptyContent"
  | "emptyMessage"
  | "errorContent"
  | "errorMessage"
  | "idleContent"
  | "loadingContent"
  | "loadingLabel"
  | "onRetry"
  | "retryLabel"
> & {
  classNames: ReturnType<typeof useSmartLoadingContainerClassNames>;
  effectiveStatus: Extract<LoadingStatus, "loading" | "delayed" | "error" | "empty" | "idle">;
}): React.ReactNode => {
  const renderDefaultStateMessage = (message: React.ReactNode): React.ReactNode => {
    const stateIconClassName =
      effectiveStatus === "loading"
        ? mergeClasses(classNames.stateFeedbackIconBare, classNames.stateFeedbackIconInfo)
        : effectiveStatus === "delayed"
          ? mergeClasses(classNames.stateFeedbackIconBare, classNames.stateFeedbackIconWarning)
          : effectiveStatus === "error"
            ? mergeClasses(classNames.stateFeedbackIcon, classNames.stateFeedbackIconDanger)
            : mergeClasses(classNames.stateFeedbackIconBare, classNames.stateFeedbackIconNeutral);

    return (
      <div className={classNames.stateMessage}>
        <div className={classNames.stateFeedback}>
          <span className={stateIconClassName}>
            {effectiveStatus === "loading" ? (
              <SpinnerIcon className={classNames.spinnerIcon} />
            ) : (
              getStatusIcon(effectiveStatus)
            )}
          </span>
          <OneUIText className={classNames.stateFeedbackMessage}>{message}</OneUIText>
        </div>
      </div>
    );
  };

  if (effectiveStatus === "loading") {
    return (
      loadingContent ?? renderDefaultStateMessage(loadingLabel ?? "Loading section content...")
    );
  }

  if (effectiveStatus === "delayed") {
    return (
      delayedContent ??
      renderDefaultStateMessage(
        delayedMessage ?? "This section is taking longer than usual to respond."
      )
    );
  }

  if (effectiveStatus === "error") {
    if (errorContent) {
      return errorContent;
    }

    return (
      <OneUIStack className={classNames.stateMessage} gap="sm">
        {renderDefaultStateMessage(errorMessage ?? "Unable to load this section.")}
        {onRetry ? (
          <div className={classNames.stateActionsRow}>
            <OneUIButton onClick={onRetry}>{retryLabel ?? "Retry"}</OneUIButton>
          </div>
        ) : null}
      </OneUIStack>
    );
  }

  if (effectiveStatus === "empty") {
    return (
      emptyContent ??
      renderDefaultStateMessage(emptyMessage ?? "No matching records were found for this section.")
    );
  }

  return idleContent ?? renderDefaultStateMessage("This section is ready to load.");
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
    delayedContent,
    delayedMessage,
    delayedThresholdMs,
    description,
    emptyContent,
    emptyMessage,
    errorContent,
    errorMessage,
    expandOnSuccess = false,
    headingLevel = 3,
    idleContent,
    loadingContent,
    loadingLabel,
    onCollapsedChange,
    onRetry,
    retryLabel,
    shape,
    surfaceAppearance,
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
  const inheritedSurfaceAppearance = React.useContext(SmartLoadingSurfaceAppearanceContext);
  const inheritedShape = React.useContext(SmartLoadingShapeContext);
  const resolvedSurfaceAppearance = surfaceAppearance ?? inheritedSurfaceAppearance;
  const resolvedShape = shape ?? inheritedShape;
  const previousEffectiveStatusRef = React.useRef<LoadingStatus | undefined>(undefined);
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
        delayedContent,
        delayedMessage,
        effectiveStatus,
        emptyContent,
        emptyMessage,
        errorContent,
        errorMessage,
        idleContent,
        loadingContent,
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
  const statusInlineClassName = getStatusInlineClassName(classNames, effectiveStatus);
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
      previousEffectiveStatusRef.current = effectiveStatus;
      return;
    }

    const previousEffectiveStatus = previousEffectiveStatusRef.current;
    const statusChanged = previousEffectiveStatus !== effectiveStatus;

    const nextShouldCollapse = shouldAutoCollapse({
      autoCollapseOnDelayed,
      autoCollapseOnError,
      collapseOnEmpty,
      effectiveStatus
    });

    if (statusChanged && nextShouldCollapse && !internalCollapsed) {
      setInternalCollapsed(true);
      onCollapsedChange?.(true);
      previousEffectiveStatusRef.current = effectiveStatus;
      return;
    }

    if (
      statusChanged &&
      expandOnSuccess &&
      (effectiveStatus === "success" || effectiveStatus === "refreshing") &&
      internalCollapsed
    ) {
      setInternalCollapsed(false);
      onCollapsedChange?.(false);
    }

    previousEffectiveStatusRef.current = effectiveStatus;
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
      <span className={statusInlineClassName}>
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
            tone={accentTone}
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
        {statusDisplayMode === "inline" && effectiveStatus !== "success" ? statusIndicator : null}
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
      className: mergeClasses(
        classNames.section,
        accentClassNames.section,
        resolvedShape === "rounded" ? classNames.sectionRounded : undefined,
        resolvedShape === "square" ? classNames.sectionSquare : undefined,
        resolvedSurfaceAppearance === "flat" ? classNames.sectionFlat : undefined,
        className
      ),
      "data-oneui-surface-appearance": resolvedSurfaceAppearance,
      "data-oneui-shape": resolvedShape,
      "data-oneui-smart-loading-section": ""
    },
    <>
      <div
        className={mergeClasses(
          classNames.sectionHeader,
          accentClassNames.header,
          resolvedShape === "rounded" ? classNames.sectionHeaderRounded : undefined,
          resolvedShape === "square" ? classNames.sectionHeaderSquare : undefined
        )}
      >
        <div className={classNames.sectionHeaderMain}>
          <span className={mergeClasses(classNames.sectionAvatar, accentClassNames.avatar)}>
            {avatar ?? (
              <span className={classNames.sectionAvatarLabel} aria-hidden="true">
                {getAvatarLabel(title)}
              </span>
            )}
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
          <div
            className={mergeClasses(
              classNames.body,
              resolvedShape === "square" ? classNames.bodySquare : undefined
            )}
          >
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
                <div
                  className={
                    effectiveStatus === "loading" ||
                    effectiveStatus === "delayed" ||
                    effectiveStatus === "error" ||
                    effectiveStatus === "empty" ||
                    effectiveStatus === "idle"
                      ? classNames.customStateSlot
                      : classNames.stateBody
                  }
                >
                  {stateBody}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
