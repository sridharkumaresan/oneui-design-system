// @ts-nocheck
import React from "react";

import { Text } from "@fluentui/react-components";

import { OneUIButton } from "@functions-oneui/atoms";

import { SmartSection } from "./SmartSection.js";

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    if (!signal) {
      return;
    }

    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

const buildItems = (prefix, count) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `${prefix}-${index + 1}`,
    label: `${prefix} item ${index + 1}`
  }));
};

const renderSimpleItem = (item) => {
  return React.createElement(Text, null, item.label);
};

const KeepPreviousDataDemo = ({ keepPreviousData }) => {
  const [requestKey, setRequestKey] = React.useState("alpha");

  const fetcher = React.useCallback(
    async ({ requestKey: activeRequestKey, signal }) => {
      if (activeRequestKey === "alpha") {
        await wait(120, signal);
        return { items: buildItems("Alpha", 3), totalCount: 3 };
      }

      await wait(1400, signal);
      return { items: buildItems("Beta", 4), totalCount: 4 };
    },
    []
  );

  return React.createElement(
    "div",
    {
      style: {
        display: "grid",
        gap: "12px"
      }
    },
    React.createElement(
      OneUIButton,
      {
        tone: "neutral",
        type: "button",
        onClick: () => setRequestKey((current) => (current === "alpha" ? "beta" : "alpha"))
      },
      "Change request key"
    ),
    React.createElement(SmartSection, {
      sectionId: keepPreviousData ? "keep-previous-true" : "keep-previous-false",
      title: keepPreviousData ? "keepPreviousData: true" : "keepPreviousData: false",
      requestKey,
      enabled: true,
      keepPreviousData,
      slowThresholdMs: 450,
      initialVisibleCount: 2,
      renderItem: renderSimpleItem,
      renderSkeletonRow: (index) => React.createElement(Text, null, `Skeleton row ${index + 1}`),
      fetcher
    })
  );
};

const meta = {
  title: "Organisms/SmartSection",
  component: SmartSection,
  args: {
    sectionId: "success",
    title: "Smart Section",
    requestKey: "demo-request",
    enabled: true,
    renderItem: renderSimpleItem,
    fetcher: async ({ signal }) => {
      await wait(150, signal);
      return { items: buildItems("Result", 5), totalCount: 5 };
    }
  }
};

export default meta;

export const Success = {
  render: (args) => React.createElement(SmartSection, args)
};

export const SlowStateAutoCollapse = {
  args: {
    sectionId: "slow",
    title: "Slow Section",
    requestKey: "slow-request",
    slowThresholdMs: 300,
    fetcher: async ({ signal }) => {
      await wait(2200, signal);
      return { items: buildItems("Slow", 3), totalCount: 3 };
    }
  },
  render: (args) => React.createElement(SmartSection, args)
};

export const ErrorAndRetry = {
  render: (args) => {
    let attempt = 0;

    const fetcher = async ({ signal }) => {
      attempt += 1;
      await wait(120, signal);

      if (attempt === 1) {
        throw new Error("Service temporarily unavailable.");
      }

      return { items: buildItems("Recovered", 4), totalCount: 4 };
    };

    return React.createElement(SmartSection, {
      ...args,
      sectionId: "error",
      title: "Error + Retry",
      requestKey: "error-request",
      fetcher
    });
  }
};

export const EmptyState = {
  args: {
    sectionId: "empty",
    title: "Empty Section",
    requestKey: "empty-request",
    fetcher: async ({ signal }) => {
      await wait(100, signal);
      return { items: [], totalCount: 0 };
    }
  },
  render: (args) => React.createElement(SmartSection, args)
};

export const ReducedMotion = {
  args: {
    sectionId: "reduced-motion",
    title: "Reduced Motion Section",
    requestKey: "motion-request",
    reducedMotion: true,
    slowThresholdMs: 300,
    fetcher: async ({ signal }) => {
      await wait(1200, signal);
      return { items: buildItems("Motion", 3), totalCount: 3 };
    }
  },
  render: (args) => React.createElement(SmartSection, args)
};

export const KeepPreviousDataRefresh = {
  render: () => React.createElement(KeepPreviousDataDemo, { keepPreviousData: true })
};

export const KeepPreviousDataDisabled = {
  render: () => React.createElement(KeepPreviousDataDemo, { keepPreviousData: false })
};

export const CustomRenderers = {
  args: {
    sectionId: "custom-renderers",
    title: "Custom Renderers",
    requestKey: "custom-request",
    fetcher: async ({ signal }) => {
      await wait(120, signal);
      return { items: [], totalCount: 0 };
    },
    renderSkeletonRow: (index) =>
      React.createElement(
        "div",
        {
          style: {
            width: "100%",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            padding: "0 8px"
          }
        },
        React.createElement(Text, null, `Skeleton row ${index + 1}`)
      ),
    renderEmpty: () => React.createElement(Text, null, "Nothing matched your request.")
  },
  render: (args) => React.createElement(SmartSection, args)
};

export const ShowcaseTwoColumnPage = {
  render: () => {
    return React.createElement(
      "div",
      {
        style: {
          width: "min(1120px, 100%)",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(280px, 1fr))",
          gap: "16px"
        }
      },
      React.createElement(SmartSection, {
        sectionId: "showcase-left",
        title: "Left Section",
        requestKey: "showcase-left-request",
        enabled: true,
        renderItem: renderSimpleItem,
        fetcher: async ({ signal }) => {
          await wait(150, signal);
          return { items: buildItems("Left", 6), totalCount: 6 };
        }
      }),
      React.createElement(SmartSection, {
        sectionId: "showcase-right",
        title: "Right Section",
        requestKey: "showcase-right-request",
        enabled: true,
        renderItem: renderSimpleItem,
        fetcher: async ({ signal }) => {
          await wait(170, signal);
          return { items: buildItems("Right", 4), totalCount: 4 };
        }
      })
    );
  }
};
