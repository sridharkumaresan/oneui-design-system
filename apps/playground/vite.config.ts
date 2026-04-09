import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { defineConfig } from "vite";

type WorkspaceAlias = {
  find: RegExp | string;
  replacement: string;
};

const workspaceRoot = path.resolve(__dirname, "../..");
const packageRoots = [
  path.join(workspaceRoot, "packages"),
  path.join(workspaceRoot, "packages", "organisms")
];

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const collectWorkspaceAliases = (): WorkspaceAlias[] => {
  const aliases: WorkspaceAlias[] = [];

  for (const packageRoot of packageRoots) {
    if (!existsSync(packageRoot)) {
      continue;
    }

    for (const entry of readdirSync(packageRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const packageDir = path.join(packageRoot, entry.name);
      const packageJsonPath = path.join(packageDir, "package.json");
      const sourceDirPath = path.join(packageDir, "src");
      const sourceEntryPath = path.join(packageDir, "src", "index.ts");

      if (!existsSync(packageJsonPath) || !existsSync(sourceEntryPath) || !existsSync(sourceDirPath)) {
        continue;
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
        name?: string;
      };

      if (!packageJson.name?.startsWith("@functions-oneui/")) {
        continue;
      }

      aliases.push({
        find: new RegExp(`^${escapeRegExp(packageJson.name)}$`),
        replacement: sourceEntryPath
      });
      aliases.push({
        find: new RegExp(`^${escapeRegExp(packageJson.name)}/(.+)$`),
        replacement: `${sourceDirPath}/$1`
      });
    }
  }

  return aliases;
};

export default defineConfig({
  resolve: {
    alias: collectWorkspaceAliases()
  },
  server: {
    fs: {
      allow: [workspaceRoot]
    },
    port: 4174
  }
});
