import * as React from "react";

import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import {
  OneUIOnboardingProvider,
  useOnboardingTarget,
  useOnboardingTour
} from "@functions-oneui/onboarding-react";
import type { OnboardingActionHandler, OnboardingTourDefinition } from "@functions-oneui/onboarding-core";
import { OneUIProvider } from "@functions-oneui/theme";

import type { SearchRuntimeMode } from "../common/types/runtime";
import { ensureReactUseId } from "../common/utils/ensureReactUseId";
import { EnterpriseSearchHost } from "../webparts/enterpriseSearch/components/EnterpriseSearchHost";
import { getRuntimeModeForVisibleDataMode, getVisibleDataModeFromSearch, visibleDataModes } from "./previewRuntime";

type DashboardViewMode = "compact" | "detailed";

const PreviewOnboardingProvider = OneUIOnboardingProvider as React.ComponentType<{
  actionHandlers: Record<string, OnboardingActionHandler>;
  children?: React.ReactNode;
  tours: OnboardingTourDefinition[];
}>;

const dashboardViewsPreviewImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 560" role="img">
  <rect width="960" height="560" rx="28" fill="#f5f9fd"/>
  <rect x="56" y="64" width="848" height="80" rx="18" fill="#0f6cbd"/>
  <rect x="88" y="92" width="260" height="24" rx="12" fill="#ffffff" opacity=".92"/>
  <rect x="56" y="184" width="370" height="296" rx="22" fill="#ffffff" stroke="#b9d8f2"/>
  <rect x="88" y="220" width="160" height="20" rx="10" fill="#0f6cbd"/>
  <rect x="88" y="264" width="296" height="36" rx="12" fill="#d7eaf9"/>
  <rect x="88" y="320" width="296" height="36" rx="12" fill="#d7eaf9"/>
  <rect x="88" y="376" width="220" height="36" rx="12" fill="#d7eaf9"/>
  <rect x="486" y="184" width="418" height="296" rx="22" fill="#ffffff" stroke="#b9d8f2"/>
  <rect x="522" y="220" width="188" height="20" rx="10" fill="#107c10"/>
  <rect x="522" y="264" width="330" height="64" rx="16" fill="#e7f4e8"/>
  <rect x="522" y="348" width="330" height="64" rx="16" fill="#e7f4e8"/>
  <rect x="522" y="432" width="230" height="24" rx="12" fill="#c8e6c9"/>
</svg>
`)}`;

const focusElementTour: OnboardingTourDefinition = {
  id: "spfx-preview-focus-onboarding",
  version: "1",
  allowRestart: true,
  visual: {
    appearance: "brand",
    progressDisplay: "dots-and-count"
  },
  targetMissingBehavior: "skip",
  steps: [
    {
      id: "mode",
      target: { kind: "named", name: "preview-mode" },
      title: "Switch data modes",
      description: "Validate the same webpart with dummy data or real SharePoint and Graph-backed services.",
      side: "bottom",
      align: "end"
    },
    {
      id: "search",
      target: { kind: "selector", selector: "[data-search-onboarding='search']" },
      title: "Start with one enterprise query",
      description:
        "Use the scoped search box to submit a query. The page keeps the experience focused on the searchable content instead of extra hero copy.",
      side: "bottom",
      align: "center"
    },
    {
      id: "verticals",
      target: { kind: "selector", selector: "[data-search-onboarding='verticals']" },
      title: "Filter by source type",
      description:
        "The tabs are driven by configuration. Select All for grouped results, or switch to a single vertical such as people, files, news, or resources.",
      side: "bottom",
      align: "center"
    },
    {
      id: "progress",
      target: { kind: "selector", selector: "[data-search-onboarding='progress']" },
      title: "Track source loading",
      description:
        "After a search, the progress bar summarizes how many configured sources are complete, still loading, delayed, empty, or in error.",
      side: "bottom",
      align: "center"
    },
    {
      id: "sections",
      target: { kind: "selector", selector: "[data-search-onboarding='main-sections']" },
      title: "Review grouped result sections",
      description:
        "Each loaded section shows its own status, result count, action, and cards. Counts come from the data source response so users can compare coverage quickly.",
      side: "top",
      align: "center"
    }
  ]
};

const fullPageTour: OnboardingTourDefinition = {
  id: "spfx-preview-full-page-onboarding",
  version: "1",
  allowRestart: true,
  visual: {
    appearance: "neutral",
    progressDisplay: "dots-and-count"
  },
  steps: [
    {
      id: "dashboard-views-announcement",
      kind: "full-page",
      eyebrow: "Feature announcement",
      title: "New dashboard views are available",
      description:
        "Switch between a compact view and a detailed view to personalize how your dashboard appears.",
      body:
        "This tour is not attached to a single page control. It is a full-page announcement step rendered from reusable onboarding config.",
      layout: "split-media",
      size: "lg",
      media: {
        type: "image",
        src: dashboardViewsPreviewImage,
        alt: "Preview showing compact and detailed dashboard layouts",
        position: "left"
      },
      primaryAction: {
        label: "Next",
        behavior: "next"
      },
      secondaryAction: {
        label: "Maybe later",
        behavior: "complete"
      }
    },
    {
      id: "dashboard-view-benefits",
      kind: "full-page",
      eyebrow: "Personalize the workspace",
      title: "Pick the amount of detail that fits the moment",
      description:
        "Use compact view when you need to scan source coverage quickly. Use detailed view when you want richer context from each result section.",
      body:
        "The pagination dots and step count are coming from the same onboarding progress model used by focus-element tours.",
      layout: "centered-card",
      size: "md",
      primaryAction: {
        label: "Next",
        behavior: "next"
      }
    },
    {
      id: "dashboard-view-action",
      kind: "full-page",
      eyebrow: "Try it now",
      title: "Choose your dashboard view",
      description:
        "The primary action calls an app-owned handler. The onboarding library only receives the action id and then completes the tour.",
      body:
        "In a real web part this same handler could open preferences, navigate to settings, or switch modes.",
      layout: "centered-card",
      size: "md",
      primaryAction: {
        label: "Choose dashboard view",
        actionId: "open-dashboard-preferences",
        behavior: "complete"
      },
      secondaryAction: {
        label: "Maybe later",
        behavior: "complete"
      }
    }
  ]
};

const PreviewContent = ({
  dashboardView,
  isPreferencesOpen,
  onClosePreferences,
  onDashboardViewChange
}: {
  dashboardView: DashboardViewMode;
  isPreferencesOpen: boolean;
  onClosePreferences: () => void;
  onDashboardViewChange: (mode: DashboardViewMode) => void;
}): React.ReactElement => {
  const visibleDataMode = getVisibleDataModeFromSearch(window.location.search);
  const runtimeMode: SearchRuntimeMode = getRuntimeModeForVisibleDataMode(visibleDataMode);
  const modeTarget = useOnboardingTarget("preview-mode");
  const canvasTarget = useOnboardingTarget("preview-canvas");
  const focusOnboardingTour = useOnboardingTour(focusElementTour.id);
  const fullPageOnboardingTour = useOnboardingTour(fullPageTour.id);

  const navigate = (updates: Record<string, string | undefined>): void => {
    const params = new URLSearchParams(window.location.search);

    Object.keys(updates).forEach((key) => {
      const value = updates[key];

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    window.history.replaceState({}, "", `?${params.toString()}`);
    window.location.reload();
  };

  return (
    <div className="previewShell">
      <div className="previewShell__toolbar">
        <div className="previewShell__actions" ref={modeTarget.ref}>
          {visibleDataModes.map((mode) => (
            <Button
              appearance={mode === visibleDataMode ? "primary" : "secondary"}
              key={mode}
              onClick={() => navigate({ mode })}
              size="small"
            >
              {mode === "dummy" ? "Dummy data" : "Real data"}
            </Button>
          ))}
          <span className="previewShell__divider" aria-hidden="true" />
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button appearance="primary" size="small">
                Onboarding
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => void focusOnboardingTour.restart()}>
                  Focus element tour
                </MenuItem>
                <MenuItem onClick={() => void fullPageOnboardingTour.restart()}>
                  Full page tour
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      <div className="previewShell__canvas" ref={canvasTarget.ref}>
        <div className="previewShell__viewStatus" aria-live="polite">
          Dashboard preview mode: <strong>{dashboardView === "compact" ? "Compact" : "Detailed"}</strong>
        </div>
        <EnterpriseSearchHost
          runtimeConfig={{
            configFailureStrategy: "fallback-dummy",
            enableDiagnostics: true,
            mockApiBaseUrl: runtimeMode === "dummy" ? "/api/search" : undefined,
            mode: runtimeMode,
            searchSourceOverrides: runtimeMode === "real" ? { files: "graph" } : undefined,
            useSampleFallbacks: true
          }}
          userDisplayName="Sabina"
        />
      </div>

      {isPreferencesOpen ? (
        <aside
          aria-labelledby="dashboard-preferences-title"
          className="previewShell__preferences"
          role="dialog"
          aria-modal="false"
        >
          <div className="previewShell__preferencesHeader">
            <div>
              <p className="previewShell__eyebrow">Dashboard preferences</p>
              <h2 id="dashboard-preferences-title">Choose dashboard view</h2>
            </div>
            <Button appearance="subtle" onClick={onClosePreferences} size="small">
              Close
            </Button>
          </div>
          <p>
            This drawer is owned by the SPFx preview app. It is opened by the onboarding
            action handler, not by any SPFx-specific logic in the onboarding library.
          </p>
          <div className="previewShell__preferenceActions">
            <Button
              appearance={dashboardView === "compact" ? "primary" : "secondary"}
              onClick={() => onDashboardViewChange("compact")}
            >
              Compact view
            </Button>
            <Button
              appearance={dashboardView === "detailed" ? "primary" : "secondary"}
              onClick={() => onDashboardViewChange("detailed")}
            >
              Detailed view
            </Button>
          </div>
        </aside>
      ) : null}
    </div>
  );
};

export const EnterpriseSearchPreviewApp = (): React.ReactElement => {
  ensureReactUseId();
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState(false);
  const [dashboardView, setDashboardView] = React.useState<DashboardViewMode>("compact");
  const actionHandlers = React.useMemo<Record<string, OnboardingActionHandler>>(
    () => ({
      "open-dashboard-preferences": () => {
        setDashboardView("detailed");
        setIsPreferencesOpen(true);
      }
    }),
    []
  );

  return (
    <OneUIProvider mode="light">
      <PreviewOnboardingProvider actionHandlers={actionHandlers} tours={[focusElementTour, fullPageTour]}>
        <PreviewContent
          dashboardView={dashboardView}
          isPreferencesOpen={isPreferencesOpen}
          onClosePreferences={() => setIsPreferencesOpen(false)}
          onDashboardViewChange={setDashboardView}
        />
      </PreviewOnboardingProvider>
    </OneUIProvider>
  );
};
