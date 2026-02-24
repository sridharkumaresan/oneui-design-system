// @ts-nocheck
import React from "react";

import { OneUIButton } from "./OneUIButton.js";

const meta = {
  title: "Atoms/OneUIButton",
  component: OneUIButton,
  args: {
    children: "Action",
    tone: "brand",
    stretch: false,
    disabled: false
  },
  argTypes: {
    children: {
      control: "text"
    },
    tone: {
      control: "inline-radio",
      options: ["brand", "neutral"]
    },
    stretch: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    }
  }
};

export default meta;

export const Default = {
  render: (args) => React.createElement(OneUIButton, args, args.children)
};

export const Neutral = {
  args: {
    tone: "neutral"
  },
  render: (args) => React.createElement(OneUIButton, args, args.children)
};

export const Disabled = {
  args: {
    disabled: true
  },
  render: (args) => React.createElement(OneUIButton, args, args.children)
};

export const Stretch = {
  args: {
    stretch: true,
    children: "Full Width"
  },
  render: (args) =>
    React.createElement(
      "div",
      { style: { width: "320px" } },
      React.createElement(OneUIButton, args, args.children)
    )
};

export const AllConfigurations = {
  render: () => {
    const combinations = [
      { tone: "brand", disabled: false, stretch: false, children: "Brand" },
      { tone: "neutral", disabled: false, stretch: false, children: "Neutral" },
      { tone: "brand", disabled: true, stretch: false, children: "Brand Disabled" },
      { tone: "neutral", disabled: true, stretch: false, children: "Neutral Disabled" },
      { tone: "brand", disabled: false, stretch: true, children: "Brand Stretch" },
      { tone: "neutral", disabled: false, stretch: true, children: "Neutral Stretch" }
    ];

    return React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gap: "12px",
          width: "360px"
        }
      },
      combinations.map((props) =>
        React.createElement(OneUIButton, { key: props.children, ...props }, props.children)
      )
    );
  }
};
