# Search Layout Showcase

## SmartSection in Page Layout

`SmartSection` is section-level UI and request lifecycle only. The parent page owns:

- query input state
- submit behavior
- shared `requestKey`
- shared `requestParams`
- multi-column placement of sections

In Storybook, this is implemented in `packages/organisms/smart-section/src/SearchLayoutShowcase.stories.tsx`.

## `requestKey` + `requestParams` Pattern

- `requestKey`: trigger token for refetch. When it changes, each enabled section fetches again.
- `requestParams`: query payload (for example `{ q: submittedQuery }`) passed to each section fetcher.

Recommended flow:

1. User edits draft query.
2. User submits.
3. Parent updates `submittedQuery`, increments shared `requestKey`.
4. All sections refetch in parallel from the same submit event.
5. With `keepPreviousData=true`, previous items stay visible while refresh is in progress.

## Mock API and Local Run

Showcase sections call `apps/mock-api` endpoints (`/api/people`, `/api/files`, etc.) with:

- `q` for filtering
- `mode=success|slow|empty|error` for demos
- `delayMs` to override response latency

Run the full local showcase:

```bash
pnpm dev:showcase
```

This starts:

- mock API at `http://localhost:7001`
- Storybook at `http://localhost:6006`

You can still run them separately with `pnpm dev:api` and `pnpm dev:storybook`.
