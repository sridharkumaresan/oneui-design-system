import { spawn, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync
} from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localRegistryRoot = path.join(workspaceRoot, ".local", "verdaccio");
const backupRoot = path.join(localRegistryRoot, "snapshot-backup");
const npmCachePath = path.join(localRegistryRoot, "npm-cache");
const configPath = path.join(workspaceRoot, "configs", "verdaccio", "config.yaml");
const logPath = path.join(localRegistryRoot, "verdaccio.log");
const pidPath = path.join(localRegistryRoot, "verdaccio.pid");
const userConfigPath = path.join(localRegistryRoot, "user.npmrc");
const temporaryChangesetPath = path.join(workspaceRoot, ".changeset", "local-registry-smoke.md");
const registryUrl = normalizeRegistryUrl(
  process.env.ONEUI_LOCAL_REGISTRY ?? "http://127.0.0.1:4873/"
);
const registryHost = new URL(registryUrl).host;
const scopedRegistryLine = `@functions-oneui:registry=${registryUrl}`;
const localWorkspaceDirectories = [
  path.join(workspaceRoot, "apps"),
  path.join(workspaceRoot, "packages")
];
const localPackageDirectories = [path.join(workspaceRoot, "packages")];
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const verdaccioBinary = path.join(
  workspaceRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "verdaccio.cmd" : "verdaccio"
);
const changesetEntrypoint = path.join(
  workspaceRoot,
  "node_modules",
  "@changesets",
  "cli",
  "bin.js"
);
const snapshotNote = "Temporary local Verdaccio smoke-test release. Do not commit.";

const command = process.argv[2];

const commands = {
  start: startRegistry,
  stop: stopRegistry,
  status: printStatus,
  login: loginToRegistry,
  whoami: printWhoAmI,
  "publish-snapshot": publishSnapshot,
  "publish-stable": publishStable,
  "print-consumer-config": printConsumerConfig,
  reset: resetRegistry
};

if (!command || !(command in commands)) {
  console.error(
    "Usage: node ./scripts/local-registry.mjs <start|stop|status|login|whoami|publish-snapshot|publish-stable|print-consumer-config|reset>"
  );
  process.exit(1);
}

try {
  await commands[command]();
} catch (error) {
  console.error(formatError(error));
  process.exit(1);
}

function normalizeRegistryUrl(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

function ensureRuntimeDirectory() {
  mkdirSync(localRegistryRoot, { recursive: true });
  mkdirSync(npmCachePath, { recursive: true });
}

function ensureUserConfig() {
  ensureRuntimeDirectory();

  const lines = existsSync(userConfigPath)
    ? readFileSync(userConfigPath, "utf8")
        .split(/\r?\n/)
        .filter(Boolean)
        .filter((line) => !line.startsWith("@functions-oneui:registry="))
    : [];

  lines.unshift(scopedRegistryLine);
  writeFileSync(userConfigPath, `${lines.join("\n")}\n`, "utf8");
}

function runCommand(executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: workspaceRoot,
    stdio: options.stdio ?? "inherit",
    env: options.env ?? process.env,
    input: options.input
  });

  if (result.status !== 0) {
    const details = [executable, ...args].join(" ");
    throw new Error(`Command failed: ${details}`);
  }

  return result;
}

function getSanitizedEnvironment() {
  const environment = { ...process.env };

  for (const key of Object.keys(environment)) {
    if (
      key === "INIT_CWD" ||
      key.startsWith("npm_") ||
      key.startsWith("npm_config_") ||
      key.startsWith("NPM_CONFIG_")
    ) {
      delete environment[key];
    }
  }

  return environment;
}

function getLocalRegistryEnvironment() {
  ensureUserConfig();

  return {
    ...getSanitizedEnvironment(),
    npm_config_cache: npmCachePath,
    npm_config_userconfig: userConfigPath,
    NPM_CONFIG_CACHE: npmCachePath,
    NPM_CONFIG_USERCONFIG: userConfigPath
  };
}

function getLocalPublishEnvironment() {
  return {
    ...getLocalRegistryEnvironment(),
    npm_config_registry: registryUrl,
    NPM_CONFIG_REGISTRY: registryUrl
  };
}

function readPid() {
  if (!existsSync(pidPath)) {
    return null;
  }

  const value = Number.parseInt(readFileSync(pidPath, "utf8").trim(), 10);
  return Number.isFinite(value) ? value : null;
}

function isProcessAlive(pid) {
  if (!pid) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function removePidFile() {
  if (existsSync(pidPath)) {
    unlinkSync(pidPath);
  }
}

function sleep(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function pingRegistry(timeoutMs = 1000) {
  return new Promise((resolve) => {
    const request = http.get(new URL("-/ping", registryUrl), (response) => {
      response.resume();
      resolve(response.statusCode !== undefined && response.statusCode < 500);
    });

    request.setTimeout(timeoutMs, () => {
      request.destroy();
      resolve(false);
    });

    request.on("error", () => {
      resolve(false);
    });
  });
}

async function waitForRegistryState(expectedUp, attempts = 30, delayMs = 500) {
  for (let index = 0; index < attempts; index += 1) {
    const available = await pingRegistry();

    if (available === expectedUp) {
      return true;
    }

    await sleep(delayMs);
  }

  return false;
}

function collectPublishablePackageManifests() {
  const manifests = [];

  for (const directory of localPackageDirectories) {
    collectPackageManifests(directory, manifests);
  }

  return manifests
    .filter((entry) => entry.manifest.private !== true)
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

function collectMutableReleaseFiles() {
  const files = new Set([path.join(workspaceRoot, "pnpm-lock.yaml")]);

  const manifests = [];
  for (const directory of localWorkspaceDirectories) {
    collectPackageManifests(directory, manifests);
  }

  for (const { manifestPath } of manifests) {
    files.add(manifestPath);

    const changelogPath = path.join(path.dirname(manifestPath), "CHANGELOG.md");
    files.add(changelogPath);
  }

  const preStatePath = path.join(workspaceRoot, ".changeset", "pre.json");
  if (existsSync(preStatePath)) {
    files.add(preStatePath);
  }

  return [...files];
}

function backupReleaseFiles(files) {
  rmSync(backupRoot, { force: true, recursive: true });
  mkdirSync(backupRoot, { recursive: true });

  for (const file of files) {
    if (!existsSync(file)) {
      continue;
    }

    const relativePath = path.relative(workspaceRoot, file);
    const backupPath = path.join(backupRoot, relativePath);
    mkdirSync(path.dirname(backupPath), { recursive: true });
    copyFileSync(file, backupPath);
  }
}

function restoreReleaseFiles(files) {
  for (const file of files) {
    const relativePath = path.relative(workspaceRoot, file);
    const backupPath = path.join(backupRoot, relativePath);

    if (existsSync(backupPath)) {
      mkdirSync(path.dirname(file), { recursive: true });
      copyFileSync(backupPath, file);
      continue;
    }

    if (existsSync(file)) {
      rmSync(file, { force: true });
    }
  }

  rmSync(backupRoot, { force: true, recursive: true });
}

function writeTemporarySnapshotChangeset() {
  const packageNames = collectPublishablePackageManifests().map(({ manifest }) => manifest.name);
  const lines = [
    "---",
    ...packageNames.map((name) => `\"${name}\": patch`),
    "---",
    snapshotNote,
    ""
  ];
  writeFileSync(temporaryChangesetPath, lines.join("\n"), "utf8");
}

function readPublishedSnapshotVersions() {
  return collectPublishablePackageManifests().map(
    ({ manifest }) => `${manifest.name}@${manifest.version}`
  );
}

async function ensureRegistryRunning() {
  const available = await pingRegistry();
  if (available) {
    return;
  }

  await startRegistry();
}

function ensureVerdaccioInstalled() {
  if (!existsSync(verdaccioBinary)) {
    throw new Error("Verdaccio is not installed. Run pnpm install first.");
  }
}

function ensureLoggedIn() {
  ensureUserConfig();

  if (!existsSync(userConfigPath)) {
    throw new Error(`Local registry auth file is missing: ${userConfigPath}`);
  }

  const whoAmIResult = spawnSync(
    npmCommand,
    ["whoami", "--registry", registryUrl, "--userconfig", userConfigPath],
    {
      cwd: workspaceRoot,
      encoding: "utf8",
      env: getLocalRegistryEnvironment()
    }
  );

  if (whoAmIResult.status !== 0) {
    throw new Error(
      `Run pnpm run registry:local:login before publishing. Registry: ${registryUrl}`
    );
  }

  return whoAmIResult.stdout.trim();
}

async function startRegistry() {
  ensureVerdaccioInstalled();
  ensureRuntimeDirectory();

  if (await pingRegistry()) {
    console.log(`[local-registry] Verdaccio is already responding at ${registryUrl}`);
    return;
  }

  const existingPid = readPid();
  if (isProcessAlive(existingPid)) {
    console.log(
      `[local-registry] Verdaccio process ${existingPid} is already running. Waiting for readiness.`
    );
    const ready = await waitForRegistryState(true);
    if (!ready) {
      throw new Error(`Verdaccio process ${existingPid} did not become ready.`);
    }
    return;
  }

  removePidFile();

  const logFd = openSync(logPath, "a");
  const child = spawn(verdaccioBinary, ["--config", configPath, "--listen", registryHost], {
    cwd: workspaceRoot,
    detached: true,
    stdio: ["ignore", logFd, logFd]
  });

  writeFileSync(pidPath, `${child.pid}\n`, "utf8");
  child.unref();

  const ready = await waitForRegistryState(true);
  if (!ready) {
    if (isProcessAlive(child.pid)) {
      process.kill(child.pid, "SIGTERM");
    }
    removePidFile();
    throw new Error(`Verdaccio failed to start. Check ${logPath} after restarting.`);
  }

  console.log(`[local-registry] Verdaccio started at ${registryUrl}`);
  console.log(`[local-registry] PID file: ${pidPath}`);
}

async function stopRegistry() {
  const pid = readPid();

  if (!pid) {
    console.log("[local-registry] No PID file found. Nothing to stop.");
    return;
  }

  if (!isProcessAlive(pid)) {
    removePidFile();
    console.log(`[local-registry] Removed stale PID file for ${pid}.`);
    return;
  }

  process.kill(pid, "SIGTERM");
  const stopped = await waitForRegistryState(false, 20, 250);
  if (!stopped && isProcessAlive(pid)) {
    process.kill(pid, "SIGKILL");
  }

  removePidFile();
  console.log(`[local-registry] Verdaccio stopped (${pid}).`);
}

async function printStatus() {
  const pid = readPid();
  const available = await pingRegistry();
  const alive = isProcessAlive(pid);

  if (available) {
    console.log(`[local-registry] running at ${registryUrl}${pid ? ` (pid ${pid})` : ""}`);
    console.log(`[local-registry] auth config: ${userConfigPath}`);
    return;
  }

  if (alive) {
    console.log(
      `[local-registry] process ${pid} is running, but the health check did not respond in this context.`
    );
    console.log(`[local-registry] auth config: ${userConfigPath}`);
    return;
  }

  console.log("[local-registry] not running");
  if (pid) {
    console.log(`[local-registry] stale pid file: ${pidPath}`);
  }
}

async function loginToRegistry() {
  await ensureRegistryRunning();
  ensureUserConfig();

  const result = spawnSync(
    npmCommand,
    ["adduser", "--auth-type=legacy", "--registry", registryUrl, "--userconfig", userConfigPath],
    {
      cwd: workspaceRoot,
      stdio: "inherit",
      env: getLocalRegistryEnvironment()
    }
  );

  if (result.status !== 0) {
    throw new Error("npm adduser failed.");
  }

  await printWhoAmI();
}

async function printWhoAmI() {
  await ensureRegistryRunning();
  ensureUserConfig();

  const result = spawnSync(
    npmCommand,
    ["whoami", "--registry", registryUrl, "--userconfig", userConfigPath],
    {
      cwd: workspaceRoot,
      encoding: "utf8",
      env: getLocalRegistryEnvironment()
    }
  );

  if (result.status !== 0) {
    throw new Error(`Not logged in for ${registryUrl}. Run pnpm run registry:local:login.`);
  }

  console.log(`[local-registry] logged in as ${result.stdout.trim()}`);
}

async function publishSnapshot() {
  await ensureRegistryRunning();
  const username = ensureLoggedIn();
  const mutableFiles = collectMutableReleaseFiles();
  const environment = getLocalPublishEnvironment();

  console.log(`[local-registry] publishing snapshot packages as ${username}`);
  runCommand(pnpmCommand, ["run", "release:verify"]);

  backupReleaseFiles(mutableFiles);
  let publishedVersions = [];

  try {
    writeTemporarySnapshotChangeset();
    runCommand(process.execPath, [changesetEntrypoint, "version", "--snapshot", "local"], {
      env: getSanitizedEnvironment()
    });
    publishedVersions = readPublishedSnapshotVersions();
    runCommand(
      process.execPath,
      [changesetEntrypoint, "publish", "--tag", "local", "--no-git-tag"],
      {
        env: environment
      }
    );
  } finally {
    restoreReleaseFiles([...mutableFiles, temporaryChangesetPath]);
  }

  console.log("[local-registry] published snapshot packages:");
  for (const value of publishedVersions) {
    console.log(`- ${value}`);
  }
}

async function publishStable() {
  await ensureRegistryRunning();
  const username = ensureLoggedIn();
  const environment = getLocalPublishEnvironment();

  console.log(`[local-registry] publishing current package versions as ${username}`);
  runCommand(pnpmCommand, ["run", "release:verify"]);
  runCommand(process.execPath, [changesetEntrypoint, "publish", "--no-git-tag"], {
    env: environment
  });
}

function printConsumerConfig() {
  console.log(scopedRegistryLine);
}

async function resetRegistry() {
  await stopRegistry();
  rmSync(localRegistryRoot, { force: true, recursive: true });
  console.log(`[local-registry] cleared ${localRegistryRoot}`);
}

function formatError(error) {
  if (error instanceof Error) {
    return `[local-registry] ${error.message}`;
  }

  return `[local-registry] ${String(error)}`;
}
