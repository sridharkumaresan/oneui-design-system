import * as React from "react";

import { Button } from "@fluentui/react-components";
import { SmartLoadingContainer, SmartLoadingSection } from "@functions-oneui/organism-smart-loading-container";

import type { AllSearchExecutionResult } from "../../../domain/search/contracts/SearchExecutionResult";
import { ResultCardFactory } from "../ResultCards/ResultCardFactory";
import styles from "../SearchPage/SearchPage.module.scss";
import { SearchResultsProgress } from "./SearchResultsProgress";

type AllVerticalResultsProps = {
  result: AllSearchExecutionResult;
};

const classNames = styles as unknown as Record<string, string>;

export const AllVerticalResults = ({ result }: AllVerticalResultsProps): React.ReactElement => {
  const mainSections = result.sections.filter((section) => section.vertical.layoutRegion === "main");
  const sideSections = result.sections.filter((section) => section.vertical.layoutRegion === "side");

  return (
    <SmartLoadingContainer
      aria-label="Search result groups"
      data-search-onboarding="loaded-results"
      layout="single"
      progressSlot={<SearchResultsProgress progress={result.progress} />}
      shape="square"
      surfaceAppearance="flat"
      title=""
    >
      <div className={styles.resultsColumns}>
        <div className={styles.mainColumn} data-search-onboarding="main-sections">
          {mainSections.map((section) => (
            <SmartLoadingSection
              accentTone={section.vertical.rendering.sectionAccentTone}
              actions={
                section.supportsViewMore ? (
                  <Button appearance="subtle" as="a" href={section.viewMoreUrl} size="small">
                    View more
                  </Button>
                ) : undefined
              }
              delayedMessage="This source is taking longer than expected."
              delayedThresholdMs={450}
              expandOnSuccess
              collapsible
              count={section.total}
              className={classNames.resultSection}
              data-search-section={section.vertical.key}
              defaultCollapsed={false}
              emptyContent={section.vertical.rendering.emptyMessage}
              errorContent={section.errorMessage}
              key={section.vertical.key}
              loadingLabel={`Loading ${section.vertical.title.toLowerCase()}...`}
              status={section.status}
              statusDisplayMode="inline"
              shape="square"
              surfaceAppearance="flat"
              title={section.vertical.title}
            >
              <ResultCardFactory items={section.items} />
            </SmartLoadingSection>
          ))}
        </div>
        <aside className={styles.sideColumn} data-search-onboarding="supporting-sections">
          {sideSections.map((section) => (
            <SmartLoadingSection
              accentTone={section.vertical.rendering.sectionAccentTone}
              actions={
                section.supportsViewMore ? (
                  <Button appearance="subtle" as="a" href={section.viewMoreUrl} size="small">
                    View more
                  </Button>
                ) : undefined
              }
              delayedMessage="This source is taking longer than expected."
              delayedThresholdMs={450}
              expandOnSuccess
              collapsible
              count={section.total}
              className={classNames.resultSection}
              data-search-section={section.vertical.key}
              defaultCollapsed={false}
              emptyContent={section.vertical.rendering.emptyMessage}
              key={section.vertical.key}
              loadingLabel={`Loading ${section.vertical.title.toLowerCase()}...`}
              status={section.status}
              statusDisplayMode="inline"
              shape="square"
              surfaceAppearance="flat"
              title={section.vertical.title}
            >
              <ResultCardFactory items={section.items} />
            </SmartLoadingSection>
          ))}
        </aside>
      </div>
    </SmartLoadingContainer>
  );
};
