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
- Support both targeted walkthroughs and full-page announcements from the same tour contract

## Package Responsibilities

### `@functions-oneui/onboarding-core`

- wraps Driver.js
- owns tour definitions, target resolution, lifecycle, analytics, persistence, and action contracts
- stays framework-agnostic

### `@functions-oneui/onboarding-react`

- registers named targets through React refs
- exposes provider and hooks for SPFx-friendly usage
- injects scope-specific CSS variables derived from the current OneUI theme mode
- passes app-owned action handlers to the core controller

### `@functions-oneui/onboarding-styles`

- ships the shared onboarding stylesheet
- layers OneUI token-driven overrides on top of Driver.js base CSS and full-page panels
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

## Supported Step Types

### Focus Element

This is the existing targeted walkthrough mode. It highlights a resolved DOM target and renders
the popover near that element.

```ts
{
  id: "search",
  kind: "focus-element", // optional; omitted existing steps still work
  title: "Search",
  description: "Use search to find content and people.",
  target: { kind: "named", name: "search-box" },
  side: "bottom",
  align: "center"
}
```

Use it for guided tours through existing UI: search boxes, tabs, filters, cards, and CTAs.

### Full Page

Full-page mode renders an accessible announcement panel over the page. It is not tied to a specific
DOM target and can appear in the same tour as focus-element steps.

```ts
{
  id: "dashboard-views",
  kind: "full-page",
  eyebrow: "Feature announcement",
  title: "New dashboard views are available",
  description: "Switch between compact and detailed views.",
  body: "Choose the layout that best fits your workflow.",
  layout: "split-media",
  size: "lg",
  media: {
    type: "image",
    src: "/assets/dashboard-preview.png",
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
```

Supported full-page layout options:

- `centered-card`: text-first announcement panel
- `split-media`: media and content side by side on wide screens, stacked on small screens
- `hero`: larger visual announcement treatment

Supported sizes:

- `sm`
- `md`
- `lg`

Use full-page mode for feature announcements, first-run introductions, and high-level workflow
education. Do not use it as a replacement for field validation, normal page help text, or simple
tooltips.

## Action Handling

Full-page actions are app-defined. The onboarding library renders the button and invokes an action
handler by `actionId`; it does not know what the action means.

```tsx
const actionHandlers = {
  "open-dashboard-preferences": () => {
    openPreferencesFlyout();
  }
};

<OneUIOnboardingProvider actionHandlers={actionHandlers} tours={tours}>
  <FeaturePage />
</OneUIOnboardingProvider>
```

Action behavior controls what happens after the handler runs:

- `next`: move to the next step, or complete if this is the last step
- `previous`: move to the previous step
- `complete`: mark the tour completed and close it
- `skip`: mark the tour dismissed and close it
- `custom`: run the action only and leave navigation to the app

If an action id has no handler, the library warns and continues with the configured behavior.

## React Demo

Storybook includes a working demo in:

- `Foundation/Onboarding`
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
        id: "welcome",
        kind: "full-page",
        title: "New dashboard views are available",
        description: "Choose how much detail your dashboard shows.",
        primaryAction: {
          label: "Choose dashboard view",
          actionId: "open-dashboard-preferences",
          behavior: "complete"
        },
        secondaryAction: {
          label: "Maybe later",
          behavior: "complete"
        }
      },
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
  const actionHandlers = {
    "open-dashboard-preferences": () => {
      openPreferencesFlyout();
    }
  };

  return (
    <OneUIProvider>
      <OneUIOnboardingProvider actionHandlers={actionHandlers} tours={tours}>
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
- keep app actions in the app layer through `actionHandlers`
- persist completion state through an adapter once host-specific storage rules are finalized

## Accessibility Expectations

- Focus-element steps inherit Driver.js keyboard and overlay behavior.
- Full-page steps render dialog semantics with labelled title and description.
- Full-page media images require meaningful `alt` text.
- CTAs use real buttons and clear labels.
- Escape/close behavior remains available unless `allowClose: false` is set on the full-page step.
- Layouts are responsive and stack on narrow screens.

## SPFx Preview Demo

The SPFx preview app demonstrates both patterns:

- The `Onboarding` toolbar menu launches either the focus-element tour or the full-page tour.
- Focus element tour runs the existing targeted walkthrough.
- Full page tour shows a multi-step feature announcement for dashboard views.
- The final primary CTA invokes the preview app's `open-dashboard-preferences` handler.
- The slide-out preferences flyout and dashboard view state live in the consumer app, not in the onboarding
  library.

## Non-React Path

Non-React consumers should reuse:

- `@functions-oneui/onboarding-core` for tour schema, analytics, persistence, and action handling
- `@functions-oneui/onboarding-styles` for the visual layer

They should not treat CSS as the source of truth. Tokens and the core tour schema remain the real contract.
