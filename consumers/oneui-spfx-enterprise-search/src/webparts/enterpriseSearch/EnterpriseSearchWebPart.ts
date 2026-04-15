import * as React from "react";
import * as ReactDom from "react-dom";

import type { IReadonlyTheme } from "@microsoft/sp-component-base";
import { Version } from "@microsoft/sp-core-library";
import type { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import EnterpriseSearch from "./components/EnterpriseSearch";
import type { IEnterpriseSearchProps } from "./components/IEnterpriseSearchProps";

export interface IEnterpriseSearchWebPartProps {}

export default class EnterpriseSearchWebPart extends BaseClientSideWebPart<IEnterpriseSearchWebPartProps> {
  private _themeVariant: IReadonlyTheme | undefined;

  public render(): void {
    const element: React.ReactElement<IEnterpriseSearchProps> = React.createElement(EnterpriseSearch, {
      enableDiagnostics: this.context.isServedFromLocalhost,
      runtimeMode: this.context.isServedFromLocalhost ? "dummy" : "hybrid",
      spfxContext: this.context,
      spfxTheme: this._themeVariant,
      userDisplayName: this.context.pageContext.user.displayName
    });

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    this._themeVariant = currentTheme;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
