# @functions-oneui/fonts

## 0.0.0-local-20260410175351

### Patch Changes

- Temporary local Verdaccio smoke-test release. Do not commit.

## 0.0.0-local-20260410174641

### Minor Changes

- 07388dc: Add a dedicated `@functions-oneui/fonts` package for Barclays Effra, make the token/theme architecture explicitly Fluent-first, and promote canonical primitive gradient names such as `gradientCyanGreen`.

  Typography foundations now point at the Barclays Effra family, Fluent-compatible theme overrides are exported from the token layer, and generated CSS variables are available for future non-React consumers. Buttons also read their shared font weight from the centralized theme contract rather than hardcoding it in component styles.

### Patch Changes

- Temporary local Verdaccio smoke-test release. Do not commit.
