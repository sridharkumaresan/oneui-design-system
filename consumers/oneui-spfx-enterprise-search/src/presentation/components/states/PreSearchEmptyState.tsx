import * as React from "react";

import { IllustratedState } from "@functions-oneui/organism-illustrated-state";

import styles from "./States.module.scss";

export const PreSearchEmptyState = (): React.ReactElement => (
  <div className={styles.stateCard}>
    <IllustratedState
      description="Search for a topic, colleague, site, file, or process to load grouped results from the configured enterprise sources."
      headingLevel={2}
      surfaceAppearance="borderless"
      title="Start with a search"
      variant="no-results"
    />
  </div>
);
