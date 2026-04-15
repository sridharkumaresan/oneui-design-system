import { detectContentFormat } from "./detectContentFormat.js";
import type {
  ContentFormat,
  CreateDescriptionPreviewOptions,
  DescriptionPreviewResult
} from "./types.js";

const DEFAULT_FALLBACK_MESSAGE = "Preview unavailable. Open the result to view full details.";
const DEFAULT_MAX_LENGTH = 180;

const entityMap: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: "\""
};

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const normalizeMultilineWhitespace = (value: string): string =>
  value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();

const decodeHtmlEntities = (value: string): string =>
  value.replace(/&(#x[\da-fA-F]+|#\d+|[a-zA-Z]+);/g, (_match, entity) => {
    if (entity.startsWith("#x")) {
      const codePoint = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
    }

    if (entity.startsWith("#")) {
      const codePoint = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
    }

    return entityMap[entity] ?? "";
  });

const blockTagBoundaryPattern =
  /<(?:br|\/p|\/div|\/section|\/article|\/li|\/ul|\/ol|\/h[1-6]|\/blockquote|\/pre|\/table|\/tr)\s*\/?>/gi;

const stripHtmlToText = (value: string): string =>
  normalizeWhitespace(
    decodeHtmlEntities(
      value
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(blockTagBoundaryPattern, "\n")
        .replace(/<[^>]+>/g, " ")
    )
  );

const stripHtmlToMultilineText = (value: string): string =>
  normalizeMultilineWhitespace(
    decodeHtmlEntities(
      value
        .replace(/<script[\s\S]*?<\/script>/gi, "\n")
        .replace(/<style[\s\S]*?<\/style>/gi, "\n")
        .replace(blockTagBoundaryPattern, "\n")
        .replace(/<(?:p|div|section|article|li|ul|ol|h[1-6]|blockquote|pre|table|tr)\b[^>]*>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
    )
  );

const stripMarkdownToText = (value: string): string =>
  normalizeWhitespace(
    value
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[([^\]]*)]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\s{0,3}>\s?/gm, "")
      .replace(/^\s{0,3}[-*+]\s+/gm, "")
      .replace(/^\s{0,3}\d+\.\s+/gm, "")
      .replace(/[*_~]+/g, "")
      .replace(/\|/g, " ")
  );

const stripMarkdownToMultilineText = (value: string): string =>
  normalizeMultilineWhitespace(
    value
      .replace(/```[\s\S]*?```/g, "\n")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[([^\]]*)]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\s{0,3}>\s?/gm, "")
      .replace(/^\s{0,3}[-*+]\s+/gm, "")
      .replace(/^\s{0,3}\d+\.\s+/gm, "")
      .replace(/[*_~]+/g, "")
      .replace(/\|/g, " ")
  );

const stripRichContentToText = (value: string, format: ContentFormat): string => {
  if (format === "html") {
    return stripHtmlToText(value);
  }

  if (format === "markdown") {
    return stripMarkdownToText(value);
  }

  return stripMarkdownToText(stripHtmlToText(value));
};

const stripRichContentToMultilineText = (value: string, format: ContentFormat): string => {
  if (format === "html") {
    return stripHtmlToMultilineText(value);
  }

  if (format === "markdown") {
    return stripMarkdownToMultilineText(value);
  }

  return stripMarkdownToMultilineText(stripHtmlToMultilineText(value));
};

const trimPreviewText = (
  value: string,
  maxChars: number
): { previewText: string; wasTrimmed: boolean } => {
  if (value.length <= maxChars) {
    return {
      previewText: value,
      wasTrimmed: false
    };
  }

  const safeLimit = Math.max(1, maxChars - 1);
  const candidate = value.slice(0, safeLimit);
  const lastWhitespace = candidate.lastIndexOf(" ");
  const trimIndex = lastWhitespace >= Math.floor(safeLimit * 0.6) ? lastWhitespace : safeLimit;

  return {
    previewText: `${candidate.slice(0, trimIndex).trimEnd()}…`,
    wasTrimmed: true
  };
};

const trimPreviewLines = (
  value: string,
  maxLines: number
): { previewText: string; wasTrimmed: boolean } => {
  const lines = normalizeMultilineWhitespace(value)
    .split("\n")
    .filter(Boolean);

  if (lines.length <= maxLines) {
    return {
      previewText: lines.join("\n"),
      wasTrimmed: false
    };
  }

  const visibleLines = lines.slice(0, maxLines);
  const lastLine = visibleLines[visibleLines.length - 1]?.trimEnd() ?? "";
  visibleLines[visibleLines.length - 1] = lastLine.endsWith("…") ? lastLine : `${lastLine}…`;

  return {
    previewText: visibleLines.join("\n"),
    wasTrimmed: true
  };
};

const resolveMaxChars = (options: CreateDescriptionPreviewOptions): number =>
  typeof options.maxChars === "number" && Number.isFinite(options.maxChars) && options.maxChars > 0
    ? options.maxChars
    : DEFAULT_MAX_LENGTH;

const resolveMaxLines = (options: CreateDescriptionPreviewOptions): number | null =>
  typeof options.maxLines === "number" && Number.isFinite(options.maxLines) && options.maxLines > 0
    ? Math.floor(options.maxLines)
    : null;

const applyPreviewConstraints = (
  value: string,
  options: CreateDescriptionPreviewOptions,
  format: ContentFormat
): { previewText: string; wasTrimmed: boolean } => {
  const maxChars = resolveMaxChars(options);
  const maxLines = resolveMaxLines(options);

  if (maxLines !== null) {
    const multilineSource =
      format === "plain-text"
        ? normalizeMultilineWhitespace(value)
        : stripRichContentToMultilineText(value, format);
    const lineTrimmed = trimPreviewLines(multilineSource, maxLines);

    if (!lineTrimmed.previewText) {
      return {
        previewText: "",
        wasTrimmed: false
      };
    }

    const charTrimmed = trimPreviewText(normalizeWhitespace(lineTrimmed.previewText), maxChars);
    return {
      previewText: charTrimmed.previewText,
      wasTrimmed: lineTrimmed.wasTrimmed || charTrimmed.wasTrimmed
    };
  }

  const singleLineSource =
    format === "plain-text" ? normalizeWhitespace(value) : stripRichContentToText(value, format);
  return trimPreviewText(singleLineSource, maxChars);
};

export const createDescriptionPreview = (
  value: string | null | undefined,
  options: CreateDescriptionPreviewOptions = {}
): DescriptionPreviewResult => {
  const normalizedValue = typeof value === "string" ? value : "";
  const richContentMode = options.richContentMode ?? "strip-and-trim";
  const fallbackMessage = options.fallbackMessage ?? DEFAULT_FALLBACK_MESSAGE;
  const detectedFormat = detectContentFormat(normalizedValue);
  const sourceHadContent = normalizedValue.trim().length > 0;

  if (!sourceHadContent) {
    return {
      detectedFormat,
      previewText: "",
      sourceHadContent: false,
      usedFallback: false,
      wasTrimmed: false
    };
  }

  if (detectedFormat === "plain-text") {
    const trimmed = applyPreviewConstraints(normalizedValue, options, detectedFormat);

    return {
      detectedFormat,
      previewText: trimmed.previewText,
      sourceHadContent: true,
      usedFallback: false,
      wasTrimmed: trimmed.wasTrimmed
    };
  }

  if (richContentMode === "fallback-message") {
    return {
      detectedFormat,
      previewText: fallbackMessage,
      sourceHadContent: true,
      usedFallback: true,
      wasTrimmed: false
    };
  }

  const stripped = stripRichContentToText(normalizedValue, detectedFormat);

  if (!stripped) {
    return {
      detectedFormat,
      previewText: fallbackMessage,
      sourceHadContent: true,
      usedFallback: true,
      wasTrimmed: false
    };
  }

  const trimmed = applyPreviewConstraints(normalizedValue, options, detectedFormat);

  return {
    detectedFormat,
    previewText: trimmed.previewText,
    sourceHadContent: true,
    usedFallback: false,
    wasTrimmed: trimmed.wasTrimmed
  };
};
