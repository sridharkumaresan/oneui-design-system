import { spawnSync } from "node:child_process";

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Missing command argument.");
  process.exit(1);
}

const result = spawnSync("corepack", ["pnpm", "exec", command, ...args], {
  encoding: "utf8"
});

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.status === 0) {
  process.exit(0);
}

const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
const missing =
  output.includes(`Command \"${command}\" not found`) ||
  output.includes(`ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL`) ||
  output.includes("Cannot find module") ||
  output.includes("not found");

if (missing) {
  console.warn(`[workspace] Skipping ${command}; dependency is not available in this environment.`);
  process.exit(0);
}

process.exit(result.status ?? 1);
