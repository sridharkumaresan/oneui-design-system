import React from "react";

import { OneUIBadge, OneUIHeading, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import type { LoadingStatus } from "@functions-oneui/react-utils/progressive-loading";

import { useSmartProgressBarClassNames } from "./SmartProgressBar.styles.js";
import type { SmartProgressBarItem, SmartProgressBarProps } from "./SmartProgressBar.types.js";

const statusToneMap: Record<
  LoadingStatus,
  "neutral" | "warning" | "danger" | "info" | "success" | "brand"
> = {
  delayed: "warning",
  empty: "neutral",
  error: "danger",
  idle: "neutral",
  loading: "info",
  refreshing: "brand",
  success: "success"
};

const statusAppearanceMap: Record<LoadingStatus, "soft"> = {
  delayed: "soft",
  empty: "soft",
  error: "soft",
  idle: "soft",
  loading: "soft",
  refreshing: "soft",
  success: "soft"
};

const statusTextMap: Record<LoadingStatus, string> = {
  delayed: "Delayed",
  empty: "Empty",
  error: "Error",
  idle: "Idle",
  loading: "Loading",
  refreshing: "Refreshing",
  success: "Success"
};

const getItemAriaLabel = (item: SmartProgressBarItem): string => {
  const countPart =
    typeof item.count === "number" && (item.status === "success" || item.status === "refreshing")
      ? `, ${item.count} items`
      : "";

  return `${String(item.label)}: ${statusTextMap[item.status]}${countPart}`;
};

const getStatusBreakdownText = ({
  delayed = 0,
  empty = 0,
  error = 0,
  loading = 0,
  refreshing = 0,
  success = 0
}: Pick<SmartProgressBarProps, "delayed" | "empty" | "error" | "loading" | "refreshing" | "success">): string => {
  const parts: string[] = [];

  if (loading > 0) {
    parts.push(`${loading} loading`);
  }

  if (refreshing > 0) {
    parts.push(`${refreshing} refreshing`);
  }

  if (success > 0) {
    parts.push(`${success} success`);
  }

  if (empty > 0) {
    parts.push(`${empty} empty`);
  }

  if (delayed > 0) {
    parts.push(`${delayed} delayed`);
  }

  if (error > 0) {
    parts.push(`${error} error`);
  }

  return parts.join(" • ");
};

const StatusGlyph = ({
  status
}: {
  status: LoadingStatus;
}): React.JSX.Element => {
  const classNames = useSmartProgressBarClassNames();

  if (status === "success") {
    return (
      <span aria-hidden="true" className={classNames.statusGlyphSuccess}>
        <span className={classNames.statusGlyphSuccessMark} />
      </span>
    );
  }

  if (status === "error") {
    return (
      <span aria-hidden="true" className={classNames.statusGlyphError}>
        <span className={classNames.statusGlyphErrorMark} />
      </span>
    );
  }

  if (status === "empty") {
    return (
      <span aria-hidden="true" className={classNames.statusGlyphEmpty}>
        <span className={classNames.statusGlyphEmptyMark} />
      </span>
    );
  }

  if (status === "loading" || status === "refreshing" || status === "delayed") {
    return (
      <span
        aria-hidden="true"
        className={
          status === "delayed" ? classNames.statusGlyphDelayed : classNames.statusGlyphLoading
        }
      />
    );
  }

  return <span aria-hidden="true" className={classNames.statusGlyphIdle} />;
};

const getDefaultSummaryText = ({
  completed,
  delayed = 0,
  error = 0,
  loading = 0,
  refreshing = 0,
  total
}: Pick<
  SmartProgressBarProps,
  "completed" | "delayed" | "error" | "loading" | "refreshing" | "total"
>): string => {
  const parts = [`${completed} of ${total} sources completed`];

  if (loading > 0) {
    parts.push(`${loading} loading`);
  }

  if (refreshing > 0) {
    parts.push(`${refreshing} refreshing`);
  }

  if (delayed > 0) {
    parts.push(`${delayed} delayed`);
  }

  if (error > 0) {
    parts.push(`${error} error`);
  }

  return parts.join(" • ");
};

export const SmartProgressBar = (props: SmartProgressBarProps): React.JSX.Element => {
  const {
    ariaLabel,
    chipsAriaLabel = "Source statuses",
    className,
    completed,
    delayed = 0,
    description,
    empty = 0,
    error = 0,
    items = [],
    loading = 0,
    percent,
    progressBarAriaLabel,
    refreshing = 0,
    showChips = true,
    showProgressBar = true,
    showSummary = true,
    success = 0,
    summaryText,
    title,
    total,
    ...restProps
  } = props;
  const classNames = useSmartProgressBarClassNames(className);
  const resolvedPercent = percent ?? (total > 0 ? Math.round((completed / total) * 100) : 0);
  const resolvedSummaryText =
    summaryText ??
    getDefaultSummaryText({
      completed,
      delayed,
      error,
      loading,
      refreshing,
      total
    });
  const resolvedStatusBreakdown = getStatusBreakdownText({
    delayed,
    empty,
    error,
    loading,
    refreshing,
    success
  });
  const resolvedAriaValueText = `${resolvedPercent}% complete. ${resolvedSummaryText}`;

  return (
    <section
      {...restProps}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : "Progress status")}
      aria-busy={loading > 0 || delayed > 0 || refreshing > 0}
      className={classNames.root}
      data-oneui-smart-progress-bar=""
    >
      <div className={classNames.header}>
        <OneUIStack gap="xs">
          <OneUIHeading level={2}>{title}</OneUIHeading>
          {description ? <OneUIText tone="secondary">{description}</OneUIText> : null}
        </OneUIStack>
        <OneUIText className={classNames.meterValue} tone="secondary">
          {completed}/{total}
        </OneUIText>
      </div>

      {showProgressBar ? (
        <div
          aria-label={progressBarAriaLabel ?? (typeof title === "string" ? `${title} progress` : "Progress")}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={resolvedPercent}
          aria-valuetext={resolvedAriaValueText}
          className={classNames.meterTrack}
          role="progressbar"
        >
          <div className={classNames.meterFill} style={{ width: `${resolvedPercent}%` }} />
        </div>
      ) : null}

      {showSummary ? (
        <div className={classNames.summary}>
          <OneUIText tone="secondary">{resolvedSummaryText}</OneUIText>
          {resolvedStatusBreakdown ? (
            <OneUIText className={classNames.summaryBreakdown} tone="secondary">
              {resolvedStatusBreakdown}
            </OneUIText>
          ) : null}
        </div>
      ) : null}

      {showChips && items.length > 0 ? (
        <ul aria-label={chipsAriaLabel} className={classNames.itemList}>
          {items.map((item) => (
            <li className={classNames.item} key={item.id}>
              <OneUIBadge
                aria-label={getItemAriaLabel(item)}
                appearance={statusAppearanceMap[item.status]}
                icon={<StatusGlyph status={item.status} />}
                shape="pill"
                size="sm"
                tone={statusToneMap[item.status]}
              >
                <span className={classNames.itemLabel}>{item.label}</span>
              </OneUIBadge>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};
