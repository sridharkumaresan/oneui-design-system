import type { ContentFormat } from "./types.js";

const htmlPattern = /<\/?[a-z][\s\S]*?>/i;
const htmlEntityPattern = /&(?:[a-zA-Z]+|#\d+|#x[\da-fA-F]+);/;
const markdownPatterns = [
  /^#{1,6}\s/m,
  /(^|\s)[*_~`]{1,3}[^\s].+?[*_~`]{1,3}(?=\s|$)/,
  /!\[[^\]]*]\([^)]+\)/,
  /\[[^\]]+]\([^)]+\)/,
  /(^|\n)\s{0,3}[-*+]\s+/,
  /(^|\n)\s{0,3}\d+\.\s+/,
  /(^|\n)\s{0,3}>\s+/,
  /```[\s\S]*?```/,
  /\|.+\|/
];
const looseMarkdownMarkerPattern = /[*_~`]{1,3}|\[[^\]]*]|\([^)]+\)/;

export const detectContentFormat = (value: string | null | undefined): ContentFormat => {
  const normalizedValue = typeof value === "string" ? value.trim() : "";

  if (!normalizedValue) {
    return "empty";
  }

  const hasHtml = htmlPattern.test(normalizedValue) || htmlEntityPattern.test(normalizedValue);
  const markdownScore = markdownPatterns.reduce(
    (count, pattern) => (pattern.test(normalizedValue) ? count + 1 : count),
    0
  );
  const hasLooseMarkdownMarkers = looseMarkdownMarkerPattern.test(normalizedValue);

  if (hasHtml && (markdownScore > 0 || hasLooseMarkdownMarkers)) {
    return "rich-text";
  }

  if (hasHtml) {
    return "html";
  }

  if (markdownScore > 0) {
    return "markdown";
  }

  return "plain-text";
};
