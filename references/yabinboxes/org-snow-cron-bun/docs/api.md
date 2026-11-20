# API Reference

Base URL: `http://localhost:3000` (or your deployed host).

All JSON responses include CORS headers (`Access-Control-Allow-Origin: *`).

---

## `GET /health`

Liveness check for this service.

### Response `200`

```json
{
  "status": "ok",
  "uptime": 42.3
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `"ok"` when the process is running |
| `uptime` | number | Process uptime in seconds |

---

## `POST /queue`

Register or update a liveness probe.

### Request body

```json
{
  "snowName": "my-service",
  "healthUrl": "https://my-service.example.com/health",
  "snowHostUrl": "https://host.example.com/api/update",
  "actorId": "12345",
  "gitType": "github"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `snowName` | Yes | Unique identifier; used as the upsert key within the profile table |
| `healthUrl` | Yes | Endpoint to poll for health |
| `actorId` | Yes | Profile lookup key; with `gitType` selects `livenessprobe_profiles` row |
| `gitType` | Yes | Profile lookup key; with `actorId` selects `livenessprobe_profiles` row |
| `snowHostUrl` | No | Destination for cron results. Defaults to `http://snow-monkeys.com:8080` |

Probes are upserted into `connectors.livenessprobe_records_{profile.id}`. The main `connectors.livenessprobe_records` table is not written by this endpoint.

### Responses

#### `201 Created` — new record

```json
{
  "message": "Record inserted",
  "snowName": "my-service"
}
```

#### `200 OK` — existing record updated

```json
{
  "message": "Record updated",
  "snowName": "my-service"
}
```

#### `400 Bad Request` — invalid JSON

```json
{
  "error": "Invalid JSON body"
}
```

#### `422 Unprocessable Entity` — missing required fields

```json
{
  "error": "Missing required fields: snowName, healthUrl, actorId, gitType"
}
```

### Example

```bash
curl -X POST http://localhost:3000/queue \
  -H "Content-Type: application/json" \
  -d '{
    "snowName": "api-example",
    "healthUrl": "https://api.example.com/health",
    "actorId": "12345",
    "gitType": "github",
    "snowHostUrl": "https://hooks.example.com/report"
  }'
```

---

## `POST /delete-record-from-queue`

Remove a liveness probe from the active queue and archive it in `livenessprobe_deleted_records`.

### Request body

```json
{
  "snowName": "my-service"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `snowName` | Yes | Identifier of the record to delete |

### Responses

#### `200 OK` — record deleted

```json
{
  "message": "Record deleted",
  "snowName": "my-service",
  "record": {
    "snowName": "my-service",
    "healthUrl": "https://my-service.example.com/health",
    "snowHostUrl": "http://snow-monkeys.com:8080"
  }
}
```

#### `400 Bad Request` — invalid JSON

```json
{
  "error": "Invalid JSON body"
}
```

#### `404 Not Found` — record not in active queue

```json
{
  "error": "Record not found: my-service"
}
```

#### `422 Unprocessable Entity` — missing `snowName`

```json
{
  "error": "Missing required field: snowName"
}
```

### Example

```bash
curl -X POST http://localhost:3000/delete-record-from-queue \
  -H "Content-Type: application/json" \
  -d '{"snowName": "my-service"}'
```

---

## `GET /queue`

List active liveness probes for a profile from `connectors.livenessprobe_records_{profile.id}`.

### Query parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `actorId` | Yes | Profile actor identifier |
| `gitType` | Yes | Git provider type |

### Response `200`

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

| Field | Type | Description |
|-------|------|-------------|
| `records` | array | Active probe records for the profile |
| `total` | number | Count of records |

Each record in `records`:

| Field | Type | Description |
|-------|------|-------------|
| `snowName` | string | Unique probe identifier |
| `healthUrl` | string | Endpoint polled by the cron job |
| `snowHostUrl` | string | Destination for cron results |
| `failureCount` | number | Consecutive network failures on `healthUrl` |
| `createdAt` | string | ISO 8601 timestamp of first insert |
| `updatedAt` | string | ISO 8601 timestamp of last update |

#### `422 Unprocessable Entity` — missing query parameters

```json
{
  "error": "Missing required query parameters: actorId, gitType"
}
```

#### `404 Not Found` — profile not found

```json
{
  "error": "Profile not found"
}
```

### Example

```bash
curl "http://localhost:3000/queue?actorId=12345&gitType=github"
```

See also: [GET /queue (detailed)](get-queue.md).

---

## `GET /profiles`

List all rows from `connectors.livenessprobe_profiles`, each with probes from `connectors.livenessprobe_records_{profile.id}`.

### Response `200`

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

| Field | Type | Description |
|-------|------|-------------|
| `profiles` | array | All profile rows with nested probe records |
| `total` | number | Count of profiles |

Each profile in `profiles`:

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Profile primary key |
| `snowName` | string \| null | Last linked probe name from profile creation |
| `actorId` | string | Profile actor identifier |
| `gitType` | string | Git provider type |
| `records` | array | Probes from `livenessprobe_records_{id}` (empty if table missing) |
| `total` | number | Count of probes for this profile |

### Example

```bash
curl http://localhost:3000/profiles
```

See also: [GET /profiles (detailed)](get-profiles.md).

---

## `GET /failed-records`

List all rows from `connectors.livenessprobe_failed_records`.

Probes appear here after more than 10 consecutive network failures on `healthUrl`. They are no longer polled by the cron job.

### Response `200`

```json
{
  "records": [
    {
      "snowName": "my-service",
      "healthUrl": "https://my-service.example.com/health",
      "snowHostUrl": "http://snow-monkeys.com:8080",
      "failureCount": 11,
      "lastError": "Unable to connect",
      "failedAt": "2026-07-13T22:30:00.000Z",
      "createdAt": "2026-07-13T22:00:00.000Z",
      "updatedAt": "2026-07-13T22:30:00.000Z"
    }
  ],
  "total": 1
}
```

| Field | Type | Description |
|-------|------|-------------|
| `records` | array | All failed liveness probe records |
| `total` | number | Count of records |

Each record in `records`:

| Field | Type | Description |
|-------|------|-------------|
| `snowName` | string | Unique probe identifier |
| `healthUrl` | string | Last known health URL |
| `snowHostUrl` | string | Last known host URL |
| `failureCount` | number | Failure count when moved to this table |
| `lastError` | string | Error message from the final failed health check |
| `failedAt` | string | ISO 8601 timestamp when the record was moved here |
| `createdAt` | string \| null | Original insert timestamp from the active table |
| `updatedAt` | string \| null | Last update timestamp from the active table |

### Example

```bash
curl http://localhost:3000/failed-records
```

---

## `GET /deleted-records`

List all rows from `connectors.livenessprobe_deleted_records`.

Probes appear here after manual removal via `POST /delete-record-from-queue`. They are no longer polled by the cron job.

### Response `200`

```json
{
  "records": [
    {
      "snowName": "my-service",
      "healthUrl": "https://my-service.example.com/health",
      "snowHostUrl": "http://snow-monkeys.com:8080",
      "failureCount": 2,
      "deletedAt": "2026-07-13T22:45:00.000Z",
      "createdAt": "2026-07-13T22:00:00.000Z",
      "updatedAt": "2026-07-13T22:30:00.000Z"
    }
  ],
  "total": 1
}
```

| Field | Type | Description |
|-------|------|-------------|
| `records` | array | All deleted liveness probe records |
| `total` | number | Count of records |

Each record in `records`:

| Field | Type | Description |
|-------|------|-------------|
| `snowName` | string | Unique probe identifier |
| `healthUrl` | string | Last known health URL |
| `snowHostUrl` | string | Last known host URL |
| `failureCount` | number | Failure count at time of deletion |
| `deletedAt` | string | ISO 8601 timestamp when the record was deleted |
| `createdAt` | string \| null | Original insert timestamp from the active table |
| `updatedAt` | string \| null | Last update timestamp from the active table |

### Example

```bash
curl http://localhost:3000/deleted-records
```

---

## `GET /*` (unknown routes)

### Response `404`

```json
{
  "error": "Not found"
}
```

---

## Outbound payload (cron → `snowHostUrl`)

This is **not** an API route on health-cron-bun. Every 10 minutes the cron job POSTs this JSON to each record's `snowHostUrl`:

```json
{
  "repository": "my-service",
  "response": "<raw text from healthUrl>",
  "status": "200"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `repository` | string | Value of `snowName` |
| `response` | string | Raw response body from `healthUrl`, or error message on failure |
| `status` | string | HTTP status from `healthUrl` as a string; `"0"` on network failure |

### Example — service down

```json
{
  "repository": "api-example",
  "response": "Unable to connect",
  "status": "0"
}
```

The receiving endpoint at `snowHostUrl` must accept `POST` with `Content-Type: application/json`.
