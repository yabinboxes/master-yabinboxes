# `GET /profiles`

List all liveness probe profiles with nested probe records.

**Method:** `GET`  
**Path:** `/profiles`  
**Body:** none  
**Query parameters:** none

Default base URL: `http://localhost:3000` (Docker Compose: `http://localhost:4202`).

---

## Summary

`GET /profiles` returns every row from `connectors.livenessprobe_profiles`, each with probes loaded from `connectors.livenessprobe_records_{profile.id}`.

1. Select all profiles from `livenessprobe_profiles`, ordered by `id`.
2. For each profile, read probes from `livenessprobe_records_{id}` if that table exists.
3. If the profile table does not exist yet, `records` is an empty array and `total` is `0`.

This endpoint does **not** read from the main `connectors.livenessprobe_records` table.

Unlike [`GET /queue`](get-queue.md), no query parameters are required — the response includes **all** profiles in one call.

---

## Request

```bash
curl http://localhost:3000/profiles
```

---

## Response `200`

```json
{
  "profiles": [
    {
      "id": 1,
      "snowName": "my-service",
      "actorId": "12345",
      "gitType": "github",
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
  ],
  "total": 1
}
```

### Top-level fields

| Field | Type | Description |
|-------|------|-------------|
| `profiles` | array | All profile rows with nested probe records |
| `total` | number | Length of `profiles` |

### Each item in `profiles`

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Profile primary key (`livenessprobe_profiles.id`) |
| `snowName` | string \| null | Probe name stored on the profile row at creation |
| `actorId` | string | Profile actor identifier |
| `gitType` | string | Git provider type (e.g. `github`) |
| `records` | array | Probes from `livenessprobe_records_{id}` |
| `total` | number | Length of `records` |

### Each item in `records`

Same shape as [`GET /queue`](get-queue.md) probe objects:

| Field | Type | Description |
|-------|------|-------------|
| `snowName` | string | Unique probe identifier within the profile table |
| `healthUrl` | string | Endpoint polled for health |
| `snowHostUrl` | string | Destination for cron results |
| `failureCount` | number | Consecutive network failures on `healthUrl` |
| `createdAt` | string | ISO 8601 timestamp of first insert |
| `updatedAt` | string | ISO 8601 timestamp of last update |

### Empty database

No profiles registered yet:

```json
{
  "profiles": [],
  "total": 0
}
```

### Profile with no probe table yet

Profile exists but no probes have been upserted (table not created):

```json
{
  "profiles": [
    {
      "id": 1,
      "snowName": "my-service",
      "actorId": "12345",
      "gitType": "github",
      "records": [],
      "total": 0
    }
  ],
  "total": 1
}
```

---

## Error responses

This endpoint has no request validation beyond routing. Unknown paths return `404` from the global handler:

```json
{
  "error": "Not found"
}
```

---

## Data source

| Response field | DB source |
|----------------|-----------|
| `profiles[].id` | `livenessprobe_profiles.id` |
| `profiles[].snowName` | `livenessprobe_profiles.snow_name` |
| `profiles[].actorId` | `livenessprobe_profiles.actor_id` |
| `profiles[].gitType` | `livenessprobe_profiles.git_type` |
| `profiles[].records` | `livenessprobe_records_{id}` |

Example: profile `id = 3` → nested probes from `connectors.livenessprobe_records_3`.

---

## Related endpoints

| Endpoint | Purpose |
|----------|---------|
| [`POST /queue`](post-queue.md) | Register or update probes (creates profiles and profile tables) |
| [`GET /queue`](get-queue.md) | List probes for a single profile (`actorId`, `gitType`) |
| [`GET /failed-records`](api.md#get-failed-records) | List failed probes (main archive table) |
| [`GET /deleted-records`](api.md#get-deleted-records) | List deleted probes (main archive table) |

---

## Notes

- **Use case:** Admin or dashboard views that need every profile and its probes in one request.
- **vs GET /queue:** `GET /queue` filters by `actorId` + `gitType` and returns `404` when the profile is missing. `GET /profiles` always returns `200` with an array (possibly empty).
- **Cron:** The 10-minute cron job reads from the main `livenessprobe_records` table only, not profile tables.
- **CORS:** Responses include `Access-Control-Allow-Origin: *`.

---

## Source

- Route handler: [`src/index.ts`](../src/index.ts)
- Query: `InputQueue.getAllProfilesWithRecords()` in [`src/queue.ts`](../src/queue.ts)
- Types: `LivenessProbeProfile`, `LivenessProbeRecord` in [`src/types.ts`](../src/types.ts)
