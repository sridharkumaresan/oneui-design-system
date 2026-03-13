import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

const scriptFileChecks = ["scripts/run-vitest-ui.mjs", "scripts/run-verify.mjs", ".gitlab-ci.yml"];

const failures = [];

const addFailure = (subject, message) => {
  failures.push(`${subject}: ${message}`);
};

const hasForbiddenScriptPattern = (value) => {
  const checks = [
    {
      test: /\bcorepack\b/,
      message: "contains corepack"
    },
    {
      test: /\bcross-env(?:-shell)?\b/,
      message: "contains cross-env"
    },
    {
      test: /(^|[;&|]\s*|\()\s*[A-Za-z_][A-Za-z0-9_]*=/,
      message: "contains inline POSIX environment assignment"
    },
    {
      test: /\.(?:sh|bat)\b/,
      message: "references a shell-specific script file"
    }
  ];

  return checks.find((check) => check.test.test(value));
};

for (const relativePath of packageJsonFiles) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  const manifest = JSON.parse(readFileSync(absolutePath, "utf8"));
  const scripts = manifest.scripts ?? {};

  for (const [name, value] of Object.entries(scripts)) {
    const failure = hasForbiddenScriptPattern(String(value));

    if (failure) {
      addFailure(`${relativePath}#scripts.${name}`, failure.message);
    }
  }
}

for (const relativePath of scriptFileChecks) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  const contents = readFileSync(absolutePath, "utf8");

  if (/\bcorepack\b/.test(contents)) {
    addFailure(relativePath, "contains corepack");
  }

  if (/\bcross-env(?:-shell)?\b/.test(contents)) {
    addFailure(relativePath, "contains cross-env");
  }
}

if (failures.length > 0) {
  console.error("[workspace] Script audit failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("[workspace] Script audit passed.");
