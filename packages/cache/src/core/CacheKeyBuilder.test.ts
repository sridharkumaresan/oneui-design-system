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
      namespace: "weather",
      key: "london",
      segments: {
        organization: "barclays",
        site: "dcw:home"
      }
    });
    const second = buildCacheStorageKey({
      namespace: "home:weather",
      key: "london",
      segments: {
        organization: "barclays:dcw"
      }
    });

    expect(first).not.toBe(second);
    expect(parseCacheStorageKey(first)).toEqual({
      namespace: "weather",
      key: "london",
      segments: {
        organization: "barclays",
        site: "dcw:home"
      }
    });
  });

  it("supports partial scope matching by arbitrary segments, namespace, or key", () => {
    const scope = normalizeCacheScope({
      namespace: "tasks",
      key: "inbox-summary",
      segments: {
        organization: "barclays",
        site: "dcw-home"
      }
    });

    expect(doesScopeMatch(scope, { segments: { organization: "barclays" } })).toBe(true);
    expect(doesScopeMatch(scope, { namespace: "tasks", segments: { organization: "barclays" } })).toBe(true);
    expect(doesScopeMatch(scope, { segments: { site: "other-site" } })).toBe(false);
  });

  it("rejects empty required segments", () => {
    expect(() =>
      buildCacheStorageKey({
        namespace: "weather",
        key: " "
      })
    ).toThrow("key");
  });

  it("sorts arbitrary segments so key generation is deterministic", () => {
    const first = buildCacheStorageKey({
      namespace: "weather",
      key: "london",
      segments: {
        site: "enterprise-search",
        tenant: "barclays"
      }
    });
    const second = buildCacheStorageKey({
      namespace: "weather",
      key: "london",
      segments: {
        tenant: "barclays",
        site: "enterprise-search"
      }
    });

    expect(first).toBe(second);
  });
});
