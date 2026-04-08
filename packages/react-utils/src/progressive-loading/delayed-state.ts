import type { DelayedStateOptions } from "./types.js";

export const shouldMarkSectionDelayed = (options: DelayedStateOptions): boolean => {
  const { now = Date.now(), startedAt, thresholdMs } = options;

  if (startedAt === undefined || thresholdMs <= 0) {
    return false;
  }

  return now - startedAt >= thresholdMs;
};
