# @functions-oneui/onboarding-core

Framework-agnostic onboarding orchestration for OneUI, backed by Driver.js.

## Purpose

- Own tour definitions, target resolution, lifecycle, persistence, and analytics
- Support focus-element steps and full-page announcement steps in the same tour
- Invoke app-defined actions through typed action handlers
- Remain independent from React and Fluent UI runtime concerns
- Provide a stable base for React/SPFx today and other framework adapters later

## Public API

- `createOnboardingController(...)`
- `oneuiOnboardingClassNames`
- typed tour, step, action, analytics, persistence, and target contracts

## Usage

```ts
import { createOnboardingController } from "@functions-oneui/onboarding-core";

const controller = createOnboardingController({
  tours: [
    {
      id: "welcome",
      version: "1",
      steps: [
        {
          id: "search",
          title: "Search",
          description: "Use search to find content.",
          target: { kind: "selector", selector: "[data-onboarding='search']" }
        }
      ]
    }
  ]
});

await controller.startTour("welcome");
```

## Full-Page Announcement Step

```ts
const controller = createOnboardingController({
  tours: [
    {
      id: "feature-announcement",
      version: "1",
      steps: [
        {
          id: "dashboard-views",
          kind: "full-page",
          eyebrow: "Feature announcement",
          title: "New dashboard views are available",
          description: "Switch between compact and detailed dashboard views.",
          layout: "split-media",
          media: {
            type: "image",
            src: "/dashboard-preview.png",
            alt: "Preview of compact and detailed dashboard views",
            position: "left"
          },
          primaryAction: {
            label: "Choose dashboard view",
            actionId: "open-dashboard-preferences",
            behavior: "complete"
          },
          secondaryAction: {
            label: "Maybe later",
            behavior: "complete"
          }
        }
      ]
    }
  ],
  actionHandlers: {
    "open-dashboard-preferences": () => {
      // App-owned behavior.
    }
  }
});
```
