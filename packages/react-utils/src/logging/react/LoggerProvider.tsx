import type { PropsWithChildren, ReactElement } from "react";

import { LoggerContext } from "./LoggerContext.js";
import type { Logger } from "../types.js";

export interface LoggerProviderProps extends PropsWithChildren {
  logger: Logger;
}

export const LoggerProvider = ({ logger, children }: LoggerProviderProps): ReactElement => {
  return <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>;
};
