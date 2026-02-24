import { startRegistry } from "./lib.mjs";

try {
  await startRegistry();
} catch (error) {
  console.error(`[local-publish] Failed to start registry: ${String(error)}`);
  process.exit(1);
}
