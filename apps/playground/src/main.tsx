import React from "react";
import ReactDOM from "react-dom/client";

import { OneUIProvider } from "@functions-oneui/theme";

import { App } from "./App.js";
import "./app.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Playground root element was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <OneUIProvider mode="light">
      <App />
    </OneUIProvider>
  </React.StrictMode>
);
