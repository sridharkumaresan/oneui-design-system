import { cleanupLocalPublish, stopRegistry } from "./lib.mjs";

const wipeRegistryStorage = process.argv.includes("--wipe-registry-storage");

try {
  cleanupLocalPublish({ wipeRegistryStorage });
  stopRegistry();
} catch (error) {
  console.error(`[local-publish] Cleanup failed: ${String(error)}`);
  process.exit(1);
}
