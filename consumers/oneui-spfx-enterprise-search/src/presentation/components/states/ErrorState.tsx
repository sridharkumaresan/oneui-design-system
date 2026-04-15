import * as React from "react";

import { Text } from "@fluentui/react-components";

import styles from "./States.module.scss";

type ErrorStateProps = {
  message?: string;
};

export const ErrorState = ({ message }: ErrorStateProps): React.ReactElement => (
  <div className={styles.stateCard}>
    <Text className={styles.stateTitle}>Search is unavailable</Text>
    <Text className={styles.stateBody}>{message ?? "Something went wrong while loading search results."}</Text>
  </div>
);
