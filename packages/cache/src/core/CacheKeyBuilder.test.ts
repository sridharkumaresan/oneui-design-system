import { describe, expect, it } from "vitest";

import {
  buildCacheStorageKey,
  doesScopeMatch,
  normalizeCacheScope,
  parseCacheStorageKey
} from "./CacheKeyBuilder.js";

describe("CacheKeyBuilder", () => {
  it("normalizes scoped keys without collisions from separator characters", () => {
    const first = buildCacheStorageKey({
      tenantId: "barclays",
      siteId: "dcw:home",
      namespace: "weather",
      key: "london"
    });
    const second = buildCacheStorageKey({
      tenantId: "barclays:dcw",
      namespace: "home:weather",
      key: "london"
    });

    expect(first).not.toBe(second);
    expect(parseCacheStorageKey(first)).toEqual({
      tenantId: "barclays",
      siteId: "dcw:home",
      namespace: "weather",
      key: "london"
    });
  });

  it("supports partial scope matching by tenant, site, namespace, or key", () => {
    const scope = normalizeCacheScope({
      tenantId: "barclays",
      siteId: "dcw-home",
      namespace: "tasks",
      key: "inbox-summary"
    });

    expect(doesScopeMatch(scope, { tenantId: "barclays" })).toBe(true);
    expect(doesScopeMatch(scope, { tenantId: "barclays", namespace: "tasks" })).toBe(true);
    expect(doesScopeMatch(scope, { siteId: "other-site" })).toBe(false);
  });

  it("rejects empty required segments", () => {
    expect(() =>
      buildCacheStorageKey({
        tenantId: " ",
        namespace: "weather",
        key: "london"
      })
    ).toThrow("tenantId");
  });
});
