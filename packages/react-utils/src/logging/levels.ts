import type { LogLevel } from "./types.js";

export const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
};

export const isLevelEnabled = (level: LogLevel, minimumLevel: LogLevel): boolean => {
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[minimumLevel];
};
