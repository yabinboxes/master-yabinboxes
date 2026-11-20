# `GET /queue`

List active liveness probes for a profile.

**Method:** `GET`  
**Path:** `/queue`  
**Body:** none

Default base URL: `http://localhost:3000` (Docker Compose: `http://localhost:4202`).

---

## Summary

`GET /queue` returns all rows from `connectors.livenessprobe_records_{profile.id}` for the profile matching the query parameters.

1. Look up `connectors.livenessprobe_profiles` by `actorId` + `gitType`.
2. If no profile exists → `404`.
3. Read probes from `connectors.livenessprobe_records_{profile.id}` (creates the table if missing, returns an empty list).

This endpoint does **not** read from the main `connectors.livenessprobe_records` table.

---

## Query parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `actorId` | Yes | Profile actor identifier |
| `gitType` | Yes | Git provider type (e.g. `github`) |

Both parameters are required.

---

## Request

```bash
curl "http://localhost:3000/queue?actorId=12345&gitType=github"
```

---

## Response `200`

```json
{
  "records": [
    {
      "snowName": "my-service",
      "healthUrl": "https://my-service.example.com/health",
      "snowHostUrl": "http://snow-monkeys.com:8080",
      "failureCount": 0,
      "createdAt": "2026-07-13T22:00:00.000Z",
      "updatedAt": "2026-07-13T22:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Top-level fields

| Field | Type | Description |
|-------|------|-------------|
| `records` | array | Active probe records for the profile |
| `total` | number | Length of `records` |

### Each item in `records`

| Field | Type | Description |
|-------|------|-------------|
| `snowName` | string | Unique probe identifier within the profile table |
| `healthUrl` | string | Endpoint polled for health |
| `snowHostUrl` | string | Destination for cron results |
| `failureCount` | number | Consecutive network failures on `healthUrl` |
| `createdAt` | string | ISO 8601 timestamp of first insert |
| `updatedAt` | string | ISO 8601 timestamp of last update |

### Empty profile table

```json
{
  "records": [],
  "total": 0
}
```

---

## Error responses

### `422 Unprocessable Entity` — missing query parameters

```json
{
  "error": "Missing required query parameters: actorId, gitType"
}
```

### `404 Not Found` — profile not found

```json
{
  "error": "Profile not found"
}
```

---

## Data source

| Query param | DB lookup | Probe table |
|-------------|-----------|-------------|
| `actorId` | `livenessprobe_profiles.actor_id` | — |
| `gitType` | `livenessprobe_profiles.git_type` | — |
| (resolved) | `livenessprobe_profiles.id` | `livenessprobe_records_{id}` |

Example: profile `id = 3` → reads from `connectors.livenessprobe_records_3`.

---

## Related endpoints

| Endpoint | Purpose |
|----------|---------|
| [`POST /queue`](post-queue.md) | Register or update probes in the same profile table |
| [`GET /profiles`](get-profiles.md) | List all profiles with nested probe records |
| [`GET /failed-records`](api.md#get-failed-records) | List failed probes (main archive table) |
| [`GET /deleted-records`](api.md#get-deleted-records) | List deleted probes (main archive table) |

---

## Notes

- **Pair with POST:** Use the same `actorId` and `gitType` values as [`POST /queue`](post-queue.md) to list probes you registered for that profile.
- **Cron:** The 10-minute cron job still reads from the main `livenessprobe_records` table only.
- **CORS:** Responses include `Access-Control-Allow-Origin: *`.

---

## Source

- Route handler: [`src/index.ts`](../src/index.ts)
- Query parsing: `parseQueueListParams()` in [`src/queue.ts`](../src/queue.ts)
- Query: `InputQueue.getAllForProfile()` in [`src/queue.ts`](../src/queue.ts)
- Types: `LivenessProbeRecord` in [`src/types.ts`](../src/types.ts)
