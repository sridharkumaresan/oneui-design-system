import type {
  CacheEngine,
  CacheEngineOptions,
  CacheFetcher,
  CacheGetOptions,
  CacheGetOrFetchOptions,
  CacheGetOrFetchSnapshotResult,
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
import { validateCacheRecord } from "./CacheRecordValidation.js";
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
  const fallbackStorage = createMemoryCacheStorageAdapter<TData>({
    id: `${storage.id}:memory-fallback`
  });
  const clock = options.clock ?? systemCacheClock;
  const events = new CacheEventEmitter<TData>();
  const inFlight = new InFlightRequestRegistry();

  const emit = (event: Omit<CacheEvent<TData>, "timestamp">): void => {
    events.emit({
      ...event,
      timestamp: clock.now()
    });
  };

  const emitStorageError = (operation: string, error: unknown, storageKey?: string): void => {
    emit({
      error,
      name: "storage-error",
      reason: operation,
      storageKey
    });
  };

  const storageGet = async <TResult>(storageKey: string): Promise<CacheRecord<TResult> | undefined> => {
    try {
      const record = await storage.get(storageKey);

      if (record) {
        await fallbackStorage.set(record).catch((error) => emitStorageError("memory-shadow-set", error, storageKey));
        return record as unknown as CacheRecord<TResult>;
      }
    } catch (error) {
      emitStorageError("get", error, storageKey);
    }

    return fallbackStorage.get(storageKey) as Promise<CacheRecord<TResult> | undefined>;
  };

  const storageSet = async <TResult>(record: CacheRecord<TResult>): Promise<void> => {
    await fallbackStorage.set(record as unknown as CacheRecord<TData>);

    try {
      await storage.set(record as unknown as CacheRecord<TData>);
    } catch (error) {
      emitStorageError("set", error, record.storageKey);
    }
  };

  const storageRemove = async (storageKey: string): Promise<void> => {
    await fallbackStorage.remove(storageKey);

    try {
      await storage.remove(storageKey);
    } catch (error) {
      emitStorageError("remove", error, storageKey);
    }
  };

  const storageClearByScope = async (partialScope: CachePartialScope): Promise<number> => {
    const fallbackRecords = await fallbackStorage.list(partialScope);
    await fallbackStorage.clearByScope?.(partialScope);

    try {
      if (storage.clearByScope) {
        return await storage.clearByScope(partialScope);
      }

      const records = await storage.list(partialScope);
      await Promise.all(records.map((record) => storage.remove(record.storageKey)));
      return records.length;
    } catch (error) {
      emitStorageError("clear-by-scope", error);
      return fallbackRecords.length;
    }
  };

  const storageClear = async (): Promise<void> => {
    await fallbackStorage.clear();

    try {
      await storage.clear();
    } catch (error) {
      emitStorageError("clear", error);
    }
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
    const storedRecord = await storageGet<TResult>(storageKey);
    const record = validateCacheRecord<TResult>(storedRecord);

    if (!record && storedRecord) {
      await storageRemove(storageKey);
    }

    if (isVersionBusted(record, resolvedPolicy)) {
      await storageRemove(storageKey);
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

    await storageSet(record);
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
    const snapshot = await getSnapshot<TResult>(scope, getOptions.policy);

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
    const result = await getOrFetchSnapshot(scope, fetcher, policy, getOrFetchOptions);

    if (result.data === undefined) {
      throw new Error("Cache fetch completed without data.");
    }

    return result.data;
  };

  const getOrFetchSnapshot = async <TResult = TData>(
    scope: CacheScope,
    fetcher: CacheFetcher<TResult>,
    policy?: CachePolicy,
    getOrFetchOptions: CacheGetOrFetchOptions = {}
  ): Promise<CacheGetOrFetchSnapshotResult<TResult>> => {
    const allowStale = getOrFetchOptions.allowStale ?? true;
    const revalidateIfStale = getOrFetchOptions.revalidateIfStale ?? false;
    const snapshot = await getSnapshot<TResult>(scope, policy);

    if (snapshot.record && snapshot.state === "fresh") {
      emit({
        data: snapshot.record.data as unknown as TData,
        name: "hit",
        scope: snapshot.scope,
        state: snapshot.state,
        storageKey: snapshot.storageKey
      });

      return {
        data: snapshot.record.data,
        snapshot,
        source: "cache",
        state: snapshot.state
      };
    }

    if (snapshot.record && snapshot.state === "stale" && allowStale) {
      emit({
        data: snapshot.record.data as unknown as TData,
        name: "stale-hit",
        scope: snapshot.scope,
        state: snapshot.state,
        storageKey: snapshot.storageKey
      });

      if (revalidateIfStale) {
        await refresh(scope, fetcher, policy);
      }

      return {
        data: snapshot.record.data,
        snapshot,
        source: "cache",
        state: snapshot.state
      };
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

    const data = await refresh(scope, fetcher, policy);
    const refreshedSnapshot = await getSnapshot<TResult>(scope, policy);

    return {
      data,
      snapshot: refreshedSnapshot,
      source: "network",
      state: snapshot.state
    };
  };

  const remove = async (scope: CacheScope): Promise<void> => {
    const normalizedScope = normalizeCacheScope(scope);
    const storageKey = buildCacheStorageKey(normalizedScope);
    await storageRemove(storageKey);
    emit({
      name: "removed",
      scope: normalizedScope,
      storageKey
    });
  };

  const removeByScope = async (partialScope: CachePartialScope): Promise<number> => {
    const count = await storageClearByScope(partialScope);

    return count;
  };

  const clearByScope = async (partialScope: CachePartialScope): Promise<number> => {
    const count = await removeByScope(partialScope);

    emit({
      name: "cleared",
      partialScope,
      reason: "scope-clear"
    });

    return count;
  };

  const invalidate = async (partialScope: CachePartialScope): Promise<number> => {
    const count = await removeByScope(partialScope);
    emit({
      name: "invalidated",
      partialScope,
      reason: "manual"
    });

    return count;
  };

  const clear = async (): Promise<void> => {
    await storageClear();
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
    getOrFetchSnapshot,
    getSnapshot,
    invalidate,
    refresh,
    remove,
    set,
    subscribe
  };
};
