import { prepareSnapshotWorkspace, startRegistry } from "./lib.mjs";

try {
  await startRegistry();
  prepareSnapshotWorkspace();
} catch (error) {
  console.error(`[local-publish] Failed to prepare snapshot workspace: ${String(error)}`);
  process.exit(1);
}
