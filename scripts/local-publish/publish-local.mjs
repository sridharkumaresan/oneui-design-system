import { prepareSnapshotWorkspace, publishSnapshotWorkspace, startRegistry } from "./lib.mjs";

try {
  await startRegistry();
  prepareSnapshotWorkspace();
  await publishSnapshotWorkspace();
} catch (error) {
  console.error(`[local-publish] Failed to publish local snapshot packages: ${String(error)}`);
  process.exit(1);
}
