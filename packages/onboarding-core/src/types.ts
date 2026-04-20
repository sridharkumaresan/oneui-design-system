import type {
  Alignment,
  AllowedButtons,
  Config,
  Driver,
  DriveStep,
  Popover,
  Side
} from "driver.js";

export type OnboardingStatus = "idle" | "in-progress" | "completed" | "dismissed";
export type OnboardingStartReason = "manual" | "auto" | "resume";

export type OnboardingNamedTarget = {
  kind: "named";
  name: string;
};

export type OnboardingSelectorTarget = {
  kind: "selector";
  selector: string;
};

export type OnboardingElementTarget = {
  kind: "element";
  element: Element;
};

export type OnboardingResolverTarget = {
  kind: "resolver";
  resolve: (context: OnboardingTargetResolveContext) => Element | null | undefined;
};

export type OnboardingStepTarget =
  | string
  | Element
  | (() => Element | null | undefined)
  | OnboardingNamedTarget
  | OnboardingSelectorTarget
  | OnboardingElementTarget
  | OnboardingResolverTarget;

export type OnboardingTargetRegistry = {
  get: (name: string) => Element | null | undefined;
};

export type OnboardingTargetResolveContext = {
  document?: Document;
  driver?: Driver;
  registry?: OnboardingTargetRegistry;
  tour: OnboardingTourDefinition;
  step: OnboardingStepDefinition;
};

export type OnboardingPersistenceRecord = {
  status?: OnboardingStatus;
  version?: string;
  activeStepId?: string;
  seenStepIds?: string[];
  startedAt?: string;
  completedAt?: string;
  dismissedAt?: string;
};

export type OnboardingPersistenceAdapter = {
  load: (tourId: string) => Promise<OnboardingPersistenceRecord | undefined> | OnboardingPersistenceRecord | undefined;
  save: (tourId: string, record: OnboardingPersistenceRecord) => Promise<void> | void;
  clear?: (tourId: string) => Promise<void> | void;
};

export type OnboardingAnalyticsEventName =
  | "tour_started"
  | "tour_completed"
  | "tour_dismissed"
  | "step_viewed"
  | "step_missing_target";

export type OnboardingAnalyticsEvent = {
  eventName: OnboardingAnalyticsEventName;
  tourId: string;
  tourVersion: string;
  stepId?: string;
  stepIndex?: number;
  reason?: OnboardingStartReason | "close" | "missing-target";
  metadata?: Record<string, string | number | boolean | null>;
};

export type OnboardingAnalyticsAdapter = {
  track: (event: OnboardingAnalyticsEvent) => Promise<void> | void;
};

export type OnboardingRunContext = {
  persistedState?: OnboardingPersistenceRecord;
  reason: OnboardingStartReason;
  tour: OnboardingTourDefinition;
};

export type OnboardingProgressDisplay = "count" | "dots" | "dots-and-count";

export type OnboardingVisualConfig = {
  appearance?: "neutral" | "brand";
  progressDisplay?: OnboardingProgressDisplay;
};

export type OnboardingStepKind = "focus-element" | "full-page";

export type OnboardingFullPageLayout = "centered-card" | "split-media" | "hero";
export type OnboardingFullPageSize = "sm" | "md" | "lg";
export type OnboardingFullPageMediaPosition = "top" | "left" | "right";
export type OnboardingActionBehavior = "next" | "previous" | "skip" | "complete" | "custom";

export type OnboardingFullPageMedia = {
  type: "image";
  src: string;
  alt: string;
  position?: OnboardingFullPageMediaPosition;
};

export type OnboardingStepAction = {
  label: string;
  actionId?: string;
  behavior?: OnboardingActionBehavior;
};

type OnboardingStepBase = {
  id: string;
  title?: string;
  description?: string;
  visual?: OnboardingVisualConfig;
};

export type OnboardingFocusElementStepDefinition = OnboardingStepBase & {
  kind?: "focus-element";
  target?: OnboardingStepTarget;
  side?: Side;
  align?: Alignment;
  showButtons?: AllowedButtons[];
  disableButtons?: AllowedButtons[];
  showProgress?: boolean;
  nextButtonLabel?: string;
  previousButtonLabel?: string;
  doneButtonLabel?: string;
  allowInteraction?: boolean;
  stagePadding?: number;
  stageRadius?: number;
  driverStep?: Omit<DriveStep, "element" | "popover" | "disableActiveInteraction">;
  popover?: Omit<
    Popover,
    "title" | "description" | "showButtons" | "disableButtons" | "nextBtnText" | "prevBtnText" | "doneBtnText"
  >;
};

export type OnboardingFullPageStepDefinition = OnboardingStepBase & {
  kind: "full-page";
  title: string;
  eyebrow?: string;
  body?: string;
  media?: OnboardingFullPageMedia;
  primaryAction?: OnboardingStepAction;
  secondaryAction?: OnboardingStepAction;
  layout?: OnboardingFullPageLayout;
  size?: OnboardingFullPageSize;
  allowClose?: boolean;
};

export type OnboardingStepDefinition =
  | OnboardingFocusElementStepDefinition
  | OnboardingFullPageStepDefinition;

export type OnboardingTourDefinition = {
  id: string;
  version: string;
  title?: string;
  description?: string;
  steps: OnboardingStepDefinition[];
  allowRestart?: boolean;
  targetMissingBehavior?: "skip" | "abort";
  visual?: OnboardingVisualConfig;
  shouldRun?: (context: OnboardingRunContext) => boolean;
  driverConfig?: Omit<Config, "steps">;
};

export type OnboardingActionContext = {
  action: OnboardingStepAction;
  actionId: string;
  behavior: OnboardingActionBehavior;
  step: OnboardingStepDefinition;
  stepIndex: number;
  tour: OnboardingTourDefinition;
};

export type OnboardingActionHandler = (
  context: OnboardingActionContext
) => Promise<void> | void;

export type OnboardingControllerOptions = {
  tours: OnboardingTourDefinition[];
  actionHandlers?: Record<string, OnboardingActionHandler | undefined>;
  onAction?: OnboardingActionHandler;
  analytics?: OnboardingAnalyticsAdapter;
  persistence?: OnboardingPersistenceAdapter;
  registry?: OnboardingTargetRegistry;
  driverFactory?: (options?: Config) => Driver;
  document?: Document;
  scopeId?: string;
  classNames?: Partial<typeof oneuiOnboardingClassNames>;
};

export type StartOnboardingTourOptions = {
  reason?: OnboardingStartReason;
  startAtStepId?: string;
  force?: boolean;
};

export type OnboardingStartResult =
  | {
      ok: true;
      tourId: string;
      stepCount: number;
      startIndex: number;
    }
  | {
      ok: false;
      tourId: string;
      reason: "not-found" | "blocked" | "no-targets";
      message: string;
    };

export type OnboardingController = {
  getTours: () => OnboardingTourDefinition[];
  getTour: (tourId: string) => OnboardingTourDefinition | undefined;
  getScopeId: () => string;
  getActiveTourId: () => string | undefined;
  canStartTour: (tourId: string, options?: StartOnboardingTourOptions) => Promise<boolean>;
  startTour: (tourId: string, options?: StartOnboardingTourOptions) => Promise<OnboardingStartResult>;
  restartTour: (tourId: string) => Promise<OnboardingStartResult>;
  stopTour: () => void;
  refresh: () => void;
  destroy: () => void;
};

export const oneuiOnboardingClassNames = {
  popover: "oneui-onboarding-popover",
  title: "oneui-onboarding-popover-title",
  description: "oneui-onboarding-popover-description",
  footer: "oneui-onboarding-popover-footer",
  progress: "oneui-onboarding-popover-progress",
  previousButton: "oneui-onboarding-button-previous",
  nextButton: "oneui-onboarding-button-next",
  closeButton: "oneui-onboarding-button-close",
  button: "oneui-onboarding-button",
  navigation: "oneui-onboarding-navigation",
  footerCenter: "oneui-onboarding-footer-center",
  pagination: "oneui-onboarding-pagination",
  paginationDot: "oneui-onboarding-pagination-dot",
  paginationDotActive: "oneui-onboarding-pagination-dot-active",
  progressCount: "oneui-onboarding-progress-count",
  fullPage: "oneui-onboarding-full-page",
  fullPagePanel: "oneui-onboarding-full-page-panel",
  fullPageContent: "oneui-onboarding-full-page-content",
  fullPageEyebrow: "oneui-onboarding-full-page-eyebrow",
  fullPageTitle: "oneui-onboarding-full-page-title",
  fullPageDescription: "oneui-onboarding-full-page-description",
  fullPageBody: "oneui-onboarding-full-page-body",
  fullPageMedia: "oneui-onboarding-full-page-media",
  fullPageActions: "oneui-onboarding-full-page-actions",
  fullPagePrimaryAction: "oneui-onboarding-full-page-primary-action",
  fullPageSecondaryAction: "oneui-onboarding-full-page-secondary-action",
  visuallyHidden: "oneui-onboarding-visually-hidden"
} as const;
