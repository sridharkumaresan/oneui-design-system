import * as React from "react";

import "@functions-oneui/fonts/styles.css";

import type { IReadonlyTheme } from "@microsoft/sp-component-base";
import { OneUIProvider, OneUISpfxProvider } from "@functions-oneui/theme";

import type { SearchRuntimeConfig } from "../composition/createSearchCompositionRoot";
import { createSearchCompositionRoot } from "../composition/createSearchCompositionRoot";
import { ensureReactUseId } from "../../../common/utils/ensureReactUseId";
import { SearchPage } from "../../../presentation/components/SearchPage/SearchPage";

export type EnterpriseSearchHostProps = {
  runtimeConfig?: SearchRuntimeConfig;
  spfxTheme?: IReadonlyTheme;
  userDisplayName: string;
};

const fluentCompatibilityThemeOverrides = {
  fluentTheme: {
    strokeWidthThin: "1px",
    strokeWidthThick: "2px"
  }
};

export const EnterpriseSearchHost = (
  props: EnterpriseSearchHostProps
): React.ReactElement => {
  const { runtimeConfig, spfxTheme, userDisplayName } = props;
  const fluidTypography = React.useMemo(
    () => ({
      enabled: true,
      maxViewport: 1440,
      minViewport: 320,
      scale: "comfortable" as const
    }),
    []
  );

  ensureReactUseId();

  const compositionRoot = React.useMemo(() => {
    return createSearchCompositionRoot(
      runtimeConfig ?? {
        mode: "dummy"
      }
    );
  }, [runtimeConfig]);

  React.useEffect(() => {
    if (!runtimeConfig?.enableDiagnostics) {
      return undefined;
    }

    const logDiagnostics = (): void => {
      const configSnapshot = compositionRoot.diagnosticsStore.getSnapshot();
      const searchSnapshot = compositionRoot.diagnosticsStore.getSearchSnapshot();

      if (configSnapshot) {
        // eslint-disable-next-line no-console
        console.table(configSnapshot);
      }

      if (searchSnapshot) {
        // eslint-disable-next-line no-console
        console.table(searchSnapshot.entries);
      }
    };

    logDiagnostics();
    return compositionRoot.diagnosticsStore.subscribe(logDiagnostics);
  }, [compositionRoot.diagnosticsStore, runtimeConfig?.enableDiagnostics]);

  return (
    spfxTheme ? (
      <OneUISpfxProvider
        fluidTypography={fluidTypography}
        spfxTheme={spfxTheme}
        themeOverrides={fluentCompatibilityThemeOverrides}
        typographyMode="fluid"
      >
        <SearchPage
          orchestrator={compositionRoot.orchestrator}
          userDisplayName={userDisplayName}
        />
      </OneUISpfxProvider>
    ) : (
      <OneUIProvider
        fluidTypography={fluidTypography}
        mode="light"
        themeOverrides={fluentCompatibilityThemeOverrides}
        typographyMode="fluid"
      >
        <SearchPage
          orchestrator={compositionRoot.orchestrator}
          userDisplayName={userDisplayName}
        />
      </OneUIProvider>
    )
  );
};
