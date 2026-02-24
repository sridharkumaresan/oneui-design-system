import { runConsumerSmokeMatrix, startRegistry } from "./lib.mjs";

try {
  await startRegistry();
  await runConsumerSmokeMatrix();
} catch (error) {
  console.error(`[local-publish] Consumer smoke matrix failed: ${String(error)}`);
  process.exit(1);
}
