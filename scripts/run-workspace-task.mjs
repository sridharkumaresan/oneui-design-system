import { spawnSync } from "node:child_process";

const task = process.argv[2];

if (!task) {
  console.error("Missing task name.");
  process.exit(1);
}

const turbo = spawnSync("corepack", ["pnpm", "exec", "turbo", "run", task], {
  encoding: "utf8"
});

if (turbo.stdout) {
  process.stdout.write(turbo.stdout);
}

if (turbo.stderr) {
  process.stderr.write(turbo.stderr);
}

if (turbo.status === 0) {
  process.exit(0);
}

const turboOutput = `${turbo.stdout ?? ""}\n${turbo.stderr ?? ""}`;
const turboMissing =
  turboOutput.includes('Command "turbo" not found') ||
  turboOutput.includes("ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL") ||
  turboOutput.includes("Cannot find module") ||
  turboOutput.includes("reading user config file: could not create any of the following paths") ||
  turboOutput.includes("not found");

if (!turboMissing) {
  process.exit(turbo.status ?? 1);
}

console.warn(`[workspace] Turbo is unavailable; falling back to pnpm recursive run for '${task}'.`);

const fallback = spawnSync("corepack", ["pnpm", "-r", "--if-present", "run", task], {
  stdio: "inherit"
});

process.exit(fallback.status ?? 1);
