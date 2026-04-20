import React from "react";
import {
  Button,
  Tab,
  TabList,
  Text,
  useFluent
} from "@fluentui/react-components";
import { OneUIBadge, OneUIButton, OneUIHeading, OneUIInput, OneUILink, OneUIText } from "@functions-oneui/atoms";
import { HeroBanner } from "@functions-oneui/organism-hero-banner";
import { ActionCard } from "@functions-oneui/organism-action-card";
import {
  OneUIOnboardingProvider,
  useOnboardingTarget,
  useOnboardingTour
} from "@functions-oneui/onboarding-react";
import { oneuiDarkTheme, oneuiLightTheme, useOneUIThemeMode } from "@functions-oneui/theme";

const SearchIcon = () => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 20 20" width="18">
    <circle cx="9" cy="9" r="5.75" stroke="currentColor" strokeWidth="1.5" />
    <path d="m13.5 13.5 3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
    <path
      d="m2.5 7.2 2.5 2.5 6-6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const WarningIcon = () => (
  <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
    <path
      d="M7 1.5 12.5 12.5H1.5L7 1.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.4"
    />
    <path d="M7 5v3.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    <circle cx="7" cy="10.1" fill="currentColor" r="0.85" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
    <path d="M8 2.5h3.5V6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    <path d="M6 8 11.2 2.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    <path
      d="M11 7.5v3a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h3"
      stroke="currentColor"
      strokeWidth="1.3"
    />
  </svg>
);

const inboxTour = {
  id: "task-inbox-onboarding",
  version: "1",
  steps: [
    {
      id: "tabs",
      title: "Switch between task streams",
      description:
        "Use the tabs to move between approvals and your active task workload without leaving the inbox.",
      target: { kind: "named", name: "tabs" }
    },
    {
      id: "search",
      title: "Search within the inbox",
      description:
        "Search narrows the task list quickly when people know the task title, owner, or campaign name.",
      target: { kind: "named", name: "search" }
    },
    {
      id: "filters",
      title: "Focus the list with filters",
      description:
        "The quick filter lets people isolate all tasks or just the overdue items that need immediate attention.",
      target: { kind: "named", name: "filters" }
    },
    {
      id: "action-card",
      title: "Review the task card",
      description:
        "Each action card brings together the task context, status, helper links, and actions in one reusable workflow surface.",
      target: { kind: "named", name: "action-card" }
    },
    {
      id: "action-card-cta",
      title: "Primary action",
      description:
        "The main CTA is the quickest way to complete the task or jump into the dedicated experience for that workflow.",
      target: { kind: "named", name: "action-card-cta" }
    }
  ]
};

const taskData = [
  {
    id: "compliance-1",
    section: "Compliance (1)",
    eyebrow: "COMPLIANCE",
    title: "You have 1 outstanding tasks",
    summary:
      "There are tasks assigned to you for compliance purposes. Please go to your compliance inbox and take action.",
    helperLinkLabel: "More information",
    primaryActionLabel: "Open Compliance Inbox",
    primaryActionIcon: <ExternalLinkIcon />,
    primaryActionKind: "open",
    secondaryActionLabel: "View in Compliance",
    status: "OVERDUE"
  },
  {
    id: "connections-1",
    section: "Connections (9)",
    eyebrow: "CONNECTIONS",
    title: "Campaign card for Connections OAT testing",
    summary: "See more",
    primaryActionLabel: "Dismiss",
    status: "OVERDUE"
  },
  {
    id: "connections-2",
    section: "Connections (9)",
    eyebrow: "CONNECTIONS",
    title: "Campaign card #3 for Connections OAT testing",
    summary: "See more",
    primaryActionLabel: "Dismiss",
    status: "OVERDUE"
  },
  {
    id: "connections-3",
    section: "Connections (9)",
    eyebrow: "CONNECTIONS",
    title: "Campaign card #8 for Connections OAT testing",
    summary: "Click here to launch",
    primaryActionLabel: "Complete",
    secondaryActionLabel: "Dismiss",
    status: "OVERDUE"
  }
];

const sectionOrder = ["Compliance (1)", "Connections (9)"];

const filterTasks = (items, selectedFilter) => {
  if (selectedFilter === "overdue") {
    return items.filter((item) => item.status === "OVERDUE");
  }

  return items;
};

const renderStatus = () => (
  <OneUIBadge appearance="filled" icon={<WarningIcon />} tone="danger">
    OVERDUE
  </OneUIBadge>
);

const InboxPage = () => {
  const mode = useOneUIThemeMode();
  const fluent = useFluent();
  const theme = fluent?.theme ?? (mode === "dark" ? oneuiDarkTheme : oneuiLightTheme);
  const tabsTarget = useOnboardingTarget("tabs");
  const searchTarget = useOnboardingTarget("search");
  const filtersTarget = useOnboardingTarget("filters");
  const actionCardTarget = useOnboardingTarget("action-card");
  const actionCardCtaTarget = useOnboardingTarget("action-card-cta");
  const onboardingTour = useOnboardingTour("task-inbox-onboarding");
  const [selectedTab, setSelectedTab] = React.useState("tasks");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const filteredTasks = React.useMemo(() => filterTasks(taskData, selectedFilter), [selectedFilter]);

  const groupedTasks = React.useMemo(() => {
    return sectionOrder
      .map((section) => ({
        section,
        items: filteredTasks.filter((task) => task.section === section)
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredTasks]);

  return (
    <div
      style={{
        background: theme.colorNeutralBackground1,
        color: theme.colorNeutralForeground1,
        display: "grid",
        gap: theme.spacingVerticalXL,
        minHeight: "100vh",
        paddingBottom: theme.spacingVerticalXXL,
        width: "100%"
      }}
    >
      <HeroBanner
        description="View approvals and tasks that require your attention"
        height="tiny"
        surfaceKey="heroSoft"
        title="Task Inbox"
      />

      <div
        style={{
          display: "grid",
          gap: theme.spacingVerticalXL,
          marginInline: "auto",
          maxWidth: "78rem",
          paddingInline: theme.spacingHorizontalXL,
          width: "100%"
        }}
      >
        <div
          style={{
            alignItems: "end",
            columnGap: theme.spacingHorizontalXXL,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            rowGap: theme.spacingVerticalL
          }}
        >
          <div
            ref={tabsTarget.ref}
            style={{ borderBottom: `1px solid ${theme.colorNeutralStroke2}` }}
          >
            <TabList
              selectedValue={selectedTab}
              onTabSelect={(_, data) => {
                setSelectedTab(String(data.value));
              }}
            >
              <Tab value="approvals">Approvals</Tab>
              <Tab value="tasks">Tasks (23)</Tab>
            </TabList>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "grid",
              gap: theme.spacingVerticalM,
              justifyItems: "end"
            }}
          >
            <div
              ref={searchTarget.ref}
              style={{
                alignItems: "center",
                display: "grid",
                gap: theme.spacingHorizontalM,
                gridTemplateColumns: "minmax(20rem, 24rem) auto",
                width: "100%"
              }}
            >
              <OneUIInput
                appearance="outline"
                contentBefore={<SearchIcon />}
                placeholder="Search tasks"
                stretch
                aria-label="Search tasks"
              />
              <OneUIButton>Search</OneUIButton>
            </div>

            <div
              ref={filtersTarget.ref}
              style={{
                alignItems: "center",
                display: "flex",
                gap: theme.spacingHorizontalM,
                justifyContent: "flex-end",
                flexWrap: "wrap"
              }}
            >
              <Text size={300}>Show</Text>
              <Button
                appearance={selectedFilter === "all" ? "primary" : "secondary"}
                icon={<CheckIcon />}
                onClick={() => setSelectedFilter("all")}
              >
                All
              </Button>
              <Button
                appearance={selectedFilter === "overdue" ? "primary" : "secondary"}
                icon={<WarningIcon />}
                onClick={() => setSelectedFilter("overdue")}
              >
                Overdue
              </Button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: theme.spacingVerticalL }}>
          <OneUIHeading level={2}>Tasks</OneUIHeading>
          <div
            style={{
              alignItems: "center",
              color: theme.colorPaletteRedForeground1,
              display: "flex",
              gap: theme.spacingHorizontalS
            }}
          >
            <WarningIcon />
            <OneUIText tone="secondary">
              Learning data could not be retrieved. Please try again or{" "}
              <OneUILink href="/learning">Visit Learning</OneUILink>
            </OneUIText>
          </div>
        </div>

        <div style={{ display: "grid", gap: theme.spacingVerticalXXL }}>
          {groupedTasks.map((group) => (
            <section
              key={group.section}
              style={{
                display: "grid",
                gap: theme.spacingVerticalL
              }}
            >
              <OneUIHeading level={3}>{group.section}</OneUIHeading>
              <div style={{ display: "grid", gap: theme.spacingVerticalL }}>
                {group.items.map((task, index) => {
                  const isPrimaryDemoCard = index === 0 && group.section === "Compliance (1)";

                  return (
                    <div key={task.id} ref={isPrimaryDemoCard ? actionCardTarget.ref : undefined}>
                      <ActionCard
                        actions={
                          <>
                            <span ref={isPrimaryDemoCard ? actionCardCtaTarget.ref : undefined}>
                              <Button size="medium" appearance="primary">
                                {task.primaryActionIcon ? (
                                  <span
                                    style={{
                                      alignItems: "center",
                                      display: "inline-flex",
                                      gap: "0.5rem"
                                    }}
                                  >
                                    {task.primaryActionIcon}
                                    {task.primaryActionLabel}
                                  </span>
                                ) : (
                                  task.primaryActionLabel
                                )}
                              </Button>
                            </span>
                            {task.secondaryActionLabel ? (
                              <OneUILink href="/dismiss" underline="hover">
                                {task.secondaryActionLabel}
                              </OneUILink>
                            ) : null}
                          </>
                        }
                        eyebrow={task.eyebrow}
                        footer={
                          task.secondaryActionLabel ? undefined : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: theme.spacingHorizontalL,
                                alignItems: "center",
                                flexWrap: "wrap"
                              }}
                            >
                              <OneUILink href="/details" underline="hover">
                                {task.helperLinkLabel}
                              </OneUILink>
                              {task.secondaryActionLabel ? (
                                <OneUILink href="/secondary" underline="hover">
                                  {task.secondaryActionLabel}
                                </OneUILink>
                              ) : null}
                            </div>
                          )
                        }
                        meta={
                          <OneUIText block tone="secondary">
                            {task.summary}
                          </OneUIText>
                        }
                        status={renderStatus()}
                        title={task.title}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <OneUIButton appearance="secondary" onClick={() => onboardingTour.restart()}>
            Restart walkthrough
          </OneUIButton>
        </div>
      </div>
    </div>
  );
};

const OnboardingInboxDemoStory = () => {
  return (
    <OneUIOnboardingProvider tours={[inboxTour]}>
      <InboxPage />
    </OneUIOnboardingProvider>
  );
};

const packageRows = [
  {
    name: "@functions-oneui/onboarding-core",
    purpose: "Framework-agnostic tour engine contract.",
    owns: "Tour schema, target resolution, lifecycle, persistence and analytics adapters, and the Driver.js adapter.",
    useWhen: "Use directly for non-React hosts or when building another framework adapter."
  },
  {
    name: "@functions-oneui/onboarding-react",
    purpose: "React and SPFx-friendly integration.",
    owns: "Provider, hooks, named target refs, controller wiring, and theme variable injection from OneUI theme mode.",
    useWhen: "Use in React apps, SPFx web parts, and Storybook examples."
  },
  {
    name: "@functions-oneui/onboarding-styles",
    purpose: "Shared visual layer for the walkthrough.",
    owns: "Driver.js base styling, OneUI token-driven overrides, focus styles, buttons, progress, and scoped CSS variables.",
    useWhen: "Import once in every host that renders OneUI onboarding."
  }
];

const solutionCards = [
  "First-run product tours for feature areas such as search, task inboxes, and admin screens.",
  "Release callouts that point to new UI without each team rebuilding overlay behavior.",
  "SPFx walkthroughs where named React refs are safer than brittle DOM selectors.",
  "Non-React host integration that still uses the same tour schema and OneUI styling."
];

const chooseRows = [
  {
    scenario: "React or SPFx feature",
    packages: "onboarding-react + onboarding-styles",
    reason: "Fastest path: provider, hooks, refs, and theme-aware CSS are handled."
  },
  {
    scenario: "Non-React host",
    packages: "onboarding-core + onboarding-styles",
    reason: "Reuse the contract and visuals while wiring targets through the host framework."
  },
  {
    scenario: "Custom adapter",
    packages: "onboarding-core",
    reason: "Build on the same controller, analytics, persistence, and target model."
  }
];

const reactSetupCode = `import "@functions-oneui/onboarding-styles/styles.css";
import { OneUIOnboardingProvider } from "@functions-oneui/onboarding-react";

<OneUIOnboardingProvider tours={tours}>
  <FeaturePage />
</OneUIOnboardingProvider>`;

const targetCode = `const searchTarget = useOnboardingTarget("search-box");
const tour = useOnboardingTour("home-tour");

<button onClick={() => tour.start()}>Start tour</button>
<div ref={searchTarget.ref}>Search UI</div>`;

const tourCode = `const tours = [{
  id: "home-tour",
  version: "1",
  steps: [{
    id: "search",
    title: "Search",
    description: "Find content and people from one place.",
    target: { kind: "named", name: "search-box" }
  }]
}];`;

const GuideCodeBlock = ({ children }) => {
  const fluent = useFluent();
  const mode = useOneUIThemeMode();
  const theme = fluent?.theme ?? (mode === "dark" ? oneuiDarkTheme : oneuiLightTheme);

  return (
    <pre
      style={{
        background: theme.colorNeutralBackground3,
        border: `1px solid ${theme.colorNeutralStroke2}`,
        borderRadius: theme.borderRadiusMedium,
        color: theme.colorNeutralForeground1,
        fontFamily: "Consolas, Monaco, 'Courier New', monospace",
        fontSize: theme.fontSizeBase200,
        lineHeight: theme.lineHeightBase300,
        margin: 0,
        overflowX: "auto",
        padding: theme.spacingHorizontalL,
        whiteSpace: "pre"
      }}
    >
      <code>{children}</code>
    </pre>
  );
};

const GuideCard = ({ children }) => {
  const fluent = useFluent();
  const mode = useOneUIThemeMode();
  const theme = fluent?.theme ?? (mode === "dark" ? oneuiDarkTheme : oneuiLightTheme);

  return (
    <div
      style={{
        background: theme.colorNeutralBackground1,
        border: `1px solid ${theme.colorNeutralStroke2}`,
        borderRadius: theme.borderRadiusMedium,
        boxShadow: theme.shadow4,
        display: "grid",
        gap: theme.spacingVerticalS,
        padding: theme.spacingHorizontalL
      }}
    >
      {children}
    </div>
  );
};

const GuideSection = ({ children, description, title }) => {
  const fluent = useFluent();
  const mode = useOneUIThemeMode();
  const theme = fluent?.theme ?? (mode === "dark" ? oneuiDarkTheme : oneuiLightTheme);

  return (
    <section style={{ display: "grid", gap: theme.spacingVerticalL }}>
      <div style={{ display: "grid", gap: theme.spacingVerticalXS }}>
        <OneUIHeading level={2}>{title}</OneUIHeading>
        {description ? (
          <OneUIText block tone="secondary">
            {description}
          </OneUIText>
        ) : null}
      </div>
      {children}
    </section>
  );
};

const OnboardingLibraryGuide = () => {
  const fluent = useFluent();
  const mode = useOneUIThemeMode();
  const theme = fluent?.theme ?? (mode === "dark" ? oneuiDarkTheme : oneuiLightTheme);

  return (
    <main
      style={{
        background: theme.colorNeutralBackground2,
        color: theme.colorNeutralForeground1,
        minHeight: "100vh",
        paddingBlock: theme.spacingVerticalXXL,
        paddingInline: theme.spacingHorizontalXL
      }}
    >
      <div
        style={{
          display: "grid",
          gap: theme.spacingVerticalXXL,
          marginInline: "auto",
          maxWidth: "78rem"
        }}
      >
        <header style={{ display: "grid", gap: theme.spacingVerticalM, maxWidth: "56rem" }}>
          <OneUIBadge appearance="filled" tone="brand">
            ONBOARDING
          </OneUIBadge>
          <OneUIHeading level={1}>OneUI onboarding library</OneUIHeading>
          <OneUIText block size="large" tone="secondary">
            A reusable guided-tour system for OneUI experiences. Teams define tours as data,
            attach steps to stable targets, and get a themed Driver.js walkthrough without owning
            overlay mechanics in each feature.
          </OneUIText>
        </header>

        <GuideSection title="What We Offer">
          <div
            style={{
              display: "grid",
              gap: theme.spacingHorizontalL,
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))"
            }}
          >
            <GuideCard>
              <OneUIHeading level={3}>Data-first tours</OneUIHeading>
              <OneUIText tone="secondary">
                Steps describe target, copy, placement, progress, and behavior. Feature code does
                not need to script the overlay.
              </OneUIText>
            </GuideCard>
            <GuideCard>
              <OneUIHeading level={3}>OneUI visual contract</OneUIHeading>
              <OneUIText tone="secondary">
                The popover, buttons, focus ring, shadow, and light/dark colors come from OneUI
                theme variables and shared CSS.
              </OneUIText>
            </GuideCard>
            <GuideCard>
              <OneUIHeading level={3}>Host-ready lifecycle</OneUIHeading>
              <OneUIText tone="secondary">
                Persistence and analytics are adapters, so SPFx or product apps can plug in their
                own storage and telemetry rules.
              </OneUIText>
            </GuideCard>
          </div>
        </GuideSection>

        <GuideSection
          title="Why Three Packages"
          description="The split keeps the contract clear: core orchestration, React ergonomics, and styling are separate responsibilities."
        >
          <div style={{ display: "grid", gap: theme.spacingVerticalM }}>
            {packageRows.map((pkg) => (
              <GuideCard key={pkg.name}>
                <OneUIHeading level={3}>{pkg.name}</OneUIHeading>
                <OneUIText>{pkg.purpose}</OneUIText>
                <OneUIText block tone="secondary">
                  Owns: {pkg.owns}
                </OneUIText>
                <OneUIText block tone="secondary">
                  Use when: {pkg.useWhen}
                </OneUIText>
              </GuideCard>
            ))}
          </div>
        </GuideSection>

        <GuideSection
          title="Why Wrap Driver.js"
          description="Driver.js is good at overlay mechanics. OneUI should own the product contract around it."
        >
          <GuideCard>
            <OneUIText>
              Driver.js handles positioning, masking, step navigation, and keyboard behavior. Our
              wrapper adds named targets, typed tour definitions, OneUI styling, scoped theme
              variables, missing-target handling, persistence hooks, and analytics hooks. Consumers
              should depend on the OneUI contract, not Driver.js internals.
            </OneUIText>
          </GuideCard>
        </GuideSection>

        <GuideSection title="How To Use It">
          <div
            style={{
              display: "grid",
              gap: theme.spacingHorizontalL,
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))"
            }}
          >
            <GuideCard>
              <OneUIHeading level={3}>1. Wrap the feature</OneUIHeading>
              <GuideCodeBlock>{reactSetupCode}</GuideCodeBlock>
            </GuideCard>
            <GuideCard>
              <OneUIHeading level={3}>2. Define stable targets</OneUIHeading>
              <GuideCodeBlock>{targetCode}</GuideCodeBlock>
            </GuideCard>
            <GuideCard>
              <OneUIHeading level={3}>3. Keep tours as data</OneUIHeading>
              <GuideCodeBlock>{tourCode}</GuideCodeBlock>
            </GuideCard>
          </div>
        </GuideSection>

        <GuideSection
          title="Where It Solves Problems"
          description="Use onboarding when the user needs guided context through an existing workflow. Do not use it as a replacement for normal help text, validation, banners, or simple tooltips."
        >
          <div
            style={{
              display: "grid",
              gap: theme.spacingHorizontalM,
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))"
            }}
          >
            {solutionCards.map((item) => (
              <GuideCard key={item}>
                <OneUIText>{item}</OneUIText>
              </GuideCard>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Which Package Do I Pick">
          <div style={{ display: "grid", gap: theme.spacingVerticalM }}>
            {chooseRows.map((row) => (
              <GuideCard key={row.scenario}>
                <div
                  style={{
                    display: "grid",
                    gap: theme.spacingHorizontalL,
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))"
                  }}
                >
                  <OneUIText weight="semibold">{row.scenario}</OneUIText>
                  <OneUIText>{row.packages}</OneUIText>
                  <OneUIText tone="secondary">{row.reason}</OneUIText>
                </div>
              </GuideCard>
            ))}
          </div>
        </GuideSection>
      </div>
    </main>
  );
};

export default {
  title: "Foundation/Onboarding",
  component: OnboardingInboxDemoStory,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A realistic task inbox page composed from the current OneUI theme, atoms, organisms, and a few Fluent primitives. The onboarding system walks users through tabs, search, filters, the action card shell, and the primary CTA."
      }
    }
  }
};

export const LibraryGuide = {
  name: "Library guide",
  parameters: {
    docs: {
      description: {
        story:
          "A compact explanation of the OneUI onboarding packages, the Driver.js wrapper, and the recommended consumption paths."
      },
      source: {
        code: null
      }
    }
  },
  render: () => <OnboardingLibraryGuide />
};

export const WalkthroughInbox = {
  name: "Walkthrough inbox",
  render: () => <OnboardingInboxDemoStory />
};
