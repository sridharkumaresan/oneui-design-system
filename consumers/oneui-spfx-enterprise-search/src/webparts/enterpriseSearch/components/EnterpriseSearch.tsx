import * as React from "react";

import type { MSGraphClientFactory } from "@microsoft/sp-http-msgraph";

import type { IEnterpriseSearchProps } from "./IEnterpriseSearchProps";
import { SharePointRestListClient } from "../../../infrastructure/config/clients/SharePointRestListClient";
import { GraphSpfxSearchClient } from "../../../infrastructure/search/clients/GraphSpfxSearchClient";
import { EnterpriseSearchHost } from "./EnterpriseSearchHost";

const EnterpriseSearch = (props: IEnterpriseSearchProps): React.ReactElement => {
  const { enableDiagnostics, runtimeMode, spfxContext, spfxTheme, userDisplayName } = props;
  const sharePointListClient =
    spfxContext && runtimeMode && runtimeMode !== "dummy"
      ? new SharePointRestListClient(spfxContext)
      : undefined;
  const graphClientFactory =
    runtimeMode === "real" && spfxContext && "msGraphClientFactory" in spfxContext
      ? (spfxContext as typeof spfxContext & {
          msGraphClientFactory: MSGraphClientFactory;
        }).msGraphClientFactory
      : undefined;
  const graphSearchClient = graphClientFactory ? new GraphSpfxSearchClient(graphClientFactory) : undefined;

  return (
    <EnterpriseSearchHost
      runtimeConfig={{
        configFailureStrategy: "error",
        enableDiagnostics,
        graphSearchClient,
        mode: runtimeMode ?? "dummy",
        searchSourceOverrides: runtimeMode === "real" ? { files: "graph" } : undefined,
        sharePointListClient
      }}
      spfxTheme={spfxTheme}
      userDisplayName={userDisplayName}
    />
  );
};

export default EnterpriseSearch;
