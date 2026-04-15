import { describe, expect, it } from "vitest";

import { createDescriptionPreview } from "./createDescriptionPreview.js";
import { detectContentFormat } from "./detectContentFormat.js";

describe("detectContentFormat", () => {
  it("detects plain text", () => {
    expect(detectContentFormat("Simple text only")).toBe("plain-text");
  });

  it("detects html", () => {
    expect(detectContentFormat("<p>Hello <strong>world</strong></p>")).toBe("html");
  });

  it("detects markdown", () => {
    expect(detectContentFormat("## Heading\n- Item one\n- Item two")).toBe("markdown");
  });

  it("detects rich mixed content", () => {
    expect(detectContentFormat("<div>**Mixed** [content](#)</div>")).toBe("rich-text");
  });
});

describe("createDescriptionPreview", () => {
  it("trims plain text safely", () => {
    const result = createDescriptionPreview("A".repeat(220), { maxChars: 40 });

    expect(result.previewText.endsWith("…")).toBe(true);
    expect(result.wasTrimmed).toBe(true);
    expect(result.usedFallback).toBe(false);
  });

  it("keeps short plain text unchanged", () => {
    const result = createDescriptionPreview("Short summary", { maxChars: 40 });

    expect(result.previewText).toBe("Short summary");
    expect(result.wasTrimmed).toBe(false);
  });

  it("strips and trims html content", () => {
    const result = createDescriptionPreview("<p>Hello <strong>world</strong> &amp; team</p>", {
      maxChars: 40
    });

    expect(result.detectedFormat).toBe("html");
    expect(result.previewText).toBe("Hello world & team");
  });

  it("strips and trims markdown content", () => {
    const result = createDescriptionPreview("## Heading\n[Open](https://example.com) now", {
      maxChars: 40
    });

    expect(result.detectedFormat).toBe("markdown");
    expect(result.previewText).toBe("Heading Open now");
  });

  it("supports fallback message mode for rich content", () => {
    const result = createDescriptionPreview("<p>Hello</p>", {
      maxChars: 40,
      richContentMode: "fallback-message"
    });

    expect(result.usedFallback).toBe(true);
    expect(result.previewText).toBe("Preview unavailable. Open the result to view full details.");
  });

  it("handles malformed mixed content safely", () => {
    const result = createDescriptionPreview("<div>Open **now", {
      maxChars: 30
    });

    expect(result.previewText.length).toBeGreaterThan(0);
    expect(result.detectedFormat).toBe("rich-text");
  });

  it("returns empty preview for nullish input", () => {
    const result = createDescriptionPreview(undefined, { maxChars: 30 });

    expect(result.detectedFormat).toBe("empty");
    expect(result.previewText).toBe("");
    expect(result.sourceHadContent).toBe(false);
  });

  it("supports maxChars as the primary char limit", () => {
    const result = createDescriptionPreview("One two three four five six", { maxChars: 12 });

    expect(result.previewText).toBe("One two…");
    expect(result.wasTrimmed).toBe(true);
  });

  it("supports plain-text maxLines trimming", () => {
    const result = createDescriptionPreview("Line one\nLine two\nLine three", {
      maxLines: 2,
      maxChars: 100
    });

    expect(result.previewText).toBe("Line one Line two…");
    expect(result.wasTrimmed).toBe(true);
  });

  it("supports html maxLines trimming", () => {
    const result = createDescriptionPreview("<p>Line one</p><p>Line two</p><p>Line three</p>", {
      maxLines: 2,
      maxChars: 100
    });

    expect(result.previewText).toBe("Line one Line two…");
    expect(result.wasTrimmed).toBe(true);
  });

  it("supports markdown maxLines trimming", () => {
    const result = createDescriptionPreview("# Heading\n- First item\n- Second item\n- Third item", {
      maxLines: 3,
      maxChars: 100
    });

    expect(result.previewText).toBe("Heading First item Second item…");
    expect(result.wasTrimmed).toBe(true);
  });

  it("applies maxLines before maxChars when both are provided", () => {
    const result = createDescriptionPreview("One two three\nFour five six\nSeven eight nine", {
      maxLines: 2,
      maxChars: 18
    });

    expect(result.previewText).toBe("One two three…");
    expect(result.wasTrimmed).toBe(true);
  });

  it("uses fallback for rich content that strips to nothing", () => {
    const result = createDescriptionPreview("<style>.hidden{display:none}</style><script>alert(1)</script>", {
      maxChars: 40
    });

    expect(result.usedFallback).toBe(true);
    expect(result.previewText).toBe("Preview unavailable. Open the result to view full details.");
  });

  it("handles null maxLines and invalid maxChars safely", () => {
    const result = createDescriptionPreview("Alpha beta gamma delta epsilon zeta eta theta", {
      maxLines: 0,
      maxChars: Number.NaN
    });

    expect(result.previewText.length).toBeGreaterThan(0);
    expect(result.usedFallback).toBe(false);
  });
});
