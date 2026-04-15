import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync } from "node:fs";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const changesetDirectory = path.join(workspaceRoot, ".changeset");

const collectPackageManifests = (directory, manifests) => {
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
      manifests.push({ manifest, manifestPath: absolutePath });
    }
  }
};

const readWorkspacePackageEntries = () => {
  const manifests = [];

  for (const directoryName of ["apps", "packages"]) {
    collectPackageManifests(path.join(workspaceRoot, directoryName), manifests);
  }

  return manifests;
};

export const readWorkspacePackageNames = () => {
  return readWorkspacePackageEntries()
    .map(({ manifest }) => manifest.name)
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
};

export const readPublishablePackageNames = () => {
  return readWorkspacePackageEntries()
    .filter(({ manifest }) => manifest.private !== true)
    .map(({ manifest }) => manifest.name)
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
};

export const parsePackageSelection = (value) => {
  if (!value) {
    return [];
  }

  return [...new Set(value
    .split(/[,\s]+/)
    .map((entry) => entry.trim())
    .filter(Boolean))];
};

export const readPendingChangesetPackageNames = () => {
  const packageNames = new Set();

  for (const entry of readdirSync(changesetDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "README.md") {
      continue;
    }

    const contents = readFileSync(path.join(changesetDirectory, entry.name), "utf8");
    const match = contents.match(/^---\n([\s\S]*?)\n---/);

    if (!match) {
      continue;
    }

    for (const line of match[1].split(/\r?\n/)) {
      const trimmedLine = line.trim();
      const packageMatch = trimmedLine.match(/^"([^"]+)":\s*(major|minor|patch)$/);

      if (packageMatch) {
        packageNames.add(packageMatch[1]);
      }
    }
  }

  return [...packageNames].sort((left, right) => left.localeCompare(right));
};

export const resolveReleasePackageNames = ({
  explicitPackages = [],
  fallbackToPendingChangesets = true,
  includeAllPublishable = false
} = {}) => {
  if (explicitPackages.length > 0) {
    return explicitPackages;
  }

  if (includeAllPublishable) {
    return readPublishablePackageNames();
  }

  if (fallbackToPendingChangesets) {
    return readPendingChangesetPackageNames();
  }

  return [];
};

export const assertKnownWorkspacePackages = (packageNames) => {
  const knownPackages = new Set(readWorkspacePackageNames());
  const unknownPackages = packageNames.filter((packageName) => !knownPackages.has(packageName));

  if (unknownPackages.length > 0) {
    throw new Error(
      `Unknown workspace package selection: ${unknownPackages.join(", ")}`
    );
  }
};

