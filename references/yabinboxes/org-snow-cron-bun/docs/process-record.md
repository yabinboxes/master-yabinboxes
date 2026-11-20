# `processRecord`

Source: [`src/cron.ts`](../src/cron.ts)

`processRecord` is the core per-record handler invoked by the cron job. For each liveness probe in PostgreSQL, it performs a health check, relays the result to the configured host URL, and updates failure tracking in the database.

## Signature

```typescript
async function processRecord(record: QueueRecord): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `record` | `QueueRecord` | A stored probe with `snowName`, `healthUrl`, and `snowHostUrl` |

Returns `Promise<void>`. Errors are logged; they are not re-thrown.

## When it runs

`processRecord` is **not** called directly by the HTTP API. It is invoked by `startCron()` every **10 minutes** (`*/10 * * * *`):

```typescript
const records = await inputQueue.getAll();
await Promise.allSettled(records.map(processRecord));
```

- Records are loaded from `connectors.livenessprobe_records`
- All records run **in parallel** via `Promise.allSettled`
- One record failing does not stop others
- Records in `livenessprobe_failed_records` are **not** processed

## Flow

```
processRecord(record)
        │
        ▼
┌───────────────────┐
│ 1. GET healthUrl │
└─────────┬─────────┘
          │
    ┌─────┼─────────────┐
    │     │             │
 network  HTTP 2xx    HTTP 4xx/5xx
 failure  (res.ok)    (!res.ok)
    │     │             │
    ▼     ▼             ▼
 healthFailed    healthSucceeded    neither flag set
    │     │             │
    └─────┴─────────────┘
          ▼
┌─────────────────────────────┐
│ Build DashboardPayload      │
│  repository = snowName     │
│  response   = body or error │
│  status     = HTTP code / 0 │
└─────────┬───────────────────┘
          ▼
┌───────────────────────────┐
│ 2. POST snowHostUrl     │
│    Content-Type: json     │
└─────────┬─────────────────┘
          ▼
┌────────────────────────────────────────────┐
│ 3. Update failure_count (by snowName)     │
│    network failure  → increment (+1)       │
│    HTTP 2xx         → reset to 0           │
│    HTTP 4xx/5xx     → no change            │
│    if count > 10    → move to failed table │
└────────────────────────────────────────────┘
```

Steps 1 and 2 are **intentionally sequential** — the host POST always runs after the health check completes or fails.

Step 3 always runs after step 2, using `record.snowName` to identify which database row to update.

## Internal state flags

After step 1, `processRecord` sets two flags:

| Flag | Set when | Meaning |
|------|----------|---------|
| `healthFailed` | `fetch` throws (catch block) | Network-level failure; no HTTP response |
| `healthSucceeded` | `res.ok` is `true` | HTTP 2xx response received |

Both flags can be `false` when the health endpoint returns a non-2xx HTTP response (e.g. `500`) — the request succeeded at the network level but is not considered healthy.

```typescript
let healthFailed = false;
let healthSucceeded = false;

try {
  const res = await fetch(record.healthUrl);
  healthStatus = res.status;
  healthResponse = await res.text();
  healthSucceeded = res.ok;
} catch (err) {
  healthFailed = true;
  healthStatus = 0;
  healthResponse = err instanceof Error ? err.message : String(err);
}
```

## Step 1 — Health check (`GET healthUrl`)

| Outcome | `healthFailed` | `healthSucceeded` | `healthStatus` | `healthResponse` |
|---------|----------------|-------------------|----------------|------------------|
| HTTP 2xx | `false` | `true` | e.g. `200` | Raw response body |
| HTTP 4xx/5xx | `false` | `false` | e.g. `503` | Raw response body |
| Network failure | `true` | `false` | `0` | Error message |

Network failures include DNS errors, connection refused, timeouts, and any `fetch` throw where no HTTP response is returned.

## Step 2 — Relay (`POST snowHostUrl`)

Runs regardless of step 1 outcome.

```typescript
const payload: DashboardPayload = {
  repository: repoName,
  response: healthResponse,
  status: healthStatus.toString(),
};

await fetch(record.snowHostUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

### Outbound payload (`DashboardPayload`)

```json
{
  "repository": "my-service",
  "response": "<raw text from healthUrl>",
  "status": "200"
}
```

| Field | Source | Type | Description |
|-------|--------|------|-------------|
| `repository` | `record.snowName` | string | Probe identifier |
| `response` | Health check body or error message | string | Always present |
| `status` | `healthStatus.toString()` | string | HTTP status as string; `"0"` on network failure |

### Examples

**Healthy service** — `200` with body `{"status":"ok"}`:

```json
{
  "repository": "api-example",
  "response": "{\"status\":\"ok\"}",
  "status": "200"
}
```

**Unreachable service** — network failure:

```json
{
  "repository": "api-example",
  "response": "Unable to connect",
  "status": "0"
}
```

**HTTP error** — endpoint returns `503`:

```json
{
  "repository": "api-example",
  "response": "Service Unavailable",
  "status": "503"
}
```

## Step 3 — Failure tracking

After the host POST, `processRecord` updates `failure_count` on the row matching `snowName` in `connectors.livenessprobe_records`.

### How the same record is identified

Each probe is keyed by `snowName` (primary key `snow_name` in PostgreSQL). All failure operations use:

```sql
WHERE snow_name = $1  -- value of record.snowName
```

The `failure_count` column on that row tracks **consecutive network failures** for that specific probe.

### Decision logic

```typescript
if (healthFailed) {
  const failureCount = await inputQueue.incrementFailureCount(repoName);

  if (failureCount > MAX_HEALTH_FAILURES) {
    await inputQueue.moveToFailed(record, failureCount, healthResponse);
  }
} else if (healthSucceeded) {
  await inputQueue.resetFailureCount(repoName);
}
// HTTP 4xx/5xx: no action on failure_count
```

| Health outcome | `failure_count` action | Removed from active table? |
|----------------|------------------------|----------------------------|
| Network failure | Increment by 1 | Yes, when count exceeds `10` |
| HTTP 2xx (`res.ok`) | Reset to `0` | No |
| HTTP 4xx/5xx | No change | No |

| Constant | Value | Meaning |
|----------|-------|---------|
| `MAX_HEALTH_FAILURES` | `10` | Threshold before removal |

When `failure_count > 10` (the 11th consecutive network failure):

1. Row is inserted/updated in `connectors.livenessprobe_failed_records`
2. Row is deleted from `connectors.livenessprobe_records`
3. The host POST (step 2) has already run for that final failure

### Timeline example

Cron runs every 10 minutes. Probe `snowName: "api-example"`:

| Run | Health result | `failure_count` after step 3 |
|-----|---------------|------------------------------|
| 1 | Network failure | 1 |
| 2 | Network failure | 2 |
| 3 | `200 OK` | **0** (reset) |
| 4 | Network failure | 1 |
| 5–14 | Network failure | 2 → 10 |
| 15 | Network failure | 11 → **moved to failed table** |

### Re-registration

`POST /queue` with the same `snowName`:

- Inserts/updates the active table with `failure_count = 0`
- Removes the row from `livenessprobe_failed_records` if present

## Error handling

| Step | On failure |
|------|------------|
| Health `GET` | Caught; `healthFailed = true`, `status = 0`; flow continues to POST and step 3 |
| Host `POST` | Caught; logged to stderr; step 3 still runs; `processRecord` resolves without throwing |

Neither failure prevents other records from being processed in the same cron tick.

## Logging

| Log | When |
|-----|------|
| `[cron] Record queue ->` | Start of each record |
| `[cron] res 1 ->` | After health `GET` |
| `[cron] Health check failed for "…"` | Network failure on health `GET` |
| `[cron] payload ->` | Before host `POST` |
| `[cron] res 2 ->` | After host `POST` |
| `[cron] Dashboard POST for "…" → <status>` | Host response status |
| `[cron] Dashboard POST failed for "…"` | Network failure on host `POST` |
| `[cron] Failure count for "…"` | After incrementing on network failure |
| `[cron] Reset failure count for "…" — health check succeeded` | Health returned 2xx; `failure_count` reset to `0` |
| `[cron] Moved "…" to livenessprobe_failed_records after N failures` | Record exceeded failure threshold |

## Input type (`QueueRecord`)

```typescript
interface QueueRecord {
  snowName: string;
  healthUrl: string;
  snowHostUrl: string;
}
```

| Field | Used in |
|-------|---------|
| `snowName` | `payload.repository`, failure tracking key |
| `healthUrl` | Step 1 `GET` target |
| `snowHostUrl` | Step 2 `POST` target (defaults to `http://snow-monkeys.com:8080` if omitted at registration) |

## Related

- [Architecture](architecture.md) — cron schedule and overall data flow
- [API Reference](api.md) — how records are registered via `POST /queue`
- [Database](database.md) — `livenessprobe_records` and `livenessprobe_failed_records` tables
