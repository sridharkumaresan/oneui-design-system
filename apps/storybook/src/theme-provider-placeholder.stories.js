import React from "react";

import { useFluent } from "@fluentui/react-components";

const meta = {
  title: "Foundation/Theme Provider",
  parameters: {
    docs: {
      description: {
        story:
          "Placeholder story to verify global theme toolbar + OneUIProvider wiring in Storybook."
      }
    }
  }
};

export default meta;

const ThemeProbe = ({ mode }) => {
  const fluent = useFluent();

  return React.createElement(
    "div",
    {
      style: {
        fontFamily: fluent.theme?.fontFamilyBase,
        color: fluent.theme?.colorNeutralForeground1,
        background: fluent.theme?.colorNeutralBackground1,
        border: `1px solid ${fluent.theme?.colorNeutralStroke1}`,
        borderRadius: fluent.theme?.borderRadiusMedium,
        padding: fluent.theme?.spacingHorizontalL,
        minWidth: "20rem"
      }
    },
    `Active Storybook theme mode: ${mode}`
  );
};

export const ProviderWiring = {
  render: (_, context) => {
    const mode = context.globals.themeMode === "dark" ? "dark" : "light";
    return React.createElement(ThemeProbe, { mode });
  }
};
