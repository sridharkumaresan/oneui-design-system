import * as React from "react";

import { Text } from "@fluentui/react-components";

import styles from "./States.module.scss";

export const PreSearchEmptyState = (): React.ReactElement => (
  <div className={styles.stateCard}>
    <Text className={styles.stateTitle}>Start with a query</Text>
    <Text className={styles.stateBody}>
      Enter a topic, person, site, file, or Barclays process to load grouped enterprise results.
    </Text>
  </div>
);
