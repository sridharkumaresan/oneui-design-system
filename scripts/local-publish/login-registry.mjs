import { ensureRegistryAuth, startRegistry } from "./lib.mjs";

try {
  await startRegistry();
  await ensureRegistryAuth();
} catch (error) {
  console.error(`[local-publish] Failed to authenticate against local registry: ${String(error)}`);
  process.exit(1);
}
