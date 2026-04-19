import { defineConfig } from "vitest/config";

const isCi = process.env.CI === "true";
const collectCoverage = isCi || process.env.VITEST_COVERAGE === "true";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    reporters: isCi ? ["default", "junit"] : ["default"],
    outputFile: isCi
      ? {
          junit: "./test-results/vitest.junit.xml"
        }
      : undefined,
    coverage: {
      enabled: collectCoverage,
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text-summary", "html", "lcov"]
    }
  }
});
