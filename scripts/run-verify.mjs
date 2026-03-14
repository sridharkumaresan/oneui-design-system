import { spawnSync } from "node:child_process";

const gitRefCandidates = ["origin/main", "main", "HEAD^1"];
const turboCommand = process.platform === "win32" ? "turbo.cmd" : "turbo";

const hasGitRef = (ref) =>
  spawnSync("git", ["rev-parse", "--verify", "--quiet", ref], { stdio: "ignore" }).status === 0;

const baseRef = gitRefCandidates.find(hasGitRef);
const turboArgs = ["run", "typecheck", "test"];

if (baseRef) {
  turboArgs.push(`--filter=...[${baseRef}]`);
}

const turboResult = spawnSync(turboCommand, turboArgs, {
  stdio: "inherit",
  shell: process.platform === "win32",
  windowsHide: true
});

process.exit(turboResult.status ?? 1);
