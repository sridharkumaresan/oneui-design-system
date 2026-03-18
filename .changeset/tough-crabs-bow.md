---
"@functions-oneui/theme": minor
"@functions-oneui/react-utils": minor
"@functions-oneui/organism-hero-banner": major
"@functions-oneui/organism-action-panel": patch
---

Add the OneUI SPFx theme bridge, promote canonical gradient names as the public gradient contract, and add a React-compatible `useOneUIId` hook for host environments that do not expose `React.useId`. `HeroBanner` now uses `gradientName` as the public gradient prop instead of the older gradient-role alias.
