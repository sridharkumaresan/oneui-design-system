import type { CachePolicy } from "./CachePolicy.js";
import type { CacheScope, CacheStorageKey } from "./CacheScope.js";

export type CacheRecordMetadata = Record<string, unknown>;

export type CacheRecord<TData = unknown> = {
  data: TData;
  storageKey: CacheStorageKey;
  scope: CacheScope;
  version?: string;
  createdAt: number;
  updatedAt: number;
  lastAccessedAt?: number;
  staleAt: number;
  expiresAt: number;
  policy?: CachePolicy;
  etag?: string;
  checksum?: string;
  metadata?: CacheRecordMetadata;
};
