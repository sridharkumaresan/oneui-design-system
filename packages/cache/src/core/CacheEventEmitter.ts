import type { CacheEvent, CacheEventListener, CacheUnsubscribe } from "../contracts/CacheEvent.js";

export class CacheEventEmitter<TData = unknown> {
  private readonly listeners = new Set<CacheEventListener<TData>>();

  subscribe(listener: CacheEventListener<TData>): CacheUnsubscribe {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(event: CacheEvent<TData>): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        continue;
      }
    }
  }
}
