# @functions-oneui/utils

Shared utility helpers for OneUI packages.

## Content Preview

Safe description preview helpers are exposed from:

```ts
import { createDescriptionPreview, detectContentFormat } from "@functions-oneui/utils";
// or
import { createDescriptionPreview } from "@functions-oneui/utils/content-preview";
```

### What it does

- classifies raw description strings as plain text, HTML, Markdown, rich text, or empty
- generates a short preview without naive substring trimming of rich content
- supports two rich-content strategies:
  - `strip-and-trim`
  - `fallback-message`

### Recommended usage

Run preview generation during data mapping or normalization rather than repeatedly inside card render functions.

```ts
const preview = createDescriptionPreview(rawDescription, {
  maxChars: 180,
  richContentMode: "strip-and-trim"
});
```

You can constrain by characters, lines, or both:

```ts
const byCharacters = createDescriptionPreview(rawDescription, {
  maxChars: 140
});

const byLines = createDescriptionPreview(rawDescription, {
  maxLines: 2
});

const byLinesThenChars = createDescriptionPreview(rawDescription, {
  maxLines: 3,
  maxChars: 180
});
```

Constraint precedence:

- `maxChars` is the canonical character-limit option
- when both `maxLines` and a character limit are provided, line trimming happens first and character trimming is applied to the reduced preview text

### Example behaviors

```ts
createDescriptionPreview("Plain text summary that is too long...", {
  maxChars: 40
});

createDescriptionPreview("<p>Hello <strong>team</strong></p><p>Next line</p>", {
  maxLines: 1
});

createDescriptionPreview("## Heading\n- One\n- Two\n- Three", {
  maxLines: 2,
  maxChars: 80
});

createDescriptionPreview("<div>Complex <em>rich</em> content</div>", {
  richContentMode: "fallback-message"
});
```

### Default behavior

- plain text is normalized and trimmed with an ellipsis when needed
- HTML and Markdown are simplified to safe plain text before trimming
- line-based trimming is supported for plain text, HTML, Markdown, and mixed rich content
- malformed or empty rich content falls back to a safe message when needed
