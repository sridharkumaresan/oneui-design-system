import type { SearchRuntimeMode } from "./runtime";
import type { LoadingStatus } from "./loading";
import type { SearchSourceKey } from "./searchSource";

export type SearchConfigDiagnostics = {
  defaultVerticalKey?: string;
  duplicateKeys: string[];
  errors: string[];
  invalidKeys: string[];
  loadedVerticalKeys: string[];
  mode: SearchRuntimeMode;
  rejectedRows: number;
  source: "dummy" | "sharepoint" | "fallback-dummy" | "mock-http";
  sourceRowCount: number;
  usedFallback: boolean;
  validRowCount: number;
};

export type SearchExecutionDiagnosticsEntry = {
  errorCategory?: "auth" | "request" | "response-shape" | "unexpected";
  errorMessage?: string;
  normalizationRejectedCount: number;
  requestBuilt: boolean;
  requestDurationMs?: number;
  source: SearchSourceKey;
  status: LoadingStatus;
  templateKey: string;
  total: number;
  transport?: "in-memory" | "mock-http" | "graph";
  usedGraph: boolean;
  verticalKey: string;
};

export type SearchExecutionDiagnostics = {
  entries: SearchExecutionDiagnosticsEntry[];
  flow: "aggregate" | "vertical";
  mode: SearchRuntimeMode;
  queryText: string;
  selectedVerticalKey: string;
};

export class SearchConfigDiagnosticsStore {
  private snapshot: SearchConfigDiagnostics | undefined;
  private searchSnapshot: SearchExecutionDiagnostics | undefined;
  private readonly listeners = new Set<() => void>();

  public getSnapshot(): SearchConfigDiagnostics | undefined {
    return this.snapshot;
  }

  public getSearchSnapshot(): SearchExecutionDiagnostics | undefined {
    return this.searchSnapshot;
  }

  public setSnapshot(snapshot: SearchConfigDiagnostics): void {
    this.snapshot = snapshot;
    this.emit();
  }

  public startSearchSnapshot(snapshot: Omit<SearchExecutionDiagnostics, "entries">): void {
    this.searchSnapshot = {
      ...snapshot,
      entries: []
    };
    this.emit();
  }

  public recordSearchEntry(entry: SearchExecutionDiagnosticsEntry): void {
    if (!this.searchSnapshot) {
      return;
    }

    const existingIndex = this.searchSnapshot.entries.findIndex(
      (candidate) => candidate.verticalKey === entry.verticalKey
    );

    if (existingIndex >= 0) {
      this.searchSnapshot.entries[existingIndex] = entry;
      this.emit();
      return;
    }

    this.searchSnapshot.entries.push(entry);
    this.emit();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
