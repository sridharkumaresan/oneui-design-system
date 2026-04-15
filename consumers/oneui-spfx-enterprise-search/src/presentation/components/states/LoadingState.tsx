import * as React from "react";

import { Spinner, Text } from "@fluentui/react-components";

import styles from "./States.module.scss";

export const LoadingState = (): React.ReactElement => (
  <div className={styles.stateCard}>
    <Spinner labelPosition="below" size="medium" />
    <Text className={styles.stateTitle}>Searching enterprise sources</Text>
    <Text className={styles.stateBody}>
      Loading content across the configured verticals.
    </Text>
  </div>
);
