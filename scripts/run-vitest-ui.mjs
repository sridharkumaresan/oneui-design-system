import { spawnSync } from "node:child_process";

const target = process.env.ONEUI_TEST_UI_FILTER ?? process.argv[2];

const result = target
  ? spawnSync("corepack", ["pnpm", "--filter", target, "run", "test:ui"], {
      stdio: "inherit"
    })
  : spawnSync(
      "corepack",
      ["pnpm", "exec", "vitest", "--ui", "--workspace", "vitest.workspace.ts"],
      {
        stdio: "inherit"
      }
    );

process.exit(result.status ?? 1);
