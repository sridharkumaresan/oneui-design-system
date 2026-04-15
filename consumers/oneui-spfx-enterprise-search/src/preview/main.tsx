import * as React from "react";
import * as ReactDOM from "react-dom";

import { EnterpriseSearchPreviewApp } from "./previewApp";
import "./previewShell.scss";

const rootNode = document.getElementById("root");

if (rootNode) {
  ReactDOM.render(<EnterpriseSearchPreviewApp />, rootNode);

  window.addEventListener("beforeunload", () => {
    ReactDOM.unmountComponentAtNode(rootNode);
  });
}
