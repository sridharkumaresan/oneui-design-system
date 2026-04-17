import type {
  CacheEngine,
  CacheEngineOptions,
  CacheFetcher,
  CacheGetOptions,
  CacheGetOrFetchOptions,
  CacheRefreshOptions,
  CacheSetOptions
} from "../contracts/CacheEngine.js";
import type { CacheEvent, CacheEventListener, CacheUnsubscribe } from "../contracts/CacheEvent.js";
import type { CachePolicy } from "../contracts/CachePolicy.js";
import type { CacheRecord } from "../contracts/CacheRecord.js";
import type { CacheSnapshot } from "../contracts/CacheSnapshot.js";
import type { CachePartialScope, CacheScope } from "../contracts/CacheScope.js";
import type { CacheStorageAdapter } from "../contracts/CacheStorageAdapter.js";
import { createMemoryCacheStorageAdapter } from "../adapters/memory/MemoryCacheStorageAdapter.js";
import { systemCacheClock } from "../environment/CacheEnvironment.js";
import { buildCacheStorageKey, normalizeCacheScope } from "./CacheKeyBuilder.js";
import { CacheEventEmitter } from "./CacheEventEmitter.js";
import { InFlightRequestRegistry } from "./InFlightRequestRegistry.js";
import { isVersionBusted, resolveCachePolicy, resolveCacheState } from "./CacheStateResolver.js";

const resolveTimestamp = (now: number, durationMs: number | undefined): number => {
  if (durationMs === undefined || !Number.isFinite(durationMs)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return now + Math.max(0, durationMs);
};

export const createCacheEngine = <TData = unknown>(
  options: CacheEngineOptions<TData> = {}
): CacheEngine<TData> => {
  const storage: CacheStorageAdapter<TData> = options.storage ?? createMemoryCacheStorageAdapter<TData>();
  const clock = options.clock ?? systemCacheClock;
  const events = new CacheEventEmitter<TData>();
  const inFlight = new InFlightRequestRegistry();

  const emit = (event: Omit<CacheEvent<TData>, "timestamp">): void => {
    events.emit({
      ...event,
      timestamp: clock.now()
    });
  };

  const readRecord = async <TResult>(
    scope: CacheScope,
    policy?: CachePolicy
  ): Promise<{
    record?: CacheRecord<TResult>;
    storageKey: string;
    scope: CacheScope;
    busted: boolean;
  }> => {
    const normalizedScope = normalizeCacheScope(scope);
    const storageKey = buildCacheStorageKey(normalizedScope);
    const resolvedPolicy = resolveCachePolicy(policy, options.defaultPolicy);
    const record = (await storage.get(storageKey)) as CacheRecord<TResult> | undefined;

    if (isVersionBusted(record, resolvedPolicy)) {
      await storage.remove(storageKey);
      emit({
        name: "busted",
        reason: "version-mismatch",
        scope: normalizedScope,
        storageKey
      });

      return {
        busted: true,
        scope: normalizedScope,
        storageKey
      };
    }

    return {
      busted: false,
      record,
      scope: normalizedScope,
      storageKey
    };
  };

  const getSnapshot = async <TResult = TData>(
    scope: CacheScope,
    policy?: CachePolicy
  ): Promise<CacheSnapshot<TResult>> => {
    const now = clock.now();
    const { record, scope: normalizedScope, storageKey } = await readRecord<TResult>(scope, policy);
    const state = resolveCacheState(record, now);

    return {
      now,
      record,
      scope: normalizedScope,
      state,
      storageKey
    };
  };

  const set = async <TResult = TData>(
    scope: CacheScope,
    data: TResult,
    policy?: CachePolicy,
    setOptions: CacheSetOptions = {}
  ): Promise<CacheRecord<TResult>> => {
    const normalizedScope = normalizeCacheScope(scope);
    const storageKey = buildCacheStorageKey(normalizedScope);
    const now = clock.now();
    const resolvedPolicy = resolveCachePolicy(policy, options.defaultPolicy);
    const record: CacheRecord<TResult> = {
      checksum: setOptions.checksum,
      createdAt: now,
      data,
      etag: setOptions.etag,
      expiresAt: resolveTimestamp(now, resolvedPolicy.expireTimeMs),
      lastAccessedAt: now,
      metadata: {
        ...(resolvedPolicy.metadata ?? {}),
        ...(setOptions.metadata ?? {})
      },
      policy: resolvedPolicy,
      scope: normalizedScope,
      staleAt: resolveTimestamp(now, resolvedPolicy.staleTimeMs),
      storageKey,
      updatedAt: now,
      version: resolvedPolicy.version
    };

    await storage.set(record as unknown as CacheRecord<TData>);
    emit({
      data: data as unknown as TData,
      name: "set",
      scope: normalizedScope,
      state: "fresh",
      storageKey
    });

    return record;
  };

  const get = async <TResult = TData>(
    scope: CacheScope,
    getOptions: CacheGetOptions = {}
  ): Promise<TResult | undefined> => {
    const snapshot = await getSnapshot<TResult>(scope);

    if (!snapshot.record) {
      emit({
        name: "miss",
        scope: snapshot.scope,
        state: "missing",
        storageKey: snapshot.storageKey
      });
      return undefined;
    }

    if (snapshot.state === "expired" && !getOptions.includeExpired) {
      emit({
        name: "expired",
        scope: snapshot.scope,
        state: snapshot.state,
        storageKey: snapshot.storageKey
      });
      return undefined;
    }

    emit({
      data: snapshot.record.data as unknown as TData,
      name: snapshot.state === "stale" ? "stale-hit" : "hit",
      scope: snapshot.scope,
      state: snapshot.state,
      storageKey: snapshot.storageKey
    });

    return snapshot.record.data;
  };

  const refresh = async <TResult = TData>(
    scope: CacheScope,
    fetcher: CacheFetcher<TResult>,
    policy?: CachePolicy,
    refreshOptions: CacheRefreshOptions = {}
  ): Promise<TResult> => {
    const normalizedScope = normalizeCacheScope(scope);
    const storageKey = buildCacheStorageKey(normalizedScope);

    return inFlight.run<TResult>(storageKey, async () => {
      emit({
        name: "refresh-start",
        scope: normalizedScope,
        storageKey
      });

      try {
        const data = await fetcher();
        await set(normalizedScope, data, policy, refreshOptions);
        emit({
          data: data as unknown as TData,
          name: "refresh-success",
          scope: normalizedScope,
          storageKey
        });
        emit({
          data: data as unknown as TData,
          name: "refreshed",
          scope: normalizedScope,
          storageKey
        });

        return data;
      } catch (error) {
        emit({
          error,
          name: "refresh-error",
          scope: normalizedScope,
          storageKey
        });
        throw error;
      }
    });
  };

  const getOrFetch = async <TResult = TData>(
    scope: CacheScope,
    fetcher: CacheFetcher<TResult>,
    policy?: CachePolicy,
    getOrFetchOptions: CacheGetOrFetchOptions = {}
  ): Promise<TResult> => {
    const allowStale = getOrFetchOptions.allowStale ?? true;
    const snapshot = await getSnapshot<TResult>(scope, policy);

    if (snapshot.record && snapshot.state === "fresh") {
      emit({
        data: snapshot.record.data as unknown as TData,
        name: "hit",
        scope: snapshot.scope,
        state: snapshot.state,
        storageKey: snapshot.storageKey
      });

      return snapshot.record.data;
    }

    if (snapshot.record && snapshot.state === "stale" && allowStale) {
      emit({
        data: snapshot.record.data as unknown as TData,
        name: "stale-hit",
        scope: snapshot.scope,
        state: snapshot.state,
        storageKey: snapshot.storageKey
      });

      return snapshot.record.data;
    }

    if (snapshot.record && snapshot.state === "expired") {
      emit({
        name: "expired",
        scope: snapshot.scope,
        state: snapshot.state,
        storageKey: snapshot.storageKey
      });
    } else {
      emit({
        name: "miss",
        scope: snapshot.scope,
        state: "missing",
        storageKey: snapshot.storageKey
      });
    }

    return refresh(scope, fetcher, policy);
  };

  const remove = async (scope: CacheScope): Promise<void> => {
    const normalizedScope = normalizeCacheScope(scope);
    const storageKey = buildCacheStorageKey(normalizedScope);
    await storage.remove(storageKey);
    emit({
      name: "removed",
      scope: normalizedScope,
      storageKey
    });
  };

  const clearByScope = async (partialScope: CachePartialScope): Promise<number> => {
    const records = await storage.list(partialScope);
    const count = storage.clearByScope
      ? await storage.clearByScope(partialScope)
      : await Promise.all(records.map((record) => storage.remove(record.storageKey))).then(() => records.length);

    emit({
      name: "cleared",
      partialScope,
      reason: "scope-clear"
    });

    return count;
  };

  const invalidate = async (partialScope: CachePartialScope): Promise<number> => {
    const count = await clearByScope(partialScope);
    emit({
      name: "invalidated",
      partialScope,
      reason: "manual"
    });

    return count;
  };

  const clear = async (): Promise<void> => {
    await storage.clear();
    emit({
      name: "cleared",
      reason: "all"
    });
  };

  const subscribe = (listener: CacheEventListener<TData>): CacheUnsubscribe => events.subscribe(listener);

  return {
    clear,
    clearByScope,
    get,
    getOrFetch,
    getSnapshot,
    invalidate,
    refresh,
    remove,
    set,
    subscribe
  };
};
