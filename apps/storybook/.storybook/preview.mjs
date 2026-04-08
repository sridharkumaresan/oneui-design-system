import React from "react";

import { DocsContainer } from "@storybook/blocks";
import "@functions-oneui/fonts/styles.css";
import "@functions-oneui/onboarding-styles/styles.css";
import { OneUIProvider, oneuiDarkTheme, oneuiLightTheme } from "@functions-oneui/theme";

const storybookFontFamilies = {
  brand: {
    base: '"Barclays Effra", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    brand: '"Barclays Effra", "Segoe UI", "Helvetica Neue", Arial, sans-serif'
  },
  system: {
    base: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    brand: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
  },
  humanist: {
    base: '"Trebuchet MS", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    brand: '"Trebuchet MS", "Segoe UI", "Helvetica Neue", Arial, sans-serif'
  }
};

const FullWidthDocsContainer = (props) => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `
          .sbdocs-wrapper {
            max-width: none !important;
            padding-inline: 32px !important;
          }

          .sbdocs-content {
            max-width: none !important;
            width: 100% !important;
          }
        `
      }
    }),
    React.createElement(DocsContainer, props)
  );
};

/** @type {import('@storybook/react').Preview} */
const preview = {
  globalTypes: {
    fontFamily: {
      name: "Font",
      description: "Global OneUI font family override for Storybook demos",
      defaultValue: "system",
      toolbar: {
        icon: "paragraph",
        dynamicTitle: true,
        items: [
          { value: "system", title: "System UI" },
          { value: "humanist", title: "Humanist" },
          { value: "brand", title: "Barclays Effra" }
        ]
      }
    },
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
      const fontFamily =
        storybookFontFamilies[context.globals.fontFamily] ?? storybookFontFamilies.system;
      const theme = mode === "dark" ? oneuiDarkTheme : oneuiLightTheme;

      return React.createElement(
        OneUIProvider,
        {
          mode,
          themeOverrides: {
            semanticTokens: {
              typography: {
                fontFamily
              }
            }
          }
        },
        React.createElement(
          "div",
          {
            style: {
              backgroundColor: theme.colorNeutralBackground1,
              color: theme.colorNeutralForeground1,
              minHeight: "100vh",
              padding: "1.5rem",
              transition: "background-color 180ms ease, color 180ms ease"
            }
          },
          React.createElement(Story)
        )
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
    docs: {
      container: FullWidthDocsContainer,
      codePanel: true,
      canvas: {
        sourceState: "shown"
      }
    },
    layout: "centered"
  }
};

export default preview;
