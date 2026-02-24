import React from "react";

import { Skeleton, SkeletonItem, Spinner, Text, mergeClasses } from "@fluentui/react-components";

import { OneUIButton } from "@functions-oneui/atoms";

import { useSmartSectionStyles } from "./SmartSection.styles.js";
import type {
  SmartSectionControllerResult,
  SmartSectionProps,
  SmartSectionRenderContext,
  SmartSectionRenderItemContext
} from "./SmartSection.types.js";
import { useSmartSectionController } from "./useSmartSectionController.js";

type OneUIButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  stretch?: boolean;
  tone?: "brand" | "neutral";
  type?: "button" | "submit" | "reset";
};

const ButtonComponent = OneUIButton as unknown as React.ComponentType<OneUIButtonProps>;
const DEFAULT_BODY_PADDING_BLOCK_PX = 16;
const DEFAULT_ROW_GAP_PX = 8;

const toStateMessage = (snapshot: SmartSectionControllerResult<unknown>): string => {
  if (snapshot.status === "slow") {
    return "Taking longer than expected";
  }

  if (snapshot.isRefreshing) {
    return "Refreshing";
  }

  if (snapshot.status === "loading") {
    return "Loading";
  }

  if (snapshot.status === "empty") {
    return "No items";
  }

  if (snapshot.status === "error") {
    return "Could not load";
  }

  if (snapshot.items.length > 0) {
    if (snapshot.isExpanded && snapshot.hasMore && snapshot.visibleItems.length > 0) {
      return `Showing ${snapshot.visibleItems.length} of ${snapshot.items.length}`;
    }

    return `${snapshot.items.length} item${snapshot.items.length === 1 ? "" : "s"}`;
  }

  return "Idle";
};

const toCollapsedMessage = (snapshot: SmartSectionControllerResult<unknown>): string => {
  if (snapshot.status === "slow") {
    return "Loading is taking longer than expected.";
  }

  if (snapshot.status === "empty") {
    return "No items available for this section.";
  }

  if (snapshot.status === "error") {
    return snapshot.error?.message || "Unable to load section.";
  }

  return "";
};

const toRowHeight = (value: number | undefined): number => {
  if (!Number.isFinite(value)) {
    return 44;
  }

  const normalized = Math.floor(value as number);
  return normalized > 0 ? normalized : 44;
};

const toPositiveInt = (value: number | undefined, fallbackValue: number): number => {
  if (!Number.isFinite(value)) {
    return fallbackValue;
  }

  const normalized = Math.floor(value as number);
  return normalized > 0 ? normalized : fallbackValue;
};

const createRenderContext = <Item, RequestParams>(
  snapshot: SmartSectionControllerResult<Item, RequestParams>
): SmartSectionRenderContext<Item, RequestParams> => {
  return {
    sectionId: snapshot.sectionId,
    requestKey: snapshot.requestKey,
    requestParams: snapshot.requestParams,
    status: snapshot.status,
    items: snapshot.items,
    visibleItems: snapshot.visibleItems,
    totalCount: snapshot.totalCount,
    error: snapshot.error,
    isExpanded: snapshot.isExpanded,
    isBusy: snapshot.isBusy,
    isRefreshing: snapshot.isRefreshing,
    isSlow: snapshot.isSlow,
    isError: snapshot.isError,
    isEmpty: snapshot.isEmpty,
    reducedMotion: snapshot.reducedMotion,
    visibleCount: snapshot.visibleCount,
    hasMore: snapshot.hasMore,
    retry: snapshot.retry,
    toggleExpanded: snapshot.toggleExpanded
  };
};

const resolveViewMoreHref = <Item, RequestParams>(
  viewMoreHref: SmartSectionProps<Item, RequestParams>["viewMoreHref"],
  context: SmartSectionRenderContext<Item, RequestParams>
): string | undefined => {
  if (!viewMoreHref) {
    return undefined;
  }

  if (typeof viewMoreHref === "function") {
    const candidate = viewMoreHref(context);
    if (typeof candidate !== "string") {
      return undefined;
    }

    const trimmed = candidate.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  const trimmed = viewMoreHref.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const SmartSectionInner = <Item, RequestParams = unknown>(
  props: SmartSectionProps<Item, RequestParams>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    sectionId,
    title,
    description,
    className,
    enabled = true,
    requestKey,
    requestParams,
    fetcher,
    onEvent,
    retryLabel = "Retry",
    viewMoreLabel = "View more",
    viewMoreHref,
    viewMoreTarget,
    viewMoreRel,
    loadingLabel = "Loading",
    skeletonizeHeaderOnInitialLoad = false,
    renderItem,
    renderSkeletonRow,
    renderEmpty,
    renderError,
    renderSlow,
    renderHeaderExtras,
    getItemKey,
    slowThresholdMs,
    rowHeightPx,
    initialVisibleCount,
    autoCollapseOn,
    autoExpandOnRequest,
    keepPreviousData,
    reducedMotion,
    bodyPaddingBlockPx,
    rowGapPx
  } = props;

  const styles = useSmartSectionStyles();
  const bodyInnerRef = React.useRef<HTMLDivElement | null>(null);
  const [measuredBodyHeightPx, setMeasuredBodyHeightPx] = React.useState(0);
  const resolvedRowHeightPx = toRowHeight(rowHeightPx);
  const resolvedBodyPaddingBlockPx = toPositiveInt(
    bodyPaddingBlockPx,
    DEFAULT_BODY_PADDING_BLOCK_PX
  );
  const resolvedRowGapPx = toPositiveInt(rowGapPx, DEFAULT_ROW_GAP_PX);

  const snapshot = useSmartSectionController<Item, RequestParams>({
    sectionId,
    enabled,
    requestKey,
    requestParams,
    fetcher,
    onEvent,
    slowThresholdMs,
    initialVisibleCount,
    autoCollapseOn,
    autoExpandOnRequest,
    keepPreviousData,
    reducedMotion
  });

  const renderContext = React.useMemo(() => createRenderContext(snapshot), [snapshot]);

  const reactId = React.useId();
  const normalizedId = sectionId.replace(/[^a-zA-Z0-9_-]/g, "-");
  const toggleId = `smart-section-toggle-${normalizedId}-${reactId}`;
  const titleId = `smart-section-title-${normalizedId}-${reactId}`;
  const panelId = `smart-section-panel-${normalizedId}-${reactId}`;

  const statusText =
    snapshot.status === "loading" && !snapshot.isRefreshing
      ? loadingLabel
      : toStateMessage(snapshot);
  const showHeaderSkeleton =
    skeletonizeHeaderOnInitialLoad &&
    snapshot.status === "loading" &&
    !snapshot.isRefreshing &&
    snapshot.items.length === 0;

  const skeletonCount = Math.max(1, snapshot.visibleCount);
  const visibleListCount = snapshot.visibleItems.length;
  const listRowCount =
    visibleListCount > 0 ? visibleListCount : snapshot.status === "loading" ? skeletonCount : 0;
  const hasStateRow =
    listRowCount === 0 &&
    (snapshot.status === "slow" || snapshot.status === "empty" || snapshot.status === "error");
  const contentRowCount = listRowCount > 0 ? listRowCount : hasStateRow ? 1 : 0;
  const listGapCount = listRowCount > 1 ? listRowCount - 1 : 0;
  const deterministicBodyHeightPx =
    snapshot.isExpanded && contentRowCount > 0
      ? contentRowCount * resolvedRowHeightPx +
        listGapCount * resolvedRowGapPx +
        resolvedBodyPaddingBlockPx
      : 0;
  React.useLayoutEffect(() => {
    if (!snapshot.isExpanded) {
      setMeasuredBodyHeightPx(0);
      return;
    }

    const element = bodyInnerRef.current;
    if (!element) {
      return;
    }

    const updateHeight = () => {
      const measured = Math.ceil(element.getBoundingClientRect().height || element.scrollHeight || 0);

      setMeasuredBodyHeightPx((previousValue) => {
        return previousValue === measured ? previousValue : measured;
      });
    };

    updateHeight();

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }

    if (typeof window === "undefined") {
      return;
    }

    const rafId = window.requestAnimationFrame(updateHeight);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [
    snapshot.isExpanded,
    snapshot.status,
    snapshot.visibleItems,
    snapshot.isRefreshing,
    deterministicBodyHeightPx
  ]);
  const bodyHeightPx = snapshot.isExpanded
    ? Math.max(deterministicBodyHeightPx, measuredBodyHeightPx)
    : 0;
  const bodyStyle: React.CSSProperties = {
    height: `${bodyHeightPx}px`,
    transition: snapshot.reducedMotion ? "none" : "height 160ms ease"
  };

  const shouldShowCollapsedSummary =
    !snapshot.isExpanded && (snapshot.isSlow || snapshot.isError || snapshot.isEmpty);
  const resolvedViewMoreHref =
    snapshot.status === "success" && snapshot.hasMore
      ? resolveViewMoreHref(viewMoreHref, renderContext)
      : undefined;
  const resolvedViewMoreRel =
    viewMoreTarget === "_blank" ? (viewMoreRel ?? "noopener noreferrer") : viewMoreRel;

  const defaultSlowNode = React.createElement(
    Text,
    { className: styles.stateMessage },
    "Loading is taking longer than expected."
  );

  const defaultEmptyNode = React.createElement(
    Text,
    { className: styles.stateMessage },
    "No items available."
  );

  const defaultErrorNode = React.createElement(
    "div",
    { className: styles.footer },
    React.createElement(
      Text,
      { className: styles.stateMessage },
      snapshot.error?.message || "Unable to load section."
    ),
    React.createElement(
      ButtonComponent,
      {
        tone: "neutral",
        type: "button",
        onClick: snapshot.retry
      },
      retryLabel
    )
  );

  return React.createElement(
    "section",
    {
      ref,
      className: mergeClasses(styles.root, className),
      "data-smart-section-id": sectionId
    },
    React.createElement(
      "div",
      { className: styles.visuallyHidden, "aria-live": "polite", "aria-atomic": "true" },
      snapshot.liveMessage
    ),
    React.createElement(
      "div",
      { className: styles.header },
      React.createElement(
        "button",
        {
          id: toggleId,
          type: "button",
          className: styles.headerToggle,
          "aria-expanded": snapshot.isExpanded,
          "aria-controls": panelId,
          disabled: showHeaderSkeleton,
          onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key !== "Enter" && event.key !== " ") {
              return;
            }

            event.preventDefault();
            snapshot.toggleExpanded();
          },
          onClick: snapshot.toggleExpanded
        },
        React.createElement(
          "span",
          { className: styles.headerMain },
          showHeaderSkeleton
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement("h3", { className: styles.visuallyHidden, id: titleId }, title),
                React.createElement(
                  "span",
                  { className: styles.titleLine },
                  React.createElement(
                    Skeleton,
                    { animation: "wave" },
                    React.createElement(SkeletonItem, { className: styles.titleSkeleton })
                  ),
                  React.createElement(
                    Skeleton,
                    { animation: "wave" },
                    React.createElement(SkeletonItem, { className: styles.countSkeleton })
                  )
                ),
                description
                  ? React.createElement(
                      Skeleton,
                      { animation: "wave" },
                      React.createElement(SkeletonItem, { className: styles.descriptionSkeleton })
                    )
                  : null
              )
            : React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "span",
                  { className: styles.titleLine },
                  React.createElement("h3", { className: styles.title, id: titleId }, title),
                  React.createElement(
                    "span",
                    { className: styles.countBadge },
                    snapshot.totalCount || snapshot.items.length
                  )
                ),
                description
                  ? React.createElement("p", { className: styles.description }, description)
                  : null
              )
        ),
        React.createElement(
          "span",
          { className: styles.headerMeta },
          !showHeaderSkeleton && !snapshot.reducedMotion && snapshot.isBusy
            ? React.createElement(Spinner, { size: "tiny", labelPosition: "below" })
            : null,
          showHeaderSkeleton
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  Skeleton,
                  { animation: "wave" },
                  React.createElement(SkeletonItem, { className: styles.statusSkeleton })
                ),
                React.createElement(
                  Skeleton,
                  { animation: "wave" },
                  React.createElement(SkeletonItem, { className: styles.chevronSkeleton })
                )
              )
            : React.createElement(
                React.Fragment,
                null,
                React.createElement("span", { className: styles.status }, statusText),
                React.createElement(
                  "span",
                  { className: styles.chevron, "aria-hidden": "true" },
                  snapshot.isExpanded ? "▾" : "▸"
                )
              )
        )
      ),
      renderHeaderExtras || resolvedViewMoreHref
        ? React.createElement(
            "div",
            { className: styles.headerExtras },
            resolvedViewMoreHref
              ? React.createElement(
                  "a",
                  {
                    href: resolvedViewMoreHref,
                    target: viewMoreTarget,
                    rel: resolvedViewMoreRel,
                    className: styles.viewMoreLink,
                    onClick: () => {
                      onEvent?.({
                        type: "viewMore",
                        sectionId: snapshot.sectionId,
                        requestKey: snapshot.requestKey,
                        href: resolvedViewMoreHref,
                        timestamp: Date.now()
                      });
                    }
                  },
                  viewMoreLabel
                )
              : null,
            renderHeaderExtras ? renderHeaderExtras(renderContext) : null
          )
        : null
    ),
    shouldShowCollapsedSummary
      ? React.createElement(
          "div",
          { className: styles.collapsedSummary },
          React.createElement(
            Text,
            { className: styles.stateMessage },
            toCollapsedMessage(snapshot)
          ),
          snapshot.status === "error"
            ? React.createElement(
                ButtonComponent,
                {
                  tone: "neutral",
                  type: "button",
                  onClick: snapshot.retry
                },
                retryLabel
              )
            : null
        )
      : null,
    React.createElement(
      "div",
      {
        id: panelId,
        role: "region",
        "aria-labelledby": titleId,
        "aria-hidden": !snapshot.isExpanded,
        className: styles.body,
        style: bodyStyle
      },
      snapshot.isExpanded
        ? React.createElement(
            "div",
            { className: styles.bodyInner, ref: bodyInnerRef },
            snapshot.visibleItems.length > 0
              ? React.createElement(
                  "ul",
                  { className: styles.list },
                  snapshot.visibleItems.map((item, index) => {
                    const itemContext: SmartSectionRenderItemContext<Item, RequestParams> = {
                      index,
                      section: renderContext
                    };

                    return React.createElement(
                      "li",
                      {
                        key: getItemKey ? getItemKey(item, index) : index,
                        className: styles.row,
                        style: { minHeight: `${resolvedRowHeightPx}px` }
                      },
                      renderItem(item, itemContext)
                    );
                  })
                )
              : snapshot.status === "loading"
                ? React.createElement(
                    "ul",
                    { className: styles.list },
                    Array.from({ length: skeletonCount }).map((_, index) =>
                      React.createElement(
                        "li",
                        {
                          key: index,
                          className: styles.row,
                          style: { minHeight: `${resolvedRowHeightPx}px` }
                        },
                        renderSkeletonRow
                          ? renderSkeletonRow(index, renderContext)
                          : React.createElement("div", {
                              className: styles.placeholderRow,
                              style: { minHeight: `${resolvedRowHeightPx}px` }
                            })
                      )
                    )
                  )
                : snapshot.status === "slow"
                  ? renderSlow
                    ? renderSlow(renderContext)
                    : defaultSlowNode
                  : snapshot.status === "empty"
                    ? renderEmpty
                      ? renderEmpty(renderContext)
                      : defaultEmptyNode
                    : snapshot.status === "error"
                      ? renderError
                        ? renderError(renderContext, snapshot.error)
                        : defaultErrorNode
                      : null,
            null
          )
        : null
    )
  );
};

export const SmartSection = React.forwardRef(SmartSectionInner) as <Item, RequestParams = unknown>(
  props: SmartSectionProps<Item, RequestParams> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;
