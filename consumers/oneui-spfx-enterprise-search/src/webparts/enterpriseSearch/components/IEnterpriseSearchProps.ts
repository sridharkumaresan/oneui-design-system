import type { BaseComponentContext, IReadonlyTheme } from "@microsoft/sp-component-base";
import type { SearchRuntimeMode } from "../../../common/types/runtime";

export interface IEnterpriseSearchProps {
  enableDiagnostics?: boolean;
  runtimeMode?: SearchRuntimeMode;
  spfxContext?: BaseComponentContext;
  spfxTheme?: IReadonlyTheme;
  userDisplayName: string;
}
