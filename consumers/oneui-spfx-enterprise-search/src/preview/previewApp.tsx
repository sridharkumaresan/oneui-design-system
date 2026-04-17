import * as React from "react";

import { Button } from "@fluentui/react-components";
import {
  OneUIOnboardingProvider,
  useOnboardingTarget,
  useOnboardingTour
} from "@functions-oneui/onboarding-react";
import type { OnboardingTourDefinition } from "@functions-oneui/onboarding-core";

import type { SearchRuntimeMode } from "../common/types/runtime";
import { ensureReactUseId } from "../common/utils/ensureReactUseId";
import { EnterpriseSearchHost } from "../webparts/enterpriseSearch/components/EnterpriseSearchHost";
import { getRuntimeModeForVisibleDataMode, getVisibleDataModeFromSearch, visibleDataModes } from "./previewRuntime";

const previewTour: OnboardingTourDefinition = {
  id: "spfx-preview-onboarding",
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

const PreviewContent = (): React.ReactElement => {
  const visibleDataMode = getVisibleDataModeFromSearch(window.location.search);
  const runtimeMode: SearchRuntimeMode = getRuntimeModeForVisibleDataMode(visibleDataMode);
  const modeTarget = useOnboardingTarget("preview-mode");
  const canvasTarget = useOnboardingTarget("preview-canvas");
  const onboardingTour = useOnboardingTour(previewTour.id);

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
          <Button appearance="primary" onClick={() => onboardingTour.restart()} size="small">
            Show onboarding
          </Button>
        </div>
      </div>

      <div className="previewShell__canvas" ref={canvasTarget.ref}>
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
    </div>
  );
};

export const EnterpriseSearchPreviewApp = (): React.ReactElement => {
  ensureReactUseId();

  return (
    <OneUIOnboardingProvider tours={[previewTour]}>
      <PreviewContent />
    </OneUIOnboardingProvider>
  );
};
