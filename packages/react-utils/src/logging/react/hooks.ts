import { useContext, useMemo } from "react";

import { LoggerContext } from "./LoggerContext.js";
import type { Logger, LoggerBindings } from "../types.js";

export const useLogger = (): Logger => {
  return useContext(LoggerContext);
};

export const useComponentLogger = (
  component: string,
  bindings?: Omit<LoggerBindings, "component">
): Logger => {
  const logger = useLogger();

  return useMemo(() => {
    return logger.child({ ...bindings, component });
  }, [bindings, component, logger]);
};
