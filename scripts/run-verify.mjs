import { spawnSync } from "node:child_process";

const gitRefCandidates = ["origin/main", "main", "HEAD^1"];

const hasGitRef = (ref) =>
  spawnSync("git", ["rev-parse", "--verify", "--quiet", ref], { stdio: "ignore" }).status === 0;

const baseRef = gitRefCandidates.find(hasGitRef);
const turboArgs = ["pnpm", "exec", "turbo", "run", "typecheck", "test"];

if (baseRef) {
  turboArgs.push(`--filter=...[${baseRef}]`);
}

const turboResult = spawnSync("corepack", turboArgs, {
  stdio: "inherit"
});

process.exit(turboResult.status ?? 1);
