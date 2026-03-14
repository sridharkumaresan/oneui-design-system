import { createContext } from "react";

import { createLogger } from "../createLogger.js";
import type { Logger } from "../types.js";

const fallbackLogger = createLogger({ level: "info" });

export const LoggerContext = createContext<Logger>(fallbackLogger);
