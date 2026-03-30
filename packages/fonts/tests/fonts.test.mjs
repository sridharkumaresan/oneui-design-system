import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  oneuiBrandFontCssImport,
  oneuiBrandFontFaces,
  oneuiBrandFontFamily
} from "../dist/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(currentDir, "..");

test("exports the brand font family metadata", () => {
  assert.equal(oneuiBrandFontFamily.includes("Barclays Effra"), true);
  assert.equal(oneuiBrandFontCssImport, "@functions-oneui/fonts/styles.css");
  assert.deepEqual(
    oneuiBrandFontFaces.map((face) => face.weight),
    [400, 500, 700]
  );
});

test("build output includes the stylesheet and woff assets", () => {
  assert.equal(existsSync(path.join(packageDir, "dist", "styles.css")), true);
  assert.equal(
    existsSync(path.join(packageDir, "dist", "assets", "effra-regular.woff")),
    true
  );
  assert.equal(
    existsSync(path.join(packageDir, "dist", "assets", "effra-medium.woff")),
    true
  );
  assert.equal(
    existsSync(path.join(packageDir, "dist", "assets", "effra-bold.woff")),
    true
  );
});

test("stylesheet declares Barclays Effra for all shipped font weights", () => {
  const stylesheet = readFileSync(path.join(packageDir, "dist", "styles.css"), "utf8");
  const familyMatches = stylesheet.match(/font-family:\s*"Barclays Effra"/g) ?? [];

  assert.equal(familyMatches.length, 3);
  assert.match(stylesheet, /font-weight:\s*400/);
  assert.match(stylesheet, /font-weight:\s*500/);
  assert.match(stylesheet, /font-weight:\s*700/);
});
