# @functions-oneui/onboarding-react

React and SPFx-friendly onboarding integration for OneUI.

## Purpose

- Connect OneUI theme and Fluent runtime to onboarding tours
- Register DOM targets with React refs
- Provide hooks for starting, stopping, and querying tours

## Public API

- `OneUIOnboardingProvider`
- `useOnboarding()`
- `useOnboardingTour(tourId)`
- `useOnboardingTarget(name)`

## Usage

```tsx
import "@functions-oneui/onboarding-styles/styles.css";
import { OneUIProvider } from "@functions-oneui/theme";
import { OneUIOnboardingProvider, useOnboardingTarget } from "@functions-oneui/onboarding-react";
```

For a working demo, see:

- [onboarding-system.stories.jsx](/Users/sridhar/codex%20workspaces/oneui-design-system/apps/storybook/src/onboarding-system.stories.jsx)
- [docs/onboarding.md](/Users/sridhar/codex%20workspaces/oneui-design-system/docs/onboarding.md)
