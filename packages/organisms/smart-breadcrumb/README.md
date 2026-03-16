# @functions-oneui/organism-smart-breadcrumb

Responsive breadcrumb organism for portal headers and hero surfaces.

## Purpose

`SmartBreadcrumb` accepts a data array and renders:

- a keyboard-accessible breadcrumb trail
- overflow handling for long paths
- a stable current-item presentation

## Usage

```tsx
import { SmartBreadcrumb } from "@functions-oneui/organism-smart-breadcrumb";

<SmartBreadcrumb
  items={[
    { id: "home", label: "Connections", href: "/" },
    { id: "hub", label: "Hub sites", href: "/hubs" },
    { id: "current", label: "People" }
  ]}
/>;
```

## Standards

- Keep the component data-driven; do not make it infer routes automatically.
- Use the overflow menu for deep structures instead of shrinking text until it becomes unreadable.
