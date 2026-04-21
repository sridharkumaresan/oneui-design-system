import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const shouldUseShell = process.platform === "win32";
const dependencyFieldNames = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
];

const args = process.argv.slice(2);
const targetVersion = parseTargetVersion(args);
const shouldSkipVerify = args.includes("--skip-verify");

if (!targetVersion) {
  console.error("Usage: pnpm run release:prepare -- <version> [--skip-verify]");
  console.error("Example: pnpm run release:prepare -- 0.0.2");
  process.exit(1);
}

if (!isStableSemver(targetVersion)) {
  console.error(
    `[release:prepare] Expected a stable semver version like 0.0.2. Received: ${targetVersion}`
  );
  process.exit(1);
}

const packageEntries = collectPublishablePackageManifests();
const packageNames = new Set(packageEntries.map(({ manifest }) => manifest.name));
const changedPackages = [];
const workspaceDependencyCount = countWorkspaceDependencies(packageEntries, packageNames);

for (const entry of packageEntries) {
  const { manifest, manifestPath } = entry;

  if (manifest.version === targetVersion) {
    continue;
  }

  manifest.version = targetVersion;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  changedPackages.push(manifest.name);
}

console.warn(
  `[release:prepare] Set ${changedPackages.length} publishable package version(s) to ${targetVersion}.`
);

if (changedPackages.length > 0) {
  for (const packageName of changedPackages) {
    console.warn(`- ${packageName}`);
  }
}

console.warn(
  `[release:prepare] Kept ${workspaceDependencyCount} internal workspace dependency reference(s) for local development.`
);
console.warn(
  "[release:prepare] Use the root publish flow so workspace dependencies are handled at package/publish time."
);

if (!shouldSkipVerify) {
  runCommand(pnpmCommand, ["run", "release:verify"]);
}

function parseTargetVersion(values) {
  for (const value of values) {
    if (value === "--skip-verify") {
      continue;
    }

    if (value.startsWith("--version=")) {
      return value.slice("--version=".length);
    }

    if (/^--\d+\.\d+\.\d+$/.test(value)) {
      return value.slice(2);
    }

    if (!value.startsWith("--")) {
      return value;
    }
  }

  return "";
}

function isStableSemver(value) {
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value);
}

function collectPublishablePackageManifests() {
  const manifests = [];

  collectPackageManifests(path.join(workspaceRoot, "packages"), manifests);

  return manifests
    .filter(({ manifest }) => manifest.private !== true)
    .filter(({ manifest }) => typeof manifest.name === "string" && manifest.name.length > 0)
    .sort((left, right) => left.manifest.name.localeCompare(right.manifest.name));
}

function collectPackageManifests(directory, manifests) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "coverage") {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collectPackageManifests(absolutePath, manifests);
      continue;
    }

    if (entry.isFile() && entry.name === "package.json") {
      const manifest = JSON.parse(readFileSync(absolutePath, "utf8"));
      manifests.push({ manifestPath: absolutePath, manifest });
    }
  }
}

function countWorkspaceDependencies(packageEntries, packageNames) {
  let count = 0;

  for (const { manifest } of packageEntries) {
    for (const fieldName of dependencyFieldNames) {
      const dependencies = manifest[fieldName];

      if (!dependencies || typeof dependencies !== "object") {
        continue;
      }

      for (const [dependencyName, dependencyVersion] of Object.entries(dependencies)) {
        if (
          packageNames.has(dependencyName) &&
          typeof dependencyVersion === "string" &&
          dependencyVersion.startsWith("workspace:")
        ) {
          count += 1;
        }
      }
    }
  }

  return count;
}

function runCommand(executable, commandArgs) {
  console.warn(`[release:prepare] ${[executable, ...commandArgs].join(" ")}`);

  const result = spawnSync(executable, commandArgs, {
    cwd: workspaceRoot,
    stdio: "inherit",
    shell: shouldUseShell,
    windowsHide: true
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
