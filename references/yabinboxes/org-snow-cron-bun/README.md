# health-cron-bun

A lightweight Bun HTTP service that registers liveness probes, checks health endpoints every 10 minutes, and relays results to a host URL. State is stored in PostgreSQL.

| | |
|--|--|
| **Repository** | [snow-monkeys-org/snow-cron-bun](https://github.com/snow-monkeys-org/snow-cron-bun) |
| **Organization** | [snow-monkeys-org](https://github.com/snow-monkeys-org) |
| **Docker image** | `yabinm/health-cron-bun:latest` |
| **Documentation** | [`docs/README.md`](docs/README.md) |

Part of the **Snow Monkeys** services stack. All JSON request and response fields use **camelCase**.

## How it works

```
Client ──POST /queue──► PostgreSQL (profile tables + main queue)
                              │
                        node-cron (every 10 min)
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
              GET healthUrl      POST snowHostUrl
```

1. Callers register probes with `POST /queue` (`snowName`, `healthUrl`, `actorId`, `gitType`, optional `snowHostUrl` defaulting to `http://snow-monkeys.com:8080`).
2. Probes are upserted into `connectors.livenessprobe_records_{profileId}` via `connectors.livenessprobe_profiles` (see [POST /queue](docs/post-queue.md)).
3. Every 10 minutes the cron job reads **main** `connectors.livenessprobe_records`, GETs each `healthUrl`, and POSTs a `DashboardPayload` to `snowHostUrl`.
4. After more than 10 consecutive network failures, a record moves to `livenessprobe_failed_records`. Manual deletes archive to `livenessprobe_deleted_records`.

**Note:** Probes registered only through profile tables are not polled by the cron until they exist in the main queue table.

## Quick start

```bash
bun install
bun run dev
```

Register a probe:

```bash
curl -X POST http://localhost:3000/queue \
  -H "Content-Type: application/json" \
  -d '{
    "snowName": "my-service",
    "healthUrl": "https://example.com/health",
    "actorId": "12345",
    "gitType": "github"
  }'
```

List probes for that profile:

```bash
curl "http://localhost:3000/queue?actorId=12345&gitType=github"
```

Check service health:

```bash
curl http://localhost:3000/health
```

## API summary

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/queue` | Register or update a probe in a profile-scoped table |
| `GET` | `/queue` | List probes for a profile (`actorId`, `gitType` query params) |
| `GET` | `/profiles` | List all profiles with nested probe records |
| `POST` | `/delete-record-from-queue` | Remove a probe from the main active queue |
| `GET` | `/failed-records` | List probes in `livenessprobe_failed_records` |
| `GET` | `/deleted-records` | List probes in `livenessprobe_deleted_records` |
| `GET` | `/health` | Service liveness — `{ status, uptime }` |

Full request/response details: [`docs/api.md`](docs/api.md).

## Documentation

| Guide | Description |
|-------|-------------|
| [Overview](docs/README.md) | Project info and documentation index |
| [Getting Started](docs/getting-started.md) | Install, run, Docker, first API calls |
| [Architecture](docs/architecture.md) | Data flow, cron behavior, source layout |
| [API Reference](docs/api.md) | Endpoints, payloads, error codes |
| [POST /queue](docs/post-queue.md) | Register or update a probe (detailed) |
| [GET /queue](docs/get-queue.md) | List probes for a profile (detailed) |
| [GET /profiles](docs/get-profiles.md) | List all profiles with nested records (detailed) |
| [Database](docs/database.md) | PostgreSQL schema and connection |
| [Deployment](docs/deployment.md) | Docker, env vars, CI/CD |

## Postman

Import [`health-cron-bun.postman_collection.json`](health-cron-bun.postman_collection.json) for all routes with example bodies.

## Docker

```bash
docker run -p 3000:3000 \
  -e POSTGRES_HOST=postgres \
  -e POSTGRES_PORT=5434 \
  -e POSTGRES_PASSWORD=admin \
  yabinm/health-cron-bun:latest
```

PostgreSQL must be reachable on startup. See [Deployment](docs/deployment.md) for environment variables and CI/CD.
