import { describe, expect, it } from "vitest";

import {
  buildCacheStorageKey,
  createCacheEngine,
  createIndexedDbCacheAdapter,
  createLocalStorageCacheAdapter,
  createMemoryCacheStorageAdapter,
  createSessionStorageCacheAdapter,
  resolveCacheState,
  validateCacheRecord
} from "./index.js";

describe("package root exports", () => {
  it("exports the public cache factories and helpers from the package root", () => {
    expect(createCacheEngine).toEqual(expect.any(Function));
    expect(createMemoryCacheStorageAdapter).toEqual(expect.any(Function));
    expect(createLocalStorageCacheAdapter).toEqual(expect.any(Function));
    expect(createSessionStorageCacheAdapter).toEqual(expect.any(Function));
    expect(createIndexedDbCacheAdapter).toEqual(expect.any(Function));
    expect(buildCacheStorageKey).toEqual(expect.any(Function));
    expect(resolveCacheState).toEqual(expect.any(Function));
    expect(validateCacheRecord).toEqual(expect.any(Function));
  });
});
