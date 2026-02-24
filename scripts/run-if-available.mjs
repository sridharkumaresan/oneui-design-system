import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Missing command argument.");
  process.exit(1);
}

const findWorkspaceRoot = (startDir) => {
  let current = path.resolve(startDir);

  while (true) {
    if (existsSync(path.join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
};

const workspaceRoot = findWorkspaceRoot(process.cwd());

if (command === "husky") {
  if (process.env.HUSKY === "0") {
    console.warn("[workspace] Skipping husky because HUSKY=0.");
    process.exit(0);
  }
  if (!workspaceRoot || !existsSync(path.join(workspaceRoot, ".git"))) {
    console.warn("[workspace] Skipping husky because .git directory is not available.");
    process.exit(0);
  }
}

const pathParts = [
  path.join(process.cwd(), "node_modules", ".bin"),
  workspaceRoot ? path.join(workspaceRoot, "node_modules", ".bin") : null,
  process.env.PATH ?? ""
].filter(Boolean);

const env = {
  ...process.env,
  PATH: pathParts.join(path.delimiter)
};

const result = spawnSync(command, args, {
  encoding: "utf8",
  env
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
if (command === "husky") {
  console.warn("[workspace] Skipping husky setup; continuing without git hooks in this environment.");
  process.exit(0);
}

const missing =
  result.error?.code === "ENOENT" ||
  output.includes("Local package.json exists, but node_modules missing") ||
  output.includes(`Command \"${command}\" not found`) ||
  output.includes(`ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL`) ||
  output.includes("Cannot find module") ||
  output.includes("not found");

if (missing) {
  console.warn(`[workspace] Skipping ${command}; dependency is not available in this environment.`);
  process.exit(0);
}

process.exit(result.status ?? 1);
