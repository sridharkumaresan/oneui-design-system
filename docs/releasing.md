# Releasing

## Versioning Model

- OneUI uses independent versioning with Changesets.
- Each publishable package under `@functions-oneui/*` gets its own semantic version.
- Current publishable packages are `@functions-oneui/standards`, `@functions-oneui/utils`, `@functions-oneui/tokens`, `@functions-oneui/testing`, `@functions-oneui/theme`, `@functions-oneui/react-utils`, `@functions-oneui/atoms`, `@functions-oneui/organism-action-panel`, and `@functions-oneui/organism-hero-banner`.
- Apps such as `@functions-oneui/storybook` stay private and are not published.

## Semver Rules

- Use `patch` for backwards-compatible fixes.
- Use `minor` for backwards-compatible additions such as new components, optional props, or additive exports.
- Use `major` for breaking changes such as removed exports, renamed props, changed token contracts, or peer dependency major changes.
- Docs-only changes can skip a changeset.

## Release Gates

Run these before any publish attempt:

1. `pnpm run release:verify`
2. Confirm package exports, peer dependencies, and `files` entries are correct.
3. Confirm the affected package has a changeset if the change affects runtime behavior.

`release:verify` runs lint, typecheck, tests, and build for the full workspace.

## Preparing a Fixed First Release Version

Use `release:prepare` when the workspace needs to move from local snapshot versions to a specific real semver version before publishing.

```powershell
pnpm run release:prepare -- 0.0.2
```

The prepare command:

- sets every publishable package under `packages/` to the requested version
- keeps internal `workspace:*` dependency references in source so local development still uses workspace packages
- runs `release:verify`, which includes the build

It does not publish. After reviewing the changed manifests, publish through the root release flow:

```powershell
pnpm run release
```

Do not manually replace `workspace:*` dependency ranges in source. The source workspace should keep local linking behavior; the publish workflow is responsible for producing registry-ready packages.

## Manual Nexus Publish Fallback

If root publishing is unreliable in a local environment, do not publish directly from each package folder. Pack registry-ready tarballs first, then publish those tarballs one by one.

```powershell
pnpm run release:prepare -- 0.0.2
pnpm run release:pack
```

`release:pack` verifies the workspace, packs publishable packages into `.release/npm`, and writes `.release/npm/publish-commands.txt`.

The generated commands use this shape:

```powershell
npm publish ".release/npm/<package>.tgz" --registry <NEXUS_NPM_REGISTRY> --access public
```

Publishing tarballs is safer than publishing package folders because `pnpm pack` prepares the package artifact from the workspace source. If publishing stops halfway through, rerun only the remaining tarball publish commands. Already-published versions should not be republished.

## Local Registry Smoke Testing

Use the local Verdaccio workflow to validate tarballs, exports, and installability before publishing to Nexus.

### Why Verdaccio

- It exercises a real registry flow instead of workspace links.
- It catches missing build output, broken exports maps, and peer dependency problems.
- It keeps local smoke testing separate from the real Nexus registry.

### Important Constraints

- Do not test package consumption inside this monorepo. Use a separate consumer app outside the workspace.
- Do not hardcode Verdaccio or Nexus URLs in package manifests.
- Do not commit local registry auth or local snapshot version changes.
- Prefer snapshot publishes for local smoke testing.

### Start the Local Registry

1. `pnpm install`
2. `pnpm run registry:local:start`
3. `pnpm run registry:local:status`

The local registry listens on `http://127.0.0.1:4873/` by default.

### Log In to the Local Registry

1. `pnpm run registry:local:login`
2. `pnpm run registry:local:whoami`

This stores auth in `.local/verdaccio/user.npmrc` under the repo. It does not need admin rights or a global npm config change.

### Publish Snapshot Versions Locally

Use snapshot publishing for repeatable local validation:

1. `pnpm run registry:local:publish:snapshot`
2. Install the snapshot packages in a separate consumer app.
3. Run the consumer app build.

The snapshot publish command:

- runs `release:verify`
- creates a temporary changeset for all publishable packages
- versions them as a snapshot
- publishes them to Verdaccio with the `local` dist-tag
- restores the repo files afterward

### Publish Current Stable Versions Locally

Use this only when you intentionally want to publish the current package versions as-is:

1. Ensure the package versions in the repo are already the ones you want to test.
2. `pnpm run registry:local:publish:stable`

If the same version already exists in Verdaccio, publish will fail. That is expected.

### Consumer Setup for Verdaccio

Create a separate app outside the monorepo and add a scoped registry entry to its `.npmrc`:

```ini
@functions-oneui:registry=http://127.0.0.1:4873/
```

Then install packages normally:

```powershell
pnpm add @functions-oneui/atoms@local
pnpm add @functions-oneui/theme@local
pnpm add @functions-oneui/organism-action-panel@local
```

Also install required peers in the consumer app if they are not already present:

```powershell
pnpm add react react-dom @fluentui/react-components
```

### Windows Verdaccio Notes

Use the workspace scripts instead of a globally installed Verdaccio. The scripts resolve the workspace Verdaccio package, generate an absolute-path runtime config at `.local/verdaccio/config.yaml`, and keep registry auth in `.local/verdaccio/user.npmrc`.

Recommended PowerShell flow:

```powershell
pnpm install
pnpm run registry:local:reset
pnpm run registry:local:start
pnpm run registry:local:login
pnpm run registry:local:whoami
pnpm run registry:local:publish:snapshot
```

If `whoami` succeeds but publish returns `401`, rerun `pnpm run registry:local:login`. Do not use `localhost` for one command and `127.0.0.1` for another unless `ONEUI_LOCAL_REGISTRY` is set consistently for every command in that terminal.

If detached startup fails on Windows, run Verdaccio in the foreground in one PowerShell window:

```powershell
pnpm run registry:local:start:foreground
```

Keep that window open, then run login and publish commands from a second PowerShell window in the same repo.

### Reset the Local Registry

Use this when you want a clean local registry state:

1. `pnpm run registry:local:reset`
2. `pnpm run registry:local:start`
3. `pnpm run registry:local:login`

## Nexus Publishing from GitLab CI

Use Nexus as the real publish target. Keep registry auth and URLs in CI variables, not in package manifests.

### Recommended Registry Split

- Install from the Nexus group or proxy repository.
- Publish to the Nexus hosted npm repository.
- Keep `@functions-oneui` scoped registry settings in CI-generated `.npmrc` files.

### Recommended CI Variables

- `NEXUS_NPM_REGISTRY`: the writable hosted npm registry URL
- `NEXUS_NPM_TOKEN`: the Nexus npm auth token
- `NEXUS_NPM_INSTALL_REGISTRY`: optional group/proxy registry URL used for installs

### Recommended CI Publish Flow

1. `pnpm install --frozen-lockfile`
2. `pnpm run release:verify`
3. Write a temporary `.npmrc` from CI variables.
4. `pnpm run release`

Example publish `.npmrc` generated during CI:

```ini
@functions-oneui:registry=https://nexus.example.com/repository/npm-hosted/
//nexus.example.com/repository/npm-hosted/:_authToken=${NEXUS_NPM_TOKEN}
```

Keep the install registry and publish registry separate if your Nexus topology requires it.

## Changesets Workflow

For real releases:

1. Add changesets in feature branches for runtime changes.
2. Merge the changes to the release branch.
3. Run `pnpm version-packages` in the controlled release workflow when you are ready to create final versions.
4. Review the versioned package manifests and changelog output.
5. Publish with `pnpm run release` from CI.

Do not rely on local manual publishing for production releases.
