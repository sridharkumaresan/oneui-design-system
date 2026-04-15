import * as React from "react";

import { Button } from "@fluentui/react-components";

import type { SearchRuntimeMode } from "../common/types/runtime";
import { EnterpriseSearchHost } from "../webparts/enterpriseSearch/components/EnterpriseSearchHost";
import { getRuntimeModeForVisibleDataMode, getVisibleDataModeFromSearch, visibleDataModes } from "./previewRuntime";

export const EnterpriseSearchPreviewApp = (): React.ReactElement => {
  const visibleDataMode = getVisibleDataModeFromSearch(window.location.search);
  const runtimeMode: SearchRuntimeMode = getRuntimeModeForVisibleDataMode(visibleDataMode);

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
        <div className="previewShell__actions">
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
        </div>
      </div>

      <div className="previewShell__canvas">
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
