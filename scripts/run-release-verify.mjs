import { spawnSync } from "node:child_process";

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const shouldUseShell = process.platform === "win32";

const steps = [
  ["run", "lint"],
  ["run", "typecheck"],
  ["run", "test"],
  ["run", "build"]
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
