# Getting Started

## Prerequisites

- [Bun](https://bun.sh) 1.x
- PostgreSQL reachable at startup (defaults assume host `postgres` on port `5434`)

## Install and run

```bash
bun install
bun run dev    # hot-reload
bun run start  # production (no watch)
```

The server listens on port `3000` by default. Override with `PORT`:

```bash
PORT=8080 bun run start
```

On startup the app will:

1. Connect to PostgreSQL
2. Create schema `connectors` and table `livenessprobe_records` if missing
3. Start the 10-minute cron job
4. Begin serving HTTP on `/health`, `/queue`

## Quick test

### 1. Check the service is running

```bash
curl http://localhost:3000/health
```

```json
{ "status": "ok", "uptime": 12.5 }
```

### 2. Register a liveness probe

```bash
curl -X POST http://localhost:3000/queue \
  -H "Content-Type: application/json" \
  -d '{
    "snowName": "my-service",
    "healthUrl": "https://my-service.example.com/health",
    "actorId": "12345",
    "gitType": "github"
  }'
```

`snowHostUrl` is optional. When omitted it defaults to `http://snow-monkeys.com:8080`.

Response (`201` on first insert):

```json
{
  "message": "Record inserted",
  "snowName": "my-service"
}
```

### 3. List registered probes

```bash
curl "http://localhost:3000/queue?actorId=12345&gitType=github"
```

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

### 4. Update an existing probe

POST again with the same `snowName` and new URLs. Returns `200` with `"message": "Record updated"`.

## Docker

```bash
docker run -p 3000:3000 \
  -e POSTGRES_HOST=postgres \
  -e POSTGRES_PORT=5434 \
  -e POSTGRES_PASSWORD=admin \
  yabinm/health-cron-bun:latest
```

PostgreSQL must be reachable from the container network (e.g. same Docker Compose network with a service named `postgres`).

## Database connection defaults

| Variable | Default |
|----------|---------|
| `POSTGRES_HOST` | `postgres` |
| `POSTGRES_PORT` | `5434` |
| `POSTGRES_DB` | `postgres` |
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | `admin` |
| `POSTGRES_SCHEMA` | `connectors` |

See [Database](database.md) for schema details.
