import { spawnSync } from "node:child_process";

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const shouldUseShell = process.platform === "win32";

const steps = [
  ["exec", "node", "./scripts/run-release-task.mjs", "lint"],
  ["exec", "node", "./scripts/run-release-task.mjs", "typecheck"],
  ["exec", "node", "./scripts/run-release-task.mjs", "test"],
  ["exec", "node", "./scripts/run-release-task.mjs", "build"]
];

for (const args of steps) {
  const label = `pnpm ${args.join(" ")}`;
  console.log(`[release:verify] ${label}`);

  const result = spawnSync(pnpmCommand, args, {
    stdio: "inherit",
    shell: shouldUseShell,
    windowsHide: true
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
