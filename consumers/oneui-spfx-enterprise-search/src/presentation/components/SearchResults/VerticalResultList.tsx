import * as React from "react";

import { Button } from "@fluentui/react-components";
import { SmartLoadingContainer, SmartLoadingSection } from "@functions-oneui/organism-smart-loading-container";

import type { DedicatedSearchExecutionResult } from "../../../domain/search/contracts/SearchExecutionResult";
import { ResultCardFactory } from "../ResultCards/ResultCardFactory";
import styles from "../SearchPage/SearchPage.module.scss";

type VerticalResultListProps = {
  result: DedicatedSearchExecutionResult;
};

const classNames = styles as unknown as Record<string, string>;

export const VerticalResultList = ({ result }: VerticalResultListProps): React.ReactElement => {
  return (
    <SmartLoadingContainer
      description={`Focused ${result.selectedVertical.title.toLowerCase()} results for the current query.`}
      layout="single"
      shape="square"
      surfaceAppearance="flat"
      title={result.selectedVertical.title}
    >
      <SmartLoadingSection
        accentTone={result.selectedVertical.rendering.sectionAccentTone}
        actions={
          result.selectedVertical.rendering.supportsViewMore ? (
            <Button appearance="subtle" size="small">
              View more
            </Button>
          ) : undefined
        }
        collapsible
        className={classNames.resultSection}
        count={result.result.total}
        delayedMessage="This source is taking longer than expected."
        delayedThresholdMs={450}
        defaultCollapsed={false}
        emptyContent={result.selectedVertical.rendering.emptyMessage}
        errorContent={result.result.errorMessage}
        expandOnSuccess
        loadingLabel={`Loading ${result.selectedVertical.title.toLowerCase()}...`}
        status={result.result.status}
        statusDisplayMode="inline"
        shape="square"
        surfaceAppearance="flat"
        title={result.selectedVertical.title}
      >
        <ResultCardFactory items={result.result.items} />
      </SmartLoadingSection>
    </SmartLoadingContainer>
  );
};
