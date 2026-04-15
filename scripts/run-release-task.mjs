import { spawnSync } from "node:child_process";

import {
  assertKnownWorkspacePackages,
  parsePackageSelection,
  resolveReleasePackageNames
} from "./release-targets.mjs";

const turboCommand = process.platform === "win32" ? "turbo.cmd" : "turbo";
const shouldUseShell = process.platform === "win32";
const task = process.argv[2];

if (!task) {
  console.error("Usage: node ./scripts/run-release-task.mjs <lint|typecheck|test|build>");
  process.exit(1);
}

const explicitPackages = parsePackageSelection(process.env.ONEUI_RELEASE_PACKAGES ?? "");
const selectedPackages = resolveReleasePackageNames({
  explicitPackages
});

if (selectedPackages.length > 0) {
  assertKnownWorkspacePackages(selectedPackages);
}

const turboArgs = ["run", task];

for (const packageName of selectedPackages) {
  turboArgs.push(`--filter=${packageName}`);
}

console.log(
  selectedPackages.length > 0
    ? `[release:${task}] targeting ${selectedPackages.join(", ")}`
    : `[release:${task}] targeting full workspace`
);

const result = spawnSync(turboCommand, turboArgs, {
  stdio: "inherit",
  shell: shouldUseShell,
  windowsHide: true
});

process.exit(result.status ?? 1);
