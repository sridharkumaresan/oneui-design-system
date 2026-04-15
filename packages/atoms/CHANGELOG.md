# @functions-oneui/atoms

## 0.0.0-local-20260410175351

### Patch Changes

- Temporary local Verdaccio smoke-test release. Do not commit.
- Updated dependencies
  - @functions-oneui/theme@0.0.0-local-20260410175351
  - @functions-oneui/tokens@0.0.0-local-20260410175351

## 0.0.0-local-20260410174641

### Patch Changes

- 07388dc: Add a dedicated `@functions-oneui/fonts` package for Barclays Effra, make the token/theme architecture explicitly Fluent-first, and promote canonical primitive gradient names such as `gradientCyanGreen`.

  Typography foundations now point at the Barclays Effra family, Fluent-compatible theme overrides are exported from the token layer, and generated CSS variables are available for future non-React consumers. Buttons also read their shared font weight from the centralized theme contract rather than hardcoding it in component styles.

- Temporary local Verdaccio smoke-test release. Do not commit.
- Updated dependencies [07388dc]
- Updated dependencies
  - @functions-oneui/tokens@0.0.0-local-20260410174641
  - @functions-oneui/theme@0.0.0-local-20260410174641
