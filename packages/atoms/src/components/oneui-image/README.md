# OneUIImage

Resilient image atom for OneUI consumers.

## Use when

- an image URL may be missing, broken, slow, or replaced with a fallback
- consumers want a polished default loading/error/empty experience
- teams need a simple, reusable image primitive instead of hand-rolling image state logic

## Default behavior

- lazy loading by default
- loading placeholder for in-flight images
- empty placeholder when no `src` is provided
- error placeholder when all sources fail
- optional `fallbackSrc`
- optional retry button for error states

## Advanced usage

Consumers that need custom image lifecycle behavior should use `useImageLoader` from `@functions-oneui/react-utils`.
