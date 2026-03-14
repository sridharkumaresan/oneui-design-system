import { spawnSync } from "node:child_process";

const target = process.env.ONEUI_TEST_UI_FILTER ?? process.argv[2];
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const vitestCommand = process.platform === "win32" ? "vitest.cmd" : "vitest";
const spawnOptions = {
  stdio: "inherit",
  shell: process.platform === "win32",
  windowsHide: true
};

const result = target
  ? spawnSync(pnpmCommand, ["--filter", target, "run", "test:ui"], spawnOptions)
  : spawnSync(vitestCommand, ["--ui", "--workspace", "vitest.workspace.ts"], spawnOptions);

process.exit(result.status ?? 1);
