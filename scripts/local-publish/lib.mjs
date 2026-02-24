import { spawn, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ROOT_DIR = resolve(__dirname, "../..");
export const LOCAL_PUBLISH_DIR = resolve(ROOT_DIR, ".local/local-publish");
export const VERDACCIO_DIR = resolve(LOCAL_PUBLISH_DIR, "verdaccio");
export const VERDACCIO_CONFIG_PATH = resolve(VERDACCIO_DIR, "config.yaml");
export const VERDACCIO_LOG_PATH = resolve(VERDACCIO_DIR, "verdaccio.log");
export const WORKSPACES_DIR = resolve(LOCAL_PUBLISH_DIR, "workspaces");
export const CONSUMERS_DIR = resolve(LOCAL_PUBLISH_DIR, "consumers");
export const AUTH_NPMRC_PATH = resolve(LOCAL_PUBLISH_DIR, "auth.npmrc");
export const STATE_PATH = resolve(LOCAL_PUBLISH_DIR, "state.json");

export const REGISTRY_URL = process.env.ONEUI_LOCAL_REGISTRY_URL ?? "http://127.0.0.1:4873";
export const DIST_TAG = process.env.ONEUI_LOCAL_DIST_TAG ?? "snapshot";
export const SNAPSHOT_TAG = process.env.ONEUI_LOCAL_SNAPSHOT_TAG ?? "local";
export const VERDACCIO_CONTAINER_NAME =
  process.env.ONEUI_VERDACCIO_CONTAINER_NAME ?? "oneui-verdaccio";

export const SEED_RUNTIME_PACKAGES = [
  "@functions-oneui/tokens",
  "@functions-oneui/theme",
  "@functions-oneui/atoms",
  "@functions-oneui/organism-action-panel",
  "@functions-oneui/organism-smart-section"
];

const COPY_EXCLUDES = new Set([
  ".git",
  ".local",
  ".pnpm-store",
  ".turbo",
  "node_modules",
  "coverage",
  "dist",
  "storybook-static"
]);

const VERDACCIO_CONFIG_CONTENT = `storage: ./storage
plugins: ./plugins
web:
  title: OneUI Local Registry
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 200
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  "@functions-oneui/*":
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs
  "**":
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs
server:
  keepAliveTimeout: 60
log:
  - { type: stdout, format: pretty, level: http }
`;

const toRegistryHostKey = (registryUrl) => {
  const parsed = new URL(registryUrl);
  return `//${parsed.host}/`;
};

const timestampLabel = () => {
  const iso = new Date().toISOString();
  return iso.replace(/[:.]/g, "-");
};

export const log = (message) => {
  process.stdout.write(`[local-publish] ${message}\n`);
};

const commandToString = (command, args) => {
  return [command, ...args].join(" ");
};

export const runCommand = ({
  command,
  args,
  cwd = ROOT_DIR,
  env,
  input,
  allowFailure = false,
  stdio = "pipe",
  echo = false
}) => {
  const result = spawnSync(command, args, {
    cwd,
    env: {
      ...process.env,
      ...env
    },
    encoding: "utf8",
    input,
    stdio
  });

  if (stdio === "inherit") {
    if (result.status !== 0 && !allowFailure) {
      throw new Error(`Command failed (${result.status ?? 1}): ${commandToString(command, args)}`);
    }

    return {
      status: result.status ?? 1,
      stdout: "",
      stderr: ""
    };
  }

  if (echo && result.stdout) {
    process.stdout.write(result.stdout);
  }

  if ((echo || result.status !== 0) && result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0 && !allowFailure) {
    throw new Error(
      `Command failed (${result.status ?? 1}): ${commandToString(command, args)}\n${result.stderr ?? ""}`
    );
  }

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? ""
  };
};

const ensureDirectory = (directoryPath) => {
  mkdirSync(directoryPath, { recursive: true });
};

const writeIfChanged = (filePath, content) => {
  if (existsSync(filePath)) {
    const existing = readFileSync(filePath, "utf8");
    if (existing === content) {
      return;
    }
  }

  writeFileSync(filePath, content, "utf8");
};

export const loadState = () => {
  if (!existsSync(STATE_PATH)) {
    return {};
  }

  try {
    return JSON.parse(readFileSync(STATE_PATH, "utf8"));
  } catch (error) {
    throw new Error(`Unable to parse ${STATE_PATH}: ${String(error)}`);
  }
};

export const saveState = (state) => {
  ensureDirectory(LOCAL_PUBLISH_DIR);
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
};

const isProcessAlive = (pid) => {
  if (!pid || typeof pid !== "number") {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

export const pingRegistry = async (registryUrl = REGISTRY_URL) => {
  try {
    const response = await fetch(new URL("/-/ping", registryUrl), {
      method: "GET"
    });

    return response.ok;
  } catch {
    return false;
  }
};

const wait = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

const waitForRegistry = async ({ registryUrl = REGISTRY_URL, timeoutMs = 30_000 }) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await pingRegistry(registryUrl)) {
      return;
    }

    await wait(500);
  }

  throw new Error(`Timed out waiting for registry at ${registryUrl}`);
};

const ensureVerdaccioFiles = () => {
  ensureDirectory(VERDACCIO_DIR);
  ensureDirectory(join(VERDACCIO_DIR, "storage"));
  writeIfChanged(VERDACCIO_CONFIG_PATH, VERDACCIO_CONFIG_CONTENT);
};

const dockerAvailable = () => {
  const result = runCommand({
    command: "docker",
    args: ["version", "--format", "{{.Server.Version}}"],
    allowFailure: true
  });

  return result.status === 0;
};

const startRegistryWithDocker = async (state) => {
  log(`Starting Verdaccio in Docker container '${VERDACCIO_CONTAINER_NAME}'.`);

  runCommand({
    command: "docker",
    args: ["rm", "-f", VERDACCIO_CONTAINER_NAME],
    allowFailure: true
  });

  runCommand({
    command: "docker",
    args: [
      "run",
      "-d",
      "--name",
      VERDACCIO_CONTAINER_NAME,
      "-p",
      `${new URL(REGISTRY_URL).port || "4873"}:4873`,
      "-v",
      `${VERDACCIO_DIR}:/verdaccio/conf`,
      "verdaccio/verdaccio:6",
      "verdaccio",
      "--config",
      "/verdaccio/conf/config.yaml",
      "--listen",
      "0.0.0.0:4873"
    ]
  });

  await waitForRegistry({ registryUrl: REGISTRY_URL });

  state.registry = {
    mode: "docker",
    registryUrl: REGISTRY_URL,
    containerName: VERDACCIO_CONTAINER_NAME,
    startedAt: new Date().toISOString()
  };
};

const startRegistryWithProcess = async (state) => {
  log("Starting Verdaccio via local process fallback (pnpm dlx).");

  ensureDirectory(VERDACCIO_DIR);
  const logFd = openSync(VERDACCIO_LOG_PATH, "a");
  const parsed = new URL(REGISTRY_URL);
  const listenAddress = `${parsed.hostname}:${parsed.port || "4873"}`;

  const child = spawn(
    "corepack",
    ["pnpm", "dlx", "verdaccio@6", "--config", VERDACCIO_CONFIG_PATH, "--listen", listenAddress],
    {
      cwd: ROOT_DIR,
      detached: true,
      env: {
        ...process.env
      },
      stdio: ["ignore", logFd, logFd]
    }
  );

  child.unref();

  await waitForRegistry({ registryUrl: REGISTRY_URL });

  state.registry = {
    mode: "process",
    registryUrl: REGISTRY_URL,
    pid: child.pid,
    startedAt: new Date().toISOString(),
    logPath: VERDACCIO_LOG_PATH
  };
};

export const startRegistry = async () => {
  ensureDirectory(LOCAL_PUBLISH_DIR);
  ensureVerdaccioFiles();

  if (await pingRegistry(REGISTRY_URL)) {
    log(`Registry already reachable at ${REGISTRY_URL}.`);
    const existing = loadState();
    if (!existing.registry) {
      existing.registry = {
        mode: "unknown",
        registryUrl: REGISTRY_URL,
        startedAt: new Date().toISOString()
      };
      saveState(existing);
    }
    return existing;
  }

  const state = loadState();

  if (state.registry?.mode === "process" && isProcessAlive(state.registry.pid)) {
    await waitForRegistry({ registryUrl: REGISTRY_URL });
    log(`Reusing existing Verdaccio process on pid ${state.registry.pid}.`);
    return state;
  }

  if (dockerAvailable()) {
    await startRegistryWithDocker(state);
  } else {
    await startRegistryWithProcess(state);
  }

  saveState(state);
  log(`Registry is ready at ${REGISTRY_URL}.`);
  return state;
};

export const stopRegistry = () => {
  const state = loadState();

  if (!state.registry) {
    log("No registry state found. Nothing to stop.");
    return;
  }

  if (state.registry.mode === "docker") {
    runCommand({
      command: "docker",
      args: ["rm", "-f", state.registry.containerName ?? VERDACCIO_CONTAINER_NAME],
      allowFailure: true
    });
    log("Stopped Verdaccio Docker container.");
  }

  if (state.registry.mode === "process") {
    if (isProcessAlive(state.registry.pid)) {
      process.kill(state.registry.pid, "SIGTERM");
      log(`Stopped Verdaccio process ${state.registry.pid}.`);
    } else {
      log("Verdaccio process was already stopped.");
    }
  }

  delete state.registry;
  saveState(state);
};

const ensureScopeRegistryLines = (existingContent) => {
  const lines = existingContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const required = [
    "registry=https://registry.npmjs.org/",
    `@functions-oneui:registry=${REGISTRY_URL}`,
    "always-auth=true"
  ];

  for (const line of required) {
    if (!lines.includes(line)) {
      lines.push(line);
    }
  }

  return `${lines.join("\n")}\n`;
};

const requestRegistryToken = async ({ username, password, email }) => {
  const requestUrl = new URL(
    `/-/user/org.couchdb.user:${encodeURIComponent(username)}`,
    REGISTRY_URL
  );
  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: username,
      password,
      email,
      type: "user"
    })
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  return {
    status: response.status,
    payload
  };
};

export const ensureRegistryAuth = async () => {
  ensureDirectory(LOCAL_PUBLISH_DIR);

  const username = process.env.ONEUI_LOCAL_REGISTRY_USER ?? "oneui-local";
  const password = process.env.ONEUI_LOCAL_REGISTRY_PASSWORD ?? "oneui-local-pass";
  const email = process.env.ONEUI_LOCAL_REGISTRY_EMAIL ?? "oneui-local@example.com";

  if (existsSync(AUTH_NPMRC_PATH)) {
    const existing = readFileSync(AUTH_NPMRC_PATH, "utf8");
    const hostKey = toRegistryHostKey(REGISTRY_URL);

    if (
      existing.includes(`${hostKey}:_authToken=`) ||
      (existing.includes(`${hostKey}:username=`) && existing.includes(`${hostKey}:_password=`))
    ) {
      writeIfChanged(AUTH_NPMRC_PATH, ensureScopeRegistryLines(existing));
      log(`Reusing existing registry auth at ${AUTH_NPMRC_PATH}.`);
      return AUTH_NPMRC_PATH;
    }
  }

  const hostKey = toRegistryHostKey(REGISTRY_URL);
  let token = "";
  let resolvedUsername = username;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${Date.now()}-${attempt}`;
    resolvedUsername = `${username}${suffix}`;

    const result = await requestRegistryToken({
      username: resolvedUsername,
      password,
      email
    });

    if (result.status === 409) {
      continue;
    }

    if (result.status >= 200 && result.status < 300 && typeof result.payload.token === "string") {
      token = result.payload.token;
      break;
    }

    throw new Error(
      `Unable to request registry token (status ${result.status}): ${JSON.stringify(result.payload)}`
    );
  }

  if (!token) {
    throw new Error("Unable to create a Verdaccio user token after multiple attempts.");
  }

  const authContent = ensureScopeRegistryLines(
    `${hostKey}:_authToken=${token}\n${hostKey}:username=${resolvedUsername}\n`
  );
  writeIfChanged(AUTH_NPMRC_PATH, authContent);
  log(`Saved Verdaccio auth to ${AUTH_NPMRC_PATH}.`);
  return AUTH_NPMRC_PATH;
};

const readJson = (filePath) => JSON.parse(readFileSync(filePath, "utf8"));

const collectPackageManifestPaths = (rootDirectory) => {
  const packagePaths = [];

  const scanDirectory = (directoryPath) => {
    const entries = readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
          continue;
        }

        scanDirectory(join(directoryPath, entry.name));
        continue;
      }

      if (entry.isFile() && entry.name === "package.json") {
        packagePaths.push(join(directoryPath, entry.name));
      }
    }
  };

  scanDirectory(join(rootDirectory, "packages"));
  return packagePaths;
};

const loadWorkspacePackages = (rootDirectory) => {
  const packagePaths = collectPackageManifestPaths(rootDirectory);
  const packages = new Map();

  for (const packagePath of packagePaths) {
    const manifest = readJson(packagePath);

    if (!manifest.name) {
      continue;
    }

    const dependencyNames = [
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.optionalDependencies ?? {})
    ];

    packages.set(manifest.name, {
      name: manifest.name,
      private: Boolean(manifest.private),
      directory: dirname(packagePath),
      relativeDirectory: relative(rootDirectory, dirname(packagePath)),
      packagePath,
      dependencyNames
    });
  }

  return packages;
};

const resolvePublishPlan = (rootDirectory) => {
  const packages = loadWorkspacePackages(rootDirectory);
  const closure = new Set();

  const includePackage = (packageName) => {
    const pkg = packages.get(packageName);
    if (!pkg) {
      throw new Error(`Unknown package in publish seed: ${packageName}`);
    }

    if (closure.has(packageName)) {
      return;
    }

    closure.add(packageName);

    for (const dependencyName of pkg.dependencyNames) {
      if (!packages.has(dependencyName)) {
        continue;
      }

      includePackage(dependencyName);
    }
  };

  for (const seed of SEED_RUNTIME_PACKAGES) {
    includePackage(seed);
  }

  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  const visit = (packageName) => {
    if (!closure.has(packageName)) {
      return;
    }

    if (visited.has(packageName)) {
      return;
    }

    if (visiting.has(packageName)) {
      throw new Error(`Cyclic dependency detected while ordering publish set at ${packageName}`);
    }

    visiting.add(packageName);

    const pkg = packages.get(packageName);
    for (const dependencyName of pkg.dependencyNames) {
      if (closure.has(dependencyName)) {
        visit(dependencyName);
      }
    }

    visiting.delete(packageName);
    visited.add(packageName);

    if (!pkg.private) {
      sorted.push(pkg);
    }
  };

  for (const packageName of closure) {
    visit(packageName);
  }

  return sorted;
};

const canUseGitWorktree = () => {
  const gitResult = runCommand({
    command: "git",
    args: ["rev-parse", "--is-inside-work-tree"],
    cwd: ROOT_DIR,
    allowFailure: true
  });

  return gitResult.status === 0 && gitResult.stdout.trim() === "true";
};

const shouldCopyPath = (rootDirectory, sourcePath) => {
  const rel = relative(rootDirectory, sourcePath);
  if (!rel || rel === "") {
    return true;
  }

  const segments = rel.split(/[\\/]/g);
  for (const segment of segments) {
    if (COPY_EXCLUDES.has(segment)) {
      return false;
    }
  }

  return true;
};

const createDisposableWorkspace = () => {
  ensureDirectory(WORKSPACES_DIR);
  const label = timestampLabel();
  const workspaceDir = resolve(WORKSPACES_DIR, `snapshot-${label}`);

  if (canUseGitWorktree()) {
    runCommand({
      command: "git",
      args: ["worktree", "add", "--detach", workspaceDir, "HEAD"],
      cwd: ROOT_DIR
    });

    log(`Created disposable git worktree at ${workspaceDir}.`);
    return {
      mode: "worktree",
      workspaceDir
    };
  }

  cpSync(ROOT_DIR, workspaceDir, {
    recursive: true,
    filter: (sourcePath) => shouldCopyPath(ROOT_DIR, sourcePath)
  });

  log(`Created disposable copied workspace at ${workspaceDir}.`);
  return {
    mode: "copy",
    workspaceDir
  };
};

const removeWorkspace = (snapshotState) => {
  if (!snapshotState?.workspaceDir || !existsSync(snapshotState.workspaceDir)) {
    return;
  }

  if (snapshotState.mode === "worktree") {
    runCommand({
      command: "git",
      args: ["worktree", "remove", "--force", snapshotState.workspaceDir],
      cwd: ROOT_DIR,
      allowFailure: true
    });

    return;
  }

  rmSync(snapshotState.workspaceDir, { recursive: true, force: true });
};

const writeTemporarySnapshotChangeset = ({ workspaceDir, publishPackages }) => {
  const fileName = `local-publish-${Date.now()}.md`;
  const filePath = join(workspaceDir, ".changeset", fileName);

  const releaseLines = publishPackages.map((pkg) => `"${pkg.name}": patch`).join("\n");

  const content = `---\n${releaseLines}\n---\n\nTemporary snapshot release for local Verdaccio validation.\n`;

  writeFileSync(filePath, content, "utf8");
  return relative(workspaceDir, filePath);
};

const changesetBinPath = (workspaceDir) => {
  const pathToBin = resolve(workspaceDir, "node_modules/@changesets/cli/bin.js");
  if (!existsSync(pathToBin)) {
    throw new Error(`Missing Changesets binary at ${pathToBin}. Did install fail?`);
  }

  return pathToBin;
};

const readPackageVersion = ({ workspaceDir, packageRelativeDirectory }) => {
  const manifestPath = resolve(workspaceDir, packageRelativeDirectory, "package.json");
  const manifest = readJson(manifestPath);
  return manifest.version;
};

const publishEnvironment = {
  NPM_CONFIG_USERCONFIG: AUTH_NPMRC_PATH,
  NPM_CONFIG_REGISTRY: REGISTRY_URL,
  ONEUI_LOCAL_PUBLISH: "1"
};

const ensureSnapshotStateFresh = (state) => {
  if (!state.snapshot) {
    return;
  }

  if (!state.snapshot.workspaceDir || !existsSync(state.snapshot.workspaceDir)) {
    delete state.snapshot;
    saveState(state);
  }
};

export const prepareSnapshotWorkspace = ({ snapshotTag = SNAPSHOT_TAG } = {}) => {
  const state = loadState();
  ensureSnapshotStateFresh(state);

  if (state.snapshot) {
    log("Removing existing snapshot workspace before creating a new one.");
    removeWorkspace(state.snapshot);
    delete state.snapshot;
    saveState(state);
  }

  const workspaceInfo = createDisposableWorkspace();
  const publishPackages = resolvePublishPlan(ROOT_DIR);

  runCommand({
    command: "corepack",
    args: ["pnpm", "install", "--frozen-lockfile"],
    cwd: workspaceInfo.workspaceDir,
    stdio: "inherit"
  });

  const changesetFile = writeTemporarySnapshotChangeset({
    workspaceDir: workspaceInfo.workspaceDir,
    publishPackages
  });

  runCommand({
    command: process.execPath,
    args: [changesetBinPath(workspaceInfo.workspaceDir), "version", "--snapshot", snapshotTag],
    cwd: workspaceInfo.workspaceDir,
    stdio: "inherit"
  });

  state.snapshot = {
    mode: workspaceInfo.mode,
    workspaceDir: workspaceInfo.workspaceDir,
    createdAt: new Date().toISOString(),
    snapshotTag,
    distTag: DIST_TAG,
    changesetFile,
    publishPackages: publishPackages.map((pkg) => ({
      name: pkg.name,
      relativeDirectory: pkg.relativeDirectory
    }))
  };

  saveState(state);

  log(`Prepared snapshot workspace at ${workspaceInfo.workspaceDir}.`);
  log(
    `Snapshot packages (${publishPackages.length}): ${publishPackages.map((pkg) => pkg.name).join(", ")}`
  );

  return state.snapshot;
};

export const publishSnapshotWorkspace = async () => {
  const state = loadState();
  const snapshot = state.snapshot;

  if (!snapshot?.workspaceDir || !existsSync(snapshot.workspaceDir)) {
    throw new Error(
      "Snapshot workspace missing. Run local-publish:snapshot-version before local-publish:publish-local."
    );
  }

  if (!snapshot.publishPackages || snapshot.publishPackages.length === 0) {
    throw new Error("Snapshot workspace does not define publishPackages.");
  }

  await ensureRegistryAuth();

  const published = [];

  for (const pkg of snapshot.publishPackages) {
    const version = readPackageVersion({
      workspaceDir: snapshot.workspaceDir,
      packageRelativeDirectory: pkg.relativeDirectory
    });

    log(`Building ${pkg.name}@${version}`);
    runCommand({
      command: "corepack",
      args: ["pnpm", "--filter", pkg.name, "run", "build"],
      cwd: snapshot.workspaceDir,
      stdio: "inherit"
    });

    log(`Publishing ${pkg.name}@${version} to ${REGISTRY_URL} with tag '${DIST_TAG}'.`);
    runCommand({
      command: "corepack",
      args: [
        "pnpm",
        "--filter",
        pkg.name,
        "publish",
        "--tag",
        DIST_TAG,
        "--registry",
        REGISTRY_URL,
        "--access",
        "public",
        "--no-git-checks"
      ],
      cwd: snapshot.workspaceDir,
      env: publishEnvironment,
      stdio: "inherit"
    });

    published.push({
      name: pkg.name,
      version
    });
  }

  snapshot.publishedAt = new Date().toISOString();
  snapshot.publishedVersions = published;
  saveState(state);

  log(`Published ${published.length} packages to ${REGISTRY_URL}.`);
  return published;
};

const writeConsumerFiles = ({ consumerDir, reactVersion, reactDomVersion, oneuiVersions }) => {
  ensureDirectory(consumerDir);
  const majorLabel = reactVersion.includes("19") ? "19" : "18";

  const packageJson = {
    name: `oneui-local-consumer-react-${majorLabel}`,
    private: true,
    type: "module",
    scripts: {
      typecheck: "tsc -p tsconfig.json --noEmit",
      build:
        "esbuild src/index.tsx --bundle --platform=browser --format=esm --outfile=dist/bundle.js",
      smoke:
        "esbuild scripts/render-smoke.mjs --bundle --platform=node --format=cjs --outfile=dist/render-smoke.cjs && node dist/render-smoke.cjs"
    },
    dependencies: {
      "@fluentui/react-components": "^9.0.0",
      "@functions-oneui/tokens": oneuiVersions["@functions-oneui/tokens"],
      "@functions-oneui/theme": oneuiVersions["@functions-oneui/theme"],
      "@functions-oneui/atoms": oneuiVersions["@functions-oneui/atoms"],
      "@functions-oneui/organism-action-panel":
        oneuiVersions["@functions-oneui/organism-action-panel"],
      "@functions-oneui/organism-smart-section":
        oneuiVersions["@functions-oneui/organism-smart-section"],
      react: reactVersion,
      "react-dom": reactDomVersion
    },
    devDependencies: {
      "@types/node": "^22.10.2",
      "@types/react": "^19.0.2",
      "@types/react-dom": "^19.0.2",
      esbuild: "^0.25.9",
      typescript: "^5.7.3"
    }
  };

  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      types: ["node"]
    },
    include: ["src/**/*", "scripts/**/*"]
  };

  const npmrc = `registry=https://registry.npmjs.org/\n@functions-oneui:registry=${REGISTRY_URL}\nstrict-peer-dependencies=true\nauto-install-peers=false\n`;

  const entryFile = `import React from "react";
import { FluentProvider } from "@fluentui/react-components";
import { OneUIButton } from "@functions-oneui/atoms";
import { ActionPanel } from "@functions-oneui/organism-action-panel";
import { SmartSection } from "@functions-oneui/organism-smart-section";
import { OneUIProvider, oneuiLightTheme } from "@functions-oneui/theme";
import { semanticTokens } from "@functions-oneui/tokens";

const fetcher = async () => ({ items: [{ id: "1", label: "Item 1" }], totalCount: 1 });
const AtomButton = OneUIButton as unknown as React.ComponentType<{ children?: React.ReactNode }>;

export const App = () => (
  <OneUIProvider mode="light">
    <FluentProvider theme={oneuiLightTheme}>
      <div>
        <span>{semanticTokens.light.color.text.brand}</span>
        {React.createElement(AtomButton, null, "Button")}
        <ActionPanel title="Panel" primaryAction={{ label: "Run", onClick: () => undefined }} />
        <SmartSection
          sectionId="smoke"
          title="Smart Section"
          requestKey={1}
          fetcher={fetcher}
          renderItem={(item) => <span>{item.label}</span>}
        />
      </div>
    </FluentProvider>
  </OneUIProvider>
);
`;

  const smokeFile = `import React from "react";
import { renderToString } from "react-dom/server";
import { OneUIButton } from "@functions-oneui/atoms";
import { ActionPanel } from "@functions-oneui/organism-action-panel";
import { SmartSection } from "@functions-oneui/organism-smart-section";
import { OneUIProvider } from "@functions-oneui/theme";
import { semanticTokens } from "@functions-oneui/tokens";

const fetcher = async () => ({ items: [{ id: "1", label: "Row" }], totalCount: 1 });
const AtomButton = OneUIButton;

const markup = renderToString(
  React.createElement(
    OneUIProvider,
    { mode: "light" },
    React.createElement(
      "div",
      null,
      React.createElement("span", null, semanticTokens.light.color.text.brand),
      React.createElement(AtomButton, null, "Button smoke"),
      React.createElement(ActionPanel, {
        title: "Action Panel Smoke",
        primaryAction: { label: "Primary", onClick: () => undefined }
      }),
      React.createElement(SmartSection, {
        sectionId: "consumer-smoke",
        title: "Smart Section Smoke",
        requestKey: 1,
        fetcher,
        renderItem: (item) => React.createElement("span", null, item.label)
      })
    )
  )
);

if (!markup.includes("Action Panel Smoke") || !markup.includes("Smart Section Smoke")) {
  throw new Error("Consumer render smoke failed: expected component markup not found.");
}

if (typeof semanticTokens.light.color.text.brand !== "string") {
  throw new Error("Consumer render smoke failed: token export missing.");
}

console.log("Consumer render smoke passed.");
`;

  ensureDirectory(join(consumerDir, "src"));
  ensureDirectory(join(consumerDir, "scripts"));

  writeFileSync(
    join(consumerDir, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(
    join(consumerDir, "tsconfig.json"),
    `${JSON.stringify(tsconfig, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(join(consumerDir, ".npmrc"), npmrc, "utf8");
  writeFileSync(join(consumerDir, "src/index.tsx"), entryFile, "utf8");
  writeFileSync(join(consumerDir, "scripts/render-smoke.mjs"), smokeFile, "utf8");
};

const resolvePublishedVersion = (packageName) => {
  const result = runCommand({
    command: "npm",
    args: ["view", `${packageName}@${DIST_TAG}`, "version", "--registry", REGISTRY_URL],
    env: {
      NPM_CONFIG_USERCONFIG: AUTH_NPMRC_PATH
    },
    allowFailure: false
  });

  const version = result.stdout.trim();
  if (!version) {
    throw new Error(
      `Unable to resolve dist-tag '${DIST_TAG}' for ${packageName} from ${REGISTRY_URL}`
    );
  }

  return version;
};

const runConsumerInstallAndChecks = ({ consumerDir }) => {
  const commandEnv = {
    NPM_CONFIG_USERCONFIG: AUTH_NPMRC_PATH
  };

  runCommand({
    command: "corepack",
    args: ["pnpm", "--ignore-workspace", "install", "--no-frozen-lockfile"],
    cwd: consumerDir,
    env: commandEnv,
    stdio: "inherit"
  });

  runCommand({
    command: "corepack",
    args: ["pnpm", "--ignore-workspace", "run", "typecheck"],
    cwd: consumerDir,
    env: commandEnv,
    stdio: "inherit"
  });

  runCommand({
    command: "corepack",
    args: ["pnpm", "--ignore-workspace", "run", "build"],
    cwd: consumerDir,
    env: commandEnv,
    stdio: "inherit"
  });

  runCommand({
    command: "corepack",
    args: ["pnpm", "--ignore-workspace", "run", "smoke"],
    cwd: consumerDir,
    env: commandEnv,
    stdio: "inherit"
  });
};

export const runConsumerSmokeMatrix = async () => {
  await ensureRegistryAuth();
  ensureDirectory(CONSUMERS_DIR);

  const oneuiVersions = {};
  for (const pkg of SEED_RUNTIME_PACKAGES) {
    oneuiVersions[pkg] = resolvePublishedVersion(pkg);
  }

  const matrix = [
    {
      label: "react18",
      reactVersion: "^18.3.1",
      reactDomVersion: "^18.3.1"
    },
    {
      label: "react19",
      reactVersion: "^19.2.0",
      reactDomVersion: "^19.2.0"
    }
  ];

  for (const entry of matrix) {
    const consumerDir = resolve(CONSUMERS_DIR, entry.label);
    rmSync(consumerDir, { recursive: true, force: true });

    writeConsumerFiles({
      consumerDir,
      reactVersion: entry.reactVersion,
      reactDomVersion: entry.reactDomVersion,
      oneuiVersions
    });

    log(`Running consumer smoke for ${entry.label}.`);
    runConsumerInstallAndChecks({ consumerDir });
  }

  const state = loadState();
  state.consumerSmoke = {
    executedAt: new Date().toISOString(),
    matrix: ["react18", "react19"],
    registryUrl: REGISTRY_URL,
    distTag: DIST_TAG,
    oneuiVersions
  };
  saveState(state);

  log("Consumer smoke matrix completed for React 18 and React 19.");
};

export const cleanupLocalPublish = ({ wipeRegistryStorage = false } = {}) => {
  const state = loadState();

  if (state.snapshot) {
    removeWorkspace(state.snapshot);
    delete state.snapshot;
  }

  rmSync(CONSUMERS_DIR, { recursive: true, force: true });
  delete state.consumerSmoke;

  if (wipeRegistryStorage) {
    rmSync(VERDACCIO_DIR, { recursive: true, force: true });
  }

  saveState(state);
  log("Removed snapshot workspaces and consumer harness artifacts.");
};

export const runFullLocalPublishSmoke = async () => {
  await startRegistry();
  await ensureRegistryAuth();
  prepareSnapshotWorkspace();
  await publishSnapshotWorkspace();
  await runConsumerSmokeMatrix();

  log("Local publish smoke workflow completed successfully.");
};
