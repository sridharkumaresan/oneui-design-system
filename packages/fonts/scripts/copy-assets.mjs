import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(currentDir, "..");
const srcDir = path.join(packageDir, "src");
const distDir = path.join(packageDir, "dist");
const srcAssetsDir = path.join(srcDir, "assets");
const distAssetsDir = path.join(distDir, "assets");

await mkdir(distAssetsDir, { recursive: true });
await copyFile(path.join(srcDir, "index.css"), path.join(distDir, "styles.css"));

for (const fileName of await readdir(srcAssetsDir)) {
  await copyFile(path.join(srcAssetsDir, fileName), path.join(distAssetsDir, fileName));
}
