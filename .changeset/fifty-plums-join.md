---
"@functions-oneui/fonts": minor
"@functions-oneui/tokens": minor
"@functions-oneui/theme": minor
"@functions-oneui/atoms": patch
"@functions-oneui/organism-hero-banner": patch
---

Add a dedicated `@functions-oneui/fonts` package for Barclays Effra, make the token/theme architecture explicitly Fluent-first, and promote canonical primitive gradient names such as `gradientCyanGreen`.

Typography foundations now point at the Barclays Effra family, Fluent-compatible theme overrides are exported from the token layer, and generated CSS variables are available for future non-React consumers. Buttons also read their shared font weight from the centralized theme contract rather than hardcoding it in component styles.
