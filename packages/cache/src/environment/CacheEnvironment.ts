import type { CacheClock } from "../contracts/CacheEngine.js";

export type CacheTimer = {
  setTimeout: (callback: () => void, delayMs: number) => unknown;
  clearTimeout: (handle: unknown) => void;
};

export type CacheActivityState = "active" | "hidden" | "unknown";

export type CacheActivityProvider = {
  getState: () => CacheActivityState;
  subscribe?: (listener: (state: CacheActivityState) => void) => () => void;
};

export type CacheRefreshScheduler = {
  schedule: (callback: () => void, delayMs: number) => () => void;
};

export const systemCacheClock: CacheClock = {
  now: () => Date.now()
};

export const createTimerRefreshScheduler = (timer: CacheTimer): CacheRefreshScheduler => ({
  schedule: (callback, delayMs) => {
    const handle = timer.setTimeout(callback, delayMs);

    return () => {
      timer.clearTimeout(handle);
    };
  }
});

export const unknownActivityProvider: CacheActivityProvider = {
  getState: () => "unknown"
};
