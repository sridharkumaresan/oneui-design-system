# @functions-oneui/fonts

Barclays Effra font assets for OneUI.

## Purpose

- Deliver the approved `Barclays Effra` font files with a stable package import
- Keep font asset hosting separate from token and theme logic
- Support both React and non-React consumers through plain CSS

## Public API

- `oneuiBrandFontFamily`
- `oneuiBrandFontFaces`
- `oneuiBrandFontCssImport`
- CSS subpath export: `@functions-oneui/fonts/styles.css`

## Usage

Import the stylesheet once near the app entry:

```ts
import "@functions-oneui/fonts/styles.css";
```

Then use the normal OneUI theme provider:

```tsx
import { OneUIProvider } from "@functions-oneui/theme";

<OneUIProvider>{/* app */}</OneUIProvider>;
```

The theme already points its base font family at `Barclays Effra`, so Fluent and OneUI components will use the brand family once the stylesheet is loaded.

## Notes

- Keep font files in `src/assets`
- Update `src/index.css` when weights or formats change
- If the font hosting model changes later, keep the exported family name stable
