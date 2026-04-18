import * as React from "react";

import { Spinner } from "@fluentui/react-components";
import { OneUICard } from "@functions-oneui/atoms";
import type { UseCachedResourceResult } from "@functions-oneui/cache-react";

import styles from "../SearchPage/SearchPage.module.scss";

const classNames = styles as unknown as Record<string, string>;

type BannerResourceShellProps<TData> = {
  ariaLabel: string;
  children: (data: TData) => React.ReactNode;
  emptyMessage: string;
  isEmptyData?: (data: TData) => boolean;
  resource: UseCachedResourceResult<TData>;
  shell: "card" | "utility";
  skeleton: React.ReactNode;
  tone?: (data: TData | undefined) => "brand" | "danger" | "success" | "warning";
};

const renderFeedback = (message: string): React.ReactElement => (
  <div className={classNames.bannerResourceFeedback}>
    <span>{message}</span>
  </div>
);

const RefreshFailureIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
    <path
      d="M6 1.4 10.7 10H1.3L6 1.4Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
    <path d="M6 4.6v2.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
    <circle cx="6" cy="8.35" fill="currentColor" r=".55" />
  </svg>
);

export const BannerResourceShell = <TData,>({
  ariaLabel,
  children,
  emptyMessage,
  isEmptyData,
  resource,
  shell,
  skeleton,
  tone
}: BannerResourceShellProps<TData>): React.ReactElement => {
  const hasRenderableData =
    resource.data !== undefined && !(isEmptyData?.(resource.data) ?? false);
  const isEmpty = resource.data !== undefined && (isEmptyData?.(resource.data) ?? false);
  const resolvedTone = shell === "card" ? (tone?.(resource.data) ?? "brand") : undefined;
  const hasPaintedDataRef = React.useRef(false);
  const [canPaintFirstData, setCanPaintFirstData] = React.useState(false);

  React.useEffect(() => {
    if (!hasRenderableData) {
      return;
    }

    if (hasPaintedDataRef.current || resource.source === "cache") {
      hasPaintedDataRef.current = true;
      setCanPaintFirstData(true);
      return;
    }

    const timerId = window.setTimeout(() => {
      hasPaintedDataRef.current = true;
      setCanPaintFirstData(true);
    }, 650);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [hasRenderableData, resource.source]);

  const shouldShowSkeleton =
    resource.isLoading || (hasRenderableData && !canPaintFirstData && resource.source === "network");
  const body = shouldShowSkeleton
    ? skeleton
    : hasRenderableData
      ? children(resource.data as TData)
      : isEmpty
        ? renderFeedback(emptyMessage)
        : resource.isError
          ? renderFeedback("Unable to load")
          : skeleton;
  const content = (
    <>
      {resource.isRefreshing ? (
        <span className={classNames.bannerResourceSpinner}>
          <Spinner aria-label="Extra Tiny Spinner" size="extra-tiny" />
        </span>
      ) : null}
      {resource.status === "error-with-stale-data" ? (
        <span
          aria-label="Background refresh failed"
          className={classNames.bannerResourceWarning}
          role="img"
          title="Background refresh failed"
        >
          <RefreshFailureIcon />
        </span>
      ) : null}
      {body}
    </>
  );

  if (shell === "card") {
    const toneClassName =
      resolvedTone === "danger"
        ? classNames.bannerTaskCardToneDanger
        : resolvedTone === "warning"
          ? classNames.bannerTaskCardToneWarning
          : resolvedTone === "success"
            ? classNames.bannerTaskCardToneSuccess
            : classNames.bannerTaskCardToneBrand;

    return (
      <OneUICard
        aria-label={ariaLabel}
        className={[classNames.bannerTaskCard, toneClassName].filter(Boolean).join(" ")}
        data-cache-source={resource.source}
        data-cache-state={resource.lifecycleState}
        data-tone={resolvedTone}
        padding="sm"
      >
        {content}
      </OneUICard>
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      className={classNames.bannerUtilityWidget}
      data-cache-source={resource.source}
      data-cache-state={resource.lifecycleState}
    >
      {content}
    </div>
  );
};
