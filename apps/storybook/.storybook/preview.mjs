import React from "react";

import { OneUIProvider } from "@functions-oneui/theme";

/** @type {import('@storybook/react').Preview} */
const preview = {
  globalTypes: {
    themeMode: {
      name: "Theme",
      description: "Global OneUI theme mode",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" }
        ]
      }
    }
  },
  decorators: [
    (Story, context) => {
      const mode = context.globals.themeMode === "dark" ? "dark" : "light";

      return React.createElement(
        OneUIProvider,
        { mode },
        React.createElement(Story)
      );
    }
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered"
  }
};

export default preview;
