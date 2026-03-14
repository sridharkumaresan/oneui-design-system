import { createLogger } from "./createLogger.js";
import { createMemoryTransport } from "./transports.js";
import type { LoggerOptions, TestLoggerHarness } from "./types.js";

export const createTestLogger = (options: LoggerOptions = {}): TestLoggerHarness => {
  const transport = createMemoryTransport();
  const logger = createLogger({
    ...options,
    transports: [...(options.transports ?? []), transport]
  });

  return {
    logger,
    transport,
    getEvents() {
      return transport.getEvents();
    },
    clear(): void {
      transport.clear();
    }
  };
};
