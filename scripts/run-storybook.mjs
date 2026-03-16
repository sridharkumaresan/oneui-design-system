import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const mode = process.argv[2];

if (mode !== "build" && mode !== "dev") {
  console.error("[storybook] Expected `build` or `dev`.");
  process.exit(1);
}

const storybookBin = resolve(process.cwd(), "node_modules/storybook/bin/index.cjs");
const args =
  mode === "build"
    ? [storybookBin, "build", "--config-dir", ".storybook", "--output-dir", "storybook-static"]
    : [storybookBin, "dev", "--config-dir", ".storybook", "--port", "6006"];

const env = {
  ...process.env,
  STORYBOOK_DISABLE_TELEMETRY: "1"
};

if (mode === "build" && !env.CI) {
  env.CI = "true";
}

const result = spawnSync(process.execPath, args, {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
  windowsHide: true
});

process.exit(result.status ?? 1);
