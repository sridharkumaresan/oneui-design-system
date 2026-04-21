# Claude OneUI SPFx Handoff

This document is project context for an AI coding assistant building a new SharePoint Framework solution that consumes the published OneUI packages from Nexus under the `@functions-oneui` namespace.

Use this as implementation guidance. Do not import private source files from this repository. Consumers must import only from package public entrypoints.

## Direction for Claude

Default implementation direction:

- Create a new HUE SPFx consumer alongside the existing consumer in this workspace, for example `consumers/oneui-spfx-hue-dashboard`.
- Do not modify or duplicate the existing `consumers/oneui-spfx-enterprise-search` app unless the user explicitly changes scope.
- Use the existing consumer as a reference for SPFx 1.22.2, Heft, Vite preview, React 17 compatibility, OneUI theme provider setup, and package consumption patterns.
- Consume `@functions-oneui/*` packages from Nexus at `0.0.1`.
- Keep Nexus URL and auth out of committed files. The user/infrastructure team must provide the actual registry URL and credentials in the Coder/RDX environment.
- Build from the textual HUE design description unless the user attaches the screenshot. Pixel matching is not required without the image.
- Ignore `@functions-oneui/standards` for the HUE app. It is published as part of the package set but currently has no runtime exports.
- Use Heft for SPFx, matching the existing consumer. Do not introduce Gulp-specific assumptions unless the generated SPFx project requires them.

## 1. Workspace Overview

### Repository Type

This repository is the OneUI Design System monorepo. It contains publishable React packages, Storybook documentation, a Vite playground, and an SPFx consumer proof app.

Primary tooling:

- Package manager: `pnpm@10.0.0`
- Monorepo orchestration: Turborepo
- Versioning/publishing: Changesets
- Component stack: React, TypeScript, Fluent UI v9, Griffel
- Storybook: Storybook 8 with React/Vite
- SPFx consumer: SharePoint Framework 1.22.2 with Heft
- Preview apps: Vite

Root package requirements from `package.json`:

```json
{
  "packageManager": "pnpm@10.0.0",
  "engines": {
    "node": ">=22.22.0 <23",
    "pnpm": "10.0.0"
  }
}
```

Important RDX/Coder constraint:

- Some remote Coder templates may not include `corepack` or `pnpm`.
- This monorepo itself needs `pnpm`, because source packages use `workspace:*` links.
- A brand-new external SPFx consumer can use `npm` if it installs already-published packages from Nexus, but the OneUI source monorepo should be installed with `pnpm`.

Infra justification for pnpm:

```text
This repository uses pnpm workspace protocol dependencies and pnpm-lock.yaml as the source of truth. pnpm is part of the build contract, not a developer preference.
```

### Folder Structure

```text
.
  apps/
    playground/                Vite playground for local package validation
    storybook/                 Storybook documentation app
  packages/
    atoms/                     Atomic UI components
    cache/                     Framework-agnostic cache engine
    cache-react/               React hooks for the cache engine
    fonts/                     Brand font CSS package
    onboarding-core/           Framework-agnostic onboarding controller
    onboarding-react/          React onboarding provider/hooks
    onboarding-styles/         Onboarding CSS
    organisms/
      action-card/
      action-panel/
      action-section/
      hero-banner/
      illustrated-state/
      search-autocomplete/
      smart-breadcrumb/
      smart-loading-container/
      smart-progress-bar/
    react-utils/               React hooks and loading/logging utilities
    standards/                 Standards package; currently no public runtime exports
    testing/                   Axe test helpers
    theme/                     OneUI Fluent v9 theme provider and SPFx bridge
    tokens/                    Design tokens and CSS variable generation
    utils/                     Framework-agnostic utilities
  consumers/
    oneui-spfx-enterprise-search/
      Existing SPFx 1.22.2 consumer and Vite preview harness.
  docs/
```

### Important Commands

For the OneUI monorepo:

```bash
pnpm install
pnpm run build
pnpm run test
pnpm run release:verify
pnpm run dev:storybook
```

For the existing SPFx consumer:

```bash
cd consumers/oneui-spfx-enterprise-search
pnpm install
pnpm preview
pnpm preview:build
pnpm start
pnpm build
```

For a new external SPFx solution consuming Nexus packages, use the package manager available in that sandbox. `npm` is acceptable for a standalone consumer if `pnpm` is blocked, because it will install published packages, not workspace links.

## 2. Published Package Inventory

Published Nexus version for the first real release: `0.0.1`. Verify from the target RDX/Coder workspace before installing:

```bash
npm view @functions-oneui/atoms versions --registry <NEXUS_NPM_REGISTRY> --json
```

The local source may still show `0.0.0-local-*`; do not use local source versions as proof of what is in Nexus.

### Inventory Table

| Package | Purpose | Public exports | Example imports | Peers | React 17 / SPFx | Fluent v9 | CSS import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `@functions-oneui/atoms` | Atomic UI building blocks | `OneUIBadge`, `OneUIButton`, `OneUICombobox`, `OneUICard`, `OneUIHeading`, `OneUIImage`, `OneUIInput`, `OneUILink`, `OneUIStack`, `OneUIText` and related types | `import { OneUIButton } from "@functions-oneui/atoms";` | React, ReactDOM, Fluent v9 | Yes, peer range includes React 17 | Yes | No external CSS |
| `@functions-oneui/theme` | Fluent v9 theme composition and SPFx bridge | `OneUIProvider`, `OneUISpfxProvider`, `createOneuiTheme`, `oneuiLightTheme`, `oneuiDarkTheme`, gradients, surfaces, responsive helpers | `import { OneUIProvider } from "@functions-oneui/theme";` | React, ReactDOM, Fluent v9 | Yes | Yes | No external CSS |
| `@functions-oneui/tokens` | Design tokens and CSS variables | `createOneuiCssVariables`, `createOneuiCssVariablesStylesheet`, token scales, raw gradient tokens, semantic tokens | `import { oneuiSpacingScale } from "@functions-oneui/tokens";` | None | Yes | No direct Fluent dependency | Optional: `@functions-oneui/tokens/styles.css` |
| `@functions-oneui/fonts` | Brand font faces and font constants | `oneuiBrandFontFamily`, `oneuiBrandFontCssImport`, `oneuiBrandFontFaces` | `import "@functions-oneui/fonts/styles.css";` | None | Yes | No | Yes: `@functions-oneui/fonts/styles.css` |
| `@functions-oneui/onboarding-core` | Framework-agnostic onboarding controller backed by Driver.js | `createOnboardingController`, onboarding config/action/persistence/analytics types | `import { createOnboardingController } from "@functions-oneui/onboarding-core";` | None | Yes | No | No |
| `@functions-oneui/onboarding-react` | React provider and hooks for onboarding | `OneUIOnboardingProvider`, `useOnboarding`, `useOnboardingTarget`, `useOnboardingTour` | `import { OneUIOnboardingProvider } from "@functions-oneui/onboarding-react";` | React, ReactDOM, Fluent v9 | Yes, but React 17 may need a `React.useId` compatibility shim | Yes through theme | Requires onboarding styles |
| `@functions-oneui/onboarding-styles` | Token-driven CSS for onboarding popovers/full-page mode | `createOneUIOnboardingCssVariables`, `createOneUIOnboardingVariableStylesheet`, class names | `import "@functions-oneui/onboarding-styles/styles.css";` | None | Yes | No | Yes: `@functions-oneui/onboarding-styles/styles.css` |
| `@functions-oneui/cache` | Framework-agnostic scoped cache engine | Cache contracts, `createCacheEngine`, memory/web storage adapters | `import { createCacheEngine } from "@functions-oneui/cache";` | None | Yes | No | No |
| `@functions-oneui/cache-react` | React adapter for cache engine | `useCachedResource` and cache hook types | `import { useCachedResource } from "@functions-oneui/cache-react";` | React, ReactDOM | Yes | No | No |
| `@functions-oneui/react-utils` | Shared React utilities | `useOneUIId`, `useImageLoader`; subpaths `progressive-loading`, `logging`, `image-loading` | `import { useLoadingCoordinator } from "@functions-oneui/react-utils/progressive-loading";` | React, ReactDOM | Yes | No | No |
| `@functions-oneui/utils` | Framework-agnostic helpers | `createDescriptionPreview`, `detectContentFormat` | `import { createDescriptionPreview } from "@functions-oneui/utils";` | None | Yes | No | No |
| `@functions-oneui/standards` | Standards package | Currently exports nothing | Ignore for the HUE app | None | Yes | No | No |
| `@functions-oneui/testing` | Shared test helpers | `expectNoAxeViolations` | `import { expectNoAxeViolations } from "@functions-oneui/testing";` | React, ReactDOM | Test-only | No | No |
| `@functions-oneui/organism-hero-banner` | Full-width hero/page header | `HeroBanner`, `BrandedHeroBanner` | `import { HeroBanner } from "@functions-oneui/organism-hero-banner";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-search-autocomplete` | Search form with scope and suggestions | `SearchAutocomplete` | `import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-action-card` | Structured action card | `ActionCard` | `import { ActionCard } from "@functions-oneui/organism-action-card";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-action-panel` | Primary/secondary action panel | `ActionPanel` | `import { ActionPanel } from "@functions-oneui/organism-action-panel";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-action-section` | Section wrapper for grouped action cards | `ActionSection` | `import { ActionSection } from "@functions-oneui/organism-action-section";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-illustrated-state` | Empty/loading/error/info states | `IllustratedState` | `import { IllustratedState } from "@functions-oneui/organism-illustrated-state";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-smart-breadcrumb` | Breadcrumb with overflow support | `SmartBreadcrumb` | `import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-smart-loading-container` | Progressive async section shell | `SmartLoadingContainer`, `SmartLoadingSection` | `import { SmartLoadingContainer } from "@functions-oneui/organism-smart-loading-container";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |
| `@functions-oneui/organism-smart-progress-bar` | Async progress summary | `SmartProgressBar` | `import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";` | React, ReactDOM, Fluent v9 | Yes | Yes | No |

### Peer Dependencies to Install in a New SPFx Consumer

For SPFx 1.22.2:

```json
{
  "react": "17.0.1",
  "react-dom": "17.0.1",
  "@fluentui/react-components": "9.73.0"
}
```

Most OneUI UI packages declare:

```json
{
  "@fluentui/react-components": "^9.0.0",
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
}
```

## 3. Theme and Token Usage

### Normal React/Vite Provider

Use `OneUIProvider` at the app root. It wraps Fluent UI v9 `FluentProvider` and injects the OneUI theme, gradient context, surface context, and theme mode context.

```tsx
import * as React from "react";
import { OneUIProvider } from "@functions-oneui/theme";
import "@functions-oneui/fonts/styles.css";

import { HueDashboardApp } from "./features/hue-dashboard/HueDashboardApp";

export function App(): React.ReactElement {
  return (
    <OneUIProvider
      mode="light"
      typographyMode="fluid"
      fluidTypography={{
        enabled: true,
        minViewport: 320,
        maxViewport: 1440,
        scale: "comfortable"
      }}
    >
      <HueDashboardApp userDisplayName="Sabina" />
    </OneUIProvider>
  );
}
```

### SPFx Provider

Use `OneUISpfxProvider` at the SPFx boundary so SharePoint theme colors flow into Fluent v9 and OneUI components.

```tsx
import * as React from "react";
import type { IReadonlyTheme } from "@microsoft/sp-component-base";
import { OneUISpfxProvider } from "@functions-oneui/theme";
import "@functions-oneui/fonts/styles.css";

import { HueDashboardApp } from "../../features/hue-dashboard/HueDashboardApp";

export type HueDashboardHostProps = {
  spfxTheme?: IReadonlyTheme;
  userDisplayName: string;
};

export function HueDashboardHost(props: HueDashboardHostProps): React.ReactElement {
  return (
    <OneUISpfxProvider
      spfxTheme={props.spfxTheme}
      typographyMode="fluid"
      fluidTypography={{
        enabled: true,
        minViewport: 320,
        maxViewport: 1440,
        scale: "comfortable"
      }}
      themeOverrides={{
        fluentTheme: {
          strokeWidthThin: "1px",
          strokeWidthThick: "2px"
        }
      }}
    >
      <HueDashboardApp userDisplayName={props.userDisplayName} />
    </OneUISpfxProvider>
  );
}
```

### React 17 Compatibility

The existing SPFx consumer includes a local `ensureReactUseId` shim because some Fluent/React helpers expect `React.useId`, which React 17 does not provide.

Use this in a React 17 SPFx app before rendering OneUI/Fluent components:

```tsx
import * as React from "react";

let nextCompatId = 0;
let didApplyCompat = false;

export const ensureReactUseId = (): void => {
  const reactModule = React as typeof React & {
    default?: typeof React & { useId?: () => string };
    useId?: () => string;
  };

  if (
    (typeof reactModule.useId === "function" ||
      typeof reactModule.default?.useId === "function") &&
    !didApplyCompat
  ) {
    return;
  }

  if (didApplyCompat) {
    return;
  }

  const createCompatUseId = (): string => {
    const idRef = React.useRef<string | undefined>(undefined);

    if (!idRef.current) {
      nextCompatId += 1;
      idRef.current = `oneui-react17-${nextCompatId}`;
    }

    return idRef.current;
  };

  Object.defineProperty(reactModule, "useId", {
    configurable: true,
    value: createCompatUseId
  });

  if (reactModule.default) {
    Object.defineProperty(reactModule.default, "useId", {
      configurable: true,
      value: createCompatUseId
    });
  }

  didApplyCompat = true;
};
```

Call it before rendering:

```tsx
ensureReactUseId();
```

### Light and Dark Theme

```tsx
import { OneUIProvider } from "@functions-oneui/theme";

<OneUIProvider mode="dark">
  <App />
</OneUIProvider>
```

### Gradient Tokens

Use theme helpers rather than hardcoded gradients.

```tsx
import * as React from "react";
import { useOneUIGradients } from "@functions-oneui/theme";

export function GradientPanel(): React.ReactElement {
  const gradients = useOneUIGradients();

  return (
    <section
      style={{
        background: gradients.heroPrimary.css,
        color: "#fff",
        padding: "32px"
      }}
    >
      Gradient-backed content
    </section>
  );
}
```

For hero surfaces, prefer `HeroBanner` with `surfaceKey`:

```tsx
<HeroBanner
  contentTone="inverse"
  surfaceKey="heroPrimary"
  title="Hierarchical User Entitlement (HUE)"
  description="Search and manage entitlement relationships across applications."
/>
```

### Typography, Spacing, Radius, and Shadows

OneUI maps semantic tokens into the Fluent v9 theme object. In component CSS, prefer Fluent CSS variables and tokens:

```tsx
import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  panel: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow8,
    padding: tokens.spacingHorizontalXL
  }
});
```

Do not hardcode page colors unless there is no token equivalent. If a value must be hardcoded for a mock visual, mark it as mock-only.

## 4. Component Usage Examples

### HUE Hero Banner / Page Header

```tsx
import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { OneUICard, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { HeroBanner } from "@functions-oneui/organism-hero-banner";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";

const WeatherIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
    <circle cx="9" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
  </svg>
);

const TrendIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
    <path d="M3 12.5 7 8.5l3 3L15 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    <path d="M11 5.5h4v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
  </svg>
);

const useStyles = makeStyles({
  widget: {
    minWidth: "12rem",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    border: "1px solid rgba(255, 255, 255, 0.28)",
    color: tokens.colorNeutralForegroundOnBrand
  }
});

const scopeOptions = [
  { label: "All", value: "all" },
  { label: "Applications", value: "applications" },
  { label: "Entitlements", value: "entitlements" },
  { label: "Roles", value: "roles" },
  { label: "User groups", value: "user-groups" }
];

export function HueHero(): React.ReactElement {
  const styles = useStyles();

  return (
    <HeroBanner
      contentTone="inverse"
      height="immersive"
      surfaceKey="heroPrimary"
      title="Hierarchical User Entitlement (HUE)"
      description="Search, review, and manage access relationships across applications, roles, groups, and entitlements."
      topStart={
        <OneUIStack direction="row" gap="sm" align="center">
          <WeatherIcon />
          <OneUIText tone="inverse">21 C | Mostly cloudy</OneUIText>
        </OneUIStack>
      }
      topEnd={
        <OneUIStack direction="row" gap="sm" align="center">
          <TrendIcon />
          <OneUIText tone="inverse">BARC.L 222.22 +1.4%</OneUIText>
        </OneUIStack>
      }
      supportingContent={
        <SearchAutocomplete
          formAriaLabel="Search HUE"
          inputAriaLabel="Search applications, entitlements, roles, or groups"
          placeholder="Search HUE"
          scopeAriaLabel="Search scope"
          scopeOptions={scopeOptions}
          submitLabel="Search"
          suggestions={[
            { id: "domains", label: "Domains", value: "domains" },
            { id: "roles", label: "Roles expiring this quarter", value: "roles expiring" }
          ]}
          onSubmit={({ query, scope }) => {
            console.log("Search submitted", { query, scope });
          }}
        />
      }
      footer={
        <OneUIStack direction="row" wrap gap="md">
          <OneUICard className={styles.widget} padding="md">
            <OneUIText block tone="inverse" weight="semibold">42 applications</OneUIText>
            <OneUIText block tone="inverse">Active in your portfolio</OneUIText>
          </OneUICard>
          <OneUICard className={styles.widget} padding="md">
            <OneUIText block tone="inverse" weight="semibold">7 reviews due</OneUIText>
            <OneUIText block tone="inverse">Access reviews need attention</OneUIText>
          </OneUICard>
        </OneUIStack>
      }
    />
  );
}
```

This example uses inline SVGs to avoid adding `@fluentui/react-icons`. If icons are desired later, install `@fluentui/react-icons` explicitly in the consumer.

### Search Box / Search Input

```tsx
import * as React from "react";
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";

export function HueSearch(): React.ReactElement {
  const [query, setQuery] = React.useState("");
  const [scope, setScope] = React.useState<string | undefined>("all");

  return (
    <SearchAutocomplete
      query={query}
      scopeValue={scope}
      inputAriaLabel="Search HUE records"
      scopeAriaLabel="HUE search scope"
      placeholder="Search domains, entitlements, roles, user groups"
      scopeOptions={[
        { label: "All", value: "all" },
        { label: "Domains", value: "domains" },
        { label: "Entitlements", value: "entitlements" },
        { label: "Roles", value: "roles" },
        { label: "User Groups", value: "user-groups" }
      ]}
      suggestions={[
        { id: "1", label: "Application owners", value: "application owners" },
        { id: "2", label: "Privileged roles", value: "privileged roles" }
      ]}
      onQueryChange={setQuery}
      onScopeChange={setScope}
      onSuggestionSelect={(suggestion) => setQuery(suggestion.value)}
      onSubmit={({ query: submittedQuery, scope: submittedScope }) => {
        console.log("Run HUE search", { submittedQuery, submittedScope });
      }}
    />
  );
}
```

### Quick Action Launcher Cards

```tsx
import * as React from "react";
import { OneUIBadge, OneUIButton, OneUIStack, OneUIText } from "@functions-oneui/atoms";
import { ActionCard } from "@functions-oneui/organism-action-card";

const launcherItems = [
  { id: "domains", title: "Domains", count: 18, tone: "brand" as const },
  { id: "entitlements", title: "Entitlements", count: 1284, tone: "info" as const },
  { id: "roles", title: "Roles", count: 246, tone: "success" as const },
  { id: "user-groups", title: "User Groups", count: 91, tone: "warning" as const },
  { id: "relationships", title: "Relationships", count: 5630, tone: "neutral" as const }
];

export function HueLauncher(): React.ReactElement {
  return (
    <OneUIStack direction="row" wrap gap="md">
      {launcherItems.map((item) => (
        <ActionCard
          key={item.id}
          title={item.title}
          eyebrow="HUE category"
          status={<OneUIBadge tone={item.tone}>{item.count.toLocaleString()}</OneUIBadge>}
          actions={
            <OneUIButton
              appearance="secondary"
              size="small"
              onClick={() => console.log("Open launcher item", item.id)}
            >
              Open
            </OneUIButton>
          }
          meta={<OneUIText tone="secondary">Browse and manage records</OneUIText>}
        />
      ))}
    </OneUIStack>
  );
}
```

### Widget Cards

There is no dedicated published `WidgetCard` package. Use `OneUICard` plus atoms.

```tsx
import * as React from "react";
import { OneUICard, OneUIHeading, OneUIStack, OneUIText } from "@functions-oneui/atoms";

export function HueMetricCard(): React.ReactElement {
  return (
    <OneUICard as="section" elevation="raised" padding="lg" accent="brand">
      <OneUIStack gap="xs">
        <OneUIText size="caption" tone="secondary" weight="semibold">
          Access health
        </OneUIText>
        <OneUIHeading level={3}>96%</OneUIHeading>
        <OneUIText tone="secondary">
          Entitlement assignments are within policy.
        </OneUIText>
      </OneUIStack>
    </OneUICard>
  );
}
```

### Action Section

Use `ActionSection` when several related `ActionCard` items need one titled section header, count, and optional header action.

```tsx
import * as React from "react";
import { OneUIBadge, OneUIButton, OneUILink, OneUIText } from "@functions-oneui/atoms";
import { ActionCard } from "@functions-oneui/organism-action-card";
import { ActionSection } from "@functions-oneui/organism-action-section";

export function HueReviewSection(): React.ReactElement {
  return (
    <ActionSection
      title="Access reviews"
      count="3"
      headerAction={
        <OneUILink href="/hue/reviews" underline="always">
          View all
        </OneUILink>
      }
    >
      <ActionCard
        eyebrow="ROLE REVIEW | HUE-1042"
        title="Privileged access review"
        status={<OneUIBadge tone="warning">Due 24 Apr</OneUIBadge>}
        meta={<OneUIText tone="secondary">Owner: Security Operations</OneUIText>}
        actions={
          <>
            <OneUIButton size="small">Review</OneUIButton>
            <OneUIButton appearance="secondary" size="small">Delegate</OneUIButton>
          </>
        }
      />
      <ActionCard
        eyebrow="GROUP REVIEW | HUE-1077"
        title="Finance user group membership"
        status={<OneUIBadge tone="danger" appearance="filled">Overdue</OneUIBadge>}
        meta={<OneUIText tone="secondary">Owner: Finance Technology</OneUIText>}
        actions={<OneUIButton size="small">Open</OneUIButton>}
      />
    </ActionSection>
  );
}
```

### Smart Progress Bar

```tsx
import * as React from "react";
import { SmartProgressBar } from "@functions-oneui/organism-smart-progress-bar";

export function HueLoadingProgress(): React.ReactElement {
  return (
    <SmartProgressBar
      title="Loading HUE dashboard"
      description="Sources update independently while the page stays usable."
      total={5}
      completed={3}
      loading={1}
      delayed={1}
      error={0}
      empty={0}
      refreshing={0}
      success={3}
      percent={60}
      mode="slim"
      items={[
        { id: "applications", label: "Applications", status: "success", count: 42, accentTone: "brand" },
        { id: "entitlements", label: "Entitlements", status: "success", count: 1284, accentTone: "info" },
        { id: "roles", label: "Roles", status: "loading", accentTone: "success" },
        { id: "groups", label: "User groups", status: "delayed", accentTone: "warning" },
        { id: "relationships", label: "Relationships", status: "success", count: 5630, accentTone: "neutral" }
      ]}
    />
  );
}
```

### Smart Loading Container / Accordion Sections

```tsx
import * as React from "react";
import { OneUIButton, OneUIText } from "@functions-oneui/atoms";
import {
  SmartLoadingContainer,
  SmartLoadingSection
} from "@functions-oneui/organism-smart-loading-container";
import { IllustratedState } from "@functions-oneui/organism-illustrated-state";

export function HueDashboardSections(): React.ReactElement {
  return (
    <SmartLoadingContainer
      title="Dashboard"
      description="Access data grouped by HUE source."
      layout="single"
      shape="square"
      surfaceAppearance="raised"
      actions={<OneUIButton appearance="secondary">Export</OneUIButton>}
    >
      <SmartLoadingSection
        title="My Applications"
        status="success"
        count={4}
        collapsible
        accentTone="brand"
      >
        <OneUIText>Application table or card content is rendered by the consuming app.</OneUIText>
      </SmartLoadingSection>

      <SmartLoadingSection
        title="My Entitlements"
        status="empty"
        collapseOnEmpty
        collapsible
        emptyContent={
          <IllustratedState
            surfaceAppearance="borderless"
            variant="no-results"
            title="No entitlements found"
            description="Try changing the search scope or clearing filters."
          />
        }
      />

      <SmartLoadingSection
        title="Relationships"
        status="error"
        onRetry={() => console.log("Retry relationships")}
        errorMessage="Relationship data did not respond."
      />
    </SmartLoadingContainer>
  );
}
```

### Buttons, Typography, Cards, Inputs

```tsx
import * as React from "react";
import {
  OneUIButton,
  OneUICard,
  OneUIHeading,
  OneUIInput,
  OneUIStack,
  OneUIText
} from "@functions-oneui/atoms";

export function HueToolbar(): React.ReactElement {
  const [filter, setFilter] = React.useState("");

  return (
    <OneUICard padding="md" elevation="flat">
      <OneUIStack direction="row" wrap gap="sm" align="center" justify="between">
        <OneUIStack gap="xxs">
          <OneUIHeading level={2}>My Applications</OneUIHeading>
          <OneUIText tone="secondary">Review applications and entitlement coverage.</OneUIText>
        </OneUIStack>

        <OneUIStack direction="row" wrap gap="sm" align="center">
          <OneUIInput
            aria-label="Filter applications"
            placeholder="Filter table"
            value={filter}
            onChange={(_, data) => setFilter(data.value)}
          />
          <OneUIButton appearance="secondary" onClick={() => setFilter("")}>
            Clear
          </OneUIButton>
          <OneUIButton appearance="primary" onClick={() => console.log("Export")}>
            Export
          </OneUIButton>
        </OneUIStack>
      </OneUIStack>
    </OneUICard>
  );
}
```

### Action Panel

```tsx
import * as React from "react";
import { ActionPanel } from "@functions-oneui/organism-action-panel";

export function HueReviewCallout(): React.ReactElement {
  return (
    <ActionPanel
      title="Access review required"
      description="Seven role assignments need owner review before Friday."
      primaryAction={{
        label: "Start review",
        onClick: () => console.log("Start review")
      }}
      secondaryAction={{
        label: "Remind me later",
        onClick: () => console.log("Remind later")
      }}
    />
  );
}
```

### Breadcrumb

```tsx
import * as React from "react";
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

export function HueBreadcrumb(): React.ReactElement {
  return (
    <SmartBreadcrumb
      maxVisibleItems={4}
      items={[
        { id: "home", label: "Home", href: "/" },
        { id: "security", label: "Security", href: "/security" },
        { id: "hue", label: "HUE" }
      ]}
    />
  );
}
```

### Onboarding

```tsx
import * as React from "react";
import "@functions-oneui/onboarding-styles/styles.css";
import {
  OneUIOnboardingProvider,
  useOnboardingTarget,
  useOnboardingTour
} from "@functions-oneui/onboarding-react";
import type { OnboardingTourDefinition } from "@functions-oneui/onboarding-core";
import { OneUIButton } from "@functions-oneui/atoms";

const hueTour: OnboardingTourDefinition = {
  id: "hue-intro",
  version: "1",
  allowRestart: true,
  visual: {
    appearance: "brand",
    progressDisplay: "dots-and-count"
  },
  steps: [
    {
      id: "search",
      target: { kind: "named", name: "hue-search" },
      title: "Search HUE",
      description: "Find applications, entitlements, roles, and relationships.",
      side: "bottom",
      align: "center"
    },
    {
      id: "announcement",
      kind: "full-page",
      eyebrow: "New",
      title: "Dashboard views are available",
      description: "Switch between compact and detailed HUE dashboard layouts.",
      primaryAction: { label: "Next", behavior: "next" },
      secondaryAction: { label: "Maybe later", behavior: "complete" }
    }
  ]
};

function HueTourButton(): React.ReactElement {
  const tour = useOnboardingTour("hue-intro");
  const searchTarget = useOnboardingTarget("hue-search");

  return (
    <>
      <div ref={searchTarget.ref}>Search region goes here</div>
      <OneUIButton onClick={() => void tour.restart()}>Show onboarding</OneUIButton>
    </>
  );
}

export function HueWithOnboarding(): React.ReactElement {
  return (
    <OneUIOnboardingProvider tours={[hueTour]}>
      <HueTourButton />
    </OneUIOnboardingProvider>
  );
}
```

### Cache Hook

```tsx
import * as React from "react";
import { createCacheEngine, createMemoryCacheStorageAdapter } from "@functions-oneui/cache";
import { useCachedResource } from "@functions-oneui/cache-react";

const engine = createCacheEngine({
  storage: createMemoryCacheStorageAdapter()
});

type HueApplication = {
  id: string;
  name: string;
};

export function HueApplicationsData(): React.ReactElement {
  const result = useCachedResource<HueApplication[]>({
    engine,
    scope: {
      namespace: "hue",
      key: "applications",
      segments: {
        user: "current"
      }
    },
    fetcher: async () => [
      { id: "app-1", name: "Markets Portal" },
      { id: "app-2", name: "Risk Console" }
    ],
    policy: {
      staleTimeMs: 60_000,
      expireTimeMs: 300_000
    },
    isEmptyData: (data) => data.length === 0
  });

  if (result.isLoading) {
    return <div>Loading applications...</div>;
  }

  return <div>{result.data?.length ?? 0} applications loaded</div>;
}
```

`CacheScope` is:

```ts
type CacheScope = {
  namespace: string;
  key: string;
  segments?: Record<string, string | number | boolean | undefined>;
};
```

## 5. Recommended Architecture for a New SPFx Consumer

Build the HUE feature as a normal React module first, then wrap it for SPFx. Keep SharePoint APIs at the boundary.

Recommended folder structure:

```text
src/
  features/
    hue-dashboard/
      HueDashboardApp.tsx
      HueDashboardApp.module.scss
      components/
        HueHero.tsx
        HueLauncher.tsx
        HueDashboardTabs.tsx
        HueApplicationsTable.tsx
        HueMetricCard.tsx
      data/
        mockHueData.ts
      models/
        hueModels.ts
      services/
        HueDashboardService.ts
        MockHueDashboardService.ts
        SpfxHueDashboardService.ts
  spfx/
    HueDashboardHost.tsx
    HueDashboardWebPart.ts
  main.tsx
```

Rules:

- `features/hue-dashboard` should not import SPFx packages.
- `features/hue-dashboard/services` should depend on interfaces and plain TypeScript models.
- `spfx/HueDashboardWebPart.ts` should adapt SharePoint context and theme into the React host.
- `main.tsx` should mount the same `HueDashboardApp` with mock services for local Vite preview.
- Keep mock data in `data/`, not inside components.
- Keep table filtering/sorting state in the feature module, not inside shared OneUI package code.

Standalone preview composition:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { OneUIProvider } from "@functions-oneui/theme";
import "@functions-oneui/fonts/styles.css";

import { HueDashboardApp } from "./features/hue-dashboard/HueDashboardApp";
import { MockHueDashboardService } from "./features/hue-dashboard/services/MockHueDashboardService";

ReactDOM.render(
  <OneUIProvider mode="light" typographyMode="fluid" fluidTypography={{ enabled: true }}>
    <HueDashboardApp
      userDisplayName="Sabina"
      service={new MockHueDashboardService()}
    />
  </OneUIProvider>,
  document.getElementById("root")
);
```

SPFx host composition:

```tsx
import * as React from "react";
import type { IReadonlyTheme } from "@microsoft/sp-component-base";
import type { WebPartContext } from "@microsoft/sp-webpart-base";
import { OneUISpfxProvider } from "@functions-oneui/theme";
import "@functions-oneui/fonts/styles.css";

import { HueDashboardApp } from "../features/hue-dashboard/HueDashboardApp";
import { SpfxHueDashboardService } from "../features/hue-dashboard/services/SpfxHueDashboardService";

export type HueDashboardHostProps = {
  context: WebPartContext;
  spfxTheme?: IReadonlyTheme;
};

export function HueDashboardHost(props: HueDashboardHostProps): React.ReactElement {
  const service = React.useMemo(
    () => new SpfxHueDashboardService(props.context),
    [props.context]
  );

  return (
    <OneUISpfxProvider spfxTheme={props.spfxTheme} typographyMode="fluid" fluidTypography={{ enabled: true }}>
      <HueDashboardApp
        userDisplayName={props.context.pageContext.user.displayName}
        service={service}
      />
    </OneUISpfxProvider>
  );
}
```

## 6. SPFx Version Constraints

Existing consumer baseline:

```json
{
  "@microsoft/sp-component-base": "1.22.2",
  "@microsoft/sp-core-library": "1.22.2",
  "@microsoft/sp-http": "1.22.2",
  "@microsoft/sp-http-msgraph": "1.22.2",
  "@microsoft/sp-property-pane": "1.22.2",
  "@microsoft/sp-webpart-base": "1.22.2",
  "@microsoft/spfx-heft-plugins": "1.22.2",
  "@microsoft/spfx-web-build-rig": "1.22.2",
  "react": "17.0.1",
  "react-dom": "17.0.1",
  "@fluentui/react-components": "9.73.0",
  "typescript": "~5.8.0",
  "vite": "5.4.21"
}
```

Existing SPFx consumer Node expectation:

```json
{
  "node": ">=22.14.0 < 23.0.0"
}
```

Monorepo root Node expectation:

```json
{
  "node": ">=22.22.0 <23"
}
```

Commands from the existing SPFx consumer:

```bash
pnpm preview
pnpm preview:build
pnpm start
pnpm build
pnpm typecheck
```

Script meanings:

- `preview`: Vite browser preview harness.
- `preview:build`: Vite production build for the preview harness.
- `start`: `heft start --clean`, for SPFx local serve/workbench flow.
- `build`: `heft test --clean --production && heft package-solution --production`.
- `typecheck`: `tsc -p tsconfig.json --noEmit`.

RDX/Coder notes:

- If building in this uploaded workspace, prefer creating `consumers/oneui-spfx-hue-dashboard` from the existing consumer pattern. SPFx generator availability is not a blocker in that path.
- If scaffolding a separate repo from the SPFx generator, verify generator availability in the template first.
- Use the SPFx 1.22.2 Heft workflow shown above. Do not switch to Gulp unless the generated project explicitly requires it.
- Verify the tenant workbench URL is reachable.
- Verify whether the corporate Nexus install registry differs from the publish registry.
- Verify whether `pnpm` is available. If not, use `npm` in the external consumer project.

## 7. Nexus Registry Setup

Use the Nexus npm group/proxy for installs if your org provides one. Use the hosted/writable registry only for publishing.

The placeholders below are intentional. Do not commit real Nexus credentials into this repository. Claude needs the user or infrastructure team to provide:

- `NEXUS_NPM_REGISTRY`: the install registry URL visible from RDX/Coder
- `NEXUS_NPM_TOKEN` or Nexus basic-auth username/password/token credentials

Consumer `.npmrc` example:

```ini
@functions-oneui:registry=https://<nexus-host>/repository/<npm-group-or-hosted>/
registry=https://registry.npmjs.org/
always-auth=true
//<nexus-host>/repository/<npm-group-or-hosted>/:_authToken=${NEXUS_NPM_TOKEN}
```

If Nexus uses basic auth instead of bearer token:

```ini
@functions-oneui:registry=https://<nexus-host>/repository/<npm-group-or-hosted>/
registry=https://registry.npmjs.org/
//<nexus-host>/repository/<npm-group-or-hosted>/:username=<username>
//<nexus-host>/repository/<npm-group-or-hosted>/:_password=<base64-password-or-token-password>
//<nexus-host>/repository/<npm-group-or-hosted>/:email=<email>
//<nexus-host>/repository/<npm-group-or-hosted>/:always-auth=true
```

Check authentication:

```bash
npm whoami --registry https://<nexus-host>/repository/<npm-group-or-hosted>/
```

Install with npm:

```bash
npm install \
  @fluentui/react-components@9.73.0 \
  @functions-oneui/atoms@0.0.1 \
  @functions-oneui/theme@0.0.1 \
  @functions-oneui/tokens@0.0.1 \
  @functions-oneui/fonts@0.0.1 \
  @functions-oneui/organism-hero-banner@0.0.1 \
  @functions-oneui/organism-search-autocomplete@0.0.1 \
  @functions-oneui/organism-action-card@0.0.1 \
  @functions-oneui/organism-action-panel@0.0.1 \
  @functions-oneui/organism-illustrated-state@0.0.1 \
  @functions-oneui/organism-smart-loading-container@0.0.1 \
  @functions-oneui/organism-smart-progress-bar@0.0.1 \
  @functions-oneui/organism-smart-breadcrumb@0.0.1
```

Install optional onboarding/cache packages:

```bash
npm install \
  @functions-oneui/onboarding-core@0.0.1 \
  @functions-oneui/onboarding-react@0.0.1 \
  @functions-oneui/onboarding-styles@0.0.1 \
  @functions-oneui/cache@0.0.1 \
  @functions-oneui/cache-react@0.0.1 \
  @functions-oneui/react-utils@0.0.1 \
  @functions-oneui/utils@0.0.1
```

If `pnpm` is available in the consumer project:

```bash
pnpm add @functions-oneui/atoms@0.0.1 @functions-oneui/theme@0.0.1
```

Yarn:

- Needs verification. The library publishes normal npm packages, so Yarn should install them from Nexus, but this repo does not use Yarn and does not validate Yarn lockfiles.

## 8. Design Target for New App

The new HUE app should be inspired by the user's HUE screenshot if it is available in the target thread. If no screenshot is attached, build from the textual description below and do not attempt pixel-level fidelity. Implement a clean enterprise Fluent/OneUI dashboard rather than a blind copy.

Target experience:

- Gradient hero background using `HeroBanner` and `surfaceKey="heroPrimary"`.
- Greeting row with user context, weather, and stock summary widgets.
- Large title: `Hierarchical User Entitlement (HUE)`.
- Subtitle describing entitlement search/review.
- Large search bar using `SearchAutocomplete` with scope dropdown.
- Central quick-action launcher cards:
  - Domains
  - Entitlements
  - Roles
  - User Groups
  - Relationships
- Dashboard panel using `OneUICard`, `SmartProgressBar`, and `SmartLoadingContainer`.
- Tabs:
  - My Applications
  - My Entitlements
  - Roles
  - User groups
  - Relationships
  - Reports
- Table with filter/export actions.
- Clean enterprise style, responsive layout, accessible headings/regions.

Recommended layout:

```text
main
  HeroBanner
    topStart: greeting/weather
    topEnd: stock widget
    title/subtitle
    SearchAutocomplete
    launcher cards
  Dashboard content band
    SmartProgressBar
    Tabs
    Toolbar: filter/export
    Table
```

Use Fluent v9 `TabList`, `Tab`, `Table`, `TableHeader`, `TableBody`, etc. for tab and table primitives unless OneUI publishes dedicated wrappers later.

## 9. Implementation Plan for Claude

1. Verify environment.

   ```bash
   node -v
   npm -v
   ```

   For SPFx 1.22.2, use Node 22. The existing consumer uses Node `>=22.14.0 <23.0.0`.

2. Verify Nexus access.

   ```bash
   npm whoami --registry https://<nexus-host>/repository/<npm-group-or-hosted>/
   npm view @functions-oneui/atoms versions --registry https://<nexus-host>/repository/<npm-group-or-hosted>/ --json
   ```

3. Create or inspect the SPFx solution.

   Default in this uploaded workspace: create a new sibling consumer at `consumers/oneui-spfx-hue-dashboard` using the existing `consumers/oneui-spfx-enterprise-search` structure as a reference.

   Only use the SPFx generator if the user wants a separate repo or a fully fresh scaffold:

   ```bash
   npx @microsoft/generator-sharepoint
   ```

   Generator availability is an RDX/Coder template concern, not a blocker for the sibling-consumer approach.

4. Add Vite preview harness if the project should run outside Workbench first.

   Recommended files:

   ```text
   src/main.tsx
   index.html
   tsconfig.preview.json
   vite.config.ts
   ```

5. Install OneUI packages from Nexus.

   Use `npm install` if `pnpm` is unavailable in the Coder template.

6. Add React 17 `ensureReactUseId` compatibility helper.

   Call it before rendering the standalone preview and before SPFx host render.

7. Create feature models.

   ```text
   src/features/hue-dashboard/models/hueModels.ts
   ```

   Suggested models:

   ```ts
   export type HueDashboardTab =
     | "applications"
     | "entitlements"
     | "roles"
     | "user-groups"
     | "relationships"
     | "reports";

   export type HueApplicationRow = {
     id: string;
     application: string;
     domain: string;
     owner: string;
     entitlementCount: number;
     risk: "Low" | "Medium" | "High";
     status: "Active" | "Review due" | "Disabled";
   };
   ```

8. Add mock data.

   ```text
   src/features/hue-dashboard/data/mockHueData.ts
   ```

9. Create service interface and mock service.

   ```text
   services/HueDashboardService.ts
   services/MockHueDashboardService.ts
   services/SpfxHueDashboardService.ts
   ```

   Keep SPFx context only in `SpfxHueDashboardService`.

10. Build UI components.

   - `HueHero.tsx`: `HeroBanner` + `SearchAutocomplete`.
   - `HueLauncher.tsx`: `ActionCard` cards.
   - `HueDashboardTabs.tsx`: Fluent v9 tabs.
   - `HueApplicationsTable.tsx`: Fluent v9 table.
   - `HueMetricCard.tsx`: `OneUICard` + atoms.

11. Wire theme provider.

   - Standalone preview: `OneUIProvider`.
   - SPFx: `OneUISpfxProvider`.

12. Add responsive CSS.

   Use Griffel `makeStyles` where possible. If SPFx module SCSS is used, keep it local to the consumer and rely on CSS variables/tokens.

13. Add SPFx wrapper.

   `HueDashboardWebPart.ts` should only:

   - read SPFx context
   - read theme via `onThemeChanged`
   - render `HueDashboardHost`
   - unmount on dispose

14. Test standalone mode.

   ```bash
   npm run preview
   npm run preview:build
   ```

15. Test SPFx Workbench.

   ```bash
   npm run start
   ```

   Then open the local or hosted workbench URL configured by `config/serve.json`.

16. Document commands and package versions in the new consumer README.

## 10. Acceptance Criteria

- The app renders in standalone React/Vite mode.
- The app renders in SPFx Workbench.
- The app consumes only published `@functions-oneui/*` package entrypoints.
- No imports from OneUI package internals like `dist/*` or `src/*`.
- The app uses `OneUIProvider` for standalone mode and `OneUISpfxProvider` for SPFx mode.
- React 17 compatibility is handled before Fluent/OneUI components render.
- `@functions-oneui/fonts/styles.css` is imported once at the app shell boundary.
- `@functions-oneui/onboarding-styles/styles.css` is imported only if onboarding is used.
- The HUE dashboard uses OneUI atoms/organisms for hero, search, cards, progress, loading sections, and states.
- Fluent v9 primitives are used for tabs, table, menus, and icons where OneUI does not yet provide wrappers.
- No hardcoded OneUI internal token names unless exposed through public package APIs.
- Mock data is isolated under `features/hue-dashboard/data`.
- SPFx context stays outside feature UI components.
- Search, filter, tab changes, and export buttons have event handlers.
- Keyboard navigation works for search, tabs, buttons, menu/dropdowns, and table actions.
- Visible focus states are preserved.
- The layout is responsive across mobile, tablet, and desktop widths.
- No TypeScript errors.
- No build errors.
- No runtime console errors from missing Fluent theme variables.
- Nexus package versions are pinned or intentionally use a controlled dist-tag.

## Final Notes for Claude

- The package is `@functions-oneui/theme`, not `@functions-oneui/themes`.
- Use `@functions-oneui/organism-search-autocomplete` for the large HUE search bar.
- Use `HeroBanner` for the gradient hero; do not recreate the hero gradient manually unless the component cannot satisfy a specific layout need.
- Use `OneUICard` for generic widget cards; there is no dedicated `WidgetCard` package yet.
- Use Fluent UI v9 for icons/tabs/tables/menus. Do not use Fluent UI v8/Fabric components.
- If an API in this document does not typecheck against the installed Nexus package, inspect the installed package `.d.ts` and mark it as a version mismatch. Do not import private source files to bypass the mismatch.
