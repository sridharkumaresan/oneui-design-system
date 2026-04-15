export const resultTypes = ["document", "event", "news", "person", "resource", "file"] as const;

export type ResultType = (typeof resultTypes)[number];

export type RenderingHint =
  | "document-list"
  | "event-list"
  | "news-list"
  | "people-list"
  | "resource-grid"
  | "file-list";

