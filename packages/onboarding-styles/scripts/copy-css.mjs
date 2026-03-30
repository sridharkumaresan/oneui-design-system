import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(packageRoot, "..");
const srcCssPath = path.join(rootDir, "src", "styles.css");
const distDir = path.join(rootDir, "dist");
const distCssPath = path.join(distDir, "styles.css");

await mkdir(distDir, { recursive: true });
await cp(srcCssPath, distCssPath);
