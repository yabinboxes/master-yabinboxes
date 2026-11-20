# `POST /queue`

Register or update a liveness probe in a profile-specific table.

**Method:** `POST`  
**Path:** `/queue`  
**Content-Type:** `application/json`

Default base URL: `http://localhost:3000` (Docker Compose: `http://localhost:4202`).

---

## Summary

`POST /queue` upserts a probe keyed by `snowName` into `connectors.livenessprobe_records_{profile.id}`. It never writes to the main `connectors.livenessprobe_records` table.

Flow:

1. Validate required body fields.
2. Get or create a row in `connectors.livenessprobe_profiles` by `actorId` + `gitType`.
3. Ensure `connectors.livenessprobe_records_{profile.id}` exists.
4. Upsert the probe from the JSON body into that table.

Posting the same `snowName` again in the same profile table **updates** URLs and resets `failure_count` to `0`.

---

## Request body

```json
{
  "snowName": "my-service",
  "healthUrl": "https://my-service.example.com/health",
  "snowHostUrl": "https://host.example.com/api/update",
  "actorId": "12345",
  "gitType": "github"
}
```

### Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `snowName` | Yes | string | Unique probe identifier within the profile table; upsert key |
| `healthUrl` | Yes | string | URL the cron job GETs for health |
| `actorId` | Yes | string | Git/host actor identifier |
| `gitType` | Yes | string | Git provider type (e.g. `github`) |
| `snowHostUrl` | No | string | URL the cron POSTs results to. Default: `http://snow-monkeys.com:8080` |

All field names use **camelCase** in JSON.

---

## Persistence

### Profile lookup

Looks up `connectors.livenessprobe_profiles` by `actor_id` + `git_type`:

- **Found** → use existing profile `id`
- **Not found** → insert profile row, use new `id`

### Probe upsert

Writes to `connectors.livenessprobe_records_{profile.id}`:

| JSON field | DB column |
|------------|-----------|
| `snowName` | `snow_name` |
| `healthUrl` | `health_url` |
| `snowHostUrl` | `snow_host_url` |

Also set on write: `failure_count = 0`, `updated_at = NOW()`.

Example: profile `id = 3` → table `connectors.livenessprobe_records_3`.

---

## Responses

### `201 Created` — new probe

```json
{
  "message": "Record inserted",
  "snowName": "my-service"
}
```

### `200 OK` — existing probe updated

```json
{
  "message": "Record updated",
  "snowName": "my-service"
}
```

### `400 Bad Request` — invalid JSON

```json
{
  "error": "Invalid JSON body"
}
```

### `422 Unprocessable Entity` — missing required fields

```json
{
  "error": "Missing required fields: snowName, healthUrl, actorId, gitType"
}
```

---

## Example

```bash
curl -X POST http://localhost:3000/queue \
  -H "Content-Type: application/json" \
  -d '{
    "snowName": "my-repo",
    "healthUrl": "https://my-repo.example.com/health",
    "actorId": "12345",
    "gitType": "github"
  }'
```

---

## Notes

- **Main table:** `connectors.livenessprobe_records` is not used by this endpoint.
- **Cron:** The 10-minute cron job currently reads from `connectors.livenessprobe_records` only. Probes stored in profile tables are not polled yet.
- **Upsert key:** `snowName` within the profile-specific table.
- **CORS:** Responses include `Access-Control-Allow-Origin: *`.

---

## Source

- Route handler: [`src/index.ts`](../src/index.ts)
- Validation: `parseQueueUpsertRequest()` in [`src/queue.ts`](../src/queue.ts)
- Persistence: `InputQueue.upsert()` in [`src/queue.ts`](../src/queue.ts)
- Types: `QueueUpsertRequest` in [`src/types.ts`](../src/types.ts)
