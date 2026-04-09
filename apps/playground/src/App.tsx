import React from "react";

import {
  OneUIStack
} from "@functions-oneui/atoms";
import { OneUIProvider, type OneUIFluidTypographyScale } from "@functions-oneui/theme";

import { IntranetTopShell } from "./components/IntranetTopShell.js";
import { SearchProgressiveLoadingDemoPage } from "./pages/SearchProgressiveLoadingDemoPage.js";
import { TaskDashboardDemoPage } from "./pages/TaskDashboardDemoPage.js";

type DemoRoute = "search" | "tasks";

export const App = (): React.JSX.Element => {
  const [route, setRoute] = React.useState<DemoRoute>("search");
  const [searchQuery, setSearchQuery] = React.useState("");
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
        <OneUIProvider fluidTypography={fluidTypography} mode="light">
          <IntranetTopShell
            onQueryChange={setSearchQuery}
            onRouteChange={setRoute}
            query={searchQuery}
            route={route}
          />
          {route === "search" ? (
            <SearchProgressiveLoadingDemoPage
              fluidEnabled={fluidEnabled}
              isSettingsOpen={isSettingsOpen}
              onCloseSettings={() => {
                setIsSettingsOpen(false);
              }}
              onOpenSettings={() => {
                setIsSettingsOpen(true);
              }}
              onFluidEnabledChange={setFluidEnabled}
              onScaleChange={setScale}
              query={searchQuery}
              scale={scale}
            />
          ) : (
            <TaskDashboardDemoPage
              fluidEnabled={fluidEnabled}
              isSettingsOpen={isSettingsOpen}
              onCloseSettings={() => {
                setIsSettingsOpen(false);
              }}
              onOpenSettings={() => {
                setIsSettingsOpen(true);
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
