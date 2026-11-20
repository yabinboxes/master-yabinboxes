# Architecture

## Purpose

**health-cron-bun** is a scheduled health-check relay. External systems register probes via HTTP; the service polls each probe's health endpoint and reports results to a configured host URL.

## Data flow

```
┌──────────┐   POST /queue    ┌─────────────────┐   every 10 min   ┌──────────────┐
│  Client  │ ───────────────► │  health-cron-bun │ ───────────────► │  healthUrl  │
└──────────┘                  │                  │                  └──────────────┘
                              │  Bun HTTP server │
                              │  + node-cron     │   POST payload   ┌──────────────┐
                              │  + PostgreSQL    │ ───────────────► │ snowHostUrl│
                              └─────────────────┘                  └──────────────┘
                                       │
                                       ▼
                              connectors.livenessprobe_records
```

## Startup sequence

1. `index.ts` calls `initDb()` — connects to PostgreSQL, ensures schema and table exist.
2. `startCron()` schedules the 10-minute job.
3. `Bun.serve()` starts the HTTP server.

## Cron behavior

- **Schedule:** `*/10 * * * *` (every 10 minutes, at `:00`, `:10`, `:20`, etc.)
- **Source:** All rows from `connectors.livenessprobe_records`
- **Concurrency:** Records processed in parallel via `Promise.allSettled` — one failure does not block others
- **Per record:**
  1. `GET healthUrl` — capture HTTP status and response body as text
  2. `POST snowHostUrl` — always fires, even when the health check fails

### Health check failure

If `healthUrl` is unreachable (network error, DNS failure, timeout):

- `status` in the outbound payload is `"0"`
- `response` contains the error message

If the health endpoint responds with an HTTP error (e.g. `500`), the actual status code is forwarded (e.g. `"500"`).

## Source layout

| File | Responsibility |
|------|----------------|
| `src/index.ts` | HTTP routes, CORS headers, server bootstrap |
| `src/cron.ts` | Cron schedule, `processRecord()` health + relay logic |
| `src/queue.ts` | `InputQueue` — PostgreSQL upsert/list/count |
| `src/db.ts` | Connection pool, schema/table initialization |
| `src/types.ts` | `QueueRecord`, `DashboardPayload`, default host URL |

## Key design decisions

- **Upsert by `snowName`** — re-posting the same name updates URLs in place.
- **Sequential HTTP per record** — health GET completes (or fails) before the host POST, so the host always receives a result. See [processRecord](process-record.md).
- **PostgreSQL persistence** — records survive process restarts.
- **No CORS preflight** — `OPTIONS` is not handled; browser cross-origin `POST` with JSON may be blocked.
