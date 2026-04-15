export type ContentFormat = "empty" | "plain-text" | "html" | "markdown" | "rich-text";

export type RichContentPreviewMode = "strip-and-trim" | "fallback-message";

export type CreateDescriptionPreviewOptions = {
  fallbackMessage?: string;
  maxChars?: number;
  maxLines?: number;
  richContentMode?: RichContentPreviewMode;
};

export type DescriptionPreviewResult = {
  detectedFormat: ContentFormat;
  previewText: string;
  sourceHadContent: boolean;
  usedFallback: boolean;
  wasTrimmed: boolean;
};
