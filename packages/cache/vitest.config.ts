import { defineConfig } from "vitest/config";

const isCi = process.env.CI === "true";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    reporters: isCi ? ["default", "junit"] : ["default"],
    outputFile: isCi
      ? {
          junit: "./test-results/vitest.junit.xml"
        }
      : undefined
  }
});
