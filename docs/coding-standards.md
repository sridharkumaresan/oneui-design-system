# Coding Standards

## Token-First Styling

- Prefer token/theme values for all visual styles.
- Components should consume theme outputs, not raw token internals.
- New styling primitives must be introduced in tokens/theme before component usage.

## No Hardcoded Colors

- Do not hardcode colors in components or stories.
- Color values must come from semantic tokens or Fluent theme values.
- Exception: internal token source definitions in `@functions-oneui/tokens` where semantic values are authored.

## Accessibility Alignment

- Ensure color and state styling remains compatible with focus visibility and contrast requirements.
- Theme changes that impact interaction states should be covered by tests and Storybook verification.
