# @functions-oneui/organism-illustrated-state

Reusable illustrated state surface for empty, loading, error, no-access, and informational product moments.

## Install

```ts
import { IllustratedState } from "@functions-oneui/organism-illustrated-state";
```

## Example

```tsx
<IllustratedState
  variant="no-results"
  title="No results found"
  description="Try a broader search or clear some filters."
  primaryAction={{
    label: "Try again",
    onClick: () => {
      // retry search
    }
  }}
/>
```

## Notes

- Use this for page-level or panel-level states where a single shared message is clearer than repeating per-section feedback.
- Override `illustration`, `title`, `description`, `actions`, or `children` when product-specific messaging is needed.
- Keep the component UI-only. Data fetching, retry logic, and state decisions stay with the consuming screen.
