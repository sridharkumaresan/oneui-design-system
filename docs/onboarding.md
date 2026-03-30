# Onboarding Architecture

The OneUI onboarding stack is split into three packages:

- `@functions-oneui/onboarding-core`
- `@functions-oneui/onboarding-react`
- `@functions-oneui/onboarding-styles`

## Design Goals

- Keep Fluent UI React v9 and OneUI theme tokens as the visual source of truth
- Wrap a mature walkthrough engine instead of building one from scratch
- Keep React/SPFx ergonomics high today
- Preserve a future adapter path for Angular, Vue, and other non-React hosts

## Package Responsibilities

### `@functions-oneui/onboarding-core`

- wraps Driver.js
- owns tour definitions, target resolution, lifecycle, analytics, and persistence contracts
- stays framework-agnostic

### `@functions-oneui/onboarding-react`

- registers named targets through React refs
- exposes provider and hooks for SPFx-friendly usage
- injects scope-specific CSS variables derived from the current OneUI theme mode

### `@functions-oneui/onboarding-styles`

- ships the shared onboarding stylesheet
- layers OneUI token-driven overrides on top of Driver.js base CSS
- exposes variable stylesheet helpers for non-React hosts

## Consumption Pattern

```tsx
import "@functions-oneui/fonts/styles.css";
import "@functions-oneui/onboarding-styles/styles.css";
import { OneUIProvider } from "@functions-oneui/theme";
import {
  OneUIOnboardingProvider,
  useOnboardingTarget,
  useOnboardingTour
} from "@functions-oneui/onboarding-react";
```

1. Wrap the feature in `OneUIProvider`
2. Import `@functions-oneui/onboarding-styles/styles.css` once
3. Wrap the relevant feature area in `OneUIOnboardingProvider`
4. Register targets with `useOnboardingTarget(name)`
5. Start the tour from `useOnboardingTour(tourId)`

## React Demo

Storybook includes a working demo in:

- `Foundation/Onboarding System`
- [onboarding-system.stories.jsx](/Users/sridhar/codex%20workspaces/oneui-design-system/apps/storybook/src/onboarding-system.stories.jsx)

It demonstrates:

- `OneUIOnboardingProvider`
- named target refs
- start and stop actions
- OneUI theme-aware walkthrough styling

## SPFx Starter

For an SPFx web part, the usual shape is:

```tsx
import "@functions-oneui/fonts/styles.css";
import "@functions-oneui/onboarding-styles/styles.css";
import { OneUIProvider } from "@functions-oneui/theme";
import {
  OneUIOnboardingProvider,
  useOnboardingTarget,
  useOnboardingTour
} from "@functions-oneui/onboarding-react";

const tours = [
  {
    id: "home-banner-tour",
    version: "1",
    steps: [
      {
        id: "search",
        title: "Search",
        description: "Use search to find content and people.",
        target: { kind: "named", name: "search-box" }
      }
    ]
  }
];

function BannerView() {
  const searchTarget = useOnboardingTarget("search-box");
  const homeTour = useOnboardingTour("home-banner-tour");

  return (
    <>
      <button onClick={() => homeTour.start()}>Start walkthrough</button>
      <div ref={searchTarget.ref}>Search UI goes here</div>
    </>
  );
}

export function WebPartRoot() {
  return (
    <OneUIProvider>
      <OneUIOnboardingProvider tours={tours}>
        <BannerView />
      </OneUIOnboardingProvider>
    </OneUIProvider>
  );
}
```

Recommended SPFx rules:

- import the onboarding stylesheet once at the web part entry
- keep tour definitions close to the feature, not buried in generic utilities
- use named targets instead of brittle DOM selectors when possible
- persist completion state through an adapter once host-specific storage rules are finalized

## Non-React Path

Non-React consumers should reuse:

- `@functions-oneui/onboarding-core` for tour schema, analytics, and persistence
- `@functions-oneui/onboarding-styles` for the visual layer

They should not treat CSS as the source of truth. Tokens and the core tour schema remain the real contract.
