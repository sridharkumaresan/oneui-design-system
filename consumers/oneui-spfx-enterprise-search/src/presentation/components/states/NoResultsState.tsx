import * as React from "react";

import { Text } from "@fluentui/react-components";

import styles from "./States.module.scss";

type NoResultsStateProps = {
  queryText: string;
};

export const NoResultsState = ({ queryText }: NoResultsStateProps): React.ReactElement => (
  <div className={styles.stateCard}>
    <Text className={styles.stateTitle}>No results found</Text>
    <Text className={styles.stateBody}>
      No enterprise content matched <strong>{queryText}</strong>. Try a broader search term or choose another vertical.
    </Text>
  </div>
);
