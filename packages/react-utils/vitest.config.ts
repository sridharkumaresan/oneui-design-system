import { defineConfig } from "vitest/config";

const isCi = process.env.CI === "true";
const collectCoverage = isCi || process.env.VITEST_COVERAGE === "true";

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"]
  },
  test: {
    fileParallelism: false,
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    maxWorkers: 1,
    minWorkers: 1,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    setupFiles: ["./src/test/setup.ts"],
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
