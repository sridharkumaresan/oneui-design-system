import type { CacheStorageKey } from "../contracts/CacheScope.js";

export class InFlightRequestRegistry {
  private readonly requests = new Map<CacheStorageKey, Promise<unknown>>();

  get<TData>(storageKey: CacheStorageKey): Promise<TData> | undefined {
    return this.requests.get(storageKey) as Promise<TData> | undefined;
  }

  run<TData>(storageKey: CacheStorageKey, factory: () => Promise<TData>): Promise<TData> {
    const existing = this.get<TData>(storageKey);

    if (existing) {
      return existing;
    }

    const request = factory().finally(() => {
      this.requests.delete(storageKey);
    });

    this.requests.set(storageKey, request);
    return request;
  }
}
