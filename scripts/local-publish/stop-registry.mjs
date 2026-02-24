import { stopRegistry } from "./lib.mjs";

try {
  stopRegistry();
} catch (error) {
  console.error(`[local-publish] Failed to stop registry: ${String(error)}`);
  process.exit(1);
}
