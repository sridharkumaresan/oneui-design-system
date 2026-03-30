# @functions-oneui/onboarding-core

Framework-agnostic onboarding orchestration for OneUI, backed by Driver.js.

## Purpose

- Own tour definitions, target resolution, lifecycle, persistence, and analytics
- Remain independent from React and Fluent UI runtime concerns
- Provide a stable base for React/SPFx today and other framework adapters later

## Public API

- `createOnboardingController(...)`
- `oneuiOnboardingClassNames`
- typed tour, step, analytics, persistence, and target contracts

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
