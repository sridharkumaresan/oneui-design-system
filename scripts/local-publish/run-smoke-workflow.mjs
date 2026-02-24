import { runFullLocalPublishSmoke } from "./lib.mjs";

try {
  await runFullLocalPublishSmoke();
} catch (error) {
  console.error(`[local-publish] End-to-end local publish smoke failed: ${String(error)}`);
  process.exit(1);
}
