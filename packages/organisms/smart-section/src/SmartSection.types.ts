import type React from "react";

export type SmartSectionRequestKey = string | number | boolean | null | undefined;

export type SmartSectionLifecycle = "idle" | "loading" | "slow" | "success" | "empty" | "error";

export type SmartSectionAutoCollapseState = "slow" | "empty" | "error";

export type SmartSectionFetchArgs<RequestParams = unknown> = {
  requestKey: SmartSectionRequestKey;
  requestParams: RequestParams | undefined;
  signal: AbortSignal;
  isRetry: boolean;
};

export type SmartSectionFetchResult<Item> = {
  items: Item[];
  totalCount?: number;
};

export type SmartSectionFetcher<Item, RequestParams = unknown> = (
  args: SmartSectionFetchArgs<RequestParams>
) => Promise<SmartSectionFetchResult<Item>>;

export type SmartSectionEventBase = {
  sectionId: string;
  requestKey: SmartSectionRequestKey;
  timestamp: number;
};

export type SmartSectionRetryEvent = SmartSectionEventBase & {
  type: "retry";
};

export type SmartSectionExpandEvent = SmartSectionEventBase & {
  type: "expand";
  reason: "request" | "manual";
};

export type SmartSectionCollapseEvent = SmartSectionEventBase & {
  type: "collapse";
  reason: "slow" | "empty" | "error" | "manual";
};

export type SmartSectionViewMoreEvent = SmartSectionEventBase & {
  type: "viewMore";
  href: string;
};

export type SmartSectionSettledEvent = SmartSectionEventBase & {
  type: "settled";
  status: "success" | "empty" | "error";
  itemCount: number;
};

export type SmartSectionEvent =
  | SmartSectionRetryEvent
  | SmartSectionExpandEvent
  | SmartSectionCollapseEvent
  | SmartSectionViewMoreEvent
  | SmartSectionSettledEvent;

export type SmartSectionRenderContext<Item, RequestParams = unknown> = {
  sectionId: string;
  requestKey: SmartSectionRequestKey;
  requestParams: RequestParams | undefined;
  status: SmartSectionLifecycle;
  items: readonly Item[];
  visibleItems: readonly Item[];
  totalCount: number;
  error: Error | null;
  isExpanded: boolean;
  isBusy: boolean;
  isRefreshing: boolean;
  isSlow: boolean;
  isError: boolean;
  isEmpty: boolean;
  reducedMotion: boolean;
  visibleCount: number;
  hasMore: boolean;
  retry: () => void;
  toggleExpanded: () => void;
};

export type SmartSectionRenderItemContext<Item, RequestParams = unknown> = {
  index: number;
  section: SmartSectionRenderContext<Item, RequestParams>;
};

export type SmartSectionControllerConfig = {
  slowThresholdMs?: number;
  initialVisibleCount?: number;
  autoCollapseOn?: SmartSectionAutoCollapseState[];
  autoExpandOnRequest?: boolean;
  keepPreviousData?: boolean;
  reducedMotion?: boolean;
};

export type SmartSectionControllerOptions<
  Item,
  RequestParams = unknown
> = SmartSectionControllerConfig & {
  sectionId: string;
  enabled?: boolean;
  requestKey: SmartSectionRequestKey;
  requestParams?: RequestParams;
  fetcher: SmartSectionFetcher<Item, RequestParams>;
  onEvent?: (event: SmartSectionEvent) => void;
};

export type SmartSectionControllerSnapshot<Item, RequestParams = unknown> = {
  sectionId: string;
  requestKey: SmartSectionRequestKey;
  requestParams: RequestParams | undefined;
  status: SmartSectionLifecycle;
  items: readonly Item[];
  visibleItems: readonly Item[];
  totalCount: number;
  error: Error | null;
  isExpanded: boolean;
  isBusy: boolean;
  isRefreshing: boolean;
  isSlow: boolean;
  isError: boolean;
  isEmpty: boolean;
  reducedMotion: boolean;
  visibleCount: number;
  hasMore: boolean;
  liveMessage: string;
};

export type SmartSectionControllerResult<
  Item,
  RequestParams = unknown
> = SmartSectionControllerSnapshot<Item, RequestParams> & {
  toggleExpanded: () => void;
  retry: () => void;
};

export type SmartSectionViewMoreHref<Item, RequestParams = unknown> =
  | string
  | ((context: SmartSectionRenderContext<Item, RequestParams>) => string | undefined | null);

export type SmartSectionProps<Item, RequestParams = unknown> = SmartSectionControllerConfig & {
  sectionId: string;
  title: React.ReactNode;
  enabled?: boolean;
  requestKey: SmartSectionRequestKey;
  requestParams?: RequestParams;
  fetcher: SmartSectionFetcher<Item, RequestParams>;
  description?: React.ReactNode;
  className?: string;
  retryLabel?: string;
  viewMoreLabel?: string;
  viewMoreHref?: SmartSectionViewMoreHref<Item, RequestParams>;
  viewMoreTarget?: React.HTMLAttributeAnchorTarget;
  viewMoreRel?: string;
  loadingLabel?: string;
  rowHeightPx?: number;
  skeletonizeHeaderOnInitialLoad?: boolean;
  renderItem: (
    item: Item,
    context: SmartSectionRenderItemContext<Item, RequestParams>
  ) => React.ReactNode;
  getItemKey?: (item: Item, index: number) => React.Key;
  renderSkeletonRow?: (
    index: number,
    context: SmartSectionRenderContext<Item, RequestParams>
  ) => React.ReactNode;
  renderEmpty?: (context: SmartSectionRenderContext<Item, RequestParams>) => React.ReactNode;
  renderError?: (
    context: SmartSectionRenderContext<Item, RequestParams>,
    error: Error | null
  ) => React.ReactNode;
  renderSlow?: (context: SmartSectionRenderContext<Item, RequestParams>) => React.ReactNode;
  renderHeaderExtras?: (context: SmartSectionRenderContext<Item, RequestParams>) => React.ReactNode;
  bodyPaddingBlockPx?: number;
  rowGapPx?: number;
  onEvent?: (event: SmartSectionEvent) => void;
};
