import React from "react";

import { Button, Card, Text } from "@fluentui/react-components";
import {
  OneUIOnboardingProvider,
  useOnboardingTarget,
  useOnboardingTour
} from "@functions-oneui/onboarding-react";
import type { OnboardingTourDefinition } from "@functions-oneui/onboarding-core";

const tour: OnboardingTourDefinition = {
  id: "playground-onboarding-customization",
  version: "1",
  allowRestart: true,
  visual: {
    appearance: "brand",
    progressDisplay: "dots-and-count"
  },
  driverConfig: {
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Done"
  },
  steps: [
    {
      id: "upload",
      target: { kind: "named", name: "upload-action" },
      title: "Ready to add something new?",
      description: "Select this action to upload or create files and folders in this library.",
      side: "bottom",
      align: "start"
    },
    {
      id: "filters",
      target: { kind: "named", name: "filters" },
      title: "Filter quickly",
      description: "Use ownership, status, and date filters to narrow long result sets without leaving the page.",
      side: "bottom",
      align: "center"
    },
    {
      id: "insights",
      target: { kind: "named", name: "insights" },
      title: "Track readiness",
      description: "The summary tiles show what changed, what is blocked, and where contributors should focus next.",
      side: "top",
      align: "end"
    }
  ]
};

const DemoContent = (): React.JSX.Element => {
  const uploadTarget = useOnboardingTarget("upload-action");
  const filtersTarget = useOnboardingTarget("filters");
  const insightsTarget = useOnboardingTarget("insights");
  const onboardingTour = useOnboardingTour(tour.id);

  return (
    <section className="onboarding-demo-page">
      <div className="onboarding-demo-header">
        <div>
          <Text as="h1" className="onboarding-demo-title">
            Config-driven onboarding
          </Text>
          <Text className="onboarding-demo-subtitle">
            Brand-colored coachmarks, accessible progress, and target registration are all driven by tour config.
          </Text>
        </div>
        <Button appearance="primary" onClick={() => onboardingTour.restart()}>
          Start demo tour
        </Button>
      </div>

      <div className="onboarding-demo-toolbar" ref={uploadTarget.ref}>
        <Button appearance="primary">Upload</Button>
        <Button>Create folder</Button>
        <Button appearance="subtle">Sync</Button>
      </div>

      <div className="onboarding-demo-filters" ref={filtersTarget.ref}>
        {["Owned by me", "Modified this week", "Blocked", "Ready for review"].map((label) => (
          <button className="onboarding-demo-filter" key={label} type="button">
            {label}
          </button>
        ))}
      </div>

      <div className="onboarding-demo-grid" ref={insightsTarget.ref}>
        {[
          ["Ready", "28", "Items ready for validation"],
          ["Blocked", "4", "Need owner action"],
          ["New", "12", "Added this week"]
        ].map(([label, value, description]) => (
          <Card className="onboarding-demo-card" key={label}>
            <Text className="onboarding-demo-card-label">{label}</Text>
            <Text className="onboarding-demo-card-value">{value}</Text>
            <Text className="onboarding-demo-card-description">{description}</Text>
          </Card>
        ))}
      </div>
    </section>
  );
};

export const OnboardingCustomizationDemoPage = (): React.JSX.Element => {
  return (
    <OneUIOnboardingProvider tours={[tour]}>
      <DemoContent />
    </OneUIOnboardingProvider>
  );
};
