import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const ignoredDirectoryNames = new Set([
  ".git",
  ".pnpm-store",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static"
]);

const collectPackageJsonFiles = (relativeDirectory) => {
  const absoluteDirectory = path.join(workspaceRoot, relativeDirectory);
  const entries = readdirSync(absoluteDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectoryNames.has(entry.name)) {
      continue;
    }

    const entryRelativePath = path.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectPackageJsonFiles(entryRelativePath));
      continue;
    }

    if (entry.isFile() && entry.name === "package.json") {
      files.push(entryRelativePath);
    }
  }

  return files;
};

const packageJsonFiles = [
  "package.json",
  ...collectPackageJsonFiles("apps"),
  ...collectPackageJsonFiles("packages")
];

const dependenciesToAudit = new Map();
const failures = [];
const registryLookupTimeoutMs = 15000;
const maxConcurrentLookups = 6;

const isWorkspaceDependency = (version) => version.startsWith("workspace:");
const isExactVersion = (version) => /^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(version);

for (const relativePath of packageJsonFiles) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  const manifest = JSON.parse(readFileSync(absolutePath, "utf8"));

  for (const field of ["dependencies", "devDependencies"]) {
    const collection = manifest[field] ?? {};
    for (const [name, version] of Object.entries(collection)) {
      if (isWorkspaceDependency(version)) {
        continue;
      }

      if (!isExactVersion(String(version))) {
        failures.push(
          `${relativePath}#${field}.${name} must use an exact version, found '${version}'.`
        );
        continue;
      }

      dependenciesToAudit.set(name, String(version));
    }
  }
}

if (failures.length > 0) {
  console.error("[workspace] Registry BOM audit failed before registry lookup.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const runRegistryLookup = (dependencySpec, expectedVersion) =>
  new Promise((resolve) => {
    const child = spawn(pnpmCommand, ["view", dependencySpec, "version"], {
      cwd: workspaceRoot,
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const settle = (result) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeoutHandle);
      resolve(result);
    };

    const timeoutHandle = setTimeout(() => {
      child.kill("SIGTERM");
      settle({
        dependencySpec,
        expectedVersion,
        timedOut: true,
        stdout,
        stderr
      });
    }, registryLookupTimeoutMs);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      settle({
        dependencySpec,
        expectedVersion,
        error,
        stdout,
        stderr
      });
    });

    child.on("close", (status) => {
      settle({
        dependencySpec,
        expectedVersion,
        status,
        stdout,
        stderr
      });
    });
  });

const lookupEntries = [...dependenciesToAudit.entries()];

console.log(
  `[workspace] Auditing ${lookupEntries.length} exact dependencies against the configured registry.`
);

for (let index = 0; index < lookupEntries.length; index += maxConcurrentLookups) {
  const batch = lookupEntries.slice(index, index + maxConcurrentLookups);
  const results = await Promise.all(
    batch.map(([name, version]) => runRegistryLookup(`${name}@${version}`, version))
  );

  for (const result of results) {
    if (result.timedOut) {
      failures.push(`Registry lookup timed out for ${result.dependencySpec}.`);
      continue;
    }

    if (result.error) {
      failures.push(`Registry lookup failed for ${result.dependencySpec}: ${result.error.message}`);
      continue;
    }

    if (result.status !== 0 || result.stdout.trim() !== result.expectedVersion) {
      failures.push(`Registry could not confirm ${result.dependencySpec}.`);
    }
  }
}

if (failures.length > 0) {
  console.error("[workspace] Registry BOM audit failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `[workspace] Registry BOM audit passed for ${dependenciesToAudit.size} exact dependencies.`
);
