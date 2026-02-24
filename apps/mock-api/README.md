# @functions-oneui/mock-api

Local deterministic mock API for Storybook showcase demos.

## Run

- `pnpm --filter @functions-oneui/mock-api run dev`
- default URL: `http://localhost:7001`

## Endpoints

- `GET /api/people`
- `GET /api/files`
- `GET /api/news`
- `GET /api/videos`
- `GET /api/it-hr`
- `GET /api/sites-events`
- `GET /api/kb-faq`
- `GET /api/servicenow`
- `GET /api/recommendations`

## Query params

- `q`: text filter across each item's serialized fields
- `mode`: `success` | `slow` | `empty` | `error`
- `delayMs`: response delay override in milliseconds

Examples:

- `/api/people?q=ava`
- `/api/news?mode=slow`
- `/api/files?mode=error&delayMs=1000`

## CORS

Allowed origins are configured by `MOCK_API_CORS_ORIGINS`.

- Default: `http://localhost:6006,http://127.0.0.1:6006`
