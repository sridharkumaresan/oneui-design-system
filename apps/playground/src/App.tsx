import React from "react";

import {
  OneUIBadge,
  OneUIHeading,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";
import { OneUIProvider, type OneUIFluidTypographyScale } from "@functions-oneui/theme";

import { SearchProgressiveLoadingDemoPage } from "./pages/SearchProgressiveLoadingDemoPage.js";
import { TaskDashboardDemoPage } from "./pages/TaskDashboardDemoPage.js";

type DemoRoute = "search" | "tasks";

export const App = (): React.JSX.Element => {
  const [route, setRoute] = React.useState<DemoRoute>("search");
  const [fluidEnabled, setFluidEnabled] = React.useState(true);
  const [scale, setScale] = React.useState<OneUIFluidTypographyScale>("comfortable");
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const fluidTypography = React.useMemo(() => {
    return {
      enabled: fluidEnabled,
      maxViewport: 1440,
      minViewport: 320,
      scale
    };
  }, [fluidEnabled, scale]);

  React.useEffect(() => {
    if (!isSettingsOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSettingsOpen]);

  return (
    <main className="playground-shell">
      <OneUIStack gap="lg">
        <header className="playground-shell-header">
          <div className="playground-shell-header-brand">
            <OneUIBadge appearance="soft" size="sm" tone="brand">
              Internal showcase
            </OneUIBadge>
            <div className="playground-shell-header-copy">
              <OneUIHeading level={1}>OneUI Progressive Loading Patterns</OneUIHeading>
              <OneUIText tone="secondary">
                Presentable demo surfaces for search and dashboard loading flows.
              </OneUIText>
            </div>
          </div>
          <div className="playground-shell-header-actions">
            <div className="playground-settings-segmented" role="tablist" aria-label="Demo pages">
              <button
                aria-selected={route === "search"}
                className={`playground-settings-segment ${route === "search" ? "playground-settings-segment-active" : ""}`}
                onClick={() => {
                  setRoute("search");
                }}
                role="tab"
                type="button"
              >
                Enterprise search
              </button>
              <button
                aria-selected={route === "tasks"}
                className={`playground-settings-segment ${route === "tasks" ? "playground-settings-segment-active" : ""}`}
                onClick={() => {
                  setRoute("tasks");
                }}
                role="tab"
                type="button"
              >
                Task dashboard
              </button>
            </div>
            <button
              aria-expanded={isSettingsOpen}
              aria-haspopup="dialog"
              className="playground-settings-trigger"
              onClick={() => {
                setIsSettingsOpen(true);
              }}
              type="button"
            >
              <span aria-hidden="true" className="playground-settings-trigger-icon">
                ⚙
              </span>
              <span>Settings</span>
            </button>
          </div>
        </header>

        <OneUIProvider fluidTypography={fluidTypography} mode="light">
          {route === "search" ? (
            <SearchProgressiveLoadingDemoPage
              fluidEnabled={fluidEnabled}
              isSettingsOpen={isSettingsOpen}
              onCloseSettings={() => {
                setIsSettingsOpen(false);
              }}
              onFluidEnabledChange={setFluidEnabled}
              onScaleChange={setScale}
              scale={scale}
            />
          ) : (
            <TaskDashboardDemoPage
              fluidEnabled={fluidEnabled}
              isSettingsOpen={isSettingsOpen}
              onCloseSettings={() => {
                setIsSettingsOpen(false);
              }}
              onFluidEnabledChange={setFluidEnabled}
              onScaleChange={setScale}
              scale={scale}
            />
          )}
        </OneUIProvider>
      </OneUIStack>
    </main>
  );
};
