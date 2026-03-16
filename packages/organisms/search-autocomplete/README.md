# @functions-oneui/organism-search-autocomplete

Search bar organism for hero surfaces, landing pages, and portal entry points.

## Purpose

`SearchAutocomplete` provides:

- optional scope selection
- search query input
- submit action
- lightweight selectable suggestions

The package is UI-only. Consumers own the search backend, ranking, analytics, and navigation.

## Usage

```tsx
import { SearchAutocomplete } from "@functions-oneui/organism-search-autocomplete";

<SearchAutocomplete
  onSubmit={({ query, scope }) => {
    console.log(query, scope);
  }}
  scopeOptions={[
    { label: "All", value: "all" },
    { label: "People", value: "people" }
  ]}
  suggestions={[
    {
      id: "1",
      label: "People directory",
      value: "people directory",
      description: "Open the employee directory"
    }
  ]}
/>;
```

## Standards

- Keep the component controlled by app state when integrating with real search services.
- Use suggestions as shortcuts, not as a replacement for search results.
- Do not fetch data inside the organism.
