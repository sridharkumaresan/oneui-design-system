import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const shouldUseShell = process.platform === "win32";
const defaultOutputDirectory = path.join(workspaceRoot, ".release", "npm");
const publishDependencyFieldNames = ["dependencies", "peerDependencies", "optionalDependencies"];

const args = process.argv.slice(2);
const shouldSkipVerify = args.includes("--skip-verify");
const outputDirectory = path.resolve(workspaceRoot, readOptionValue(args, "--out-dir") ?? defaultOutputDirectory);
const packageEntries = sortPackagesForPublish(collectPublishablePackageManifests());

assertStablePackageVersions(packageEntries);

if (!shouldSkipVerify) {
  runCommand(pnpmCommand, ["run", "release:verify"]);
}

rmSync(outputDirectory, { force: true, recursive: true });
mkdirSync(outputDirectory, { recursive: true });

const packedTarballs = [];

for (const { manifest, manifestPath } of packageEntries) {
  const packageDirectory = path.dirname(manifestPath);

  console.warn(`[release:pack] Packing ${manifest.name}@${manifest.version}`);

  const result = runCommand(
    pnpmCommand,
    ["pack", "--pack-destination", outputDirectory, "--json"],
    {
      cwd: packageDirectory,
      stdio: "pipe"
    }
  );
  const packedPath = readPackedTarballPath(result.stdout, outputDirectory);

  packedTarballs.push({
    name: manifest.name,
    version: manifest.version,
    tarball: packedPath
  });
}

writePublishInstructions(outputDirectory, packedTarballs);

console.warn(`[release:pack] Wrote ${packedTarballs.length} tarball(s) to ${outputDirectory}`);
console.warn(`[release:pack] Publish commands: ${path.join(outputDirectory, "publish-commands.txt")}`);

function readOptionValue(values, optionName) {
  const optionIndex = values.indexOf(optionName);

  if (optionIndex >= 0) {
    return values[optionIndex + 1];
  }

  const prefix = `${optionName}=`;
  const option = values.find((value) => value.startsWith(prefix));

  return option ? option.slice(prefix.length) : undefined;
}

function collectPublishablePackageManifests() {
  const manifests = [];

  collectPackageManifests(path.join(workspaceRoot, "packages"), manifests);

  return manifests
    .filter(({ manifest }) => manifest.private !== true)
    .filter(({ manifest }) => typeof manifest.name === "string" && manifest.name.length > 0);
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

function sortPackagesForPublish(packageEntries) {
  const entryByName = new Map(packageEntries.map((entry) => [entry.manifest.name, entry]));
  const sorted = [];
  const temporaryMarks = new Set();
  const permanentMarks = new Set();

  const visit = (packageName) => {
    if (permanentMarks.has(packageName)) {
      return;
    }

    if (temporaryMarks.has(packageName)) {
      throw new Error(`Circular internal package dependency detected at ${packageName}.`);
    }

    const entry = entryByName.get(packageName);

    if (!entry) {
      return;
    }

    temporaryMarks.add(packageName);

    for (const dependencyName of readInternalDependencyNames(entry.manifest, entryByName)) {
      visit(dependencyName);
    }

    temporaryMarks.delete(packageName);
    permanentMarks.add(packageName);
    sorted.push(entry);
  };

  for (const packageName of [...entryByName.keys()].sort((left, right) => left.localeCompare(right))) {
    visit(packageName);
  }

  return sorted;
}

function readInternalDependencyNames(manifest, entryByName) {
  const dependencyNames = new Set();

  for (const fieldName of publishDependencyFieldNames) {
    const dependencies = manifest[fieldName];

    if (!dependencies || typeof dependencies !== "object") {
      continue;
    }

    for (const dependencyName of Object.keys(dependencies)) {
      if (entryByName.has(dependencyName)) {
        dependencyNames.add(dependencyName);
      }
    }
  }

  return [...dependencyNames].sort((left, right) => left.localeCompare(right));
}

function assertStablePackageVersions(packageEntries) {
  const invalidPackages = packageEntries
    .filter(({ manifest }) => !isStableSemver(manifest.version))
    .map(({ manifest }) => `${manifest.name}@${manifest.version}`);

  if (invalidPackages.length === 0) {
    return;
  }

  console.error("[release:pack] Package versions must be stable semver before packing.");
  for (const packageName of invalidPackages) {
    console.error(`- ${packageName}`);
  }
  console.error("Run: pnpm run release:prepare -- 0.0.2");
  process.exit(1);
}

function isStableSemver(value) {
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value);
}

function readPackedTarballPath(stdout, fallbackDirectory) {
  const output = String(stdout).trim();

  if (!output) {
    throw new Error("pnpm pack did not return tarball metadata.");
  }

  const parsed = JSON.parse(output);
  const packedMetadata = Array.isArray(parsed) ? parsed[0] : parsed;
  const packedPath = packedMetadata.filename ?? packedMetadata.path;

  if (!packedPath) {
    throw new Error(`Unable to read packed tarball path from pnpm pack output: ${output}`);
  }

  return path.resolve(fallbackDirectory, path.basename(packedPath));
}

function writePublishInstructions(directory, packedTarballs) {
  const lines = [
    "# Replace <NEXUS_NPM_REGISTRY> with the writable Nexus npm hosted registry URL.",
    "# Publish in this order. If a command fails after some packages publish, rerun only the remaining commands.",
    ""
  ];

  for (const { name, version, tarball } of packedTarballs) {
    lines.push(`# ${name}@${version}`);
    lines.push(`npm publish "${tarball}" --registry <NEXUS_NPM_REGISTRY> --access public`);
    lines.push("");
  }

  writeFileSync(path.join(directory, "publish-commands.txt"), `${lines.join("\n")}\n`, "utf8");
}

function runCommand(executable, commandArgs, options = {}) {
  const result = spawnSync(executable, commandArgs, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: "utf8",
    stdio: options.stdio ?? "inherit",
    shell: shouldUseShell,
    windowsHide: true
  });

  if (result.status !== 0) {
    const details = [executable, ...commandArgs].join(" ");
    throw new Error(`Command failed: ${details}`);
  }

  return result;
}
