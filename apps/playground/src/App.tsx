import React from "react";

import {
  OneUIBadge,
  OneUIButton,
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
  const [scale, setScale] = React.useState<OneUIFluidTypographyScale>("expressive");

  const fluidTypography = React.useMemo(() => {
    return {
      enabled: fluidEnabled,
      maxViewport: 1440,
      minViewport: 320,
      scale
    };
  }, [fluidEnabled, scale]);

  return (
    <main className="playground-shell">
      <OneUIStack gap="lg">
        <header className="playground-header">
          <OneUIStack gap="sm">
            <OneUIBadge appearance="soft" size="sm" tone="brand">
              Internal showcase
            </OneUIBadge>
            <OneUIHeading level={1}>OneUI Progressive Loading Patterns</OneUIHeading>
            <OneUIText tone="secondary">
              Two realistic product-style demos showing the same organisms and shared loading logic
              used with different layouts, content, and outcomes.
            </OneUIText>
          </OneUIStack>
          <OneUIStack gap="sm">
            <div className="playground-nav" role="tablist" aria-label="Demo pages">
              <OneUIButton
                appearance={route === "search" ? "primary" : "secondary"}
                onClick={() => {
                  setRoute("search");
                }}
                role="tab"
                aria-selected={route === "search"}
              >
                Enterprise search
              </OneUIButton>
              <OneUIButton
                appearance={route === "tasks" ? "primary" : "secondary"}
                onClick={() => {
                  setRoute("tasks");
                }}
                role="tab"
                aria-selected={route === "tasks"}
              >
                Task dashboard
              </OneUIButton>
            </div>
            <div className="playground-typography-controls">
              <label className="playground-control-toggle">
                <input
                  checked={fluidEnabled}
                  onChange={(event) => {
                    setFluidEnabled(event.target.checked);
                  }}
                  type="checkbox"
                />
                <span>Fluid typography</span>
              </label>

              <label className="playground-control-field">
                <span>Scale</span>
                <select
                  className="playground-control-select"
                  onChange={(event) => {
                    setScale(event.target.value as OneUIFluidTypographyScale);
                  }}
                  value={scale}
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="expressive">Expressive</option>
                </select>
              </label>
            </div>
          </OneUIStack>
        </header>

        <div className="playground-demo-meta">
          <OneUIText tone="secondary">
            The live demo below runs under a nested OneUI theme with optional fluid typography. Use
            browser responsive mode to verify the layout and type scale.
          </OneUIText>
        </div>

        <OneUIProvider fluidTypography={fluidTypography} mode="light">
          {route === "search" ? <SearchProgressiveLoadingDemoPage /> : <TaskDashboardDemoPage />}
        </OneUIProvider>
      </OneUIStack>
    </main>
  );
};
